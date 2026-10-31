"""3D airport scene for the jury: real FRA geometry from OpenStreetMap + the 48 h forecast -> site/airport3d.html.

    uv run python -m fra.scene3d [forecast_csv]      (default: newest data/forecast_*.csv)

OSM map tiles are cached in data/osm/ (fetched once from the OSM API, ~30 requests). The Three.js viewer is
bundled once from web/ (`cd web && npm i && npm run build` -> web/dist/app.js); this script inlines bundle, scene
geometry and forecast into one self-contained HTML file that works offline.
Map data (c) OpenStreetMap contributors, ODbL.
"""

import json
import math
import re
import sys
import time
from pathlib import Path

import pandas as pd
import requests

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OSM = DATA / "osm"
SITE = ROOT / "site"
BUNDLE = ROOT / "web" / "dist" / "app.js"

ARP = (50.0333, 8.5706)  # FRA aerodrome reference point
BBOX = (49.990, 8.480, 50.065, 8.630)  # lat0, lon0, lat1, lon1
STEP = 0.02
API = "https://api.openstreetmap.org/api/0.6/map.json"
UA = {"User-Agent": "fra-od-hackathon/0.1 (FraAlliance AI Week demo)"}

M_LAT = 111_320.0
M_LON = 111_320.0 * math.cos(math.radians(ARP[0]))


# ---------------------------------------------------------------- fetch

def fetch_tile(lat0, lon0, lat1, lon1, depth=0):
    """List of tile files covering the box; splits in four when the API's 50k node limit is hit."""
    path = OSM / f"{lat0:.4f}_{lon0:.4f}_{lat1:.4f}_{lon1:.4f}.json"
    if path.exists():
        return [path]
    for attempt in range(4):
        r = requests.get(API, params={"bbox": f"{lon0},{lat0},{lon1},{lat1}"}, headers=UA, timeout=120)
        if r.status_code == 200:
            path.write_bytes(r.content)
            print(f"  tile {path.name}: {len(r.content) / 1e6:.1f} MB")
            return [path]
        if r.status_code == 400 and depth < 3:  # too many nodes
            lm, om = (lat0 + lat1) / 2, (lon0 + lon1) / 2
            return [p for b in ((lat0, lon0, lm, om), (lat0, om, lm, lon1), (lm, lon0, lat1, om), (lm, om, lat1, lon1))
                    for p in fetch_tile(*b, depth=depth + 1)]
        print(f"  tile {path.name}: HTTP {r.status_code}, retry")
        time.sleep(5 * (attempt + 1))
    raise RuntimeError(f"OSM API failed for {path.name}")


def fetch_all():
    OSM.mkdir(parents=True, exist_ok=True)
    files = []
    lat = BBOX[0]
    while lat < BBOX[2] - 1e-9:
        lon = BBOX[1]
        while lon < BBOX[3] - 1e-9:
            files += fetch_tile(round(lat, 4), round(lon, 4), round(min(lat + STEP, BBOX[2]), 4),
                                round(min(lon + STEP, BBOX[3]), 4))
            lon += STEP
        lat += STEP
    return files


def load_osm(files):
    nodes, ways, rels = {}, {}, {}
    for p in files:
        for e in json.loads(p.read_text())["elements"]:
            t = e["type"]
            if t == "node":
                nodes[e["id"]] = e
            elif t == "way":
                ways[e["id"]] = e
            else:
                rels[e["id"]] = e
    return nodes, ways, rels


# ---------------------------------------------------------------- geometry

def xy(node):
    return [round((node["lon"] - ARP[1]) * M_LON), round((node["lat"] - ARP[0]) * M_LAT)]


def num(v, default=None):
    try:
        return float(str(v).split()[0].replace(",", "."))
    except (TypeError, ValueError, IndexError):
        return default


def way_pts(way, nodes):
    pts = [xy(nodes[i]) for i in way["nodes"] if i in nodes]
    return [p for k, p in enumerate(pts) if k == 0 or p != pts[k - 1]]


def join_rings(segments):
    """Assemble open member ways (lists of node ids) into closed rings."""
    rings, segs = [], [list(s) for s in segments if len(s) > 1]
    while segs:
        ring = segs.pop(0)
        changed = True
        while ring[0] != ring[-1] and changed:
            changed = False
            for k, s in enumerate(segs):
                if s[0] == ring[-1]:
                    ring += s[1:]
                elif s[-1] == ring[-1]:
                    ring += s[::-1][1:]
                elif s[-1] == ring[0]:
                    ring = s[:-1] + ring
                elif s[0] == ring[0]:
                    ring = s[::-1][:-1] + ring
                else:
                    continue
                segs.pop(k)
                changed = True
                break
        if ring[0] == ring[-1] and len(ring) >= 4:
            rings.append(ring)
    return rings


