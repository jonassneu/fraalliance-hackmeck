"""Live record: score every forecast issued by fra.archive against the direction that was actually flown.

    uv run python -m fra.scoring          -> data/archive/live_record.json (+ a copy in site/ for the dashboard)
                                             and data/archive/live_record_variants.json (champion vs challengers)
    uv run python -m fra.scoring --dry-run   compute both, write nothing (smoke test of a runtime)

These forecasts were issued hour by hour with the model of the day and only live inputs, so they are the true
out-of-sample record (the locked holdout starts with issue times >= 2026-11-01). Everything is recomputed from the
files on every run (cheap), so labels that arrive late or get corrected are picked up automatically.

Truth: flown OD / RWY 18 from data/inaa_counts.csv via fra.labels.to_labels(bridge="night"), computed in memory
(labels.parquet is not touched): OD by majority if >= 4 movements, carried (<= 8 h) only through the night ban and
fetched quiet hours, never across a daytime hour the radar step did not fetch (that hour and the ones after it stay
unlabelled and are not scored; the pre-registered truth definition, as for training's clean labels); RWY 18 judged in
busy hours. Per window `truth` counts the valid hours that are directly observed, bridged and unlabelled.
Valid hour v of a forecast = the radar hour starting at v (same alignment as training). Baselines at the same issue
time: the official rules on the forecast wind (column rule_baseline_od of the issued forecast, hysteresis path from
the flown OD), the published Umwelthaus prognosis as of the issue hour (data/archive/prognosis_live.parquet; main
scenario P(west) >= 0.5, falling back to persistence where it has no block, like fra.train.baselines) and
persistence (the flown OD at issue). Next-change events use the fra.changetime definitions: an actual change must
last >= 2 flown hours, a predicted change is a hit within +-3 h.

Coverage: per window, the hours for which no forecast was issued (job not running, e.g. no user session without
systemd lingering, or a failed issue step); they are never backfilled, so they stay holes in the record.
Current-OD check: the issued od_now comes from the radar as published at issue time. Forecasts issued with the code of
31 Oct 2026 (runtime 2026-10-31-wave2) on take it from the last COMPLETELY published hour [t-2h, t-1h) (fra.dataset.
KNOWN_LAG_H = 2, as in training); the earlier ones read the newest, partly published hour [t-1h, t) (FANOMOS delay
~60-75 min). "od_now_vs_source_hour" = share of issues whose od_now equals the final label of [t-2h, t-1h) (the
consistency check of the current rule); "od_now_vs_full_hour" = share equal to the final label of [t-1h, t), i.e. how
often the one-hour staleness of od_now matters.

Variant streams: an official forecast belongs to the variant its .json records (fra.archive since 31 Oct 2026); the
stream of a variant = its official forecasts + its shadow forecasts, so a champion change never mixes two models in
one stream.

Variants (live_record_variants.json): the official forecasts (data/archive/issued/, issued by the registry champion)
and the shadow forecasts of every challenger (data/archive/issued_shadow/<variant>/, see fra.archive.load_variants)
are scored on IDENTICAL issue times only: per pair champion vs challenger, the issue hours both issued; per window
"all", the issue hours every variant issued. Per lead 1/6/24/48 and pooled over these leads: OD accuracy (p >= 0.5)
and Brier, RWY 18 Brier, with day-block bootstrap 95 % CIs (fra.evalkit.bootstrap, blocks = valid day) and the paired
difference champion - challenger (accuracy: + = champion better; Brier: - = champion better) with its CI and a
two-sided bootstrap p. CIs use BLOCK_DAYS = 3-day blocks (fixed calendar blocks of the valid day; daily paired
differences are autocorrelated, lag-1 ~0.2 on the long test, so 1-day blocks are too narrow; amendment of the
pre-registration of 31 Oct 2026); `brier_pooled_by_block_days` repeats the pooled Brier difference with 1-, 3- and
7-day blocks. Per variant on the same issue hours also the next-change events and the RWY 18 warnings.
Input health (`inputs`, per stream): NWP runs that fell back to an older run (fra.archive live_inputs), the logit and
Part B on different ECMWF runs, blend fallbacks to the logit. `source_hour`: the counts of the od_now source hour
[t-2h, t-1h) as read at issue time vs its final counts (how complete the hour was when the job read it).
Windows: since start, the holdout (issue times >= 2026-11-01), which is the referee, and the pre-registered fixed
holdout windows holdout_4w / holdout_8w (HOLDOUT_WINDOWS, experiments/integration/preregistration.json).
"""

