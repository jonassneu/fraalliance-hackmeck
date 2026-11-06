"""Shared look of the site pages (fra.dashboard -> index.html).

Quiet on purpose: IBM Plex Sans with tabular figures, graphite neutrals, white cards on #f1f1ef, hairlines
instead of boxes; runway numbers are drawn as painted designators on asphalt. Colour is reserved for data (07 East navy, 25 West teal, the official forecast orange, the tailwind limit red) plus one accent for
links and focus. Both pages are laid out on a 1280 px canvas and zoomed to fit the window (one screen, no scrolling).
"""

BASE_CSS = """
/* graphite neutrals; colour belongs to the data (07 East navy, 25 West teal, the official forecast orange, the tailwind limit red) and to the runway plates */
:root{--east-line:#2c3e66;--west-line:#1f9e89;--bg:#f1f1ef;--card:#fff;--ink:#1b1c1e;--ink2:#55575d;--ink3:#5e6065;--line:rgba(27,28,30,.09);--fill:#ebebe8;
  --asphalt:#2b2c2f;--paint:#f6f6f1;--accent:#1b1c1e;
  --west:#1f9e89;--risk:#4b4d53;--east:#2c3e66;--amber:#e08a00;--red:#d8392e;--green:#2e9d54;--live:#5c9a0f;--ok:#cde7d4;--good:#248a3d;--b1:#a1a1a6;--b2:#d2d2d7;
  --shadow:0 8px 24px rgba(20,20,22,.1),0 0 0 1px rgba(20,20,22,.06);--ease:cubic-bezier(.2,.8,.2,1);
  --ink-rgb:27 28 30;--on-ink:#fff;--on-dir:#fff;--hatch:rgba(255,255,255,.4);--alert-bg:#fdf4f3;--inaa-ink:#8a5000;
  --area-fill:rgba(27,28,30,.07);--area-line:rgba(27,28,30,.18);--hover:#f7f7f5;--rwy:#2b2c2f;
  --sans:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--mono:var(--sans)} /* one typeface: figures use tabular numbers, not a mono face */
/* dark: the system setting, or data-theme on <html> (the same palette logic as the 3D view's dark mode) */
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#111214;--card:#1b1c1f;--ink:#ececea;--ink2:#a7a9ae;--ink3:#8e9095;--line:rgba(255,255,255,.1);--fill:#2a2b2f;
  --asphalt:#3a3b40;--accent:#ececea;--west:#4dbfa7;--east:#2f4a7a;--east-line:#a3adc2;--west-line:#5fcab5;--risk:#9aa0a8;--amber:#f0a030;--red:#ef5b4f;--green:#3fb96a;--b1:#6f7177;--b2:#4a4c51;
  --shadow:0 8px 24px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.07);--ink-rgb:236 236 234;--on-ink:#111214;--on-dir:#fff;--hatch:rgba(255,255,255,.5);--live:#8cc63f;
  --alert-bg:#3a1d1b;--inaa-ink:#f0a24a;--area-fill:rgba(255,255,255,.07);--area-line:rgba(255,255,255,.22);--hover:#26272b;--rwy:#d8d7d2;color-scheme:dark}}
:root[data-theme=dark]{--bg:#111214;--card:#1b1c1f;--ink:#ececea;--ink2:#a7a9ae;--ink3:#8e9095;--line:rgba(255,255,255,.1);--fill:#2a2b2f;
  --asphalt:#3a3b40;--accent:#ececea;--west:#4dbfa7;--east:#2f4a7a;--east-line:#a3adc2;--west-line:#5fcab5;--risk:#9aa0a8;--amber:#f0a030;--red:#ef5b4f;--green:#3fb96a;--b1:#6f7177;--b2:#4a4c51;
  --shadow:0 8px 24px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.07);--ink-rgb:236 236 234;--on-ink:#111214;--on-dir:#fff;--hatch:rgba(255,255,255,.5);--live:#8cc63f;
  --alert-bg:#3a1d1b;--inaa-ink:#f0a24a;--area-fill:rgba(255,255,255,.07);--area-line:rgba(255,255,255,.22);--hover:#26272b;--rwy:#d8d7d2;color-scheme:dark}
*{box-sizing:border-box}
[hidden]{display:none!important}
html,body{margin:0;background:var(--bg);overflow:hidden}
body{color:var(--ink);font:400 13px/1.45 var(--sans);-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums;width:1280px}
button{font:inherit;color:inherit;border:0;background:none;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--ink);outline-offset:2px;border-radius:4px}

.topbar{display:flex;align-items:center;gap:24px;height:56px;padding:0 24px;flex:none}
.brand{display:flex;align-items:center;gap:10px;font-size:19px;font-weight:600;letter-spacing:-.01em;white-space:nowrap}
.brand svg{width:28px;height:28px;flex:none}
.brand span{font-size:14px;font-weight:400;letter-spacing:0;color:var(--ink3)}
.nav{display:flex;gap:4px}
.nav a{font-size:13px;font-weight:500;color:var(--ink2);padding:4px 12px;border-radius:8px;transition:color .15s var(--ease),background-color .15s var(--ease)}
.nav a:hover{color:var(--ink)}
.nav a[aria-current]{color:var(--ink);background:var(--fill)}
.topbar-r{margin-left:auto;display:flex;align-items:center;gap:12px}

/* controls: feedback on press, not on release */
.btn{display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 12px;border-radius:8px;background:var(--card);
  font-size:13px;font-weight:500;white-space:nowrap;box-shadow:inset 0 0 0 1px var(--line);
  transition:background-color .15s var(--ease),transform .12s var(--ease)}
.btn svg{width:16px;height:16px}
.btn:hover{background:var(--hover)}
.btn:active,.seg button:active,.icon:active{transform:scale(.97)}
.seg{position:relative;display:inline-flex;padding:2px;border-radius:8px;background:var(--fill);flex:none}
.seg button{position:relative;z-index:1;height:28px;padding:0 12px;border-radius:6px;font-size:13px;font-weight:500;
  color:var(--ink2);white-space:nowrap;transition:color .15s var(--ease),transform .12s var(--ease)}
.seg button[aria-pressed=true]{color:var(--ink)}
.seg>i{position:absolute;top:2px;left:0;height:28px;border-radius:6px;background:var(--card);pointer-events:none;
  box-shadow:0 1px 2px rgba(20,20,22,.08),0 0 0 1px rgba(20,20,22,.05)}
.seg.on>i{transition:transform .3s var(--ease),width .3s var(--ease)}
.icon{width:32px;height:32px;border-radius:8px;display:grid;place-items:center;background:var(--fill);flex:none;
  transition:background-color .15s var(--ease),transform .12s var(--ease)}
.icon svg{width:12px;height:12px}
.icon:hover{background:var(--fill)}

.card{background:var(--card);border-radius:16px;box-shadow:inset 0 0 0 1px rgba(27,28,30,.04)}
.tip{position:fixed;z-index:30;pointer-events:none;background:var(--card);color:var(--ink);font-size:12px;line-height:1.5;
  padding:8px 12px;border-radius:8px;box-shadow:var(--shadow)}
/* signature: a runway number is a painted designator on asphalt; the bottom edge carries its direction colour */
.rw{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:20px;padding:0 6px;border-radius:4px;
  background:var(--asphalt);color:var(--paint);font:500 12px/1 var(--mono);box-shadow:inset 0 -2px 0 var(--dc,transparent);
  vertical-align:middle;flex:none}

@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.01ms!important;animation-duration:.01ms!important}}
@media (prefers-contrast:more){:root{--line:rgba(0,0,0,.3);--ink2:#3a3a3c;--ink3:#555}.card{box-shadow:0 0 0 1px rgba(0,0,0,.3)}}
"""

