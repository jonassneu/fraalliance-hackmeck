"""Install the forecast from a release: model files, a test forecast, optionally a background service.

    ./install.sh                                  (= uv sync --frozen, then this module)
    uv run python -m ops.install [--bundle FILE_OR_URL] [--force] [--no-test]
    uv run python -m ops.install --service [--host 0.0.0.0] [--port 8080]     (Linux: systemd user service)
    uv run python -m ops.install --service --print                            (show the unit, install nothing)

1. Model bundle: downloads the release's model bundle (ops/release.json: URL and sha256), checks the sha256 and
   unpacks it into data/ (model files, variant registry, the 3D scene; ops/release_bundle.py). Files that already
   exist with other content are left alone and reported (--force replaces them). A bundle that is already installed
   is not downloaded again.
2. Test forecast: forecasts the current hour with the installed champion (python -m fra.archive --smoke), with the
   live inputs (radar, weather, the published prognosis), and prints the result. Nothing is written as an issued
   forecast.
3. With --service: writes ~/.config/systemd/user/fra-forecast.service, which runs ops/serve.py (the hourly job and the
   web pages) and starts it. Without a login session user services stop; `sudo loginctl enable-linger $USER` keeps
   it running (printed, not run).
"""

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
RELEASE = ROOT / "ops" / "release.json"
UNIT_NAME = "fra-forecast.service"
UA = {"User-Agent": "fra-od-install/2.0"}