import json
import os
import sys
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
ARCHIVE = DATA / "archive"
ISSUED = ARCHIVE / "issued"
PROG_LIVE = ARCHIVE / "prognosis_live.parquet"
OUT = ARCHIVE / "live_record.json"
SHADOW = ARCHIVE / "issued_shadow"
REGISTRY = Path(os.environ["FRA_VARIANTS_FILE"]) if os.environ.get("FRA_VARIANTS_FILE") else ARCHIVE / "variants.json"  # smoke: candidate
OUT_VARIANTS = ARCHIVE / "live_record_variants.json"
SITE_OUT = ROOT / "site" / "live_record.json"

LEADS = (1, 6, 24, 48)
H = 48
HOLDOUT_FROM = pd.Timestamp("2026-11-01", tz="UTC")
# pre-registered fixed analysis windows (experiments/integration/preregistration.json): issue times from HOLDOUT_FROM
# through these hours inclusive (4 weeks = primary decision, 8 weeks = extension if the primary one is inconclusive)
HOLDOUT_WINDOWS = {"holdout_4w": pd.Timestamp("2026-11-28T23:00", tz="UTC"),
                   "holdout_8w": pd.Timestamp("2026-12-26T23:00", tz="UTC")}
ROLLING_DAYS = 30
BLOCK_DAYS = 3              # bootstrap blocks of the variant comparison (pre-registration amendment, 31 Oct 2026)
SENS_BLOCK_DAYS = (1, 3, 7)  # pooled Brier difference repeated with these block lengths
TOL_H, ACTUAL_MIN_RUN = 3, 2  # as in fra.changetime
BINS = np.linspace(0, 1, 11)


# ---------------------------------------------------------------- inputs

def load_issued(folder=ISSUED):
    frames = []
    for p in sorted(Path(folder).glob("forecast_*.csv")):
        try:
            f = pd.read_csv(p)
        except Exception as ex:
            print(f"skip {p.name}: {ex}", file=sys.stderr)
            continue
        f["file"] = p.name
        frames.append(f)
    if not frames:
        return pd.DataFrame()
    f = pd.concat(frames, ignore_index=True)
    for c in ("issue_utc", "valid_utc", "next_change_utc"):
        f[c] = pd.to_datetime(f[c], utc=True, format="ISO8601")
    return f


_labels = None
_counts = None


def load_counts_cached():
    global _counts
    if _counts is None:
        from fra.labels import load_counts
        _counts = load_counts()
    return _counts


def load_labels():
    """Truth labels (pre-registered): to_labels(load_counts(), bridge="night"), see the module docstring."""
    global _labels
    if _labels is None:
        from fra.labels import to_labels
        _labels = to_labels(load_counts_cached(), bridge="night")
    return _labels


def truth_stats(valid):
    """How the valid hours `valid` are labelled: observed (>= 4 movements in the hour), bridged (night ban / quiet
    hour carried <= 8 h), unlabelled (not scored)."""
    v = pd.DatetimeIndex(pd.unique(pd.DatetimeIndex(valid)))
    lab, c = load_labels(), load_counts_cached()
    od = lab["od"].reindex(v)
    n = (c["west"] + c["east"]).reindex(v)
    obs = od.notna() & (n >= 4)
    return dict(valid_hours=int(len(v)), observed=int(obs.sum()), bridged=int((od.notna() & ~obs).sum()),
                unlabelled=int(od.isna().sum()))


def published_prognosis(issues):
    """P(west) of the main scenario per (issue, lead) as published at the issue hour (None if not archived)."""
    if not len(issues):
        return None
    from fra import prognosis
    cols = ["asof", "kind", "start", "state", "prob"]
    parts = []
    for rank, p in enumerate((PROG_LIVE, prognosis.ARCHIVE)):  # live snapshot first, history archive as fallback
        try:
            a = pd.read_parquet(p, columns=cols)
            parts.append(a[a["asof"].isin(issues)].assign(rank=rank))
        except Exception:
            pass
    if not parts:
        return None
    arch = pd.concat(parts, ignore_index=True)
    if arch.empty:
        return None
    arch = arch[arch["rank"] == arch.groupby("asof")["rank"].transform("min")][cols]  # one source per as-of
    f = prognosis.features(pd.DatetimeIndex(sorted(arch["asof"].unique())), list(range(1, H + 1)), arch)
    return f[["issue", "lead", "prog_main_west"]].rename(columns={"issue": "issue_utc", "lead": "lead_h"})


# ---------------------------------------------------------------- metrics

def r4(x):
    return None if x is None or (isinstance(x, float) and np.isnan(x)) else round(float(x), 4)


