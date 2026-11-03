"""Frozen runtimes for the hourly live job: the job never imports code from the working tree.

    uv run python -m ops.runtime snapshot --tag NAME [--note TEXT]   copy fra/*.py + ops/*.py -> data/archive/runtime/NAME/
    uv run python -m ops.runtime snapshot --tag NAME --base TAG --files fra/scoring.py,fra/dashboard.py
                                                                     copy snapshot TAG and replace ONLY the listed files
                                                                     from the working tree (scoring / site fixes during
                                                                     the holdout: the forecast code stays as registered)
    uv run python -m ops.runtime smoke NAME [--registry FILE]        forecast the current hour for every registered
                                                                     variant with that code, without writing official outputs
                                                                     (--registry: test a candidate registry before it goes
                                                                     live; runtimes that predate the option read the live one)
    uv run python -m ops.runtime promote NAME [--with V1,V2]         smoke must pass, then data/archive/runtime/current -> NAME
                                                                     (--with: challengers that move to NAME too; from
                                                                     the holdout start a promote whose forecast modules
                                                                     differ from the pre-registration is refused unless
                                                                     --allow-forecast-change "reason")
    uv run python -m ops.runtime list                                snapshots, the current one, the variant registry
    uv run python -m ops.runtime status                              current runtime + the last runs of the hourly job

Rollback = promote an older snapshot (they are never deleted by this tool).

A snapshot is a directory data/archive/runtime/NAME/ holding read-only copies of fra/*.py and ops/*.py plus symlinks
for every repository directory the code resolves through Path(__file__).resolve().parent.parent (data, site, web,
experiments, assets, ...), so DATA / SITE / ARCHIVE of the frozen code point at the live repository data. The
manifest RUNTIME.json records tag, creation time, sha256 per file, git HEAD and whether the copied code differed
from HEAD (dirty) and the versions of the Python packages the models depend on (`packages`; the smoke test fails if
the shared virtual environment changed since). fra-archive.service runs with WorkingDirectory=data/archive/runtime/
current and `<repo>/.venv/bin/python -m fra.archive` (the repository's virtual environment used directly, never
re-synced by `uv run`; the code of the snapshot: `python -m` puts the working directory first on sys.path).

Variants (data/archive/variants.json, see fra.archive.load_variants): the champion is issued as the official forecast
by the hourly job, every enabled challenger as a shadow forecast in its own runtime. `promote NAME` also sets the
champion's runtime tag to NAME in the registry (the official forecast is issued by the code in `current`).
"""

import argparse
import hashlib
import json
import os
import re
import shutil
import stat
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
_man = HERE / "RUNTIME.json"
REPO = Path(json.loads(_man.read_text())["repo"]) if _man.exists() else HERE  # also works from inside a snapshot
RUNTIME = REPO / "data" / "archive" / "runtime"
CURRENT = RUNTIME / "current"
HISTORY = RUNTIME / "history.jsonl"
SMOKE_DIR = RUNTIME / "smoke"
REGISTRY = REPO / "data" / "archive" / "variants.json"
UV = shutil.which("uv") or "/home/jonas/.local/bin/uv"
PY = REPO / ".venv" / "bin" / "python"             # the job's interpreter (no `uv run`: no re-lock / re-sync per start)
PACKAGES = ("numpy", "pandas", "scikit-learn", "lightgbm", "pyarrow", "requests", "scipy")
PREREG = REPO / "experiments" / "integration" / "preregistration.json"
HOLDOUT_START = datetime(2026, 11, 1, tzinfo=timezone.utc)
CODE_DIRS = ("fra", "ops")                         # *.py of these packages are copied
NO_LINK = {"fra", "ops", ".git", ".venv", "__pycache__", ".ruff_cache", ".shots", "src", "pyproject.toml", "uv.lock",
           ".python-version", ".gitignore", "RUNTIME.json"}
TAG_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$")
SMOKE_TIMEOUT_S = 600


def utc_now():
    return datetime.now(timezone.utc).replace(microsecond=0)


def iso(t):
    return t.isoformat()


def sha256_bytes(b):
    return hashlib.sha256(b).hexdigest()


def atomic_write(path, data: bytes):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    tmp.write_bytes(data)
    os.replace(tmp, path)


def git(*args):
    try:
        return subprocess.run(["git", *args], cwd=REPO, capture_output=True, text=True, timeout=20).stdout.strip()
    except Exception:
        return ""


