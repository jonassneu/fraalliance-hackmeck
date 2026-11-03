"""One source of truth for evaluation periods, walk-forward folds and day-block bootstrap error bars.

Periods (all UTC, by ISSUE time):
    TEST_START        2026-06-01  default walk-forward test (hourly labels since 2026-02-11 -> ~3x the legacy rows)
    LEGACY_TEST_START 2026-09-15  the hackathon test period (comparability with the submitted numbers)
    HOLDOUT_START     2026-11-01  locked holdout: never used for tuning / model selection
    SELECTION_START   2026-09-15  = LEGACY_TEST_START: the production spec (features, C = 0.03, 120-day window,
                                  temperature scaling, change-rule PARAMS / P48_COEF) was SELECTED on the walk-forward
                                  from this date. Rows from it on are in-sample for model selection, so the long test is
                                  only partly out of sample: report [TEST_START, SELECTION_START) separately (valid <
                                  SELECTION_START). Even that part is not perfectly clean (three weather features were
                                  also vetted on Mar-Sep 2026); only the locked holdout is a clean test.
                                  Phase 2 (experiments/phase2, 2026-10-31) re-tested the spec on the WHOLE long test
                                  (21 pre-registered variants) and adopted one change (fra.train.CLEAN_LABELS, Brier
                                  -0.00006, see fra.train): the "selection-free" part is selection-free only up to that
                                  change. After waves 1 and 2 (31 Oct 2026) SELECTION_START no longer marks a
                                  selection-free period at all for the blended forecast (fra.blend): its components,
                                  weights and change rule were chosen on the whole Jun-Oct test, so valid < 15 Sep is
                                  reported as "pre_sep15_part", not as selection-free; only the holdout is clean.

Default walk-forward tests score issue times in [start, HOLDOUT_START) whose valid time is also < HOLDOUT_START (so no
outcome from the holdout period is ever looked at while tuning). `final=True` is the explicit opt-in that scores ONLY
the holdout (issue >= HOLDOUT_START), weekly folds counted from HOLDOUT_START, each week predicted by a model trained
on outcomes strictly before that week.

Folds: week w = issue in [start + 7w d, start + 7(w+1) d); training rows = labels known at the week start: the label
of the radar hour starting at v is complete only at v + fra.dataset.KNOWN_LAG_H (FANOMOS publishes ~60-75 min late),
so training rows have valid + KNOWN_LAG_H h <= week start (KNOWN_LAG_H = 2: valid < week start - 1 h; the hackathon
rule valid < week start equals KNOWN_LAG_H = 1).

Error bars: day-block bootstrap. Whole days (of valid time, UTC) are resampled with replacement; the SAME resampled
days are used for every method, lead and metric, so paired differences (model - baseline, variant - production) are
computed on identical rows and their CIs account for the correlation between the two prediction sets.
"""

import numpy as np
import pandas as pd

TEST_START = pd.Timestamp("2026-06-01", tz="UTC")
LEGACY_TEST_START = pd.Timestamp("2026-09-15", tz="UTC")
HOLDOUT_START = pd.Timestamp("2026-11-01", tz="UTC")
SELECTION_START = LEGACY_TEST_START  # production spec selected on the walk-forward from here (see docstring)
REPORT_LEADS = (1, 6, 24, 48)
ALL_LEADS = tuple(range(1, 49))
POOLED = 0          # `lead` value of the pooled 1/6/24/48 group in bootstrap tables (headline Brier(1,6,24,48))
POOLED_ALL = -1     # `lead` value of the pooled group over ALL leads 1..48 (Brier(all leads))
N_BOOT = 2000
SEED = 20261031
WEEK = pd.Timedelta(days=7)


# ---------------------------------------------------------------- periods and folds

def _ts(x):
    t = pd.Timestamp(x)
    return t.tz_localize("UTC") if t.tzinfo is None else t.tz_convert("UTC")


def period_start(mode="cv"):
    """'cv' -> TEST_START, 'legacy' -> LEGACY_TEST_START, 'final' -> HOLDOUT_START, else a date string/Timestamp."""
    named = {"cv": TEST_START, "legacy": LEGACY_TEST_START, "final": HOLDOUT_START}
    return named[mode] if isinstance(mode, str) and mode in named else _ts(mode)