def od_metrics(d):
    """d: scored rows (y = flown OD). Accuracy of the model and the baselines, Brier, accuracy on changed hours."""
    if d.empty:
        return dict(n=0)
    y25 = (d["y"] == 25).astype(float)
    ch = d["y"] != d["od_now"]
    return dict(n=int(len(d)), acc=r4((d["od_pred"] == d["y"]).mean()), brier=r4(((d["p_od25"] - y25) ** 2).mean()),
                rule=r4((d["rule_baseline_od"] == d["y"]).mean()), prog=r4((d["prog_od"] == d["y"]).mean()),
                pers=r4((d["od_now"] == d["y"]).mean()), prog_coverage=r4(d["prog_real"].mean()),
                n_changed=int(ch.sum()), acc_changed=r4((d.loc[ch, "od_pred"] == d.loc[ch, "y"]).mean()) if ch.any() else None,
                rule_changed=r4((d.loc[ch, "rule_baseline_od"] == d.loc[ch, "y"]).mean()) if ch.any() else None)


def rwy18_metrics(d):
    d = d[d["y18"].notna()]
    if d.empty:
        return dict(n=0)
    closed = d["y18"] == 0
    warn = d["p_rwy18_open"] < 0.8
    return dict(n=int(len(d)), acc=r4(((d["p_rwy18_open"] >= 0.5) == (d["y18"] == 1)).mean()),
                brier=r4(((d["p_rwy18_open"] - d["y18"]) ** 2).mean()), closed_hours=int(closed.sum()),
                closed_flagged=int((closed & warn).sum()), false_alarms=int((~closed & warn).sum()))


def reliability(d):
    if d.empty:
        return []
    b = np.clip(np.digitize(d["p_od25"], BINS[1:-1]), 0, len(BINS) - 2)
    out = []
    for k in range(len(BINS) - 1):
        m = b == k
        if m.any():
            out.append(dict(bin=f"{BINS[k]:.1f}-{BINS[k + 1]:.1f}", n=int(m.sum()), p=r4(d.loc[m, "p_od25"].mean()),
                            obs=r4((d.loc[m, "y"] == 25).mean())))
    return out


def first_change(diff, k):
    """First index where diff holds for k consecutive steps (-1 = none)."""
    for i in range(len(diff) - k + 1):
        if diff[i:i + k].all():
            return i
    return -1


def switch_events(f, lab):
    """Per issue with a fully labelled 48 h horizon: actual first sustained change vs the issued next change."""
    od = lab["od"]
    last = od.dropna().index.max()
    rows = []
    for issue, g in f.groupby("issue_utc"):
        if issue + pd.Timedelta(hours=H) > last:
            continue
        g = g.sort_values("lead_h")
        y = od.reindex(g["valid_utc"]).ffill().bfill().values
        if np.isnan(y).all():
            continue
        now = g["od_now"].iloc[0]
        act = first_change(y != now, ACTUAL_MIN_RUN)
        nc = g["next_change_utc"].iloc[0]
        pred = -1 if pd.isna(nc) else int(round((nc - issue) / pd.Timedelta(hours=1))) - 1
        rows.append(dict(issue=issue, act=act, pred=pred))
    if not rows:
        return dict(n_issues=0)
    e = pd.DataFrame(rows)
    has_a, has_p = e["act"] >= 0, e["pred"] >= 0
    hit = has_a & has_p & ((e["pred"] - e["act"]).abs() <= TOL_H)
    n = len(e)
    return dict(n_issues=n, n_actual_change=int(has_a.sum()), n_pred_change=int(has_p.sum()), hits=int(hit.sum()),
                hit_rate=r4(hit.sum() / max(has_a.sum(), 1)) if has_a.any() else None,
                timing_mae_h=r4((e["pred"] - e["act"]).abs()[hit].mean()) if hit.any() else None,
                false_alarm=int((~has_a & has_p).sum()), missed=int((has_a & ~has_p).sum()),
                correct_no_change=int((~has_a & ~has_p).sum()),
                event_acc=r4((hit.sum() + (~has_a & ~has_p).sum()) / n))


def coverage(issues, t_from, now, strict=False):
    """Issue hours expected in [max(t_from, first issue), last complete hour] vs issued (strict: from t_from even
    before the first issue, for the holdout)."""
    if strict:
        lo = pd.Timestamp(t_from)
    elif not len(issues):
        return dict(expected=0, issued=0, missing=0)
    else:
        lo = max(pd.Timestamp(t_from), issues.min()) if t_from is not None else issues.min()
    hi = (now - pd.Timedelta(minutes=30)).floor("h")  # the current hour is issued by the run that calls the scoring
    exp = pd.date_range(lo.ceil("h"), hi, freq="h") if hi >= lo else pd.DatetimeIndex([], tz="UTC")
    miss = exp.difference(pd.DatetimeIndex(issues))
    return dict(expected=int(len(exp)), issued=int(len(exp) - len(miss)), missing=int(len(miss)),
                missing_hours=[iso(t) for t in miss[-72:]])