def snapshot_dir(tag):
    if tag == "current":
        return CURRENT.resolve()
    if not TAG_RE.match(tag):
        raise SystemExit(f"bad tag {tag!r}: use letters, digits, '.', '_', '-' (max 64)")
    return RUNTIME / tag


def current_tag():
    try:
        return os.readlink(CURRENT).rstrip("/").split("/")[-1]
    except OSError:
        return None


def log_history(**rec):
    rec = dict(time_utc=iso(utc_now()), **rec)
    HISTORY.parent.mkdir(parents=True, exist_ok=True)
    with open(HISTORY, "a") as f:
        f.write(json.dumps(rec) + "\n")


# ---------------------------------------------------------------- snapshot

def packages():
    """Versions of PACKAGES in the job's virtual environment (asked from PY itself)."""
    code = ("import json,importlib.metadata as m,platform\n"
            "def v(n):\n    try: return m.version(n)\n    except Exception: return None\n"
            f"print(json.dumps(dict(python=platform.python_version(), **{{n: v(n) for n in {PACKAGES!r}}})))")
    try:
        r = subprocess.run([str(PY), "-c", code], capture_output=True, text=True, timeout=60)
        return json.loads(r.stdout.strip().splitlines()[-1])
    except Exception as ex:
        return dict(error=f"{type(ex).__name__}: {str(ex)[:120]}")


def snapshot(tag, note=None, force=False, base=None, only=None):
    """Freeze fra/*.py + ops/*.py of the working tree. base + only: copy snapshot `base` and replace only the files in
    `only` (repo-relative, e.g. fra/scoring.py) from the working tree; everything else stays byte-identical to base."""
    dst = snapshot_dir(tag)
    if dst.exists() or dst.is_symlink():
        if not force:
            raise SystemExit(f"{dst} exists (snapshots are immutable; pick a new tag)")
        if tag == current_tag():
            raise SystemExit(f"{tag} is the current runtime; refusing to overwrite it")
        _rmtree(dst)
    tmp = RUNTIME / f".{tag}.{os.getpid()}.tmp"
    if tmp.exists():
        _rmtree(tmp)
    files = {}
    if base:
        bdir = snapshot_dir(base)
        bman, bad, _ = verify(base)
        if bad:
            raise SystemExit(f"base snapshot {base} does not match its manifest: {bad}")
        only = [x.strip() for x in (only or []) if x.strip()]
        for rel in only:
            if not (REPO / rel).is_file() or rel.split("/")[0] not in CODE_DIRS or not rel.endswith(".py"):
                raise SystemExit(f"--files: {rel} is not a fra/*.py or ops/*.py file of the working tree")
        for d in CODE_DIRS:
            (tmp / d).mkdir(parents=True)
        for rel in sorted(set(bman["files"]) | set(only)):
            b = (REPO / rel).read_bytes() if rel in only else (bdir / rel).read_bytes()
            (tmp / rel).write_bytes(b)
            files[rel] = sha256_bytes(b)
    else:
        for d in CODE_DIRS:
            (tmp / d).mkdir(parents=True)
            for p in sorted((REPO / d).glob("*.py")):
                b = p.read_bytes()
                (tmp / d / p.name).write_bytes(b)
                files[f"{d}/{p.name}"] = sha256_bytes(b)
    links = {}
    for p in sorted(REPO.iterdir()):
        if p.name in NO_LINK or p.name.startswith("."):
            continue
        (tmp / p.name).symlink_to(p)
        links[p.name] = str(p)
    for rel in files:  # read-only copies: the frozen code cannot be edited in place by accident
        q = tmp / rel
        q.chmod(q.stat().st_mode & ~(stat.S_IWUSR | stat.S_IWGRP | stat.S_IWOTH))
    head = git("rev-parse", "HEAD")
    dirty_files = []
    for rel, s in files.items():
        blob = subprocess.run(["git", "show", f"HEAD:{rel}"], cwd=REPO, capture_output=True, timeout=20)
        if blob.returncode != 0 or sha256_bytes(blob.stdout) != s:
            dirty_files.append(rel)
    ver = hashlib.sha256()
    for name in sorted(k for k in files if k.startswith("fra/")):  # = fra.archive.code_snapshot() version
        ver.update(name.split("/", 1)[1].encode() + b"\0" + files[name].encode() + b"\0")
    man = dict(tag=tag, created_utc=iso(utc_now()), repo=str(REPO), git_head=head, dirty=bool(dirty_files),
               dirty_files=dirty_files, fra_code_version=ver.hexdigest(), note=note, files=files, links=links,
               base=base, replaced=sorted(only) if base else None, packages=packages(),
               python_cmd=f"cd {dst} && {PY} -m fra.archive")
    (tmp / "RUNTIME.json").write_text(json.dumps(man, indent=1))
    os.replace(tmp, dst)
    log_history(action="snapshot", tag=tag, git_head=head[:12], dirty=bool(dirty_files), n_files=len(files),
                note=note, **({"base": base, "replaced": sorted(only)} if base else {}))
    print(f"snapshot {tag}: {len(files)} files ({len(dirty_files)} differ from HEAD {head[:12]}), "
          f"links {', '.join(links)} -> {dst}")
    return man