def test_weeks(issue, valid=None, start=None, final=False):
    """Weekly fold index per row (int array, -1 = not a test row).

    Default: issue in [start, HOLDOUT_START) and (if `valid` is given) valid < HOLDOUT_START.
    final=True: issue >= HOLDOUT_START only; weeks counted from HOLDOUT_START (`start` is ignored)."""
    issue = pd.DatetimeIndex(issue)
    if final:
        start = HOLDOUT_START
        ok = issue >= HOLDOUT_START
    else:
        start = TEST_START if start is None else _ts(start)
        if start >= HOLDOUT_START:
            raise ValueError(f"test start {start} is inside the locked holdout; use final=True to score the holdout")
        ok = (issue >= start) & (issue < HOLDOUT_START)
        if valid is not None:
            ok &= pd.DatetimeIndex(valid) < HOLDOUT_START
    wk = np.asarray((issue - start) // WEEK, dtype=np.int64)
    return np.where(ok, wk, -1)


def week_start(w, start=None, final=False):
    start = HOLDOUT_START if final else (TEST_START if start is None else _ts(start))
    return start + int(w) * WEEK


def label_lag_h():
    """Hours from the START of a radar hour until its label is completely published (= fra.dataset.KNOWN_LAG_H, read
    at call time so that a comparison run with the legacy lag also uses the legacy fold rule)."""
    from fra import dataset
    return int(dataset.KNOWN_LAG_H)


def folds(issue, valid, start=None, final=False, wk=None, lag_h=None):
    """Walk-forward weekly folds: yields (week, test_mask, train_mask) as numpy bool arrays.
    train_mask = labels known at the start of the test week: valid + lag_h h <= week start (lag_h default
    label_lag_h() = KNOWN_LAG_H; 1 = the hackathon rule valid < week start)."""
    if wk is None:
        wk = test_weeks(issue, valid, start, final)
    valid = pd.DatetimeIndex(valid)
    lag = pd.Timedelta(hours=label_lag_h() if lag_h is None else lag_h)
    for w in np.unique(wk[wk >= 0]):
        yield int(w), wk == w, np.asarray(valid + lag <= week_start(w, start, final))


def describe(start=None, final=False, wk=None):
    s = HOLDOUT_START if final else (TEST_START if start is None else _ts(start))
    n = int(wk.max()) + 1 if wk is not None and (wk >= 0).any() else 0
    if final:
        return f"locked holdout, walk-forward weekly from {s.date()} ({n} weeks)"
    return f"walk-forward weekly evaluation from {s.date()} ({n} weeks), holdout from {HOLDOUT_START.date()} excluded"


# ---------------------------------------------------------------- day-block bootstrap

def boot_weights(n_blocks, n_boot=N_BOOT, seed=SEED):
    """(n_boot, n_blocks) multiplicity matrix of blocks drawn with replacement."""
    rng = np.random.default_rng(seed)
    idx = rng.integers(0, n_blocks, size=(n_boot, n_blocks))
    W = np.zeros((n_boot, n_blocks))
    np.add.at(W, (np.repeat(np.arange(n_boot), n_blocks), idx.ravel()), 1.0)
    return W


def day_blocks(valid, block_days=1):
    """Block id per row: UTC calendar day of the valid time (or block_days-day blocks)."""
    v = pd.DatetimeIndex(valid).tz_convert("UTC")
    day = np.asarray((v.normalize() - pd.Timestamp("2000-01-01", tz="UTC")) // pd.Timedelta(days=1), dtype=np.int64)
    _, codes = np.unique(day // block_days, return_inverse=True)
    return codes


def bootstrap(y, preds, valid, lead, leads=REPORT_LEADS, pairs=(), mask=None, n_boot=N_BOOT, seed=SEED,
              block_days=1, alpha=0.05, pooled=True, per_lead=True, pooled_id=POOLED):
    """Accuracy (p > 0.5) and Brier with day-block bootstrap CIs, per lead and pooled over `leads`.

    y: 0/1 outcomes; preds: {name: P(y=1) or 0/1 predictions}; valid, lead: per row.
    pairs: [(a, b), ...] -> paired difference a - b (acc: + = a better; brier: - = a better).
    Rows: finite y, lead in `leads`, all preds finite (identical rows for every method) and `mask`.
    per_lead=False: only the pooled group, labelled `pooled_id` (e.g. leads=ALL_LEADS, pooled_id=POOLED_ALL).
    Returns a long DataFrame: metric, lead (POOLED = 0 for all `leads`), method, n, n_days, est, lo, hi, p_boot
    (two-sided bootstrap p for pairs: 2 * min(P(diff <= 0), P(diff >= 0)))."""
    y = np.asarray(y, dtype=float)
    lead = np.asarray(lead)
    P = {k: np.asarray(v, dtype=float) for k, v in preds.items()}
    ok = np.isfinite(y) & np.isin(lead, leads)
    for v in P.values():
        ok &= np.isfinite(v)
    if mask is not None:
        ok &= np.asarray(mask, dtype=bool)
    cols = ["metric", "lead", "method", "n", "n_days", "est", "lo", "hi", "p_boot"]
    if not ok.any():
        return pd.DataFrame(columns=cols)
    blk = day_blocks(pd.DatetimeIndex(valid)[ok], block_days)
    nb = int(blk.max()) + 1
    W = boot_weights(nb, n_boot, seed)
    y, lead = y[ok], lead[ok]
    P = {k: v[ok] for k, v in P.items()}
    correct = {k: ((v > 0.5) == (y > 0.5)).astype(float) for k, v in P.items()}
    se = {k: (v - y) ** 2 for k, v in P.items()}
    q = [100 * alpha / 2, 100 * (1 - alpha / 2)]
    groups = ([(L, lead == L) for L in leads] if per_lead else []) + \
        ([(pooled_id, np.ones(len(y), bool))] if pooled and (len(leads) > 1 or not per_lead) else [])
    rows = []
    for L, g in groups:
        if not g.any():
            continue
        b = blk[g]
        n_b = np.bincount(b, minlength=nb).astype(float)
        den = W @ n_b
        den[den == 0] = np.nan
        days = int((n_b > 0).sum())

        def stat(x):
            s = np.bincount(b, weights=x[g], minlength=nb)
            return s.sum() / n_b.sum(), (W @ s) / den

        for metric, val in (("acc", correct), ("brier", se)):
            for k in P:
                est, bs = stat(val[k])
                lo, hi = np.nanpercentile(bs, q)
                rows.append([metric, L, k, int(g.sum()), days, est, lo, hi, np.nan])
            for a, c in pairs:
                est, bs = stat(val[a] - val[c])
                lo, hi = np.nanpercentile(bs, q)
                p = 2 * min(np.nanmean(bs <= 0), np.nanmean(bs >= 0))
                rows.append([metric, L, f"{a} - {c}", int(g.sum()), days, est, lo, hi, min(p, 1.0)])
    return pd.DataFrame(rows, columns=cols)


def bootstrap_means(x, time, pairs=(), mask=None, n_boot=N_BOOT, seed=SEED, block_days=1, alpha=0.05):
    """Mean of arbitrary per-row values (e.g. hit / correct indicators per issue time) with day-block bootstrap CIs.
    x: {name: values}; time: per row (blocks = UTC days); rows: all values finite and `mask`; pairs -> a - b.
    Returns DataFrame: method, n, n_days, est, lo, hi, p_boot."""
    X = {k: np.asarray(v, dtype=float) for k, v in x.items()}
    ok = np.ones(len(next(iter(X.values()))), bool) if mask is None else np.asarray(mask, dtype=bool).copy()
    for v in X.values():
        ok &= np.isfinite(v)
    cols = ["method", "n", "n_days", "est", "lo", "hi", "p_boot"]
    if not ok.any():
        return pd.DataFrame(columns=cols)
    blk = day_blocks(pd.DatetimeIndex(time)[ok], block_days)
    nb = int(blk.max()) + 1
    W = boot_weights(nb, n_boot, seed)
    n_b = np.bincount(blk, minlength=nb).astype(float)
    den = W @ n_b
    den[den == 0] = np.nan
    q = [100 * alpha / 2, 100 * (1 - alpha / 2)]
    rows = []
    for name, v, is_pair in [(k, v[ok], False) for k, v in X.items()] + \
                            [(f"{a} - {b}", X[a][ok] - X[b][ok], True) for a, b in pairs]:
        s = np.bincount(blk, weights=v, minlength=nb)
        bs = (W @ s) / den
        lo, hi = np.nanpercentile(bs, q)
        p = min(2 * min(np.nanmean(bs <= 0), np.nanmean(bs >= 0)), 1.0) if is_pair else np.nan
        rows.append([name, int(ok.sum()), int((n_b > 0).sum()), s.sum() / n_b.sum(), lo, hi, p])
    return pd.DataFrame(rows, columns=cols)


def ci_wide(tab, metric="acc", value="fmt", scale=100, nd=1):
    """Pivot a bootstrap() table to method x lead with 'est [lo, hi]' strings."""
    t = tab[tab["metric"] == metric].copy()
    t["fmt"] = [fmt(e, lo, hi, scale, nd) for e, lo, hi in zip(t["est"], t["lo"], t["hi"])]
    return t.pivot(index="method", columns="lead", values=value)


def fmt(est, lo, hi, scale=100, nd=1, sign=False):
    if not np.isfinite(est):
        return "–"
    f = f"{{:{'+' if sign else ''}.{nd}f}}"
    return f"{f.format(est * scale)} [{f.format(lo * scale)}, {f.format(hi * scale)}]"
