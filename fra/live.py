"""Real-time feed for the 3D view: live aircraft (OpenSky) + forecast + simulated future traffic -> site/live.json.

    uv run python -m fra.live            # loop: aircraft every 20 s, forecast refreshed every hour
    uv run python -m fra.live --once     # write one snapshot and exit

Coordinates match fra/scene3d.py: x/y = metres east/north of the FRA aerodrome reference point, z = metres above field.
Live aircraft: OpenSky Network REST API (anonymous, https://openskynetwork.github.io/opensky-api/rest.html), ~400
requests/day budget -> 20 s polling; the viewer extrapolates positions between polls with speed/track/vrate.
Future traffic: per forecast hour, the typical movement rate for that local hour (from the INAA radar counts) assigned
to runways by the forecast OD and RWY 18 probability (simulation, not a schedule).
"""

import json
import math
import sys
import threading
import time

import pandas as pd
import requests

from fra.dataset import DATA

SITE = DATA.parent / "site"
OUT = SITE / "live.json"
ARP = (50.0333, 8.5706)
FIELD_M = 111.0
M_LAT = 111_320.0
M_LON = 111_320.0 * math.cos(math.radians(ARP[0]))
BOX = dict(lamin=49.75, lomin=8.15, lamax=50.32, lomax=9.00)  # ~0.5 sq deg -> 1 OpenSky credit per call
OPENSKY = "https://opensky-network.org/api/states/all"
POLL_S = 20
UA = {"User-Agent": "fra-od-hackathon/0.1 (FraAlliance AI Week demo)"}

AIRLINES = {  # ICAO prefix -> name, the usual FRA operators
    "DLH": "Lufthansa", "CLH": "Lufthansa CityLine", "LHX": "Lufthansa City", "OCN": "Discover", "EWG": "Eurowings",
    "CFG": "Condor", "TUI": "TUIfly", "BCS": "European Air Transport (DHL)", "GEC": "Lufthansa Cargo",
    "UAE": "Emirates", "QTR": "Qatar Airways", "ETD": "Etihad", "THY": "Turkish Airlines", "PGT": "Pegasus",
    "UAL": "United", "DAL": "Delta", "AAL": "American", "ACA": "Air Canada", "SIA": "Singapore Airlines",
    "CPA": "Cathay Pacific", "CCA": "Air China", "CES": "China Eastern", "CSN": "China Southern",
    "KAL": "Korean Air", "AAR": "Asiana", "ANA": "ANA", "JAL": "Japan Airlines", "AIC": "Air India",
    "ETH": "Ethiopian", "SVA": "Saudia", "BAW": "British Airways", "AFR": "Air France", "KLM": "KLM",
    "SWR": "Swiss", "AUA": "Austrian", "BEL": "Brussels Airlines", "SAS": "SAS", "FIN": "Finnair",
    "IBE": "Iberia", "VLG": "Vueling", "TAP": "TAP Air Portugal", "AEE": "Aegean", "LOT": "LOT",
    "RYR": "Ryanair", "EZY": "easyJet", "WZZ": "Wizz Air", "ITY": "ITA Airways", "ELY": "El Al",
    "FDX": "FedEx", "UPS": "UPS", "CLX": "Cargolux", "MSR": "EgyptAir", "RAM": "Royal Air Maroc",
}
PHASE_TEXT = {"arr": "arriving", "dep": "departing", "low": "low level", "ground": "on ground", "enroute": "en route"}
RWY_TEXT = {25: "westbound (OD 25)", 7: "eastbound (OD 07)", 18: "RWY 18 West, southbound"}


