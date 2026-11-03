"""Weekly retrain (systemd fra-retrain.timer, Sunday 04:30 local). SHIPPED DISABLED: the timer is installed but not
enabled, and data/archive/RETRAIN_PAUSED exists; arming it is the user's decision (ops/README.md).

    uv run python -m ops.retrain                  # refresh inputs, fit a candidate, smoke-test, promote, report
    uv run python -m ops.retrain --dry-run        # no shared writes: candidate fitted on the inputs as they are and
                                                  # smoke-tested but never promoted; report -> *_dryrun.md
    uv run python -m ops.retrain --no-refresh     # retrain on the inputs as they are
    uv run python -m ops.retrain --require-clean  # (used by the timer) refuse while the recipe code is uncommitted
    uv run python -m ops.retrain --promote FILE   # smoke-test a model file and make it the production model (manual;
                                                  # also the roll-back: --promote data/archive/models/<date>.pkl)

Skipped when data/archive/RETRAIN_PAUSED exists (touch it to pause, delete it to resume).

The production model is data/archive/models/production/model.pkl: fra.archive issues every hourly forecast with it,
and only this script promotes it (promoted.json + history.jsonl next to it). data/model.pkl (the modelling work's
model, rewritten by every `python -m fra.train`) is never read for production except as a flagged fallback.

1. Code: version = sha256 over fra/*.py (archived by fra.archive.code_snapshot) + `git status` of the recipe files
   in the report. --require-clean refuses to run if any recipe file has uncommitted changes (pin the code by
   committing it); without it the uncommitted state is recorded.
2. Refresh the production training inputs. Append-only and compare-and-swap: a file is replaced only if it is
   unchanged since it was read (otherwise that refresh is skipped: its owner is writing it), never rewritten in full:
   labels.parquet       rows of to_labels(load_counts()) after the last stored hour are appended, after checking that
                        the stored rows equal the rebuild on the common range (only forward hours of the archive that
                        the radar re-check corrected may differ, they are updated); any other difference aborts
   ifs_runs(_upper)     fra.singleruns.download_runs / download_upper_runs from the last archived init - 2 days, run on
   icon_runs.parquet    a private copy (data/archive/retrain_work/), checked to keep every stored init, then swapped in
   prognosis.parquet    + as-of hours from data/archive/prognosis_live.parquet, gaps fetched from INAA (sequential)
   metar.parquet        last 2 days re-fetched from IEM (late reports), older rows kept
   forecasts.parquet    last 7 days re-fetched from the Open-Meteo previous-runs API (final d0/d1/d2), older rows kept
3. Candidate: the production refit of fra.train.main (fra.train.fit on all labelled rows, same recipe) in this
   process -> data/archive/models/candidate/model.pkl. fra.train itself is NOT run: data/model.pkl, eval.csv,
   eval_long_ci.csv, train_meta.json, importance.json and experiments/eval_long/preds_cv.parquet stay untouched.
4. Smoke test: a live fra.predict.forecast() with the candidate, exactly as fra.archive issues (prognosis snapshot,
   radar archive); it must return 48 finite probabilities in [0, 1] for both targets.
5. Promote the candidate if the smoke test passes (the previous production model is backed up to
   data/archive/models/<date>.pkl); otherwise the production model stays. No model is selected on performance, so
   the locked holdout (issue times >= 2026-11-01) stays clean.
6. Calibration check, last 4 weeks of flown labels (OD model): Brier at leads 1/6/24/48 and reliability per
   probability bin for (a) the production recipe walk-forward (each week fitted only on data before it: the honest
   out-of-sample number), (b) the previous production model on rows issued after its training data (out of sample)
   and on all rows (partly in-sample), (c) the candidate (in-sample, reference only) and (d) the forecasts actually
   issued live (data/archive/issued). Warnings for a Brier jump or a miscalibrated bin. Monitoring only.
7. Report -> data/archive/retrain_report_<date>.md.
"""