# assets/icon.svg inline: one runway on its real heading with both operating directions (25 west, 07 east)
LOGO = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 14.5h17v5h-17zM7 17h2m3 0h2m3 0h2M4 7.5h14.5m-4-4 4 4-4 4" fill="none" '
        'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>')  # one path: a runway and the direction arrow; crisp at any size


PAGES = [("forecast", "index.html", "Dashboard"), ("3d", "airport3d.html", "3D view")]

# one hatch for the night ban on both pages: the dashboard as --hatch-bg, the 3D view as window.FRA_STYLE
HATCH = dict(css="repeating-linear-gradient(135deg,{c} 0 1.5px,transparent 1.5px 4.5px)", light="rgba(255,255,255,.4)", dark="rgba(255,255,255,.5)")  # dark: light stripes, ~3:1 on the navy bar
# the switch-chance row on both pages: 0 to 100 % once a real switch (>= 20 %) is in view; otherwise 0 to 20 % in a
# 84 px row with one gridline at 10 % (labelled in the gutter), the same on every calm day; 110 px for a real switch
SWITCH = dict(nice_step=0.1, nice_min=0.2, min_bar=0.01, real=0.2, real_h=110, calm_top=0.2, low_top=0.2, calm_h=48, calm_h_3d=56, grid=0.1)  # 0 to 100 % for a real switch (>= 20 %); 0 to 20 % below that, 0 to 12 % while the peak stays under 10 %; one 10 % gridline
# the arrow of the headline, reused at text size in the chart's direction labels
ARROW = dict(e="M3 12h27M22 4l8 8-8 8", w="M31 12H4M12 4l-8 8 8 8")
# one axis on both pages: "18:00" when 6 hours get at least long_px, else "18"; day labels on the top row (right-aligned at
# the plot edge when they would overflow), hours and the Now pill on the bottom row, labels masked over the dividers
AXIS = dict(long_px=48, short_below=520, font=11)  # short "18" below a 520 px window or when 6 h get under 48 px
# one check mark for "Open" on both pages
CHECK = '<svg class="ck" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
STYLE = dict(hatch=HATCH, switch=SWITCH, logo=None, arrow=ARROW, header_css=None, axis=AXIS, check=CHECK)
BASE_CSS += ":root{--hatch-bg:" + HATCH["css"].format(c="var(--hatch)") + "}\n"