def describe(f):
    """Human-readable label fields for the 3D view."""
    cs = f["cs"] or f["id"]
    airline = AIRLINES.get(cs[:3]) if cs[:3].isalpha() else None
    if airline is None and cs[:1] == "D" and cs[:3].isalpha():
        airline = "German private/GA (D- registration)"
    f["airline"] = airline
    f["alt_ft"] = round((f["z"] + FIELD_M) * 3.281 / 50) * 50 if not f["on_ground"] else 0
    f["spd_kt"] = None if f["spd"] is None else round(f["spd"] * 1.944)
    f["heading"] = None if f["track"] is None else ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][round(f["track"] / 45) % 8]
    bits = [cs] + ([airline] if airline else []) + [PHASE_TEXT[f["phase"]]]
    if f["rw"] in RWY_TEXT and f["phase"] in ("arr", "dep", "low"):
        bits.append(RWY_TEXT[f["rw"]])
    if not f["on_ground"]:
        bits.append(f"{f['alt_ft']:,} ft")
    if f["spd_kt"]:
        bits.append(f"{f['spd_kt']} kt {f['heading'] or ''}".strip())
    f["label"] = " · ".join(bits)
    return f


_forecast = {"hours": [], "issue": None, "od_now": None, "next_change": None, "p_change_48h": None}
_lock = threading.Lock()


def angdiff(a, b):
    return abs((a - b + 180) % 360 - 180)


def classify(f):
    """Phase + runway direction guess for one aircraft (low-level movers near FRA)."""
    if f["on_ground"]:
        return "ground", None
    near = f["dist_km"] < 40 and f["z"] < 2500
    if not near:
        return "enroute", None
    rw = None
    if f["track"] is not None:
        if angdiff(f["track"], 250) < 25:
            rw = 25
        elif angdiff(f["track"], 70) < 25:
            rw = 7
        elif angdiff(f["track"], 180) < 25 and f["x"] < -1500:
            rw = 18
    vr = f["vrate"] or 0
    if vr < -1.5:
        return "arr", rw
    if vr > 1.5:
        return "dep", rw
    return "low", rw


def poll_opensky():
    r = requests.get(OPENSKY, params=BOX, headers=UA, timeout=15)
    r.raise_for_status()
    js = r.json()
    out = []
    for s in js.get("states") or []:
        icao, cs, lon, lat, baro, ground, vel, trk, vr, geo = s[0], s[1], s[5], s[6], s[7], s[8], s[9], s[10], s[11], s[13]
        if lat is None or lon is None:
            continue
        alt = baro if baro is not None else geo
        f = dict(id=icao, cs=(cs or "").strip(), lat=lat, lon=lon,
                 x=round((lon - ARP[1]) * M_LON), y=round((lat - ARP[0]) * M_LAT),
                 z=0 if ground or alt is None else round(max(alt - FIELD_M, 0)),
                 on_ground=bool(ground), spd=None if vel is None else round(vel, 1),
                 track=None if trk is None else round(trk, 1), vrate=None if vr is None else round(vr, 1))
        f["dist_km"] = round(math.hypot(f["x"], f["y"]) / 1000, 1)
        f["phase"], f["rw"] = classify(f)
        out.append(describe(f))
    return js.get("time"), out


def live_od(flights):
    """Direction currently flown, from live low-level movers (None if too few)."""
    w = sum(1 for f in flights if f["phase"] in ("arr", "dep", "low") and f["rw"] == 25)
    e = sum(1 for f in flights if f["phase"] in ("arr", "dep", "low") and f["rw"] == 7)
    return (25 if w > e else 7) if w + e >= 2 else None, w, e


def hourly_profile():
    """Typical low-level movements per local hour (arrivals + departures) from the INAA radar counts."""
    c = pd.read_csv(DATA / "inaa_counts.csv", parse_dates=["time"]).dropna()
    c["n"] = c["west"] + c["east"]
    c["h"] = pd.to_datetime(c["time"], utc=True).dt.tz_convert("Europe/Berlin").dt.hour
    prof = c[c["n"] > 0].groupby("h")["n"].median().reindex(range(24)).fillna(0)
    share18 = (c["rwy18_deps"] / (c["n"] / 2)).clip(0, 1)[c["n"] >= 15].median()
    return prof.to_dict(), float(share18)