import argparse
import hashlib
import json
import os
import pickle
import shutil
import subprocess
import sys
import traceback
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
ARCHIVE = DATA / "archive"
MODELS = ARCHIVE / "models"
PROD_DIR = MODELS / "production"
PROD_MODEL = PROD_DIR / "model.pkl"
PROD_INFO = PROD_DIR / "promoted.json"
WORK = ARCHIVE / "retrain_work"
PAUSE = ARCHIVE / "RETRAIN_PAUSED"
MODEL = DATA / "model.pkl"
LEADS = (1, 6, 24, 48)
WEEKS = 4
BINS = np.linspace(0, 1, 11)
WARN_BRIER_RATIO = 1.3   # walk-forward Brier vs the previous model's out-of-sample Brier
WARN_BIN_GAP, WARN_BIN_N = 0.10, 50
RECIPE = ["fra/train.py", "fra/dataset.py", "fra/evalkit.py", "fra/labels.py", "fra/rules.py", "fra/predict.py",
          "fra/prognosis.py", "fra/singleruns.py", "fra/singleruns_icon.py", "fra/weather.py", "fra/changetime.py"]


def now_utc():
    return pd.Timestamp.now("UTC")


def iso(t):
    return None if t is None or pd.isna(t) else pd.Timestamp(t).tz_convert("UTC").isoformat()


def sha256(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def atomic_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    tmp.write_text(text)
    os.replace(tmp, path)


# ---------------------------------------------------------------- compare-and-swap writes

def stamp(p):
    st = Path(p).stat()
    return st.st_mtime_ns, st.st_size


def cas_write(path, st0, write):
    """write(tmp) in the target directory, then replace `path` only if it is still the file that was read (stamp st0);
    otherwise another process wrote it meanwhile -> raise and leave it alone."""
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    try:
        write(tmp)
        if stamp(path) != st0:
            raise RuntimeError(f"{path.name} was changed by another process during the refresh; left untouched")
        os.replace(tmp, path)
    finally:
        tmp.unlink(missing_ok=True)


# ---------------------------------------------------------------- 1. code

def git(*args):
    try:
        return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, timeout=20).stdout.strip()
    except Exception as ex:
        return f"git failed: {ex}"


def code_state():
    from fra.archive import code_snapshot
    ver, man = code_snapshot()
    dirty = [l for l in git("status", "--porcelain", "--", *RECIPE).splitlines() if l.strip()]
    return dict(version=ver, manifest=str(man.relative_to(ROOT)), head=git("rev-parse", "--short", "HEAD"),
                dirty=dirty, diffstat=git("diff", "--stat", "HEAD", "--", *RECIPE).splitlines()[-1:] if dirty else [])


# ---------------------------------------------------------------- 2. refresh inputs

def refresh_labels(write):
    from fra.archive import radar_path
    from fra.labels import load_counts, to_labels
    p = DATA / "labels.parquet"
    st0 = stamp(p)
    old = pd.read_parquet(p)
    lab = to_labels(load_counts())
    if set(lab.columns) != set(old.columns):
        raise RuntimeError(f"labels.parquet columns {list(old.columns)} != to_labels {list(lab.columns)}: the labels "
                           "build changed; refresh left to the labels owner")
    lab = lab[old.columns]
    common = old.index.intersection(lab.index)
    a, b = old.loc[common], lab.loc[common]
    neq = ~((a == b) | (a.isna() & b.isna())).all(axis=1).to_numpy()
    bad = common[neq]
    own = pd.DatetimeIndex([t for t in bad if radar_path(t).exists()])  # forward hours corrected by the re-check
    foreign = bad.difference(own)
    new = lab[lab.index > old.index.max()]
    info = dict(stored_until=str(old.index.max()), rows=len(old), new_rows=len(new), until=str(lab.index.max()),
                common=len(common), corrected_forward_hours=[str(t) for t in own],
                observed_new=int(new["west_frac"].notna().sum()))
    if len(foreign):
        raise RuntimeError(f"labels.parquet differs from to_labels(load_counts()) on {len(foreign)} stored hours that "
                           f"the forward archive did not write (first {foreign[0]}): the labels build or the counts "
                           "changed; not touching labels.parquet (refresh left to the labels owner)")
    out = old.copy()
    if len(own):
        out.loc[own] = lab.loc[own].to_numpy()
    out = pd.concat([out, new]).astype(old.dtypes.to_dict())
    out.index.name = old.index.name
    if write and (len(new) or len(own)):
        cas_write(p, st0, lambda t: out.to_parquet(t))
        info["written"] = True
    return info