# one vocabulary on both pages: the dashboard reads it as T, the 3D view as window.FRA_COPY
NNB = " "  # narrow no-break space between a number and its unit (6 %, 48 h, 5 kt)
COPY = dict(
    # the one sentence on both pages when the official forecast flags a switch we don't expect; {when} is "Fri evening" when the
    # window ends that night, else "from Fri evening to Sat midday" (parts of the day: night 23-05, morning, midday 11-14,
    # afternoon, evening 17-23)
    disagree="{of} warns of a switch {when}; we don't\u00a0expect\u00a0one.",  # no widow: "don't expect one" stays together
    of_name="The official forecast",
    night_next="Night ban · {od} at {t}",  # one night phrase: the 3D title (desktop and phone) and both readouts ("… · night ban · 07 at 05:00")
    # the outlook line under the headline, the same on both pages (the thresholds stay in the pages' logic: a predicted
    # flip = expected, a peak >= 20 % = possible, else none; a peak in the last 3 h says "by ... (end of forecast)")
    out_expected="Switch to {to} expected {t}",
    out_possible="{p} chance of {to} {when}",
    out_when_end='by {t} <span class="eof">(end of forecast)</span>',
    out_when_mid="around {t}",
    out_edge=' <span class="eof"><span class="eofs">·\u00a0</span>end of forecast window</span>',  # a predicted switch in the last 2 h of the horizon
    out_none="No switch expected in the next 48" + NNB + "h",
    issued="Forecast issued",
    now="Runway direction now",
    peak="Peak switch risk",
    nextsw="Next likely switch",
    acc24="of hours correct, 24" + NNB + "h ahead",
    official="official",
    inaa="Official forecast",
    inaa_flag="Official: switch window",
    switch="Chance of",  # + West / East / other direction: p(the other direction) for that hour, not a hazard
    per_hour="that hour",
    any_switch="chance of any switch",
    headwind="Headwind",
    limit="Limit: tailwind > 1" + NNB + "kt",
    limit_tip="Sustained for 30 minutes, or at once from 10 kt: the FraAlliance case rule (fra/rules.py), the baseline the model is compared with",  # fra/rules.py: the FraAlliance case rules (MODEL_CARD, section 3)
    night="Night 23–05",
    landings="Landings",
    takeoffs="Take-offs",
    town="Town near a landing path",  # within 1.5 km of the approach centreline (the rule both maps use)
    r18_gloss="take-offs only",
    faded="Faded: < 90" + NNB + "% sure",
    wind="Wind",
    r18="Runway 18 West",
    # one legend item for Runway 18 on both pages: solid = closed, hatched = at risk (the split is in the tooltip)
    r18_closed="Runway 18 closed",
    r18_risk="Runway 18 at risk",
    r18_both="Runway 18 closed / at risk",
    r18_tip="Solid: closure chance over 50" + NNB + "% that hour. Hatched: 10 to 50" + NNB + "%.",
    # the Runway 18 status at the current hour, one wording on both pages: the next closure in the 48 h window, scheduled
    # (the headline names the absolute day, like the switch line; the quiet line the relative day) or in effect; else open.
    # {date} = "Fri 6 Nov", {a}, {b} = HH:MM; {b} carries its weekday when the closure ends on another day. {rel} = Today /
    # Tomorrow / In N days; the "at risk" range (the legend's term) adds the at-risk hours drawn next to the closure in the
    # lane (left out when there are none); "open until then" names the runway's state before it
    r18_closes="Closes {date}, {a}–{b}",
    r18_rel=["Today", "Tomorrow", "In {n} days"],
    r18_may="at risk {a}–{b}",
    r18_date="open until then",
    r18_until="Closed now until {b}",
    r18_open="Open for the next {n}" + NNB + "h",
    # no closure in the window: the quiet line names the highest closure chance of any open daytime hour, the last line
    # how many departures an hour it carries at the busiest (the figure a closure would move); both from the forecast
    r18_open_max="Closure chance at most {p} an hour",
    r18_carries="Carries up to ≈{n} departures an hour",
    r18_moves="≈{n} departures an hour move to the Centre runway",
    r18_moves0="Inside the night ban, so no departures move",
    # the switch's certainty, tied to the switch: the highest hourly chance of the other direction and when it is reached
    # (hero: "81 % chance of West at Sat 17:00"; 3D card row "Chance of West": "81 % at Sat 17:00"; both charts:
    # "Highest: 81 % at Sat 17:00", one preposition everywhere)
    peak_hi="{p} chance of {to} at {t}",
    peak_by="{p} at {t}",
)


