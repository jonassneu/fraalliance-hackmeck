# 3D airport view

Source of the interactive 3D view of Frankfurt Airport (`site/airport3d.html`), built with [three.js](https://threejs.org/).
It shows the forecast operating direction, the active runways, Runway 18 West and simulated traffic for any hour of
the 48 h forecast, and live aircraft when the page is served together with the live feed.

[`fra/scene3d.py`](../fra/scene3d.py) inlines the bundle, the airport geometry (OpenStreetMap) and the forecast into
one self-contained HTML file. The bundle `dist/app.js` is checked in, so the Python pipeline needs no Node.js.
Rebuild it only after changing `src/`:

```bash
cd web
npm ci
npm run build            # esbuild -> dist/app.js
cd .. && uv run python -m fra.scene3d
```

| File | Purpose |
| --- | --- |
| `src/main.js` | Scene, camera, runway and traffic animation, timeline and controls |
| `src/style.js` | Styles of the in-page interface |
| `src/spring.js` | Spring animation helpers for camera and interface motion |
| `shot.mjs` | Headless screenshot of a page in `site/` (used for the README images): `node shot.mjs out.png` |
| `rec.mjs` | Short screen recording of the 3D view |

The two tools use `playwright-core` with a local Chromium; set `CHROME_PATH` if yours is not in the default
Playwright cache.

Map data © OpenStreetMap contributors (ODbL). Live aircraft: The OpenSky Network.