def _swap_in(work, src, st0, key="init"):
    """Replace src by its refreshed private copy if src is unchanged and every stored `key` is still there."""
    old = pd.read_parquet(src, columns=[key])
    new = pd.read_parquet(work, columns=[key])
    if len(new) < len(old) or not set(old[key].unique()) <= set(new[key].unique()):
        raise RuntimeError(f"refreshed copy of {src.name} lost rows ({len(old)} -> {len(new)}); not swapped in")
    cas_write(src, st0, lambda t: shutil.copyfile(work, t))
    return len(new) - len(old)


def refresh_runs(write):
    from fra import singleruns, singleruns_icon
    out = {}
    WORK.mkdir(parents=True, exist_ok=True)
    for name, mod, step_h, buf_h in (("ifs", singleruns, 6, 6), ("icon", singleruns_icon, 3, 4)):
        src = mod.ARCHIVE
        last = pd.read_parquet(src, columns=["init"])["init"].max()
        start = (last - pd.Timedelta(days=2)).strftime("%Y-%m-%d")
        if not write:
            pending = pd.date_range(last + pd.Timedelta(hours=step_h), now_utc() - pd.Timedelta(hours=buf_h),
                                    freq=f"{step_h}h")
            out[name] = dict(last_init=str(last), would_fetch_from=start, new_inits=len(pending))
            continue
        try:
            st0, work = stamp(src), WORK / src.name
            shutil.copy2(src, work)
            mod.ARCHIVE = work  # the owner's downloader appends to the private copy
            try:
                d = mod.download_runs(start=start, workers=2)
            finally:
                mod.ARCHIVE = src
            out[name] = dict(last_init_before=str(last), last_init=str(d["init"].max()),
                             rows_added=_swap_in(work, src, st0))
        except Exception as ex:
            out[name] = dict(error=f"{type(ex).__name__}: {str(ex)[:200]}")
    if write:
        src = singleruns.UPPER_ARCHIVE
        try:
            st0, work = stamp(src), WORK / src.name
            shutil.copy2(src, work)
            singleruns.UPPER_ARCHIVE = work
            try:
                singleruns.download_upper_runs(workers=2)
            finally:
                singleruns.UPPER_ARCHIVE = src
            out["ifs_upper"] = dict(rows_added=_swap_in(work, src, st0))
        except Exception as ex:  # failed runs stay pending for next week
            out["ifs_upper"] = dict(error=f"{type(ex).__name__}: {str(ex)[:200]}")
    errs = [f"{k}: {v['error']}" for k, v in out.items() if isinstance(v, dict) and v.get("error")]
    if errs:
        out["errors"] = errs
    return out


def refresh_prognosis(write):
    import time
    from fra import prognosis
    p = prognosis.ARCHIVE
    st0 = stamp(p)
    old = pd.read_parquet(p)
    last = old["asof"].max()
    hours = pd.date_range(last + pd.Timedelta(hours=1), now_utc().floor("h"), freq="h")
    live_p = ARCHIVE / "prognosis_live.parquet"
    live = pd.read_parquet(live_p)[list(old.columns)] if live_p.exists() else old.iloc[:0]
    live = live[live["asof"].isin(hours)]
    gaps = [t for t in hours if t not in set(live["asof"])]
    info = dict(last_asof=str(last), new_hours=len(hours), from_live_archive=int(live["asof"].nunique()),
                to_fetch=len(gaps))
    if not write or not len(hours):
        return info
    rows, failed = [], 0
    for t in gaps:  # sequential: INAA serializes requests for everyone
        try:
            rows += prognosis.fetch(t)
        except Exception:
            failed += 1
        time.sleep(0.3)
    new = pd.concat([live, pd.DataFrame(rows, columns=old.columns)], ignore_index=True)
    new = new[new["asof"] > last]  # append-only: stored as-of hours are never touched
    for c in old.columns:
        new[c] = new[c].astype(old[c].dtype)
    df = pd.concat([old, new.drop_duplicates(["asof", "kind", "start"], keep="last")], ignore_index=True)
    cas_write(p, st0, lambda t: df.to_parquet(t))
    info.update(fetch_failed=failed, rows_after=len(df))
    return info