def bar(current, right=""):
    """Top bar: brand, page nav (current page highlighted), optional controls on the right."""
    nav = "".join(f'<a href="#" aria-current="page">{t}</a>' if k == current else f'<a href="{h}">{t}</a>' for k, h, t in PAGES)
    brand = f"{LOGO}Runway Direction Forecast<span>Frankfurt Airport</span>"
    brand = f'<div class="brand">{brand}</div>' if current == "forecast" else f'<a class="brand" href="index.html">{brand}</a>'
    nav = f'<nav class="nav" aria-label="Pages">{nav}</nav>' if len(PAGES) > 1 else ""
    return f'<header class="topbar">{brand}{nav}<div class="topbar-r">{right}</div></header>'

STYLE["logo"] = LOGO  # the 3D view draws the same mark in its header


DESCRIPTION = ("Which way Frankfurt Airport flies, east (07) or west (25), for each of the next 48 hours, updated hourly. "
               "Correct 93 to 97 % of hours in the backtest, ahead of the official forecast at every lead time.")


def _favicon():
    """assets/icon.svg as a data URI, its arrows in the site's direction colours (West teal, East navy)."""
    import re
    from pathlib import Path
    from urllib.parse import quote
    f = Path(__file__).resolve().parent.parent / "assets" / "icon.svg"
    if not f.exists():
        return "data:,"
    svg = re.sub(r"<!--.*?-->", "", f.read_text(), flags=re.S)
    svg = svg.replace("#2a78d6", "#1f9e89").replace("#eda100", "#2c3e66")
    svg = re.sub(r">\s+<", "><", svg).strip()
    return "data:image/svg+xml," + quote(svg, safe=":/=;,.-'()")