def outer_rings(elem, ways):
    """Node-id rings of a closed way or the outer rings of a multipolygon relation."""
    if elem["type"] == "way":
        nd = elem["nodes"]
        return [nd] if len(nd) >= 4 and nd[0] == nd[-1] else []
    segs = [ways[m["ref"]]["nodes"] for m in elem.get("members", [])
            if m["type"] == "way" and m.get("role") in ("outer", "") and m["ref"] in ways]
    return join_rings(segs)


def ring_xy(ring, nodes):
    pts = [xy(nodes[i]) for i in ring if i in nodes]
    pts = [p for k, p in enumerate(pts) if k == 0 or p != pts[k - 1]]
    if len(pts) > 1 and pts[0] == pts[-1]:
        pts.pop()
    return pts if len(pts) >= 3 else None


def area(pts):
    return abs(sum(pts[i][0] * pts[i - 1][1] - pts[i - 1][0] * pts[i][1] for i in range(len(pts)))) / 2


def centroid(pts):
    return [sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)]


def inside(pt, poly):
    x, y, c = pt[0], pt[1], False
    for i in range(len(poly)):
        (x1, y1), (x2, y2) = poly[i], poly[i - 1]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c


DEFAULT_H = {"house": 7, "detached": 7, "semidetached_house": 7, "terrace": 8, "residential": 10, "apartments": 13,
             "garage": 3, "garages": 3, "shed": 3, "roof": 6, "industrial": 13, "warehouse": 13, "hangar": 22,
             "office": 18, "commercial": 14, "retail": 8, "hotel": 24, "transportation": 18, "parking": 14,
             "storage_tank": 14, "service": 5, "school": 10, "kindergarten": 5}


def building_height(t):
    h = num(t.get("height"))
    if h is None and t.get("building:levels"):
        h = num(t["building:levels"], 2) * 3.4 + 2
    if h is None:
        if t.get("aeroway") == "terminal":
            h = 20
        elif t.get("man_made") == "tower":
            h = 40
        else:
            h = DEFAULT_H.get(t.get("building") or t.get("building:part"), 9)
    lo = num(t.get("min_height"))
    if lo is None and t.get("building:min_level"):
        lo = num(t["building:min_level"], 0) * 3.4
    if lo is None and t.get("building") == "roof":
        lo = max(h - 2, 3)
    return round(h, 1), round(lo or 0, 1)


def building_kind(t, c, aerodrome):
    if t.get("man_made") == "tower" or t.get("aeroway") == "control_tower":
        return "w"
    if t.get("aeroway") == "terminal" or (t.get("building") == "transportation" and any(inside(c, a) for a in aerodrome)):
        return "t"
    if t.get("building") == "hangar" or t.get("aeroway") == "hangar":
        return "h"
    return "a" if any(inside(c, a) for a in aerodrome) else "o"


PLACES = [("Terminal 1", r"Terminal 1( |$)"), ("Terminal 2", r"Terminal 2( |$)"),
          ("Terminal 3", r"(Terminal 3$|Flugsteig [GHJ]$)")]
ROAD_CLASS = {"motorway": 0, "trunk": 0, "motorway_link": 1, "trunk_link": 1, "primary": 1, "secondary": 1,
              "tertiary": 1, "primary_link": 1, "secondary_link": 1, "tertiary_link": 1, "unclassified": 2,
              "residential": 2, "service": 2, "living_street": 2}
LIGHT_CLASS = {"als": 0, "rwc": 1, "tdz": 1, "rwe": 1, "rwt": 1, "rgl": 1, "txc": 2, "txe": 3, "sbl": 4, "cbl": 4}


def nearest_runway(pt, runways, extend=0.0):
    """Index of the runway whose centreline (extended by `extend` x length at both ends) is closest to pt, distance."""
    best, bd = None, 1e9
    for k, rw in enumerate(runways):
        (ax, ay), (bx, by) = rw["p"][0], rw["p"][-1]
        dx, dy = bx - ax, by - ay
        s = max(-extend, min(1 + extend, ((pt[0] - ax) * dx + (pt[1] - ay) * dy) / (dx * dx + dy * dy)))
        d = math.hypot(ax + s * dx - pt[0], ay + s * dy - pt[1])
        if d < bd:
            best, bd = k, d
    return best, bd