def refresh_metar_forecasts(write):
    from fra import weather
    out = {}
    pm, pf = DATA / "metar.parquet", DATA / "forecasts.parquet"
    sm, sf = stamp(pm), stamp(pf)
    m_old = pd.read_parquet(pm)
    cut = (m_old.index.max() - pd.Timedelta(days=2)).normalize()
    f_old = pd.read_parquet(pf)
    fcut = (f_old.index.max() - pd.Timedelta(days=7)).normalize()
    out["metar"] = dict(last=str(m_old.index.max()), refetch_from=str(cut))
    out["forecasts"] = dict(last=str(f_old.index.max()), refetch_from=str(fcut))
    if not write:
        return out
    errors = []
    try:
        m_new = weather.metar(start=cut.strftime("%Y-%m-%d"))
        m = pd.concat([m_old[m_old.index < cut], m_new[m_new.index >= cut][m_old.columns]]).sort_index()
        if len(m) < len(m_old[m_old.index < cut]) + len(m_old[m_old.index >= cut]) * 0.9:
            raise RuntimeError("re-fetched METAR has fewer reports than stored")
        cas_write(pm, sm, lambda t: m.to_parquet(t))
        out["metar"]["last_after"] = str(m.index.max())
    except Exception as ex:
        errors.append(f"metar: {ex}")
    try:
        f_new = weather.archived_forecasts(start=fcut.strftime("%Y-%m-%d"))
        f = pd.concat([f_old[f_old.index < fcut], f_new[f_new.index >= fcut].reindex(columns=f_old.columns)]).sort_index()
        if f.index.max() < f_old.index.max():
            raise RuntimeError("re-fetched forecasts end earlier than stored")
        cas_write(pf, sf, lambda t: f.to_parquet(t))
        out["forecasts"]["last_after"] = str(f.index.max())
    except Exception as ex:
        errors.append(f"forecasts: {ex}")
    if errors:
        out["errors"] = errors
    return out


# ---------------------------------------------------------------- 3.-5. candidate, smoke test, promotion

def fit_candidate(dst):
    """The production refit of fra.train.main ({tgt: fit(d, tgt)} on the full table), without running fra.train."""
    from fra.train import TARGETS, fit, load_table
    d, kind = load_table()
    models = {tgt: fit(d, tgt) for tgt in TARGETS}
    dst.parent.mkdir(parents=True, exist_ok=True)
    tmp = dst.with_name(f".{dst.name}.{os.getpid()}.tmp")
    with open(tmp, "wb") as f:
        pickle.dump(models, f)
    os.replace(tmp, dst)
    lab = d.loc[d["od"].notna(), "valid"]
    return dict(path=str(dst.relative_to(ROOT)), sha256=sha256(dst), rows=len(d), label_kind=kind,
                labelled_until=iso(lab.max()), fitted_utc=iso(now_utc()))


def smoke_test(model_path):
    """Live forecast with this model file, exactly as fra.archive issues (nothing is written)."""
    import fra.predict as FP
    from fra import archive
    model_path = Path(model_path)
    if model_path.name != "model.pkl":  # fra.predict reads <DATA>/model.pkl
        tmpdir = WORK / "smoke"
        tmpdir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(model_path, tmpdir / "model.pkl")
        model_path = tmpdir / "model.pkl"
    archive.install_kml_cache()
    info = {}
    archive.patch_prognosis_live(info)
    data0 = FP.DATA
    FP.DATA = model_path.parent
    try:
        out, issue, od_now, change = FP.forecast()
    finally:
        FP.DATA = data0
    p = out[["p_od25", "p_rwy18_open"]].to_numpy(float)
    ok = len(out) == 48 and bool(np.isfinite(p).all()) and bool(((p >= 0) & (p <= 1)).all())
    return dict(ok=ok, issue=iso(issue), od_now=int(od_now), next_change=iso(change),
                p25_lead1=float(p[0, 0]), p25_lead24=float(p[23, 0]), min_p18_24h=float(p[:24, 1].min()),
                prognosis=info.get("prognosis_source"))