FAVICON = _favicon()


def meta(title):
    """Share metadata for both pages; og:image is the dashboard screenshot copied next to the pages (site/og.png)."""
    esc = lambda t: t.replace("&", "&amp;").replace('"', "&quot;")
    return (f'<meta name="description" content="{esc(DESCRIPTION)}"><meta property="og:type" content="website">'
            f'<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(DESCRIPTION)}">'
            '<meta property="og:image" content="og.png"><meta name="twitter:card" content="summary_large_image">'
            f'<link rel="icon" type="image/svg+xml" href="{FAVICON}">')


# one header for both pages: the dashboard's .topbar and the 3D view's .pbar are drawn from these numbers (CSS px before the
# page zoom; both pages scale the header by the same factor, so brand and tabs sit at identical pixels). The brand's line
# height is fixed too: left to each page's body line height it set the brand's baseline a pixel apart on the two pages.
HEADER = dict(h=56, pad=24, gap=24, brand=16, brand_sub=14, logo=24, logo_gap=10, nav_fs=14, nav_pad_y=4, nav_pad_x=12, nav_gap=4,
              nav_ml=-8, right_gap=12, brand_lh=24, icon=32, seg_h=28, seg_fs=13, seg_pad=12, upd_fs=14)


def header_css(sel):
    """CSS for one page's header from HEADER; sel maps the roles to that page's class names."""
    H = HEADER
    return (f"{sel['bar']}{{height:{H['h']}px;padding:0 {H['pad']}px;gap:{H['gap']}px;display:flex;align-items:center;box-sizing:border-box}}"
            f"{sel['brand']}{{display:flex;align-items:center;gap:{H['logo_gap']}px;font-size:{H['brand']}px;font-weight:600;letter-spacing:-.01em;white-space:nowrap}}"
            f"{sel['brand']} svg{{width:{H['logo']}px;height:{H['logo']}px;flex:none}}"
            f"{sel['brand']} span{{font-size:{H['brand_sub']}px;font-weight:400;letter-spacing:0;line-height:{H['brand_lh']}px}}"
            f"{sel['brand']}{{line-height:{H['brand_lh']}px}}"
            f"{sel['nav']}{{display:flex;gap:{H['nav_gap']}px;margin-left:{H['nav_ml']}px}}"
            f"{sel['nav']} a{{font-size:{H['nav_fs']}px;font-weight:500;line-height:1.6;padding:{H['nav_pad_y']}px {H['nav_pad_x']}px;border-radius:8px}}"
            # the page tabs as a segmented control, the time-zone switch's: a grey track, the current page a raised card-colour pill
            f"{sel['nav']}{{gap:0;padding:2px;border-radius:8px;background:var(--fill);align-items:center}}"
            f"{sel['nav']} a{{height:{H['seg_h']}px;box-sizing:border-box;display:inline-flex;align-items:center;padding:0 {H['nav_pad_x']}px;border-radius:6px;line-height:1}}"
            f"{sel['nav']} a[aria-current]{{background:{sel['pill_bg']};box-shadow:{sel['pill_sh']};color:{sel['pill_ink']}}}"
            f"{sel['icon']}{{width:{H['icon']}px;height:{H['icon']}px}}"
            f"{sel['seg']} button{{height:{H['seg_h']}px;padding:0 {H['seg_pad']}px;font-size:{H['seg_fs']}px}}"
            f"{sel['upd']}{{font-size:{H['upd_fs']}px;line-height:20px}}")