def _rmtree(p):
    def onerr(fn, path, exc):
        os.chmod(path, stat.S_IWUSR | stat.S_IRUSR | stat.S_IXUSR)
        fn(path)
    if p.is_symlink():
        p.unlink()
    else:
        shutil.rmtree(p, onexc=onerr)


def verify(tag):
    """Files of the snapshot still equal the manifest (nobody edited the frozen copy)."""
    d = snapshot_dir(tag)
    man = json.loads((d / "RUNTIME.json").read_text())
    bad = [rel for rel, s in man["files"].items() if not (d / rel).exists() or sha256_bytes((d / rel).read_bytes()) != s]
    missing_links = [k for k in man["links"] if not (d / k).exists()]
    return man, bad, missing_links


# ---------------------------------------------------------------- smoke

def run_in(tag_dir, args, timeout, registry=None):
    env = dict(os.environ, OMP_NUM_THREADS="1", OPENBLAS_NUM_THREADS="1", MKL_NUM_THREADS="1", PYTHONUNBUFFERED="1")
    if registry:  # fra.archive reads FRA_VARIANTS_FILE instead of data/archive/variants.json (smoke tests only)
        env["FRA_VARIANTS_FILE"] = str(Path(registry).resolve())
    cmd = [str(PY), *args]
    return subprocess.run(cmd, cwd=tag_dir, capture_output=True, text=True, timeout=timeout, env=env)


def smoke(tag, quiet=False, registry=None):
    """Forecast the current hour in snapshot `tag` for every enabled variant (no official outputs written).
    The champion and every variant pinned to `tag` run with the code of `tag` and must pass; variants pinned to other
    runtimes run in their own runtime (as in the hourly job) and are reported, but do not block.
    registry: a candidate registry file instead of data/archive/variants.json (passed as FRA_VARIANTS_FILE)."""
    d = snapshot_dir(tag)
    man, bad, missing = verify(tag)
    res = dict(tag=tag, time_utc=iso(utc_now()), files_ok=not bad, files_changed=bad, missing_links=missing,
               imports=None, variants={}, scoring=None, registry=str(registry) if registry else None)
    regf = Path(registry) if registry else REGISTRY
    reg = json.loads(regf.read_text()) if regf.exists() else dict(variants=[])
    groups = {}
    for v in reg.get("variants", []):
        if not v.get("enabled", True):
            continue
        rt = tag if v.get("role") == "champion" or v.get("runtime") in (tag, None) else v["runtime"]
        groups.setdefault(rt, []).append(v["name"])
    t0 = time.monotonic()
    r = run_in(d, ["-c", "import fra.archive, fra.scoring, fra.alerts, fra.predict, fra.dashboard, ops.retrain; "
                         "import fra.archive as A; print(A.ROOT)"], 300)
    res["imports"] = dict(ok=r.returncode == 0, root=r.stdout.strip()[-200:], err=r.stderr.strip()[-600:] or None)
    for rt, names in groups.items():
        rdir = snapshot_dir(rt) if rt != "current" else CURRENT.resolve()
        if not (rdir / "RUNTIME.json").exists():
            for n in names:
                res["variants"][n] = dict(ok=False, runtime=rt, blocking=rt == tag, error=f"runtime {rt} not found")
            continue
        try:
            r = run_in(rdir, ["-m", "fra.archive", "--smoke", ",".join(names)], SMOKE_TIMEOUT_S, registry)
            out = [ln for ln in r.stdout.splitlines() if ln.startswith("SMOKE_RESULT ")]
            got = json.loads(out[-1][len("SMOKE_RESULT "):]) if out else {}
            err = None if out else (r.stderr or r.stdout)[-800:]
        except subprocess.TimeoutExpired:
            got, err = {}, f"timeout after {SMOKE_TIMEOUT_S} s"
        for n in names:
            x = got.get(n) or dict(ok=False, error=err or "no result")
            res["variants"][n] = dict(x, runtime=rt, blocking=rt == tag)
    r = run_in(d, ["-m", "fra.scoring", "--dry-run"], 300, registry)
    res["scoring"] = dict(ok=r.returncode == 0, out=r.stdout.strip()[-400:], err=r.stderr.strip()[-600:] or None)
    now_pk, man_pk = packages(), man.get("packages")
    res["packages"] = dict(now=now_pk, snapshot=man_pk,
                           ok=man_pk is None or {k: v for k, v in now_pk.items() if k != "error"} ==
                           {k: v for k, v in man_pk.items() if k != "error"})
    res["prereg"] = prereg_diff(tag)
    res["seconds"] = round(time.monotonic() - t0, 1)
    champ = [n for n, v in res["variants"].items() if v.get("blocking")]
    res["ok"] = bool(res["files_ok"] and not missing and res["imports"]["ok"] and res["scoring"]["ok"] and champ
                     and all(res["variants"][n].get("ok") for n in champ) and res["packages"]["ok"])
    atomic_write(SMOKE_DIR / f"{tag}_{utc_now():%Y%m%dT%H%M%S}.json", json.dumps(res, indent=1).encode())
    if not quiet:
        print(json.dumps(res, indent=1))
    per = ", ".join(f"{n}: {'ok' if v.get('ok') else 'FAIL'}" for n, v in res["variants"].items())
    print(f"smoke {tag}: {'PASS' if res['ok'] else 'FAIL'} ({per})")
    return res