def backup(date):
    """Previous production model -> data/archive/models/<date>.pkl (+ .sha256)."""
    src = PROD_MODEL if PROD_MODEL.exists() else MODEL
    MODELS.mkdir(parents=True, exist_ok=True)
    dst, k = MODELS / f"{date}.pkl", 1
    while dst.exists():
        dst, k = MODELS / f"{date}_{k}.pkl", k + 1
    shutil.copy2(src, dst)
    h = sha256(dst)
    dst.with_suffix(".sha256").write_text(h + "\n")
    return dst, h


def promote(src, reason, smoke, trained=None):
    """Make `src` the production model (atomic), with promoted.json + a line in history.jsonl."""
    from fra.archive import keep_model
    src = Path(src)
    prev = json.loads(PROD_INFO.read_text()) if PROD_INFO.exists() else None
    sha, keep = keep_model(src)
    PROD_DIR.mkdir(parents=True, exist_ok=True)
    tmp = PROD_DIR / f".model.pkl.{os.getpid()}.tmp"
    shutil.copy2(src, tmp)
    os.replace(tmp, PROD_MODEL)
    info = dict(sha256=sha, promoted_utc=iso(now_utc()), source=str(src), archived=str(keep.relative_to(ROOT)),
                reason=reason, trained=trained, smoke_test=smoke,
                previous_sha256=(prev or {}).get("sha256"))
    atomic_text(PROD_INFO, json.dumps(info, indent=1, default=str))
    with open(PROD_DIR / "history.jsonl", "a") as f:
        f.write(json.dumps(info, default=str) + "\n")
    return info


def promote_cmd(path):
    """Manual promotion / roll-back: smoke-test FILE, then make it the production model."""
    path = Path(path).resolve()
    smoke = smoke_test(path)
    print(f"smoke test: {smoke}")
    if not smoke["ok"]:
        print("smoke test FAILED: production model unchanged")
        return 1
    trained = dict(file_mtime_utc=iso(pd.Timestamp(path.stat().st_mtime, unit="s", tz="UTC")))
    info = promote(path, f"manual: python -m ops.retrain --promote {path.relative_to(ROOT) if path.is_relative_to(ROOT) else path}",
                   smoke, trained)
    print(f"promoted {info['sha256'][:12]} -> {PROD_MODEL.relative_to(ROOT)}")
    return 0


def trained_before():
    """Upper bound of the outcomes the production model can know (rows issued from here on are out of sample)."""
    info = json.loads(PROD_INFO.read_text()) if PROD_INFO.exists() else {}
    t = (info.get("trained") or {})
    for k in ("labelled_until", "fitted_utc", "file_mtime_utc"):
        if t.get(k):
            return pd.Timestamp(t[k])
    src = PROD_MODEL if PROD_MODEL.exists() else MODEL
    return pd.Timestamp(src.stat().st_mtime, unit="s", tz="UTC")


# ---------------------------------------------------------------- 6. calibration check

def brier(p, y):
    return float(np.mean((p - y) ** 2)) if len(y) else np.nan


def reliability(p, y):
    b = np.clip(np.digitize(p, BINS[1:-1]), 0, len(BINS) - 2)
    return [dict(bin=f"{BINS[k]:.1f}-{BINS[k + 1]:.1f}", n=int((b == k).sum()), p=float(p[b == k].mean()),
                 obs=float(y[b == k].mean())) for k in range(len(BINS) - 1) if (b == k).any()]


def summarize(name, p, y, lead, note=""):
    m = ~np.isnan(p)
    p, y, lead = p[m], y[m], lead[m]
    sel = np.isin(lead, LEADS)
    r = dict(name=name, note=note, n=int(len(y)), n_1_6_24_48=int(sel.sum()), brier_1_6_24_48=brier(p[sel], y[sel]),
             brier_all=brier(p, y), acc_all=float(np.mean((p >= 0.5) == (y == 1))) if len(y) else np.nan,
             by_lead={L: brier(p[lead == L], y[lead == L]) for L in LEADS}, rel=reliability(p, y) if len(y) else [])
    r["max_bin_gap"] = max([abs(b["p"] - b["obs"]) for b in r["rel"] if b["n"] >= WARN_BIN_N], default=np.nan)
    # miscalibrated bin: off by > WARN_BIN_GAP and by > 3 binomial standard errors (n >= WARN_BIN_N)
    r["bad_bins"] = [b["bin"] for b in r["rel"] if b["n"] >= WARN_BIN_N and abs(b["p"] - b["obs"]) > max(
        WARN_BIN_GAP, 3 * np.sqrt(max(b["p"] * (1 - b["p"]), 1e-4) / b["n"]))]
    return r


