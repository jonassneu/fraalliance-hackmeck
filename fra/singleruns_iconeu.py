"""EDDF DWD ICON-EU vintages (Open-Meteo single runs, model id `icon_eu` = dwd_icon_eu), UTC and knots.

Purpose: fill forecast leads ~44-48 h where ICON-D2 (fra/singleruns_icon.py, lead 0..48, 4 h buffer) runs out.
Probed 2026-10-31: archive starts 2026-04-02 00 UTC (2026-04-01 is "not available"); the 00/06/12/18 UTC runs reach
lead 120 h, the 03/09/15/21 UTC runs only 30 h (so only the four main cycles are downloaded by default). Nearest grid
point 50.0625 N, 8.5625 E. The stored grid is lead 0..120 inclusive; unavailable leads stay NaN.
Five-hour publication buffer is an assumption (DWD finishes the 120 h ICON-EU output ~3-3.5 h after init; one hour
more than the D2 module because the run is longer), not API metadata.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys
import threading
import time

import numpy as np
import pandas as pd
import requests

from fra.rules import tailwind
from fra.singleruns import DATA, SINGLE, LIVE, _request as _base_request

MODEL = 'icon_eu'
ARCHIVE = DATA / 'iconeu_runs.parquet'
NAMES = {'wind_speed_10m': 'wind_speed',
         'wind_direction_10m': 'wind_direction', 'wind_gusts_10m': 'wind_gusts'}
COLUMNS = ['issue', 'lead', 'iconeu_tw25', 'iconeu_tw25_roll6', 'iconeu_tw18']
MAX_LEAD = 120
CYCLES = (0, 6, 12, 18)
BUFFER_H = 5
START = '2026-04-02'


def _request(url, **params):
    return _base_request(url, models=MODEL, hourly=','.join(NAMES), **params)


_tls = threading.local()


def _session():
    if not hasattr(_tls, 's'):
        _tls.s = requests.Session()
    return _tls.s


def _frame(payload, init):
    d = pd.DataFrame(payload['hourly']).rename(columns={'time': 'valid', **NAMES})
    d['valid'] = pd.to_datetime(d.valid, utc=True)
    d['init'] = init
    d['lead_h'] = (d.valid - init).dt.total_seconds() / 3600
    return d[['init', 'valid', 'lead_h', *NAMES.values()]]


def download_runs(start=START, end=None, workers=2, cycles=CYCLES):
    """Inclusive UTC dates; atomic checkpoints; failed runs retry on rerun."""
    now = pd.Timestamp.now('UTC')
    last = now - pd.Timedelta(hours=BUFFER_H)
    if end is not None:
        last = min(last, pd.to_datetime(end, utc=True).normalize() + pd.Timedelta(hours=21))
    inits = pd.date_range(pd.to_datetime(start, utc=True), last, freq='3h')
    inits = inits[inits.hour.isin(cycles)]
    DATA.mkdir(exist_ok=True)
    old = pd.read_parquet(ARCHIVE) if ARCHIVE.exists() else pd.DataFrame()
    complete = set()
    if not old.empty:
        good = old.lead_h.between(0, MAX_LEAD)
        counts = old.loc[good].groupby('init').valid.nunique()
        complete = set(counts[counts == MAX_LEAD + 1].index)
    pending = [i for i in inits if i not in complete]
    parts = [old] if not old.empty else []
    failures = []

    def fetch(init):
        time.sleep(1)  # Bound request rate as well as concurrency.
        d = _frame(_request(SINGLE, timeout=(10, 60), session=_session(), run=init.strftime('%Y-%m-%dT%H:%M')), init)
        d = d.set_index('valid').reindex(pd.date_range(init, periods=MAX_LEAD + 1, freq='h'))
        d.index.name = 'valid'
        d['init'], d['lead_h'] = init, np.arange(MAX_LEAD + 1)
        if d.wind_speed.isna().all():
            raise ValueError('run has no wind data')
        return d.reset_index()[['init', 'valid', 'lead_h', *NAMES.values()]]

    def save():
        if not parts:
            return pd.DataFrame(columns=['init', 'valid', 'lead_h', *NAMES.values()])
        d = pd.concat(parts, ignore_index=True).drop_duplicates(['init', 'valid'], keep='last').sort_values(['init', 'valid'])
        tmp = ARCHIVE.with_suffix('.tmp.parquet')
        d.to_parquet(tmp, index=False)
        tmp.replace(ARCHIVE)
        parts[:] = [d]
        return d

    print(f'{MODEL}: {len(pending)} pending; {len(complete)} cached', flush=True)
    with ThreadPoolExecutor(max_workers=max(1, min(workers, 4))) as pool:
        futures = {pool.submit(fetch, i): i for i in pending}
        for n, future in enumerate(as_completed(futures), 1):
            try:
                parts.append(future.result())
            except Exception as exc:
                failures.append(futures[future])
                print(f'Unavailable {futures[future]}: {exc}', flush=True)
            if n % 50 == 0:
                save()
                print(f'{n}/{len(pending)}', flush=True)
    out = save()
    if failures:
        print(f'{len(failures)} runs unavailable; saved progress, rerun to retry', flush=True)
    return out


def _features(runs, issues, leads, buffer_h=BUFFER_H):
    q = pd.DataFrame({'issue': pd.to_datetime(issues, utc=True)}).merge(
        pd.DataFrame({'lead': list(leads)}), how='cross')
    q['_order'] = np.arange(len(q))
    q['valid'] = q.issue + pd.to_timedelta(q.lead, unit='h')
    q['cutoff'] = q.issue - pd.Timedelta(hours=buffer_h)
    available = pd.DataFrame({'run_init': pd.to_datetime(runs.init.unique(), utc=True)}).sort_values('run_init')
    q = pd.merge_asof(q.sort_values('cutoff'), available,
                      left_on='cutoff', right_on='run_init', direction='backward')
    d = runs.copy()
    d['iconeu_tw25'] = tailwind(d.wind_speed, d.wind_direction, 250)
    d['iconeu_tw18'] = tailwind(d.wind_speed, d.wind_direction, 180)
    s = pd.Series(d.iconeu_tw25.to_numpy(), index=pd.MultiIndex.from_frame(d[['init', 'valid']]))
    window = [s.reindex(pd.MultiIndex.from_arrays([d.init, d.valid + pd.Timedelta(hours=h)])).to_numpy()
              for h in range(-3, 3)]
    d['iconeu_tw25_roll6'] = np.mean(window, axis=0)
    q = q.merge(d[['init', 'valid', *COLUMNS[2:]]].rename(columns={'init': 'run_init'}),
                on=['run_init', 'valid'], how='left', validate='many_to_one')
    return q.sort_values('_order').reset_index(drop=True)


def asof_features_iconeu(issues, leads, buffer_h=BUFFER_H):
    """Latest eligible init; exact valid time; missing samples/windows stay NaN."""
    return _features(pd.read_parquet(ARCHIVE), issues, leads, buffer_h)[COLUMNS]


def live_features_iconeu(issue, leads):
    """Current stitched forecast only; synthetic init is not historical evidence."""
    issue = pd.to_datetime(issue, utc=True)
    if abs(issue - pd.Timestamp.now('UTC')) > pd.Timedelta(hours=1):
        raise ValueError('Live features require a current issue; use asof_features_iconeu for history')
    init = issue - pd.Timedelta(hours=BUFFER_H)
    runs = _frame(_request(LIVE, forecast_days=6, past_days=1), init)
    return _features(runs, [issue], leads)[COLUMNS]


if __name__ == '__main__':
    runs = download_runs(*sys.argv[1:3])
    print('Model', MODEL, 'archive', runs.shape, 'init', runs.init.min(), '..', runs.init.max(),
          'init hours', sorted(runs.init.dt.hour.unique().tolist()), flush=True)
    t = time.monotonic()
    leads = [1, 2, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48]
    sample = _features(runs, pd.date_range(runs.init.min(), periods=5000, freq='h'), leads)
    assert (sample.run_init.isna() | (sample.run_init <= sample.issue - pd.Timedelta(hours=BUFFER_H))).all()
    cov = sample.groupby('lead').iconeu_tw25.apply(lambda s: s.notna().mean())
    print(f'Leakage self-check passed: {len(sample)} rows in {time.monotonic()-t:.3f}s; coverage by lead:',
          cov.round(3).to_dict(), flush=True)
