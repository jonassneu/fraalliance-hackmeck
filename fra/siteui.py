"""Shared look of the site pages (fra.dashboard -> index.html, fra.modelpage -> model.html).

Apple-style and quiet on purpose: the system font, one neutral palette, white cards on #f5f5f7 without shadows,
hairlines instead of boxes. Colour is reserved for data (25 blue, 07 amber, Runway 18 status) plus one accent for
links and focus. Both pages are laid out on a 1280 px canvas and zoomed to fit the window (one screen, no scrolling).
"""

BASE_CSS = """
:root{--bg:#f5f5f7;--card:#fff;--ink:#1d1d1f;--ink2:#6e6e73;--ink3:#86868b;--line:rgba(0,0,0,.08);--fill:#f0f0f3;
  --accent:#0071e3;--west:#2a78d6;--east:#eda100;--red:#e0352b;--green:#2aa44f;--ok:#cbe9d3;--good:#248a3d;
  --b1:#a1a1a6;--b2:#d2d2d7;--glass:rgba(255,255,255,.8);--lift:0 10px 30px rgba(0,0,0,.12),0 0 0 .5px rgba(0,0,0,.08)}
*{box-sizing:border-box}
[hidden]{display:none!important}
html,body{margin:0;background:var(--bg);overflow:hidden}
body{color:var(--ink);font:400 13px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Inter,system-ui,Roboto,sans-serif;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums;width:1280px}
button{font:inherit;color:inherit;border:0;background:none;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:6px}

/* top bar: sits on the page, no banner; the current page is a soft pill */
.topbar{display:flex;align-items:center;gap:28px;height:54px;padding:0 28px;flex:none}
.brand{font-size:15px;font-weight:600;letter-spacing:-.01em;white-space:nowrap}
.brand span{margin-left:8px;font-weight:400;color:var(--ink3)}
.nav{display:flex;gap:2px}
.nav a{font-size:13px;font-weight:500;color:var(--ink2);padding:5px 12px;border-radius:999px;transition:color .15s,background-color .15s}
.nav a:hover{color:var(--ink)}
.nav a[aria-current]{color:var(--ink);background:rgba(0,0,0,.06)}
.topbar-r{margin-left:auto;display:flex;align-items:center;gap:12px}

/* controls: feedback on press, not on release */
.btn{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 12px;border-radius:999px;background:var(--card);
  font-size:12.5px;font-weight:500;white-space:nowrap;box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
  transition:transform .12s ease-out,background-color .15s}
.btn svg{width:13px;height:13px}
.btn:hover{background:#fafafa}
.btn:active,.seg button:active,.icon:active{transform:scale(.96)}
.seg{position:relative;display:inline-flex;padding:2px;border-radius:9px;background:rgba(118,118,128,.12);flex:none}
.seg button{position:relative;z-index:1;height:24px;padding:0 12px;border-radius:7px;font-size:12.5px;font-weight:500;
  color:var(--ink2);white-space:nowrap;transition:color .2s,transform .12s ease-out}
.seg button[aria-pressed=true]{color:var(--ink)}
.seg>i{position:absolute;top:2px;left:0;height:24px;border-radius:7px;background:var(--card);pointer-events:none;
  box-shadow:0 1px 3px rgba(0,0,0,.12),0 0 0 .5px rgba(0,0,0,.04)}
.seg.on>i{transition:transform .36s cubic-bezier(.2,.9,.25,1),width .36s cubic-bezier(.2,.9,.25,1)}
.icon{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:rgba(118,118,128,.12);flex:none;
  transition:transform .12s ease-out,background-color .15s}
.icon svg{width:12px;height:12px}
.icon:hover{background:rgba(118,118,128,.2)}

.card{background:var(--card);border-radius:18px}
.tip{position:fixed;z-index:30;pointer-events:none;background:var(--glass);-webkit-backdrop-filter:blur(20px) saturate(180%);
  backdrop-filter:blur(20px) saturate(180%);color:var(--ink);font-size:12px;line-height:1.5;padding:7px 11px;border-radius:10px;
  box-shadow:var(--lift)}

@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.01ms!important;animation-duration:.01ms!important}}
@media (prefers-reduced-transparency:reduce){.tip,.toast,.fs{background:var(--card);-webkit-backdrop-filter:none;backdrop-filter:none}}
@media (prefers-contrast:more){:root{--line:rgba(0,0,0,.3);--ink2:#3a3a3c;--ink3:#555}.card{box-shadow:0 0 0 1px rgba(0,0,0,.3)}}
"""

PAGES = [("forecast", "index.html", "Forecast"), ("model", "model.html", "Model")]


def bar(current, right=""):
    """Top bar: brand, page nav (current page highlighted), optional controls on the right."""
    nav = "".join(f'<a href="#" aria-current="page">{t}</a>' if k == current else f'<a href="{h}">{t}</a>' for k, h, t in PAGES)
    brand = "Runway Operations<span>Frankfurt Airport</span>"
    brand = f'<div class="brand">{brand}</div>' if current == "forecast" else f'<a class="brand" href="index.html">{brand}</a>'
    return f'<header class="topbar">{brand}<nav class="nav" aria-label="Pages">{nav}</nav><div class="topbar-r">{right}</div></header>'