def calibration(prev_path, prev_trained_before, cand_path=None):
    from fra.train import fit, load_table, predict
    d, _ = load_table()
    d = d[d["od"].notna()]
    end = d["valid"].max()
    start = end - pd.Timedelta(weeks=WEEKS)
    w = d[d["valid"] > start].copy()
    y = (w["od"] == 25).astype(float).values
    lead = w["lead"].values
    res = []
    # (a) walk-forward: each week predicted by the production recipe fitted only on outcomes before that week
    p_wf = np.full(len(w), np.nan)
    week = ((w["issue"] - w["issue"].min()).dt.days // 7).values
    for k in np.unique(week):
        te = week == k
        t0 = w["issue"][te].min()
        p_wf[te] = predict(fit(d[d["valid"] < t0], "od25"), w[te], "od25")
    res.append(summarize("production recipe, walk-forward (out of sample)", p_wf, y, lead,
                         "each week fitted on data before it"))
    # (b) previous production model
    with open(prev_path, "rb") as f:
        prev = pickle.load(f)
    p_prev = predict(prev["od25"], w, "od25")
    oos = (w["issue"] >= prev_trained_before).values
    res.append(summarize("previous model, issued after it was trained (out of sample)", np.where(oos, p_prev, np.nan), y,
                         lead, f"issue >= {prev_trained_before:%Y-%m-%d %H:%M} UTC"))
    res.append(summarize("previous model, all rows (partly in-sample)", p_prev, y, lead))
    # (c) candidate (in-sample)
    if cand_path is not None:
        with open(cand_path, "rb") as f:
            new = pickle.load(f)
        res.append(summarize("new model (in-sample, reference only)", predict(new["od25"], w, "od25"), y, lead))
    # (d) forecasts issued live
    try:
        from fra import scoring
        f = scoring.load_issued()
        if len(f):
            lab = scoring.load_labels()
            f["y"] = lab["od"].reindex(f["valid_utc"]).values
            f = f[f["y"].notna() & (f["valid_utc"] > start)]
            res.append(summarize("forecasts issued live (data/archive/issued)", f["p_od25"].values.astype(float),
                                 (f["y"] == 25).astype(float).values, f["lead_h"].values, "true forward record"))
    except Exception as ex:
        print("live record unavailable:", ex)
    return dict(start=start, end=end, rows=len(w), issues=int(w["issue"].nunique()), results=res)


# ---------------------------------------------------------------- 7. report

def fmt(x, nd=4):
    return "–" if x is None or (isinstance(x, float) and np.isnan(x)) else f"{x:.{nd}f}"


def report(date, ctx):
    L = [f"# Weekly retrain report {date}", "", f"Generated {now_utc():%Y-%m-%d %H:%M} UTC by `ops/retrain.py`"
         f"{' (DRY RUN: no shared file written, nothing promoted)' if ctx['dry'] else ''}.", ""]
    c = ctx.get("code")
    if c:
        L += [f"- Code: version {c['version'][:16]} (fra/*.py, archived in `{c['manifest']}`), git HEAD {c['head']}"
              + (f"; **uncommitted recipe changes**: {', '.join(x.strip() for x in c['dirty'])}" if c["dirty"] else
                 "; recipe files clean")]
    b = ctx.get("backup")
    if b:
        L += [f"- Previous production model {'' if ctx['dry'] else 'backed up to '}`{b['path']}` (sha256 "
              f"{b['sha256'][:12]}, out of sample for issues >= {b['trained_before']:%Y-%m-%d %H:%M} UTC)."]
    cd = ctx.get("candidate")
    if cd:
        L += [f"- Candidate `{cd['path']}` sha256 {cd['sha256'][:12]}: production recipe refit on {cd['rows']} rows, "
              f"labels until {cd['labelled_until']} ({cd['label_kind']})."]
    sm = ctx.get("smoke")
    if sm:
        L += [f"- Smoke test (live forecast with the candidate): {'passed' if sm.get('ok') else '**FAILED**'} "
              f"`{json.dumps(sm, default=str)}`"]
    pr = ctx.get("promoted")
    L += [f"- **Promoted** to `data/archive/models/production/model.pkl` (sha256 {pr['sha256'][:12]})." if pr else
          "- Production model **unchanged**" + (" (dry run)." if ctx["dry"] else ".")]
    L += ["", "## Input refresh", ""]
    for k, v in ctx.get("refresh", {}).items():
        L.append(f"- **{k}**: `{json.dumps(v, default=str)}`")
    cal = ctx.get("calibration")
    if cal:
        L += ["", f"## Calibration check: last {WEEKS} weeks of flown labels", "",
              f"Valid times {cal['start']:%Y-%m-%d %H:%M} .. {cal['end']:%Y-%m-%d %H:%M} UTC, {cal['issues']} issue times, "
              f"{cal['rows']} rows (OD model, all training leads). Brier: lower is better.", "",
              "| Model | rows | Brier 1/6/24/48 h | Brier 1 h | 6 h | 24 h | 48 h | Brier all leads | accuracy | max bin gap |",
              "|---|---|---|---|---|---|---|---|---|---|"]
        for r in cal["results"]:
            L.append(f"| {r['name']} | {r['n']} | **{fmt(r['brier_1_6_24_48'])}** | " + " | ".join(
                fmt(r["by_lead"][k]) for k in LEADS) + f" | {fmt(r['brier_all'])} | {fmt(r['acc_all'] * 100 if r['n'] else np.nan, 1)} % "
                f"| {fmt(r['max_bin_gap'], 3)} |")
        for r in cal["results"]:
            if r["rel"] and ("walk-forward" in r["name"] or "issued live" in r["name"] or "out of sample" in r["name"]):
                L += ["", f"Reliability, {r['name']}" + (f" ({r['note']})" if r["note"] else "") + ":", "",
                      "| P(OD 25) bin | n | mean P | observed share OD 25 |", "|---|---|---|---|"]
                L += [f"| {x['bin']} | {x['n']} | {x['p']:.3f} | {x['obs']:.3f} |" for x in r["rel"]]
        L += ["", "## Warnings", ""]
        warn = []
        res = {r["name"]: r for r in cal["results"]}
        wf = next(r for r in cal["results"] if "walk-forward" in r["name"])
        po = next((r for r in cal["results"] if r["name"].startswith("previous model, issued after")), None)
        if po and po["n_1_6_24_48"] >= 200 and wf["brier_1_6_24_48"] > WARN_BRIER_RATIO * po["brier_1_6_24_48"]:
            warn.append(f"walk-forward Brier {fmt(wf['brier_1_6_24_48'])} > {WARN_BRIER_RATIO} x the previous model's "
                        f"out-of-sample {fmt(po['brier_1_6_24_48'])}")
        for r in res.values():
            if "in-sample" not in r["name"] and r["bad_bins"]:
                warn.append(f"{r['name']}: bins {', '.join(r['bad_bins'])} off by > {WARN_BIN_GAP} and > 3 standard errors")
        L += [f"- WARNING: {x}" for x in warn] or ["- none"]
    if ctx.get("errors"):
        L += ["", "## Errors", ""] + [f"- {e}" for e in ctx["errors"]]
    L += ["", "## Notes", "",
          "- A candidate that passes the smoke test is promoted (fixed recipe); the calibration check is monitoring only",
          "  and never selects a model, so the locked holdout (issue times >= 2026-11-01) stays clean for the live record",
          "  (`data/archive/live_record.json`). fra.train is not run: data/model.pkl and the eval files are untouched.",
          f"- Roll back: `uv run python -m ops.retrain --promote {b['path'] if b and not ctx['dry'] else 'data/archive/models/<date>.pkl'}`"
          " (the next hourly fra.archive run issues with it).",
          "- Pause the weekly retrain: `touch data/archive/RETRAIN_PAUSED`."]
    out = ARCHIVE / f"retrain_report_{date}{'_dryrun' if ctx['dry'] else ''}.md"
    atomic_text(out, "\n".join(L) + "\n")
    return out


# ---------------------------------------------------------------- main

def main(argv=None):
    ap = argparse.ArgumentParser(description="weekly retrain")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-refresh", action="store_true")
    ap.add_argument("--require-clean", action="store_true", help="refuse while recipe files have uncommitted changes")
    ap.add_argument("--promote", metavar="FILE", help="smoke-test FILE and make it the production model")
    a = ap.parse_args(argv)
    if a.promote:
        return promote_cmd(a.promote)
    date = pd.Timestamp.now(tz="Europe/Berlin").strftime("%Y-%m-%d")
    if PAUSE.exists() and not a.dry_run:
        print(f"{PAUSE} exists: retrain paused, nothing done")
        return 0
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    ctx = dict(dry=a.dry_run, refresh={}, errors=[])
    ctx["code"] = code_state()
    if a.require_clean and ctx["code"]["dirty"]:
        ctx["errors"].append("refused (--require-clean): uncommitted changes in the recipe code: "
                             + ", ".join(x.strip() for x in ctx["code"]["dirty"]) + ". Commit the code the retrain "
                             "should use, or run without --require-clean by hand.")
        print(f"wrote {report(date, ctx)}")
        return 2
    prev_path = PROD_MODEL if PROD_MODEL.exists() else MODEL
    tb = trained_before()
    if a.dry_run:
        bpath, h = prev_path, sha256(prev_path)
    else:
        bpath, h = backup(date)
    ctx["backup"] = dict(path=str(bpath.relative_to(ROOT)), sha256=h, trained_before=tb)
    if not a.no_refresh:
        for name, fn in (("labels", refresh_labels), ("weather runs", refresh_runs), ("prognosis", refresh_prognosis),
                         ("metar + previous-runs forecasts", refresh_metar_forecasts)):
            try:
                ctx["refresh"][name] = fn(write=not a.dry_run)
                ctx["errors"] += [f"refresh {name}: {e}" for e in ctx["refresh"][name].get("errors", [])]
            except Exception as ex:
                traceback.print_exc()
                ctx["refresh"][name] = dict(error=f"{type(ex).__name__}: {str(ex)[:300]}")
                ctx["errors"].append(f"refresh {name}: {type(ex).__name__}: {str(ex)[:300]}")
            print(f"refresh {name}: {ctx['refresh'].get(name)}", flush=True)
    cand = MODELS / ("candidate_dryrun" if a.dry_run else "candidate") / "model.pkl"
    try:
        ctx["candidate"] = fit_candidate(cand)
        print(f"candidate: {ctx['candidate']}", flush=True)
    except BaseException as ex:  # fra.train.fit raises SystemExit on one-class labels
        traceback.print_exc()
        ctx["errors"].append(f"candidate fit: {type(ex).__name__}: {str(ex)[:300]}")
    if ctx.get("candidate"):
        try:
            ctx["smoke"] = smoke_test(cand)
        except Exception as ex:
            traceback.print_exc()
            ctx["smoke"] = dict(ok=False, error=f"{type(ex).__name__}: {str(ex)[:300]}")
        print(f"smoke test: {ctx['smoke']}", flush=True)
        if not ctx["smoke"].get("ok"):
            ctx["errors"].append("smoke test failed: production model unchanged")
        elif not a.dry_run:
            ctx["promoted"] = promote(cand, "weekly retrain (ops.retrain)", ctx["smoke"],
                                      {k: ctx["candidate"][k] for k in ("labelled_until", "fitted_utc", "rows")})
    try:
        ctx["calibration"] = calibration(prev_path if a.dry_run else bpath, tb,
                                         cand if ctx.get("candidate") else None)
    except Exception as ex:
        traceback.print_exc()
        ctx["errors"].append(f"calibration check: {type(ex).__name__}: {str(ex)[:200]}")
    out = report(date, ctx)
    print(f"wrote {out}")
    return 1 if ctx["errors"] else 0


if __name__ == "__main__":
    sys.exit(main())
