"""Copy of the live record outside the repository (last step of the hourly job, fra-archive.service).

    python -m ops.backup [--dest DIR]          default DIR: ~/fra-archive-backup (env FRA_BACKUP_DIR overrides)

data/ is not in git, so the forward record (issued and shadow forecasts, runs.jsonl, the variant registry, the frozen
runtimes and models, the archived inputs) and the truth source data/inaa_counts.csv exist only in this working tree.
The issued forecasts cannot be recomputed (they used live inputs), so an accidental cleanup of data/ would destroy
the holdout. Every run:

  1. rsync -a (no --delete: a file removed here stays in the copy) of data/archive (without run_cache/, which is
     pruned after 2 days anyway), data/inaa_counts.csv and experiments/integration/preregistration.json -> DIR/repo/...
     Symlinks are copied as symlinks (the runtime snapshots link data/ etc. back to the repository).
  2. Once per UTC day: DIR/manifests/<YYYYMMDD>.sha256 = sha256 of every issued / shadow forecast file (sha256sum
     format), so a later change of a forecast file would be visible.

The copy is on the same disk as the repository (protects against deletion, not against a disk fault; an off-disk
target can be set with --dest / FRA_BACKUP_DIR). Exit 0 on success, 1 on failure (the unit ignores the exit code).
"""

import argparse
import fnmatch
import hashlib
import json
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
_man = HERE / "RUNTIME.json"
REPO = Path(json.loads(_man.read_text())["repo"]) if _man.exists() else HERE  # also works from a frozen runtime
DEFAULT_DEST = Path(os.environ.get("FRA_BACKUP_DIR") or Path.home() / "fra-archive-backup")
SOURCES = ["data/archive/", "data/inaa_counts.csv", "experiments/integration/preregistration.json"]
EXCLUDE = ["run_cache/", ".archive.lock", "*.tmp", ".*.tmp"]


def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 16), b""):
            h.update(b)
    return h.hexdigest()


def excluded(name, is_dir):
    return any(fnmatch.fnmatch(name, x.rstrip("/")) for x in EXCLUDE if x.endswith("/") == is_dir)


def copy_new(src, dst):
    """What rsync -a does here, for machines without rsync (Windows): new and changed files, nothing removed."""
    if src.is_file():
        files = [(src, dst)]
    else:
        files = []
        for d, dirs, names in os.walk(src):
            dirs[:] = [x for x in dirs if not excluded(x, True)]
            files += [(Path(d) / n, dst / Path(d).relative_to(src) / n) for n in names if not excluded(n, False)]
    for a, b in files:
        st = a.stat()
        if b.exists() and b.stat().st_size == st.st_size and abs(b.stat().st_mtime - st.st_mtime) < 2:
            continue
        b.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(a, b)


def rsync(dest):
    out = {}
    for rel in SOURCES:
        src = REPO / rel
        if not src.exists():
            out[rel] = "missing"
            continue
        dst = dest / "repo" / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not shutil.which("rsync"):
            copy_new(src, dst)
            out[rel] = "ok"
            continue
        cmd =["rsync", "-a", *[f"--exclude={x}" for x in EXCLUDE], str(src) + ("/" if src.is_dir() else ""),
               str(dst) + ("/" if src.is_dir() else "")]
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        out[rel] = "ok" if r.returncode == 0 else f"rsync exit {r.returncode}: {r.stderr.strip()[-200:]}"
    return out


def daily_manifest(dest, now):
    path = dest / "manifests" / f"{now:%Y%m%d}.sha256"
    if path.exists():
        return dict(manifest=str(path), note="exists")
    arch = REPO / "data" / "archive"
    files = sorted(list((arch / "issued").glob("forecast_*")) + list((arch / "issued_shadow").glob("*/forecast_*")))
    lines = [f"{sha256(p)}  {p.relative_to(REPO).as_posix()}" for p in files if p.is_file()]
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    tmp.write_text("\n".join(lines) + "\n")
    os.replace(tmp, path)
    return dict(manifest=str(path), files=len(lines))


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--dest", default=str(DEFAULT_DEST))
    a = ap.parse_args(argv)
    dest = Path(a.dest).expanduser()
    if dest.resolve() == REPO.resolve() or REPO.resolve() in dest.resolve().parents:
        print(f"backup target {dest} is inside the repository; refusing", flush=True)
        return 1
    t = time.monotonic()
    now = datetime.now(timezone.utc)
    res = dict(time_utc=now.replace(microsecond=0).isoformat(), dest=str(dest))
    try:
        res["rsync"] = rsync(dest)
        res.update(daily_manifest(dest, now))
        ok = all(v == "ok" for v in res["rsync"].values())
    except Exception as ex:
        res["error"] = f"{type(ex).__name__}: {str(ex)[:200]}"
        ok = False
    res["ok"], res["s"] = ok, round(time.monotonic() - t, 1)
    try:
        with open(dest / "backup_log.jsonl", "a") as f:
            f.write(json.dumps(res) + "\n")
    except OSError:
        pass
    print(f"backup {'ok' if ok else 'FAILED'}: {json.dumps(res)[:400]}", flush=True)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
