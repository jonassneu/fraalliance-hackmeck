"""EDDF ICON-D2 vintages, UTC and knots.

Probed 2026-04-02, 2026-05-01 and 2026-10-29: eight 3-hour cycles,
lead 0..48 inclusive. ICON-EU and seamless also exist on April 2, but
D2 is preferred. The requested 0..50 grid preserves unavailable 49..50
as NaN. Four-hour publication buffer is an assumption, not API metadata.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

import numpy as np
import pandas as pd

from fra.rules import tailwind
from fra.singleruns import DATA, SINGLE, LIVE, _request as _base_request

MODEL = 'icon_d2'
ARCHIVE = DATA / 'icon_runs.parquet'
NAMES = {'wind_speed_10m': 'wind_speed',
         'wind_direction_10m': 'wind_direction', 'wind_gusts_10m': 'wind_gusts'}
COLUMNS = ['issue', 'lead', 'icon_tw25', 'icon_tw25_roll6', 'icon_tw18']


def _request(url, **params):
    return _base_request(url, models=MODEL, hourly=','.join(NAMES), **params)


def _frame(payload, init):
    d = pd.DataFrame(payload['hourly']).rename(columns={'time': 'valid', **NAMES})
    d['valid'] = pd.to_datetime(d.valid, utc=True)
    d['init'] = init
    d['lead_h'] = (d.valid - init).dt.total_seconds() / 3600
    return d[['init', 'valid', 'lead_h', *NAMES.values()]]


def download_runs(start='2026-05-01', end=None, workers=4):
    """Inclusive UTC dates; atomic checkpoints; failed runs retry on rerun."""
    now = pd.Timestamp.now('UTC')
    last = now - pd.Timedelta(hours=4)
    if end is not None:
        last = min(last, pd.to_datetime(end, utc=True).normalize() + pd.Timedelta(hours=21))
    inits = pd.date_range(pd.to_datetime(start, utc=True), last, freq='3h')
    DATA.mkdir(exist_ok=True)
    old = pd.read_parquet(ARCHIVE) if ARCHIVE.exists() else pd.DataFrame()
    complete = set()
    if not old.empty:
        good = old.lead_h.between(0, 50)
        counts = old.loc[good].groupby('init').valid.nunique()
        complete = set(counts[counts == 51].index)
    pending = [i for i in inits if i not in complete]
    parts = [old] if not old.empty else []
    failures = []

    def fetch(init):
        time.sleep(1)  # Bound request rate as well as concurrency.
        d = _frame(_request(SINGLE, run=init.strftime('%Y-%m-%dT%H:%M')), init)
        d = d.set_index('valid').reindex(pd.date_range(init, periods=51, freq='h'))
        d.index.name = 'valid'
        d['init'], d['lead_h'] = init, np.arange(51)
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


def _features(runs, issues, leads, buffer_h=4):
    q = pd.DataFrame({'issue': pd.to_datetime(issues, utc=True)}).merge(
        pd.DataFrame({'lead': list(leads)}), how='cross')
    q['_order'] = np.arange(len(q))
    q['valid'] = q.issue + pd.to_timedelta(q.lead, unit='h')
    q['cutoff'] = q.issue - pd.Timedelta(hours=buffer_h)
    available = pd.DataFrame({'run_init': pd.to_datetime(runs.init.unique(), utc=True)}).sort_values('run_init')
    q = pd.merge_asof(q.sort_values('cutoff'), available,
                      left_on='cutoff', right_on='run_init', direction='backward')
    d = runs.copy()
    d['icon_tw25'] = tailwind(d.wind_speed, d.wind_direction, 250)
    d['icon_tw18'] = tailwind(d.wind_speed, d.wind_direction, 180)
    s = pd.Series(d.icon_tw25.to_numpy(), index=pd.MultiIndex.from_frame(d[['init', 'valid']]))
    window = [s.reindex(pd.MultiIndex.from_arrays([d.init, d.valid + pd.Timedelta(hours=h)])).to_numpy()
              for h in range(-3, 3)]
    d['icon_tw25_roll6'] = np.mean(window, axis=0)
    q = q.merge(d[['init', 'valid', *COLUMNS[2:]]].rename(columns={'init': 'run_init'}),
                on=['run_init', 'valid'], how='left', validate='many_to_one')
    return q.sort_values('_order').reset_index(drop=True)


def asof_features_icon(issues, leads, buffer_h=4):
    """Latest eligible init; exact valid time; missing samples/windows stay NaN."""
    return _features(pd.read_parquet(ARCHIVE), issues, leads, buffer_h)[COLUMNS]


def live_features_icon(issue, leads):
    """Current stitched forecast only; synthetic init is not historical evidence."""
    issue = pd.to_datetime(issue, utc=True)
    if abs(issue - pd.Timestamp.now('UTC')) > pd.Timedelta(hours=1):
        raise ValueError('Live features require a current issue; use asof_features_icon for history')
    init = issue - pd.Timedelta(hours=4)
    runs = _frame(_request(LIVE, forecast_days=4, past_days=1), init)
    return _features(runs, [issue], leads)[COLUMNS]


if __name__ == '__main__':
    runs = download_runs()
    print('Model', MODEL, 'archive', runs.shape, 'init', runs.init.min(), '..', runs.init.max(),
          'init hours', sorted(runs.init.dt.hour.unique().tolist()), flush=True)
    t = time.monotonic()
    sample = _features(runs, pd.date_range(runs.init.min(), periods=13000, freq='h'),
                       [1, 2, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48])
    assert (sample.run_init.isna() | (sample.run_init <= sample.issue - pd.Timedelta(hours=4))).all()
    print(f'Leakage self-check passed: {len(sample)} rows in {time.monotonic()-t:.3f}s', flush=True)