# ---------------------------------------------------------------- promote

def set_champion_runtime(tag):
    if not REGISTRY.exists():
        return None
    reg = json.loads(REGISTRY.read_text())
    old = None
    for v in reg.get("variants", []):
        if v.get("role") == "champion":
            old, v["runtime"] = v.get("runtime"), tag
    if old != tag:
        reg["updated_utc"] = iso(utc_now())
        atomic_write(REGISTRY, (json.dumps(reg, indent=1) + "\n").encode())
    return old


def prereg_diff(tag):
    """Forecast modules of snapshot `tag` vs the pre-registration, for every pre-registered variant:
    {variant: [files whose sha256 differs]} (empty list = identical)."""
    try:
        pre = json.loads(PREREG.read_text())
    except (OSError, ValueError):
        return None
    files = json.loads((snapshot_dir(tag) / "RUNTIME.json").read_text())["files"]
    return {v["name"]: sorted(k for k, s in ((v.get("runtime") or {}).get("forecast_modules_sha256") or {}).items()
                              if files.get(k) != s) for v in pre.get("variants", [])}


def set_runtime(names, tag):
    """Move the registry variants `names` to runtime `tag` (atomic write) -> {name: old tag}."""
    reg = json.loads(REGISTRY.read_text())
    old = {}
    for v in reg.get("variants", []):
        if v["name"] in names:
            old[v["name"]], v["runtime"] = v.get("runtime"), tag
    missing = set(names) - set(old)
    if missing:
        raise SystemExit(f"--with: no variant {sorted(missing)} in the registry")
    reg["updated_utc"] = iso(utc_now())
    atomic_write(REGISTRY, (json.dumps(reg, indent=1) + "\n").encode())
    return old


def promote(tag, keep_registry=False, also=(), allow_forecast_change=None):
    d = snapshot_dir(tag)
    if not (d / "RUNTIME.json").exists():
        raise SystemExit(f"no snapshot {tag}")
    if datetime.now(timezone.utc) >= HOLDOUT_START and not keep_registry:
        reg = json.loads(REGISTRY.read_text()) if REGISTRY.exists() else dict(variants=[])
        moving = [v["name"] for v in reg.get("variants", []) if v.get("role") == "champion" and v.get("enabled", True)]
        moving += list(also)
        diff = prereg_diff(tag) or {}
        changed = {n: diff[n] for n in moving if diff.get(n)}
        if changed and not allow_forecast_change:
            log_history(action="promote-refused", tag=tag, reason="forecast modules differ from the pre-registration",
                        differ=changed)
            raise SystemExit(f"refused: in {tag} the forecast modules of {changed} differ from the pre-registration "
                             "(holdout running). Snapshot scoring/site fixes with --base <current tag> --files ...; a "
                             "forecast change needs a NEW variant name, or --allow-forecast-change \"reason\" "
                             "(logged; the record of the variant restarts there)")
        if changed:
            log_history(action="promote-forecast-change", tag=tag, differ=changed, reason=allow_forecast_change)
    res = smoke(tag, quiet=True)
    if not res["ok"]:
        log_history(action="promote-refused", tag=tag, smoke=False)
        raise SystemExit(f"smoke test of {tag} failed; current stays {current_tag()}")
    prev = current_tag()
    tmp = RUNTIME / f".current.{os.getpid()}.tmp"
    if tmp.is_symlink() or tmp.exists():
        tmp.unlink()
    tmp.symlink_to(tag)  # relative link inside data/archive/runtime/
    os.replace(tmp, CURRENT)  # atomic flip; a running job keeps the directory it started in
    old_rt = None if keep_registry else set_champion_runtime(tag)
    also_was = set_runtime(list(also), tag) if also else None
    log_history(action="promote", tag=tag, previous=prev, smoke=True, champion_runtime_was=old_rt,
                **({"with": also_was} if also else {}))
    print(f"current runtime: {prev} -> {tag}")


