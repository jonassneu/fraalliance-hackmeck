"""Check a finished installation after one hourly run (used by .github/workflows/install-check.yml, not by pytest).

    python tests/check_install.py             forecast files, run log, pages; starts the web server for a moment
    python tests/check_install.py --service   the pages of the background service, which is already running
    python tests/check_install.py --loop      the long-running service fires its hourly steps on schedule
"""

import csv
import json
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE = ROOT / "data" / "archive"
PAGES = {"/": "text/html", "/airport3d.html": "text/html", "/alerts.json": "application/json"}


def fail(msg):
    sys.exit(f"FAILED: {msg}")


def check_forecast():
    files = sorted((ARCHIVE / "issued").glob("forecast_*.csv"))
    if not files:
        fail("no issued forecast")
    with open(files[-1], newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    if len(rows) != 48:
        fail(f"{files[-1].name}: {len(rows)} rows, expected 48")
    if not all(0 <= float(r["p_od25"]) <= 1 and 0 <= float(r["p_rwy18_open"]) <= 1 for r in rows):
        fail(f"{files[-1].name}: probabilities out of range")
    print(f"{files[-1].name}: 48 hours, P(OD 25) {float(rows[0]['p_od25']):.6f} at +1 h, "
          f"{float(rows[23]['p_od25']):.6f} at +24 h, blend_ok {rows[0]['blend_ok']}")


def check_run_log():
    last = json.loads((ARCHIVE / "runs.jsonl").read_text(encoding="utf-8").splitlines()[-1])
    print(f"run log: issue hour {last['issue_utc']}, failed steps: {last['failed'] or 'none'}")
    return [s for s in last["failed"] if not s.startswith("om_")]   # weather snapshots: time-outs on shared machines


def check_page_text():
    text = (ROOT / "site" / "index.html").read_text(encoding="utf-8")    # raises if the page is not valid UTF-8
    if 'charset="utf-8"' not in text.lower() and "charset=utf-8" not in text.lower():
        fail("index.html does not declare UTF-8")
    print(f"index.html: valid UTF-8, {len(text)} characters, {sum(ord(c) > 127 for c in text)} non-ASCII")


def check_pages(port, wait_s):
    deadline = time.monotonic() + wait_s
    while True:
        try:
            requests.get(f"http://127.0.0.1:{port}/", timeout=5)
            break
        except requests.RequestException as ex:
            if time.monotonic() > deadline:
                fail(f"web server not reachable within {wait_s} s: {ex}")
            time.sleep(2)
    for path, kind in PAGES.items():
        r = requests.get(f"http://127.0.0.1:{port}{path}", timeout=10)
        got = r.headers.get("Content-Type", "")
        if r.status_code != 200 or not got.startswith(kind) or not r.content:
            fail(f"{path}: {r.status_code}, {got}, {len(r.content)} bytes")
        print(f"{path}: {r.status_code}, {got}, {len(r.content)} bytes")


def check_loop():
    """Start ops.serve with its hourly minute shortly ahead and wait until all its steps have run from the schedule."""
    minute = (datetime.now(timezone.utc) + timedelta(minutes=2)).minute
    log = ROOT / "data" / "loop.log"
    server = subprocess.Popen([sys.executable, "-m", "ops.serve", "--no-web", "--minute", str(minute), "--log", str(log)],
                              cwd=ROOT)
    deadline = time.monotonic() + 20 * 60
    try:
        while time.monotonic() < deadline:
            text = log.read_text(encoding="utf-8") if log.exists() else ""
            if "fra.alerts:" in text:
                print(text[-1500:])
                return
            if server.poll() is not None:
                fail(f"the service stopped with exit code {server.returncode}")
            time.sleep(5)
        fail(f"no scheduled run within 20 min; log:\n{text[-1500:]}")
    finally:
        server.kill()


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if "--loop" in sys.argv:
        check_loop()
        return
    if "--service" in sys.argv:
        check_pages(8080, 90)
        if not (ROOT / "data" / "service.log").exists():
            fail("the service wrote no log")
        return
    check_forecast()
    failed = check_run_log()
    check_page_text()
    server = subprocess.Popen([sys.executable, "-m", "ops.serve", "--port", "8099"], cwd=ROOT)
    try:
        check_pages(8099, 120)
    finally:
        server.kill()
    if failed:
        fail(f"steps of the hourly run failed: {failed}")


if __name__ == "__main__":
    main()