def simulate_future(hours, prof, share18):
    """Per forecast hour: expected arrivals/departures and their runways under the forecast OD (simulation)."""
    sim = []
    for h in hours:
        t = pd.Timestamp(h["t"])
        n = float(prof.get(t.tz_convert("Europe/Berlin").hour, 0))
        od = h["od"]
        arr = dep = round(n / 2)
        dep18 = round(dep * share18 * h["p18"]) if h["p18"] >= 0.5 else 0
        land = ["25R", "25L"] if od == 25 else ["07L", "07R"]
        sim.append(dict(t=h["t"], od=od, p25=h["p25"], p18=h["p18"], arrivals=arr, departures=dep,
                        landing_runways=land, dep_centre=dep - dep18, dep_18=dep18,
                        dep_centre_runway="25C" if od == 25 else "07C"))
    return sim


def refresh_forecast():
    """Latest 48 h forecast from the production model (fra.predict), hourly."""
    from fra.predict import forecast
    out, issue, od_now, change = forecast()
    hours = [dict(t=r.valid_utc.isoformat(), p25=round(float(r.p_od25), 3), p18=round(float(r.p_rwy18_open), 3),
                  od=int(r.od_pred), certainty=round(float(r.od_certainty), 3), rule=int(r.rule_baseline_od))
             for r in out.itertuples()]
    with _lock:
        _forecast.update(hours=hours, issue=issue.isoformat(), od_now=int(od_now),
                         next_change=None if change is None else pd.Timestamp(change).isoformat(),
                         p_change_48h=float(out["p_change_48h"].iloc[0]) if "p_change_48h" in out else None)
    print(f"forecast refreshed: issue {issue}, OD now {od_now}, next change {change}", flush=True)


def write(payload):
    SITE.mkdir(exist_ok=True)
    tmp = OUT.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(payload, separators=(",", ":")))
    tmp.replace(OUT)  # atomic: the viewer never reads a half-written file


def snapshot(prof, share18, last_flights):
    try:
        ts, flights = poll_opensky()
        err = None
    except Exception as ex:  # keep the last positions; the viewer keeps extrapolating
        ts, flights, err = None, last_flights, str(ex)[:160]
    od_live, w, e = live_od(flights)
    with _lock:
        fc = dict(_forecast)
    payload = dict(
        generated=pd.Timestamp.now("UTC").isoformat(), opensky_time=ts, poll_s=POLL_S, error=err,
        source="OpenSky Network (live ADS-B), Umwelthaus INAA (flown OD), fra model (forecast)",
        od_live=od_live, live_west=w, live_east=e, od_now=fc["od_now"], issue=fc["issue"],
        next_change=fc["next_change"], p_change_48h=fc["p_change_48h"],
        flights=[{k: f.get(k) for k in ("id", "cs", "x", "y", "z", "spd", "track", "vrate", "on_ground", "phase", "rw",
                                        "airline", "alt_ft", "spd_kt", "heading", "label", "dist_km")}
                 for f in flights],
        forecast=fc["hours"], future=simulate_future(fc["hours"], prof, share18))
    write(payload)
    return flights, payload


def main():
    once = "--once" in sys.argv
    prof, share18 = hourly_profile()
    refresh_forecast()
    last_hour, flights = pd.Timestamp.now("UTC").floor("h"), []
    while True:
        flights, p = snapshot(prof, share18, flights)
        print(f"{p['generated'][11:19]}Z {len(p['flights'])} aircraft, live OD {p['od_live']} "
              f"(W{p['live_west']}/E{p['live_east']}){' ERROR ' + p['error'] if p['error'] else ''}", flush=True)
        if once:
            return
        hour = pd.Timestamp.now("UTC").floor("h")
        if hour != last_hour:  # new hour -> new forecast in the background, polling continues
            last_hour = hour
            threading.Thread(target=refresh_forecast, daemon=True).start()
        time.sleep(POLL_S)


if __name__ == "__main__":
    main()