def build_scene(nodes, ways, rels):
    elems = list(ways.values()) + list(rels.values())
    aerodrome = [ring_xy(r, nodes) for e in elems if e.get("tags", {}).get("aeroway") == "aerodrome"
                 for r in outer_rings(e, ways)]
    aerodrome = [a for a in aerodrome if a]

    scene = dict(origin=list(ARP), aerodrome=aerodrome, runways=[], taxiways=[], aprons=[], buildings=[], rail=[],
                 roads=[], forest=[], water=[], lights=[], stands=[], windsocks=[])
    parts, outlines = [], []
    for e in elems:
        t = e.get("tags", {})
        if not t:
            continue
        aw = t.get("aeroway")
        if e["type"] == "way" and aw == "runway":
            scene["runways"].append(dict(ref=t.get("ref", ""), w=num(t.get("width"), 45), p=way_pts(e, nodes)))
        elif e["type"] == "way" and aw == "taxiway":
            p = way_pts(e, nodes)
            if len(p) > 1:
                scene["taxiways"].append(dict(w=min(num(t.get("width"), 23), 40), p=p))
        elif aw == "apron":
            scene["aprons"] += [r for r in (ring_xy(r, nodes) for r in outer_rings(e, ways)) if r]
        elif e["type"] == "way" and t.get("railway") in ("rail", "light_rail", "subway", "monorail"):
            p = way_pts(e, nodes)
            if len(p) > 1:
                scene["rail"].append(p)
        elif e["type"] == "way" and t.get("highway") in ROAD_CLASS:
            p = way_pts(e, nodes)
            if len(p) > 1:
                scene["roads"].append(dict(c=ROAD_CLASS[t["highway"]], p=p))
        elif t.get("landuse") == "forest" or t.get("natural") == "wood":
            scene["forest"] += [r for r in (ring_xy(r, nodes) for r in outer_rings(e, ways)) if r and area(r) > 2000]
        elif t.get("natural") == "water":
            scene["water"] += [r for r in (ring_xy(r, nodes) for r in outer_rings(e, ways)) if r and area(r) > 500]
        elif e["type"] == "way" and aw == "parking_position":
            p = way_pts(e, nodes)
            if len(p) > 1:
                scene["stands"].append(p)

        if "building:part" in t and t["building:part"] != "no":
            for r in outer_rings(e, ways):
                pts = ring_xy(r, nodes)
                if pts and area(pts) > 10:
                    parts.append((pts, t))
        elif ("building" in t and t["building"] != "no") or (t.get("man_made") in ("tower", "storage_tank")
                                                              and e["type"] == "way"):
            for r in outer_rings(e, ways):
                pts = ring_xy(r, nodes)
                if pts and area(pts) > 12:
                    outlines.append((pts, t))

    # area labels from named outlines (the outlines themselves may be replaced by their building:parts)
    places = {}
    for pts, t in outlines:
        for label, pat in PLACES:
            if re.match(pat, t.get("name", "")):
                places.setdefault(label, []).extend(pts)
    scene["places"] = [[k, *[round(v) for v in centroid(v)]] for k, v in places.items()]

    # OSM 3D convention: an outline with building:parts inside is not drawn itself
    part_cs = [centroid(p) for p, _ in parts]
    for pts, t in outlines + parts:
        c = centroid(pts)
        if (pts, t) in outlines and "building:part" not in t:
            xs, ys = [p[0] for p in pts], [p[1] for p in pts]
            if any(min(xs) <= q[0] <= max(xs) and min(ys) <= q[1] <= max(ys) and inside(q, pts) for q in part_cs):
                continue
        h, lo = building_height(t)
        b = dict(r=pts, h=h, k=building_kind(t, c, aerodrome))
        if lo:
            b["m"] = lo
        if t.get("name") and b["k"] in "twh":
            b["n"] = t["name"]
        scene["buildings"].append(b)

    # airfield lights: [x, y, class, runway index or -1]
    for nd in nodes.values():
        t = nd.get("tags", {})
        if t.get("aeroway") == "navigationaid" and t.get("navigationaid") in LIGHT_CLASS:
            p = xy(nd)
            cls = LIGHT_CLASS[t["navigationaid"]]
            rw = -1
            if cls <= 1:
                k, d = nearest_runway(p, scene["runways"], extend=0.4 if cls == 0 else 0)
                rw = k if d < (60 if cls == 0 else 120) else -1
            scene["lights"].append([p[0], p[1], cls, rw])
        elif t.get("aeroway") == "windsock":
            scene["windsocks"].append(xy(nd))

    scene["stands"] = [s for s in (stand_pose(p, scene["buildings"]) for p in scene["stands"]) if s]
    return scene