STYLE["header_css"] = header_css(dict(bar=".pbar", brand=".pbrand", nav=".ptabs", icon=".pthm", seg=".ptz", upd=".prun",
                                      pill_bg="var(--mat)", pill_sh="0 1px 2px rgba(0,0,0,.12)", pill_ink="var(--label)"))


# the official window's tag, one wording on both pages: "Official: Fri 19h → Sat 11h" ({a}/{b} = weekday + hour), the bare
# word when even that does not fit; the full window is in the tooltip
STYLE["pgtag"] = dict(long="Official: {da} {ha}h → {db} {hb}h", mid="Official → {db} {hb}h", short="Official")  # the ladder, longest first (both pages; also stepped down next to the switch chip)


# the 48 h legend, one order on both pages (each page shows only what its hours contain)
# a switch in the forecast's last hours is drawn at least this wide (px), running past the plot's right edge
STYLE["switch_tab_min"] = 24
# the official-window tag: one background on both pages (white text on light, ink on dark: >= 4.5:1, check.mjs)
STYLE["tag_bg"] = dict(light="#8a5000", dark="#f0a030", ink_light="#ffffff", ink_dark="#1b1c1f")
STYLE["legend_order"] = ["east", "west", "faded", "official", "night", "limit", "r18"]


# one footer text for both pages
# (both pages set it as two short lines on desktop: sources, then the backtest)
FOOTER_LINES = ("Official forecast = INAA (Umwelthaus). Wind: ECMWF IFS, DWD ICON. Map data © OpenStreetMap contributors.",
                "Backtest: walk-forward \u2014 each week's model trained only on earlier data.")


def footer_lines(months=None):
    """The two footer lines; the backtest line names its length when known (the only backtest note on the page)."""
    if not months:
        return FOOTER_LINES
    return (FOOTER_LINES[0], FOOTER_LINES[1].replace("Backtest: ", f"Backtest: {months}\u00a0months, ", 1))


FOOTER = " ".join(FOOTER_LINES)  # one line, where a page has no room for two
STYLE["footer"] = FOOTER
STYLE["footer_lines"] = list(FOOTER_LINES)


# one type scale for both pages and the shared header: every font size in the built HTML snaps to a token
# (CSS px before the page zoom; rem at 16 px). A size halfway between two tokens takes the larger one.
TYPE = (11, 13, 15, 18, 24, 36, 56)


def _tok(v, unit):
    px = float(v) * (16 if unit == "rem" else 1)
    return min(TYPE, key=lambda t: (abs(t - px), -t))


def snap_type(html):
    """Map every font size in the page's CSS, inline styles and canvas fonts to the nearest TYPE token."""
    import re
    num = r"(\d+(?:\.\d+)?|\.\d+)"
    html = re.sub(r"font-size:(\s*)" + num + r"(px|rem)", lambda m: f"font-size:{m[1]}{_tok(m[2], m[3])}px", html)
    html = re.sub(r"(font:\s*(?:italic\s+)?(?:\d{3}\s+|normal\s+|bold\s+)?)" + num + r"(px|rem)", lambda m: f"{m[1]}{_tok(m[2], m[3])}px", html)
    html = re.sub(r"(\.font\s*=\s*['`](?:\d{3}\s+)?)" + num + r"px", lambda m: f"{m[1]}{_tok(m[2], 'px')}px", html)
    return html


def type_sizes(html):
    """The distinct font sizes left in a built page (px; em sizes are relative to a token and listed as such)."""
    import re
    out = set()
    for m in re.finditer(r"font-size:\s*(\d+(?:\.\d+)?|\.\d+)(px|rem|em)|font:\s*(?:italic\s+)?(?:\d{3}\s+)?(\d+(?:\.\d+)?|\.\d+)(px|rem)|\.font\s*=\s*['`](?:\d{3}\s+)?(\d+)px", html):
        v, u = (m[1], m[2]) if m[1] else (m[3], m[4]) if m[3] else (m[5], "px")
        out.add(f"{float(v):g}{u}")
    return sorted(out, key=lambda x: float(x.rstrip("pxremx")))