# ---------------------------------------------------------------- list / status

def list_runtimes():
    cur = current_tag()
    for d in sorted(RUNTIME.glob("*/RUNTIME.json")):
        if d.parent.name == "current":
            continue
        m = json.loads(d.read_text())
        print(f"{'*' if m['tag'] == cur else ' '} {m['tag']:24s} created {m['created_utc']}  HEAD {m['git_head'][:12]}"
              f"{' +dirty (' + str(len(m['dirty_files'])) + ' files)' if m['dirty'] else ''}  {m.get('note') or ''}")
    if REGISTRY.exists():
        for v in json.loads(REGISTRY.read_text()).get("variants", []):
            print(f"  variant {v['name']:12s} {v['role']:10s} runtime {v.get('runtime')}  entry {v.get('entry')}  "
                  f"models {v.get('models')}  {'' if v.get('enabled', True) else '(disabled)'}")


def status():
    print(f"current runtime: {current_tag()} -> {CURRENT.resolve() if CURRENT.exists() else 'missing'}")
    runlog = REPO / "data" / "archive" / "runs.jsonl"
    if runlog.exists():
        for ln in runlog.read_text().splitlines()[-3:]:
            r = json.loads(ln)
            sh = (r.get("steps") or {}).get("shadow") or {}
            print(f"  run {r['run_utc'][:19]} issue {r['issue_utc'][:13]} runtime {(r.get('runtime') or {}).get('tag')} "
                  f"failed {r['failed']} shadow {[(k, v.get('ok')) for k, v in (sh.get('variants') or {}).items()]}")


def main(argv=None):
    ap = argparse.ArgumentParser(description="frozen runtimes for the hourly live job")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("snapshot")
    s.add_argument("--tag", required=True)
    s.add_argument("--note")
    s.add_argument("--force", action="store_true", help="replace an existing (non-current) snapshot")
    s.add_argument("--base", help="copy this snapshot instead of the working tree ...")
    s.add_argument("--files", help="... and replace only these comma-separated files (fra/x.py,...) from the working tree")
    s = sub.add_parser("smoke")
    s.add_argument("tag")
    s.add_argument("--registry", help="candidate registry file to test instead of data/archive/variants.json")
    s = sub.add_parser("promote")
    s.add_argument("tag")
    s.add_argument("--keep-registry", action="store_true", help="do not set the champion's runtime tag to TAG")
    s.add_argument("--with", dest="also", default="", help="comma list of challengers that move to TAG as well")
    s.add_argument("--allow-forecast-change", metavar="REASON",
                   help="during the holdout: promote although forecast modules differ from the pre-registration")
    sub.add_parser("list")
    sub.add_parser("status")
    a = ap.parse_args(argv)
    RUNTIME.mkdir(parents=True, exist_ok=True)
    if a.cmd == "snapshot":
        if bool(a.base) != bool(a.files):
            raise SystemExit("--base and --files go together")
        snapshot(a.tag, a.note, a.force, a.base, a.files.split(",") if a.files else None)
    elif a.cmd == "smoke":
        return 0 if smoke(a.tag, registry=a.registry)["ok"] else 1
    elif a.cmd == "promote":
        promote(a.tag, a.keep_registry, [x for x in a.also.split(",") if x], a.allow_forecast_change)
    elif a.cmd == "list":
        list_runtimes()
    else:
        status()
    return 0


if __name__ == "__main__":
    sys.exit(main())