def stand_pose(line, buildings):
    """[x, y, heading_rad, size] of a parked aircraft: nose towards the end of the lead-in line nearest a terminal."""
    terms = [b for b in buildings if b["k"] in "ta"]

    def dist_term(p):
        best = 1e9
        for b in terms:
            r = b["r"]
            if abs(r[0][0] - p[0]) > 400 or abs(r[0][1] - p[1]) > 400:
                continue
            best = min(best, min(math.hypot(q[0] - p[0], q[1] - p[1]) for q in r))
        return best

    a, b = line[0], line[-1]
    nose, prev = (a, line[1]) if dist_term(a) < dist_term(b) else (b, line[-2])
    dx, dy = nose[0] - prev[0], nose[1] - prev[1]
    if dx == dy == 0:
        return None
    hd = math.atan2(dy, dx)
    big = math.hypot(line[-1][0] - line[0][0], line[-1][1] - line[0][1]) > 70
    size = 1.7 if big else 1.0
    back = 22 * size
    return [round(nose[0] - back * math.cos(hd), 1), round(nose[1] - back * math.sin(hd), 1), round(hd, 3), size]


# ---------------------------------------------------------------- forecast + wind

def newest_forecast():
    files = sorted(DATA.glob("forecast_*.csv"), key=lambda p: p.stat().st_mtime)
    if not files:
        sys.exit("no data/forecast_*.csv found - run `uv run python -m fra.predict` first")
    return files[-1]


def ifs_wind(issue, valid):
    """ECMWF IFS 10 m wind (kt) for the valid hours from the newest run available at issue time (~6 h latency)."""
    p = DATA / "ifs_runs.parquet"
    if not p.exists():
        return None
    r = pd.read_parquet(p, columns=["init", "valid", "wind_speed", "wind_direction", "wind_gusts"])
    r = r[r["init"] <= issue - pd.Timedelta(hours=6)]
    if r.empty:
        return None
    r = r[r["init"] == r["init"].max()].set_index("valid").reindex(valid)
    return r if r["wind_speed"].notna().any() else None


def forecast_payload(path):
    f = pd.read_csv(path)
    f["valid_utc"] = pd.to_datetime(f["valid_utc"], utc=True)
    f = f.sort_values("valid_utc").reset_index(drop=True)
    issue = f["valid_utc"].iloc[0] - pd.Timedelta(hours=1)
    wind = ifs_wind(issue, pd.DatetimeIndex(f["valid_utc"]))
    hours = []
    for i, row in f.iterrows():
        h = dict(t=row["valid_utc"].isoformat(), p25=round(float(row["p_od25"]), 3),
                 p18=round(float(row["p_rwy18_open"]), 3), od=int(row.get("od_pred", 25 if row["p_od25"] >= .5 else 7)))
        if "rule_baseline_od" in f:
            h["rule"] = int(row["rule_baseline_od"])
        if wind is not None and pd.notna(wind["wind_speed"].iloc[i]):
            h["wd"] = round(float(wind["wind_direction"].iloc[i]))
            h["ws"] = round(float(wind["wind_speed"].iloc[i]), 1)
            h["wg"] = round(float(wind["wind_gusts"].iloc[i]), 1)
        hours.append(h)
    return dict(issue=issue.isoformat(), source=path.name, wind_init=None if wind is None else
                str(pd.read_parquet(DATA / "ifs_runs.parquet", columns=["init"])["init"]
                    .pipe(lambda s: s[s <= issue - pd.Timedelta(hours=6)].max())), hours=hours)


# ---------------------------------------------------------------- page

PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>FRA 3D - operating direction forecast</title><link rel="icon" href="data:,">
<style>html,body{margin:0;height:100%;background:#03060d;overflow:hidden}</style>
</head><body>
<div id="app"></div>
<script>window.FRA_SCENE=__SCENE__;window.FRA_FORECAST=__FORECAST__;</script>
<script>__BUNDLE__</script>
</body></html>
"""


def render(fc):
    """Write site/airport3d.html with all forecast runs embedded, `fc` selected by default."""
    cache = DATA / "scene3d.json"
    if cache.exists():
        scene = json.loads(cache.read_text())
    else:
        print("fetching OSM tiles ...")
        scene = build_scene(*load_osm(fetch_all()))
        cache.write_text(json.dumps(scene, separators=(",", ":")))
    if not BUNDLE.exists():
        sys.exit(f"{BUNDLE} missing - run `cd web && npm i && npm run build` first")
    runs = sorted((forecast_payload(p) for p in DATA.glob("forecast_*.csv")), key=lambda r: r["issue"])
    fcj = dict(default=fc.name, runs=runs)
    page = (PAGE.replace("__SCENE__", json.dumps(scene, separators=(",", ":")))
            .replace("__FORECAST__", json.dumps(fcj, separators=(",", ":")))
            .replace("__BUNDLE__", BUNDLE.read_text().replace("</script", "<\\/script")))
    SITE.mkdir(exist_ok=True)
    out = SITE / "airport3d.html"
    out.write_text(page)
    print(f"wrote {out} ({len(page) / 1e6:.1f} MB), default run {fc.name}, {len(runs)} runs")
    return out


def main():
    render(Path(sys.argv[1]) if len(sys.argv) > 1 else newest_forecast())


if __name__ == "__main__":
    main()
