"""EDDF IFS single-run archive. Six-hour publication buffer is an assumption.

Live API data are stitched forecasts: their synthetic init is only an approximation,
not evidence of a real vintage. Never use live_features to reconstruct history.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import time
import random

import numpy as np
import pandas as pd
import requests

from fra.rules import add_components, tailwind

DATA = Path(__file__).resolve().parent.parent / 'data'
ARCHIVE = DATA / 'ifs_runs.parquet'
UPPER_ARCHIVE = DATA / 'ifs_runs_upper.parquet'
# Pressure-level winds return all nulls for ecmwf_ifs (earliest/latest probes).
UPPER_NAMES = {k: k for k in ['wind_speed_100m', 'wind_direction_100m', 'cape']}

SINGLE = 'https://single-runs-api.open-meteo.com/v1/forecast'
LIVE = 'https://api.open-meteo.com/v1/forecast'
NAMES = dict(zip(['wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
                  'temperature_2m', 'precipitation', 'pressure_msl', 'cloud_cover'],
                 ['wind_speed', 'wind_direction', 'wind_gusts', 'temperature',
                  'precipitation', 'pressure_msl', 'cloud_cover']))


def _request(url, **extra):
    params = dict(latitude=50.0333, longitude=8.5706, models='ecmwf_ifs',
                  wind_speed_unit='kn', timezone='GMT', hourly=','.join(NAMES))
    params.update(extra)
    for attempt in range(8):
        try:
            r = requests.get(url, params=params, timeout=90)
            if r.status_code == 429 or r.status_code >= 500:
                if attempt == 7:
                    r.raise_for_status()
                time.sleep(max(float(r.headers.get('Retry-After', 0)), min(60, 2**attempt)) + random.random())
                continue
            r.raise_for_status()
            return r.json()
        except (requests.ConnectionError, requests.Timeout):
            if attempt == 7:
                raise
            time.sleep(min(60, 2**attempt) + random.random())


def _frame(payload, init, names=None):
    names = NAMES if names is None else names
    d = pd.DataFrame(payload['hourly']).rename(columns={'time': 'valid', **names})
    d['valid'] = pd.to_datetime(d['valid'], utc=True)
    d['init'] = init
    d['lead_h'] = ((d.valid - init).dt.total_seconds() / 3600).astype(int)
    return d[['init', 'valid', 'lead_h', *names.values()]]


def download_runs(start='2025-05-01', end=None, workers=8):
    """Inclusive calendar dates; resume complete 0..71 h runs, retry missing runs.

    All four 00/06/12/18 UTC cycles are supported (probed May 2025).
    Today's unpublished cycles are excluded using the same six-hour buffer.
    """
    now = pd.Timestamp.now('UTC')
    last = min(pd.Timestamp(end, tz='UTC').normalize() + pd.Timedelta(hours=18)
               if end else now, now - pd.Timedelta(hours=6))
    inits = pd.date_range(pd.Timestamp(start, tz='UTC'), last, freq='6h')
    DATA.mkdir(exist_ok=True)
    old = pd.read_parquet(ARCHIVE) if ARCHIVE.exists() else pd.DataFrame()
    complete = set()
    if not old.empty:
        counts = old.loc[old.wind_speed.notna() & old.lead_h.between(0, 71)].groupby('init').valid.nunique()
        complete = set(counts[counts == 72].index)
    pending = [i for i in inits if i not in complete]
    parts, timings, failures = [old] if not old.empty else [], [], []

    def fetch(init):
        t = time.monotonic()
        d = _frame(_request(SINGLE, run=init.strftime('%Y-%m-%dT%H:%M')), init)
        d = d[d.lead_h.between(0, 71)].copy()
        if len(d) != 72 or d.wind_speed.isna().all():
            raise ValueError('incomplete/unavailable run')
        return d, time.monotonic() - t

    def save():
        if not parts:
            return pd.DataFrame()
        d = pd.concat(parts, ignore_index=True).drop_duplicates(['init', 'valid'], keep='last').sort_values(['init', 'valid'])
        tmp = ARCHIVE.with_suffix('.tmp.parquet')
        d.to_parquet(tmp, index=False)
        tmp.replace(ARCHIVE)
        parts[:] = [d]
        return d

    print(f'{len(pending)} runs to fetch; {len(complete)} cached', flush=True)
    with ThreadPoolExecutor(max_workers=max(1, min(workers, 8))) as pool:
        futures = {pool.submit(fetch, i): i for i in pending}
        for n, f in enumerate(as_completed(futures), 1):
            try:
                d, elapsed = f.result()
                parts.append(d)
                timings.append(elapsed)
            except Exception as exc:
                failures.append(futures[f])
                print(f'Unavailable {futures[f]}: {exc}', flush=True)
            if n % 50 == 0:
                save()
                print(f'{n}/{len(pending)}; mean request {np.mean(timings):.3f}s', flush=True)
    out = save()
    if timings:
        print(f'Request seconds mean={np.mean(timings):.3f}, median={np.median(timings):.3f}, p95={np.percentile(timings,95):.3f}', flush=True)
    print(f'Failed/unavailable runs: {len(failures)} (retried on next invocation)', flush=True)
    return out


def download_upper_runs(workers=4):
    """Resume upper-air data for precisely the inits in the surface archive.

    Null pressure-level fields are deliberately excluded. Each checkpoint is
    atomic; failed runs remain pending for the next invocation.
    """
    inits = pd.read_parquet(ARCHIVE, columns=['init']).init.unique()
    old = pd.read_parquet(UPPER_ARCHIVE) if UPPER_ARCHIVE.exists() else pd.DataFrame()
    complete = set()
    if not old.empty:
        good = old.lead_h.between(0, 71)
        counts = old.loc[good].groupby('init').valid.nunique()
        complete = set(counts[counts == 72].index)
    pending = [pd.Timestamp(i) for i in inits if i not in complete]
    parts = [old] if not old.empty else []
    failures = []

    def fetch(init):
        d = _frame(_request(SINGLE, run=init.strftime('%Y-%m-%dT%H:%M'),
                            hourly=','.join(UPPER_NAMES)), init, UPPER_NAMES)
        d = d.loc[d.lead_h.between(0, 71)].copy()
        # Preserve API nulls: some vintages lack individual upper fields.
        if d.valid.nunique() != 72:
            raise ValueError('incomplete upper-air run')
        return d

    def save():
        if not parts:
            return pd.DataFrame()
        d = pd.concat(parts, ignore_index=True).drop_duplicates(['init', 'valid'], keep='last').sort_values(['init', 'valid'])
        tmp = UPPER_ARCHIVE.with_suffix('.tmp.parquet')
        d.to_parquet(tmp, index=False)
        tmp.replace(UPPER_ARCHIVE)
        parts[:] = [d]
        return d

    print(f'Upper: {len(pending)} pending; {len(complete)} cached', flush=True)
    with ThreadPoolExecutor(max_workers=max(1, min(workers, 4))) as pool:
        futures = {pool.submit(fetch, i): i for i in pending}
        for n, f in enumerate(as_completed(futures), 1):
            try:
                parts.append(f.result())
            except Exception as exc:
                failures.append(futures[f])
                print(f'Upper unavailable {futures[f]}: {exc}', flush=True)
            if n % 50 == 0:
                save()
                print(f'Upper {n}/{len(pending)}', flush=True)
    out = save()
    if failures:
        raise RuntimeError(f'{len(failures)} upper runs failed; rerun to resume')
    return out


def _merge_upper(runs):
    if not UPPER_ARCHIVE.exists():
        return runs
    upper = pd.read_parquet(UPPER_ARCHIVE)
    cols = [c for c in UPPER_NAMES.values() if c not in runs.columns]
    if not cols:
        return runs
    return runs.merge(upper[['init', 'valid', *cols]], on=['init', 'valid'],
                      how='left', validate='one_to_one')


def _features(runs, issues, leads, buffer_h=6):
    issues = pd.DatetimeIndex(pd.to_datetime(issues, utc=True))
    q = pd.DataFrame({'issue': issues}).merge(pd.DataFrame({'lead': leads}), how='cross')
    q['_order'] = np.arange(len(q))
    q['valid'] = q.issue + pd.to_timedelta(q.lead, unit='h')
    q['cutoff'] = q.issue - pd.Timedelta(hours=buffer_h)
    available = pd.DataFrame({'run_init': runs.init.drop_duplicates().sort_values()})
    q = pd.merge_asof(q.sort_values('cutoff'), available, left_on='cutoff', right_on='run_init', direction='backward')
    d = add_components(runs.copy()).sort_values(['init', 'valid'])
    extra = [c for c in UPPER_NAMES.values() if c in d]
    for level in ['100m', '850']:
        if f'wind_speed_{level}' in d and f'wind_direction_{level}' in d:
            for heading in ([25, 18] if level == '100m' else [25]):
                name = f'tw{heading}_{level}'
                d[name] = tailwind(d[f'wind_speed_{level}'], d[f'wind_direction_{level}'], heading * 10)
                extra.append(name)
    if 'tw25_850' in d:
        d['shear25'] = d.tw25_850 - d.tw25
        extra.append('shear25')
    # Exact timestamp joins prevent shifts crossing gaps or run boundaries.
    idx = pd.MultiIndex.from_frame(d[['init', 'valid']])
    for name, offset in [('tw25_prev3', -3), ('tw25_next3', 3)]:
        target = pd.MultiIndex.from_arrays([d.init, d.valid + pd.Timedelta(hours=offset)])
        d[name] = pd.Series(d.tw25.to_numpy(), index=idx).reindex(target).to_numpy()
    for col in ['tw25', 'tw18']:
        s = pd.Series(d[col].to_numpy(), index=idx)
        window = [s.reindex(pd.MultiIndex.from_arrays([d.init, d.valid + pd.Timedelta(hours=h)])).to_numpy() for h in range(-3, 3)]
        # Require all six hours; boundary/gap trends remain missing.
        d[col + '_roll6'] = np.mean(window, axis=0)
    d = d.drop(columns='lead_h').rename(columns={'init': 'run_init'})
    q = q.merge(d, on=['run_init', 'valid'], how='left', validate='many_to_one')
    q['run_age_h'] = (q.valid - q.run_init).dt.total_seconds() / 3600
    cols = ['issue', 'valid', 'lead', 'run_init', 'run_age_h', *NAMES.values(),
            'tw25', 'tw18', 'tw18_gust', 'xw25_gust', 'xw18_gust',
            'tw25_prev3', 'tw25_next3', 'tw25_roll6', 'tw18_roll6', *extra]
    return q.sort_values('_order')[cols].reset_index(drop=True)


def asof_features(issues: pd.DatetimeIndex, leads: list[int], buffer_h=6) -> pd.DataFrame:
    """Latest eligible vintage, even when its target is missing; no future fallback."""
    return _features(_merge_upper(pd.read_parquet(ARCHIVE)), issues, leads, buffer_h)


def live_run(model='ecmwf_ifs'):
    """Synthetic init = retrieval UTC hour floored to 6h minus 6h; approximate only."""
    init = pd.Timestamp.now('UTC').floor('6h') - pd.Timedelta(hours=6)
    names = {**NAMES, **UPPER_NAMES}
    return _frame(_request(LIVE, models=model, forecast_days=4, past_days=1,
                           hourly=','.join(names)), init, names)


def live_features(issue, leads):
    """Live prediction only; normal API cannot recover historical vintages."""
    issue = pd.to_datetime(issue, utc=True)
    if abs(issue - pd.Timestamp.now('UTC')) > pd.Timedelta(hours=1):
        raise ValueError('live_features requires a current issue time; use asof_features for history')
    return _features(live_run(), pd.DatetimeIndex([issue]), leads)


if __name__ == '__main__':
    runs = download_runs()
    print('Archive', runs.shape, 'init', runs.init.min(), '..', runs.init.max(), 'hours', sorted(runs.init.dt.hour.unique()))
    ref = runs.dropna(subset=['wind_speed']).sort_values('lead_h').drop_duplicates('valid').set_index('valid').wind_speed
    error = (runs.wind_speed - runs.valid.map(ref)).abs()
    buckets = pd.cut(runs.lead_h, [-1, 6, 24, 48], labels=['0-6', '6-24', '24-48'])
    print('Wind speed MAE (kt) against shortest-lead forecast, NOT observations:')
    print(error.groupby(buckets, observed=True).mean())
    t = time.monotonic()
    sample = asof_features(pd.date_range(runs.init.min(), periods=10000, freq='h'), [1,2,3,6,9,12,18,24,30,36,42,48])
    assert (sample.run_init.isna() | (sample.run_init <= sample.issue - pd.Timedelta(hours=6))).all()
    print(f'As-of self-check passed: {len(sample)} rows in {time.monotonic()-t:.3f}s')
