"""The forecast service in one process: the hourly job plus the web pages.

    uv run python -m ops.serve [--port 8080] [--host 127.0.0.1] [--minute 30] [--backup DIR] [--no-web] [--once]

Every hour at minute 30 it runs these steps, each in its own process with a time limit; a failed step never stops
the next one:

    python -m fra.archive    issue the 48 h forecast of the champion in data/archive/variants.json, archive its
                             inputs, collect the flown direction from the radar, rebuild site/
    python -m fra.scoring    live record: every earlier forecast against the direction actually flown
    python -m fra.alerts     site/alerts.json: a switch within 12 h, a Runway 18 risk within 24 h
    python -m ops.backup     only with --backup DIR: a copy of data/archive outside the installation

At minute 50 it tries again if the forecast of the hour is still missing (a weather service down at :30). Started
after minute 30, it runs at once if the current hour has no forecast yet. Why minute 30: the current direction is read from the last
completely published radar hour [t-2h, t-1h), complete about 75-80 min after its end (ops/README.md).

The pages in site/ (dashboard index.html, 3D view airport3d.html) are served on http://HOST:PORT/. The default host
127.0.0.1 serves this machine only; --host 0.0.0.0 serves the network.
"""

import argparse
import functools
import http.server
import os
import subprocess
import sys
import threading
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
ISSUED = ROOT / "data" / "archive" / "issued"
RETRY_MINUTE = 50
STEPS = [  # (module, extra args, time limit in s)
    ("fra.archive", [], 40 * 60),
    ("fra.scoring", [], 10 * 60),
    ("fra.alerts", [], 5 * 60),
]
ENV = {**os.environ, "OMP_NUM_THREADS": "1", "OPENBLAS_NUM_THREADS": "1", "MKL_NUM_THREADS": "1",
       "PYTHONUNBUFFERED": "1"}


def log(msg):
    print(f"{datetime.now(timezone.utc):%Y-%m-%d %H:%M:%S}Z  {msg}", flush=True)


def issued(hour):
    """Has the official forecast of this UTC hour been issued?"""
    return (ISSUED / f"forecast_{hour:%Y%m%dT%H}.csv").exists()


def run_chain(backup=None):
    """The hourly steps, in order. Returns {module: exit code or 'timeout'}."""
    steps = STEPS + ([("ops.backup", ["--dest", str(backup)], 10 * 60)] if backup else [])
    res = {}
    for mod, args, limit in steps:
        t0 = time.monotonic()
        try:
            r = subprocess.run([sys.executable, "-m", mod, *args], cwd=ROOT, env=ENV, timeout=limit)
            res[mod] = r.returncode
        except subprocess.TimeoutExpired:
            res[mod] = "timeout"
        log(f"{mod}: {res[mod]} ({time.monotonic() - t0:.0f} s)")
    return res


def next_event(now, minute, retry_minute=RETRY_MINUTE):
    """(time, kind) of the next scheduled run after `now`: kind 'run' at `minute`, 'retry' at `retry_minute`."""
    base = now.replace(second=0, microsecond=0)
    events = []
    for h in range(3):
        hour = base.replace(minute=0) + timedelta(hours=h)
        events.append((hour + timedelta(minutes=minute), "run"))
        if retry_minute is not None and retry_minute != minute:
            events.append((hour + timedelta(minutes=retry_minute), "retry"))
    return min(e for e in events if e[0] > now)


class Handler(http.server.SimpleHTTPRequestHandler):
    """Static files of site/; no caching, so the dashboard always polls the newest alerts and live record."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, *a):
        pass


def serve_web(host, port):
    httpd = http.server.ThreadingHTTPServer((host, port), functools.partial(Handler, directory=str(SITE)))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    shown = "localhost" if host in ("127.0.0.1", "0.0.0.0", "") else host
    log(f"web pages: http://{shown}:{port}/ (dashboard), http://{shown}:{port}/airport3d.html (3D view)")
    return httpd


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--host", default="127.0.0.1", help="address of the web server (0.0.0.0 = the network)")
    ap.add_argument("--port", type=int, default=8080)
    ap.add_argument("--minute", type=int, default=30, help="minute of the hourly run (default 30)")
    ap.add_argument("--backup", metavar="DIR", help="copy data/archive to DIR after every run (ops.backup)")
    ap.add_argument("--no-web", action="store_true", help="run the hourly job only")
    ap.add_argument("--once", action="store_true", help="run the hourly steps once and exit (for cron)")
    a = ap.parse_args(argv)
    if not (ROOT / "data" / "archive" / "variants.json").exists():
        sys.exit("No model installed: run ./install.sh first (SETUP.md).")
    if a.once:
        res = run_chain(a.backup)
        return 0 if res.get("fra.archive") == 0 else 1
    if not a.no_web:
        serve_web(a.host, a.port)
    now = datetime.now(timezone.utc)
    if now.minute >= a.minute and not issued(now.replace(minute=0, second=0, microsecond=0)):
        log("no forecast for this hour yet: running now")   # before :30 the radar hour may still be incomplete
        run_chain(a.backup)
    while True:
        t, kind = next_event(datetime.now(timezone.utc), a.minute)
        log(f"next {kind} at {t:%H:%M}Z")
        while (wait := (t - datetime.now(timezone.utc)).total_seconds()) > 0:
            time.sleep(min(wait, 60))
        if kind == "retry" and issued(t.replace(minute=0)):
            continue
        run_chain(a.backup)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        log("stopped")