def od_now_check(w, lab, back_h=1):
    """Issued od_now (radar as published at issue time) vs the final label of the hour starting at issue - back_h
    (1: [issue-1h, issue), the newest hour; 2: [issue-2h, issue-1h), the last complete hour = the current rule)."""
    i = w.drop_duplicates("issue_utc")
    full = lab["od"].reindex(i["issue_utc"] - pd.Timedelta(hours=back_h)).values
    m = ~pd.isna(full)
    if not m.any():
        return dict(n=0)
    diff = i["od_now"].values[m] != full[m]
    return dict(n=int(m.sum()), agree=r4(1 - diff.mean()), n_differ=int(diff.sum()),
                differ=[iso(t) for t in i["issue_utc"].values[m][diff][-24:]])


def window(f, lab, mask, name, t_from=None, now=None, strict=False):
    w = f[mask]
    issues = w["issue_utc"].drop_duplicates()
    d = w[w["y"].notna()]
    res = dict(name=name, n_issues=int(len(issues)), n_scored_issues=int(d["issue_utc"].nunique()),
               first_issue=iso(issues.min()) if len(issues) else None, last_issue=iso(issues.max()) if len(issues) else None,
               coverage=coverage(issues, t_from, now or pd.Timestamp.now("UTC"), strict), od_now_vs_full_hour=od_now_check(w, lab),
               od_now_vs_source_hour=od_now_check(w, lab, 2),
               od={str(L): od_metrics(d[d["lead_h"] == L]) for L in LEADS})
    res["od"]["all"] = od_metrics(d)
    try:
        res["truth"] = truth_stats(w["valid_utc"])
    except Exception as ex:
        res["truth"] = dict(error=str(ex)[:120])
    res["rwy18"] = rwy18_metrics(w)
    res["switch"] = switch_events(w, lab)
    res["reliability"] = reliability(d)
    return res


def iso(t):
    return None if t is None or pd.isna(t) else pd.Timestamp(t).tz_convert("UTC").isoformat()


# ---------------------------------------------------------------- variants: champion vs challengers

def registry():
    try:
        return [v for v in json.loads(REGISTRY.read_text()).get("variants", []) if v.get("enabled", True)]
    except (OSError, ValueError):
        return []