def sha256_file(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def installed_ok(version):
    """True if data/BUNDLE.json is this version and every file it lists is present with its sha256."""
    p = DATA / "BUNDLE.json"
    if not p.exists():
        return False
    m = json.loads(p.read_text())
    if m.get("version") != version:
        return False
    return all((ROOT / k).exists() and sha256_file(ROOT / k) == f["sha256"] for k, f in m["files"].items())


def fetch(src, dest):
    """Copy a local file or download a URL to dest (atomically)."""
    tmp = dest.with_suffix(dest.suffix + ".part")
    if "://" not in src:
        shutil.copyfile(src, tmp)
    else:
        print(f"downloading {src}")
        with requests.get(src, headers=UA, stream=True, timeout=(10, 120)) as r:
            r.raise_for_status()
            with open(tmp, "wb") as f:
                for b in r.iter_content(1 << 20):
                    f.write(b)
    os.replace(tmp, dest)
    return dest


def unpack(bundle, force=False):
    """Unpack the bundle into the repository (members under data/ only). Returns (written, kept, conflicts)."""
    with tarfile.open(bundle, "r:gz") as tar:
        members = [m for m in tar.getmembers() if m.isfile()]
        for m in tar.getmembers():
            parts = Path(m.name).parts
            if m.name.startswith("/") or ".." in parts or not parts or parts[0] != "data" or not (m.isfile() or m.isdir()):
                sys.exit(f"refusing bundle member {m.name!r}")
        with tempfile.TemporaryDirectory(dir=DATA) as tmp:
            tar.extractall(tmp, members=members, filter="data")
            man = json.loads((Path(tmp) / "data" / "BUNDLE.json").read_text())
            written, kept, conflicts = [], [], []
            for m in members:
                src, dst = Path(tmp) / m.name, ROOT / m.name
                if m.name in man["files"] and sha256_file(src) != man["files"][m.name]["sha256"]:
                    sys.exit(f"{m.name}: sha256 differs from the bundle manifest (damaged download?)")
                if dst.exists() and sha256_file(dst) == sha256_file(src):
                    kept.append(m.name)
                    continue
                if dst.exists() and not force and m.name != "data/BUNDLE.json":
                    conflicts.append(m.name)
                    continue
                dst.parent.mkdir(parents=True, exist_ok=True)
                if dst.exists():
                    dst.chmod(0o644)
                shutil.copyfile(src, dst)
                if "/archive/models/" in m.name:
                    dst.chmod(0o444)   # model files are frozen: a variant's files never change
                written.append(m.name)
    return written, kept, conflicts


def test_forecast(variant):
    """python -m fra.archive --smoke VARIANT -> the parsed SMOKE_RESULT of the variant (or None)."""
    env = {**os.environ, "OMP_NUM_THREADS": "1", "OPENBLAS_NUM_THREADS": "1", "MKL_NUM_THREADS": "1"}
    r = subprocess.run([sys.executable, "-m", "fra.archive", "--smoke", variant], cwd=ROOT, env=env,
                       capture_output=True, text=True, timeout=600)
    line = next((x for x in r.stdout.splitlines() if x.startswith("SMOKE_RESULT ")), None)
    if line is None:
        print(r.stdout[-3000:], r.stderr[-3000:], sep="\n")
        return None
    return json.loads(line.split(" ", 1)[1]).get(variant)


def describe(res):
    od = res["od_now"]
    side = {25: "west", 7: "east"}.get(od, "?")
    nc = res.get("next_change")
    p18 = min(res["p_rwy18_open"])
    return "\n".join([
        f"  issue hour             {res['issue']}",
        f"  current direction      OD {od:02d} ({side})",
        f"  P(OD 25 west) in 1 h   {100 * res['p25_lead1']:.0f} %",
        f"  P(OD 25 west) in 24 h  {100 * res['p25_lead24']:.0f} %",
        f"  next likely change     {nc or 'none within 48 h'}",
        f"  Runway 18 open         {'at least ' if p18 >= 0.5 else 'down to '}{100 * p18:.0f} % within 48 h",
        f"  model                  {res['model']} ({res['model_sha256']}), {res['s']} s",
    ])


def unit_text(host, port):
    py = Path(sys.executable)
    return f"""[Unit]
Description=FRA operating direction forecast: hourly forecast and web pages (ops/serve.py)
Documentation=file://{ROOT}/SETUP.md
Wants=network-online.target
After=network-online.target

[Service]
WorkingDirectory={ROOT}
ExecStart={py} -m ops.serve --host {host} --port {port}
Restart=on-failure
RestartSec=60
Nice=10

[Install]
WantedBy=default.target
"""


def install_service(host, port, show_only=False):
    text = unit_text(host, port)
    if show_only:
        print(text)
        return 0
    if not shutil.which("systemctl"):
        sys.exit("systemctl not found: run `uv run python -m ops.serve` under your own process manager (SETUP.md).")
    path = Path.home() / ".config" / "systemd" / "user" / UNIT_NAME
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    subprocess.run(["systemctl", "--user", "daemon-reload"], check=True)
    subprocess.run(["systemctl", "--user", "enable", "--now", UNIT_NAME], check=True)
    print(f"installed and started {path}")
    print(f"  status:  systemctl --user status {UNIT_NAME}")
    print(f"  log:     journalctl --user -u {UNIT_NAME} -f")
    print(f"  pages:   http://{'localhost' if host in ('127.0.0.1', '0.0.0.0') else host}:{port}/")
    print("  To keep it running without a login session (servers): sudo loginctl enable-linger $USER")
    return 0


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--bundle", help="model bundle: a local file or URL (default: the release in ops/release.json)")
    ap.add_argument("--any-bundle", action="store_true", help="accept a bundle whose sha256 is not the pinned one")
    ap.add_argument("--force", action="store_true", help="replace installed files that differ from the bundle")
    ap.add_argument("--no-test", action="store_true", help="skip the test forecast")
    ap.add_argument("--service", action="store_true", help="install and start the systemd user service")
    ap.add_argument("--print", dest="show_only", action="store_true", help="with --service: print the unit only")
    ap.add_argument("--host", default="127.0.0.1", help="with --service: web server address (0.0.0.0 = network)")
    ap.add_argument("--port", type=int, default=8080, help="with --service: web server port")
    a = ap.parse_args(argv)
    if a.service and a.show_only:
        return install_service(a.host, a.port, show_only=True)

    rel = json.loads(RELEASE.read_text())
    version, b = rel["version"], rel["bundle"]
    DATA.mkdir(exist_ok=True)
    print(f"FRA forecast {version}: model bundle")
    if installed_ok(version) and not a.force and not a.bundle:
        print(f"  already installed ({DATA / 'BUNDLE.json'})")
    else:
        dl = DATA / "downloads"
        dl.mkdir(exist_ok=True)
        path = fetch(a.bundle or b["url"], dl / (Path(a.bundle).name if a.bundle and "://" not in a.bundle else b["name"]))
        digest = sha256_file(path)
        if digest != b["sha256"] and not a.any_bundle:
            sys.exit(f"{path}: sha256 {digest}\n  expected {b['sha256']} (ops/release.json). Damaged download, or a "
                     f"bundle of another release (--any-bundle accepts it).")
        written, kept, conflicts = unpack(path, force=a.force)
        print(f"  {len(written)} files written, {len(kept)} already in place")
        if conflicts:
            print("  NOT replaced (exist with other content; --force replaces them):")
            for c in conflicts:
                print(f"    {c}")
    reg = json.loads((DATA / "archive" / "variants.json").read_text())
    champ = next(v["name"] for v in reg["variants"] if v.get("role") == "champion" and v.get("enabled", True))

    if not a.no_test:
        print(f"\nTest forecast with {champ} (live inputs; nothing is issued) ...")
        res = test_forecast(champ)
        if not res or not res.get("ok"):
            print(f"  FAILED: {(res or {}).get('error', 'no result, see the output above')}")
            print("  Check the network access listed in SETUP.md (radar, weather, prognosis services).")
            return 1
        print(describe(res))
    if a.service:
        print()
        return install_service(a.host, a.port)
    print("\nInstalled. Start the service (hourly forecast + web pages on http://localhost:8080/):")
    print("  uv run python -m ops.serve")
    print("or as a background service on Linux:  ./install.sh --service")
    return 0


if __name__ == "__main__":
    sys.exit(main())