def boot_table(y, preds, valid, lead, pairs, block_days=BLOCK_DAYS):
    """Accuracy / Brier per lead and pooled with day-block bootstrap CIs (fra.evalkit.bootstrap; a self-contained
    copy of the same estimator if it cannot be imported) -> long DataFrame (metric, lead, method, n, n_days, est, lo,
    hi, p_boot); lead 0 = pooled over LEADS. block_days: length of the bootstrap blocks (calendar days of valid)."""
    try:
        from fra.evalkit import bootstrap
        return bootstrap(y, preds, valid, lead, leads=LEADS, pairs=pairs, block_days=block_days)
    except ImportError:
        pass
    y, lead = np.asarray(y, float), np.asarray(lead)
    P = {k: np.asarray(v, float) for k, v in preds.items()}
    ok = np.isfinite(y) & np.isin(lead, LEADS)
    for v in P.values():
        ok &= np.isfinite(v)
    cols = ["metric", "lead", "method", "n", "n_days", "est", "lo", "hi", "p_boot"]
    if not ok.any():
        return pd.DataFrame(columns=cols)
    v = pd.DatetimeIndex(valid)[ok].tz_convert("UTC")   # = fra.evalkit.day_blocks
    day = np.asarray((v.normalize() - pd.Timestamp("2000-01-01", tz="UTC")) // pd.Timedelta(days=1), dtype=np.int64)
    blk = np.unique(day // block_days, return_inverse=True)[1]
    nb = blk.max() + 1
    rng = np.random.default_rng(20261031)
    W = np.zeros((2000, nb))
    np.add.at(W, (np.repeat(np.arange(2000), nb), rng.integers(0, nb, size=(2000, nb)).ravel()), 1.0)
    y, lead = y[ok], lead[ok]
    P = {k: v[ok] for k, v in P.items()}
    vals = {"acc": {k: ((v > 0.5) == (y > 0.5)).astype(float) for k, v in P.items()},
            "brier": {k: (v - y) ** 2 for k, v in P.items()}}
    rows = []
    for L, g in [(L, lead == L) for L in LEADS] + [(0, np.ones(len(y), bool))]:
        if not g.any():
            continue
        n_b = np.bincount(blk[g], minlength=nb).astype(float)
        den = W @ n_b
        den[den == 0] = np.nan

        def stat(x):
            sm = np.bincount(blk[g], weights=x[g], minlength=nb)
            return sm.sum() / n_b.sum(), (W @ sm) / den

        for metric, val in vals.items():
            items = [(k, val[k], False) for k in P] + [(f"{a} - {c}", val[a] - val[c], True) for a, c in pairs]
            for name, x, paired in items:
                est, bs = stat(x)
                lo, hi = np.nanpercentile(bs, [2.5, 97.5])
                p = min(1.0, 2 * min(np.nanmean(bs <= 0), np.nanmean(bs >= 0))) if paired else np.nan
                rows.append([metric, L, name, int(g.sum()), int((n_b > 0).sum()), est, lo, hi, p])
    return pd.DataFrame(rows, columns=cols)


def nest(tab, prefix=""):
    """Long bootstrap table -> {lead ('1', '6', '24', '48', 'pooled'): {method: {metric: {est, lo, hi[, p]}, n, n_days}}}."""
    out = {}
    for r in tab.itertuples(index=False):
        lk = "pooled" if int(r.lead) == 0 else str(int(r.lead))
        m = out.setdefault(lk, {}).setdefault(r.method, dict(n=int(r.n), n_days=int(r.n_days)))
        m[f"{prefix}{r.metric}"] = dict(est=r4(r.est), lo=r4(r.lo), hi=r4(r.hi),
                                        **({} if pd.isna(r.p_boot) else dict(p=r4(r.p_boot))))
    return out


def compare(streams, names, pairs, lab=None):
    """Score `names` on the issue hours ALL of them issued (identical rows): OD accuracy + Brier and RWY 18 Brier
    with CIs, paired differences for `pairs`; with `lab` also, per variant on the same issue hours, the next-change
    events (switch_events) and the RWY 18 warnings at P(open) < 0.8 over all leads (rwy18_metrics)."""
    common = None
    for n in names:
        iss = set(streams[n]["issue_utc"].unique())
        common = iss if common is None else common & iss
    common = sorted(common or [])
    res = dict(variants=list(names), n_issues=len(common), first_issue=iso(min(common)) if common else None,
               last_issue=iso(max(common)) if common else None)
    if not common:
        return dict(res, n_scored_issues=0, od={}, rwy18={})
    key = ["issue_utc", "lead_h"]
    base = streams[names[0]]
    m = base[base["issue_utc"].isin(common)][key + ["valid_utc", "y", "y18"]].drop_duplicates(key)
    for n in names:
        s = streams[n]
        s = s[s["issue_utc"].isin(common)].drop_duplicates(key)[key + ["p_od25", "p_rwy18_open"]]
        m = m.merge(s.rename(columns={"p_od25": f"p25|{n}", "p_rwy18_open": f"p18|{n}"}), on=key, how="inner")
    d = m[m["y"].notna()]
    res["n_scored_issues"] = int(d["issue_utc"].nunique())
    try:
        res["truth"] = truth_stats(m["valid_utc"])
    except Exception as ex:
        res["truth"] = dict(error=str(ex)[:120])
    if d.empty:
        return dict(res, od={}, rwy18={})
    y25 = (d["y"] == 25).astype(float)
    od = boot_table(y25, {n: d[f"p25|{n}"] for n in names}, d["valid_utc"], d["lead_h"], pairs)
    sens = {}
    for bd in SENS_BLOCK_DAYS:   # the pooled Brier difference with other block lengths (sensitivity)
        t = od if bd == BLOCK_DAYS else boot_table(y25, {n: d[f"p25|{n}"] for n in names}, d["valid_utc"],
                                                   d["lead_h"], pairs, block_days=bd)
        t = t[(t["metric"] == "brier") & (t["lead"] == 0) & t["method"].str.contains(" - ")]
        sens[str(bd)] = {r.method: dict(est=r4(r.est), lo=r4(r.lo), hi=r4(r.hi), p=r4(r.p_boot))
                         for r in t.itertuples(index=False)}
    res["brier_pooled_by_block_days"] = sens
    d18 = m[m["y18"].notna()]
    r18 = boot_table(d18["y18"].astype(float), {n: d18[f"p18|{n}"] for n in names}, d18["valid_utc"], d18["lead_h"],
                     pairs) if len(d18) else pd.DataFrame(columns=od.columns)
    res = dict(res, od=nest(od), rwy18=nest(r18))
    if lab is not None:
        sub = {n: streams[n][streams[n]["issue_utc"].isin(common)].drop_duplicates(key) for n in names}
        res["switch"] = {n: switch_events(f, lab) for n, f in sub.items()}
        res["rwy18_warnings"] = {n: rwy18_metrics(f) for n, f in sub.items()}
    return res


def _json_records(folder):
    out = []
    for p in sorted(Path(folder).glob("forecast_*.json")):
        try:
            out.append(json.loads(p.read_text()))
        except (OSError, ValueError):
            continue
    return out


def input_health(recs, t_from=None):
    """NWP fallbacks / logit-vs-Part-B ECMWF run / blend fallbacks of one stream's issued .json records."""
    rs = [r for r in recs if t_from is None or pd.Timestamp(r.get("issue_utc")) >= t_from]
    li = [r.get("live_inputs") for r in rs if isinstance(r.get("live_inputs"), dict) and "runs" in r["live_inputs"]]
    fb = {}
    for x in li:
        for m in x.get("fallback_models") or []:
            fb[m] = fb.get(m, 0) + 1
    bl = [r.get("blend") for r in rs if isinstance(r.get("blend"), dict)]
    return dict(n_issues=len(rs), n_with_inputs_record=len(li), n_any_nwp_fallback=sum(bool(x.get("any_fallback")) for x in li),
                fallback_by_model=fb, n_ifs_logit_partb_differ=sum(x.get("ifs_same_run") is False for x in li),
                n_blend=len(bl), n_blend_fallback=sum(not str(b.get("status", "")).startswith("ok") for b in bl))


def source_hour(recs, t_from=None):
    """od_now source hour [t-2h, t-1h) as read at issue time (flown_state.od_hour with hours_back 0) vs its final
    counts in data/inaa_counts.csv (once re-checked): complete share, mean published share, OD / RWY 18 status agreement."""
    c = load_counts_cached()
    rows = []
    for r in recs:
        if t_from is not None and pd.Timestamp(r.get("issue_utc")) < t_from:
            continue
        fs = r.get("flown_state") or {}
        oh = fs.get("od_hour") or {}
        if not oh or oh.get("hours_back") != 0 or not fs.get("last_complete_hour"):
            continue
        h = pd.Timestamp(oh["hour_start"])
        if h not in c.index or pd.isna(c.loc[h, "west"]):
            continue
        fw, fe, fr = (float(c.loc[h, k]) for k in ("west", "east", "rwy18_deps"))
        w, e, s18 = float(oh.get("west") or 0), float(oh.get("east") or 0), float(oh.get("rwy18_deps") or 0)
        busy = lambda n: n >= 15 and h.tz_convert("Europe/Berlin").hour >= 6
        rows.append(dict(complete=(w, e, s18) == (fw, fe, fr), share=(w + e) / max(fw + fe, 1),
                         od_same=(w >= e) == (fw >= fe),
                         r18_same=(busy(w + e) and s18 > 0) == (busy(fw + fe) and fr > 0) if busy(fw + fe) else None))
    if not rows:
        return dict(n=0)
    t = pd.DataFrame(rows)
    r18 = t["r18_same"].dropna()
    return dict(n=int(len(t)), complete=r4(t["complete"].mean()), mean_published_share=r4(t["share"].mean()),
                min_published_share=r4(t["share"].min()), od_same=r4(t["od_same"].mean()),
                rwy18_status_same=r4(r18.astype(float).mean()) if len(r18) else None)


PRE_REGISTRY = "production-before-registry"


def official_variants():
    """{issued csv file name: variant} from the official forecasts' .json (fra.archive records `variant`)."""
    out = {}
    for p in sorted(ISSUED.glob("forecast_*.json")):
        try:
            v = json.loads(p.read_text()).get("variant")
        except (OSError, ValueError):
            continue
        if v:
            out[p.with_suffix(".csv").name] = v
    return out


def compute_variants(now=None, official=None):
    """Champion (official stream) vs every challenger (shadow streams) on identical issue times."""
    now = now or pd.Timestamp.now("UTC")
    reg = registry()
    champ = next((v["name"] for v in reg if v.get("role") == "champion"), "production")
    info = {v["name"]: dict(role=v.get("role"), runtime=v.get("runtime"), entry=v.get("entry"),
                            models=v.get("models")) for v in reg}
    off = load_issued() if official is None else official
    if not off.empty:   # each official forecast belongs to the variant its .json records (none before 31 Oct 15:39)
        var = official_variants()
        off = off.assign(variant=off["file"].map(var).fillna(PRE_REGISTRY) if "file" in off else champ)
    streams = {}
    for name, f in (off.groupby("variant") if not off.empty else []):
        streams[name] = f.drop(columns="variant")
    streams.setdefault(champ, pd.DataFrame())
    if SHADOW.exists():
        for d in sorted(p for p in SHADOW.iterdir() if p.is_dir()):
            f = load_issued(d)
            if f.empty:
                continue
            if d.name in streams and not streams[d.name].empty:   # official issues of this variant + its shadows
                o = streams[d.name]
                f = pd.concat([o, f[~f["issue_utc"].isin(o["issue_utc"].unique())]], ignore_index=True)
            streams[d.name] = f
    base = dict(generated=iso(now), holdout_from=iso(HOLDOUT_FROM), leads=list(LEADS), champion=champ,
                definition=("official forecasts (champion) and shadow forecasts (challengers), each scored only on "
                            "issue hours every compared variant issued; paired difference = champion - challenger "
                            "(accuracy: + = champion better; Brier: - = champion better); 95 % day-block bootstrap CIs"))
    lab = load_labels() if any(not f.empty for f in streams.values()) else None
    variants = {}
    for n, f in list(streams.items()):
        if f.empty:
            streams.pop(n)
            continue
        f = f.copy()
        f["y"] = lab["od"].reindex(f["valid_utc"]).values
        f["y18"] = lab["rwy18_open"].reindex(f["valid_utc"]).values
        streams[n] = f
        iss = f["issue_utc"].drop_duplicates()
        variants[n] = dict(info.get(n, dict(role="champion" if n == champ else "unregistered")),
                           n_issued=int(len(iss)), first_issue=iso(iss.min()), last_issue=iso(iss.max()),
                           models_sha256=sorted({str(x)[:12] for x in f["model_sha256"].dropna().unique()})
                           if "model_sha256" in f else [])
    for n in info:
        variants.setdefault(n, dict(info[n], n_issued=0))
    wins = {}
    wdefs = [("since_start", None, None), ("holdout", HOLDOUT_FROM, None)] + [
        (k, HOLDOUT_FROM, t_to) for k, t_to in HOLDOUT_WINDOWS.items()]
    for wname, t_from, t_to in wdefs:
        if t_from is not None and now < t_from:
            continue
        lo = t_from if t_from is not None else pd.Timestamp.min.tz_localize("UTC")
        hi = t_to if t_to is not None else pd.Timestamp.max.tz_localize("UTC")
        sw = {n: f[f["issue_utc"].between(lo, hi)] for n, f in streams.items()}
        sw = {n: f for n, f in sw.items() if not f.empty}
        w = dict(pairs={}, all=None)
        if champ in sw:
            for c in sw:
                if c in (champ, PRE_REGISTRY):
                    continue
                r = compare(sw, [champ, c], [(champ, c)], lab)
                only = set(sw[champ]["issue_utc"].unique()) - set(sw[c]["issue_utc"].unique())
                r["champion_only_issues"] = len(only)
                w["pairs"][c] = r
            names = [champ] + [n for n in sw if n not in (champ, PRE_REGISTRY)]
            if len(names) > 2:
                w["all"] = compare(sw, names, [(champ, n) for n in names[1:]], lab)
        wins[wname] = w
    health = {}
    try:
        folders = {champ: ISSUED, **({d.name: d for d in sorted(SHADOW.iterdir()) if d.is_dir()} if SHADOW.exists() else {})}
        for n, folder in folders.items():
            recs = _json_records(folder)
            if n == champ:
                recs = [r for r in recs if r.get("variant") == champ]
            health[n] = dict(inputs=input_health(recs), inputs_holdout=input_health(recs, HOLDOUT_FROM) if now >= HOLDOUT_FROM else None,
                             source_hour=source_hour(recs))
    except Exception as ex:
        health = dict(error=f"{type(ex).__name__}: {str(ex)[:160]}")
    return dict(base, block_days=BLOCK_DAYS, variants=variants, windows=wins, health=health)


def write_variants(rec):
    p = OUT_VARIANTS
    tmp = p.with_name(f".{p.name}.{os.getpid()}.tmp")
    tmp.write_bytes(json.dumps(rec, indent=1, default=str).encode())
    os.replace(tmp, p)


# ---------------------------------------------------------------- main

def compute(now=None):
    now = now or pd.Timestamp.now("UTC")
    f = load_issued()
    base = dict(generated=iso(now), holdout_from=iso(HOLDOUT_FROM), rolling_days=ROLLING_DAYS, leads=list(LEADS),
                definition="forecasts issued live each hour by fra.archive, scored against flown OD (INAA radar)")
    if f.empty:
        return dict(base, status="collecting", start=None, n_forecasts=0, windows={})
    lab = load_labels()
    f["y"] = lab["od"].reindex(f["valid_utc"]).values
    f["y18"] = lab["rwy18_open"].reindex(f["valid_utc"]).values
    pg = published_prognosis(pd.DatetimeIndex(f["issue_utc"].unique()))
    if pg is not None:
        f = f.merge(pg, on=["issue_utc", "lead_h"], how="left")
    else:
        f["prog_main_west"] = np.nan
    f["prog_real"] = f["prog_main_west"].notna().astype(float)
    f["prog_od"] = np.where(f["prog_main_west"].isna(), f["od_now"], np.where(f["prog_main_west"] >= 0.5, 25, 7))
    if "od_pred" not in f:
        f["od_pred"] = np.where(f["p_od25"] >= 0.5, 25, 7)
    labelled = lab["od"].dropna()
    start = f["issue_utc"].min()
    t30 = now - pd.Timedelta(days=ROLLING_DAYS)
    wins = {"30d": window(f, lab, f["issue_utc"] >= t30, f"last {ROLLING_DAYS} days", t30, now),
            "since_start": window(f, lab, f["issue_utc"].notna(), "since start", None, now)}
    if now >= HOLDOUT_FROM:
        wins["holdout"] = window(f, lab, f["issue_utc"] >= HOLDOUT_FROM, f"holdout (issued from {HOLDOUT_FROM.date()})",
                                 HOLDOUT_FROM, now, strict=True)
    scored = f[f["y"].notna()]
    daily = [dict(date=str(day), n=int(len(g)), acc=r4((g["od_pred"] == g["y"]).mean()),
                  brier=r4(((g["p_od25"] - (g["y"] == 25)) ** 2).mean()))
             for day, g in scored.groupby(scored["valid_utc"].dt.tz_convert("Europe/Berlin").dt.date)]
    models = f.groupby("model_sha256")["issue_utc"].agg(["min", "max", "nunique"]) if "model_sha256" in f else None
    return dict(base, status="scoring" if len(scored) else "collecting", start=iso(start),
                n_forecasts=int(f["issue_utc"].nunique()), n_scored_rows=int(len(scored)),
                labels_until=iso(labelled.index.max()) if len(labelled) else None,
                models=[dict(sha256=k[:12], first=iso(r["min"]), last=iso(r["max"]), n=int(r["nunique"]))
                        for k, r in models.iterrows()] if models is not None else [],
                windows=wins, daily=daily)


def write(rec):
    blob = json.dumps(rec, indent=1, default=str).encode()
    for p in (OUT, SITE_OUT):
        p.parent.mkdir(parents=True, exist_ok=True)
        tmp = p.with_name(f".{p.name}.{os.getpid()}.tmp")
        tmp.write_bytes(blob)
        os.replace(tmp, p)


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    dry = "--dry-run" in argv
    rec = compute()
    if not dry:
        write(rec)
    w = rec.get("windows", {}).get("since_start")
    msg = f"live record: {rec['n_forecasts']} issued forecasts since {rec['start']}, status {rec['status']}"
    if w:
        parts = [f"{L} h {w['od'][L]['acc']:.1%} (n={w['od'][L]['n']})" for L in ("1", "6", "24", "48") if w["od"][L]["n"]]
        msg += "; OD accuracy " + (", ".join(parts) if parts else "n/a yet") + f"; labels until {rec.get('labels_until')}"
    print(msg)
    if not dry:
        print(f"wrote {OUT} and {SITE_OUT}")
    try:
        rv = compute_variants()
    except Exception as ex:  # never costs the champion's record above
        import traceback
        traceback.print_exc()
        print(f"variant record failed: {type(ex).__name__}: {ex}")
        return 1
    if not dry:
        write_variants(rv)
    for wname, w in rv["windows"].items():
        for c, r in w["pairs"].items():
            pooled = (r.get("od") or {}).get("pooled", {}).get(f"{rv['champion']} - {c}", {}).get("brier", {})
            print(f"variants {wname}: {rv['champion']} vs {c}: {r['n_issues']} common issues, {r['n_scored_issues']} "
                  f"scored; Brier diff (pooled 1/6/24/48) {pooled.get('est')} [{pooled.get('lo')}, {pooled.get('hi')}]")
    print(("dry run: nothing written" if dry else f"wrote {OUT_VARIANTS}"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
