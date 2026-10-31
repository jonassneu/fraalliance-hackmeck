// Apple-style dark materials, system type with size-specific tracking, springs do the motion (no CSS keyframes).
export const css = () => `
#app{
  --label:#f0efec;--label2:#c3c2b7;--label3:#7d7c76;--sep:rgba(240,239,236,.1);
  --fill:rgba(240,239,236,.07);--fill2:rgba(240,239,236,.13);--tint:#f0efec;
  --mat:rgba(26,26,25,.72);--mat-blur:blur(28px) saturate(170%);--edge:rgba(240,239,236,.08);
  --bg:#0e0e0d;--seg-thumb:#3a3a37;--chip:rgba(20,20,19,.82);--place:rgba(240,239,236,.75);
  --halo:0 1px 3px rgba(0,0,0,.9),0 0 10px rgba(0,0,0,.6);--inner:rgba(255,255,255,.16);--shadow:rgba(0,0,0,.45);
  --scrim:14,14,13;--scrim-a:.78;
  position:fixed;inset:0;overflow:hidden;background:var(--bg);color:var(--label);transition:background-color .3s;
  font:400 .875rem/1.35 -apple-system,BlinkMacSystemFont,"SF Pro Text","Inter","Segoe UI Variable",system-ui,sans-serif;
  letter-spacing:-.006em;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums;user-select:none}
#app canvas{display:block;touch-action:none}
:where(#app) button{font:inherit;color:inherit;border:0;background:none;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
#app :focus-visible{outline:2px solid var(--tint);outline-offset:2px}

/* scroll-edge effects: only where floating chrome overlaps the scene */
.scrim{position:absolute;left:0;right:0;pointer-events:none;z-index:-1}
.scrim.top{top:0;height:11rem;background:linear-gradient(rgba(var(--scrim),var(--scrim-a)),rgba(var(--scrim),0))}
.scrim.bottom{bottom:0;height:9rem;background:linear-gradient(rgba(var(--scrim),0),rgba(var(--scrim),calc(var(--scrim-a) - .06)))}

/* map labels */
.labels{position:absolute;inset:0;pointer-events:none;z-index:2}
.lbl{position:absolute;left:0;top:0;white-space:nowrap;text-shadow:var(--halo)}
.lbl.place{font-size:.75rem;font-weight:600;color:var(--place);letter-spacing:.01em}
.lbl.rwy{display:flex;align-items:center;gap:.375rem;font-size:.8125rem}
.lbl.rwy b{font-weight:700;letter-spacing:-.01em}
.lbl.rwy b.dim{color:var(--label3);font-weight:600}
.lbl.rwy small{font-size:.6875rem;color:var(--label2);letter-spacing:.01em}
.chip{font-style:normal;font-size:.6875rem;font-weight:600;letter-spacing:.01em;padding:.125rem .5rem .125rem .4375rem;
  border-radius:999px;background:var(--chip);text-shadow:none;display:inline-flex;align-items:center;gap:.3125rem}
.chip::before{content:"";width:.375rem;height:.375rem;border-radius:50%;background:currentColor}
.chip.arr{color:var(--arr)}.chip.dep{color:var(--dep)}.chip.closed{color:var(--closed)}

.hud{position:absolute;inset:0;pointer-events:none;z-index:3}
.hud .panel,.hud button,.hud .seg,.hud .track,.hud select{pointer-events:auto}

/* materials: bigger surface = thicker (more blur, deeper shadow) */
.panel{background:var(--mat);-webkit-backdrop-filter:var(--mat-blur);backdrop-filter:var(--mat-blur);
  border:.5px solid var(--edge);box-shadow:inset 0 .5px 0 var(--inner),0 18px 50px var(--shadow)}

/* hero: the one thing that matters most */
.hero{position:absolute;left:1.5rem;top:1.25rem;pointer-events:none}
.eyebrow{font-size:.8125rem;font-weight:600;color:var(--label2);letter-spacing:.005em}
.dir{position:relative;height:2.9rem;margin-top:.125rem;font-size:2.625rem;line-height:1.05;font-weight:700;letter-spacing:-.025em}
.dir span{position:absolute;left:0;top:0;white-space:nowrap;will-change:transform,opacity}
.dir span i{display:inline-block;width:.38em;height:.38em;border-radius:.1em;margin-right:.24em;vertical-align:.14em}
.dir-sub{font-size:.9375rem;color:var(--label2);margin-top:.25rem;letter-spacing:-.01em}
.dir-sub b{color:var(--label);font-weight:600}
.hero .seg{margin-top:.875rem}

/* segmented control */
.seg{position:relative;display:inline-flex;padding:2px;border-radius:9px;background:var(--fill);isolation:isolate}
.seg button{position:relative;z-index:1;font-size:.8125rem;font-weight:500;padding:.3125rem .875rem;border-radius:7px;
  color:var(--label);transition:opacity .1s ease-out}
.seg button[aria-checked=true]{font-weight:600}
.seg button:active{opacity:.55}
.seg .thumb{position:absolute;z-index:0;top:2px;bottom:2px;left:0;border-radius:7px;background:var(--seg-thumb);
  box-shadow:0 3px 8px rgba(0,0,0,.18),0 3px 1px rgba(0,0,0,.06);will-change:transform,width}
.seg.small button{font-size:.75rem;padding:.25rem .625rem}

/* conditions: one grouped inset list */
.conditions{position:absolute;right:1rem;top:1rem;width:18.5rem;border-radius:22px;padding:.25rem 0}
.row{padding:.75rem 1rem;position:relative}
.row+.row::before{content:"";position:absolute;top:0;left:1rem;right:0;border-top:.5px solid var(--sep)}
.row-main{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem}
.row-title{font-size:.8125rem;font-weight:600;color:var(--label2);letter-spacing:.005em}
.row-value{font-size:1.25rem;font-weight:700;letter-spacing:-.02em}
.row-value small{font-size:.8125rem;font-weight:600;color:var(--label2);margin-left:.375rem;letter-spacing:0}
.row-sub{font-size:.8125rem;color:var(--label2);margin-top:.125rem}
.row .seg{margin-top:.625rem;display:flex}
.row .seg button{flex:1}
.wind{display:flex;gap:.75rem;align-items:center}
.wind>div{flex:1;min-width:0}
.compass{width:2.75rem;height:2.75rem;flex:none}
.compass circle{fill:var(--fill);stroke:none}
.compass .axis{stroke:rgba(235,235,245,.22);stroke-width:7;stroke-linecap:round}
.compass text{fill:var(--label3);font-size:13px;font-weight:600;text-anchor:middle;dominant-baseline:central}
.compass .arrow{fill:var(--label);will-change:transform}
.menu{position:relative;display:inline-flex;align-items:center}
.menu select{appearance:none;-webkit-appearance:none;font:inherit;font-size:.8125rem;font-weight:600;color:var(--tint);
  background:var(--fill);border:0;border-radius:999px;padding:.3125rem 1.625rem .3125rem .75rem;cursor:pointer}
.menu select option{color:#000}
.menu svg{position:absolute;right:.5625rem;width:.625rem;height:.625rem;color:var(--tint);pointer-events:none}

/* map controls: vertical glass stack, like Maps */
.stack{position:absolute;right:1rem;bottom:7.5rem;display:flex;flex-direction:column;border-radius:14px;overflow:hidden}
.ib{width:2.75rem;height:2.75rem;display:grid;place-items:center;color:var(--label);transition:transform .1s ease-out,background-color .15s}
.ib+.ib{border-top:.5px solid var(--sep)}
.ib svg{width:1.25rem;height:1.25rem;fill:currentColor}
.ib:active{transform:scale(.92);background:var(--fill)}
.ib[aria-pressed=true]{color:var(--tint)}
.ib .needle{will-change:transform}

.popover{position:absolute;right:4.5rem;bottom:7.5rem;width:17rem;border-radius:18px;padding:.875rem 1rem;transform-origin:100% 85%;
  will-change:transform,opacity,filter}
.popover h3{margin:0 0 .5rem;font-size:.9375rem;font-weight:700;letter-spacing:-.01em}
.lg{display:flex;align-items:center;gap:.625rem;font-size:.8125rem;padding:.25rem 0}
.lg i{flex:none;width:1.375rem;height:.5rem;border-radius:3px}
.lg .src{font-size:.6875rem;color:var(--label3);margin-top:.5rem;line-height:1.4}

/* timeline dock + scrubber */
.dock{position:absolute;left:1rem;right:1rem;bottom:1rem;border-radius:24px;display:flex;align-items:center;gap:.875rem;padding:.75rem 1.125rem .5rem .75rem}
.play{width:2.75rem;height:2.75rem;flex:none;border-radius:50%;background:var(--fill);display:grid;place-items:center;
  transition:transform .1s ease-out,background-color .15s}
.play:active{transform:scale(.92);background:var(--fill2)}
.play svg{width:1.125rem;height:1.125rem;fill:var(--label)}
.scrub{flex:1;min-width:0}
.track{position:relative;height:2.5rem;cursor:grab;touch-action:none;outline-offset:4px;border-radius:8px}
.track.dragging{cursor:grabbing}
.segs{position:absolute;left:0;right:0;top:.875rem;height:.875rem;display:flex;gap:2px}
.segs i{flex:1;border-radius:2px}
.segs i:first-child{border-radius:7px 2px 2px 7px}.segs i:last-child{border-radius:2px 7px 7px 2px}
.marks{position:absolute;left:0;right:0;top:2rem;height:3px;display:flex;gap:2px}
.marks i{flex:1;border-radius:2px}
.thumb-knob{position:absolute;top:.5rem;left:0;width:1.625rem;height:1.625rem;margin-left:-.8125rem;border-radius:50%;background:#fff;
  box-shadow:0 .5px 4px rgba(0,0,0,.12),0 6px 13px rgba(0,0,0,.35);will-change:transform}
.bubble{position:absolute;bottom:calc(100% + .375rem);left:0;padding:.3125rem .625rem;border-radius:10px;white-space:nowrap;
  font-size:.8125rem;font-weight:600;letter-spacing:-.005em;pointer-events:none;will-change:transform}
.bubble span{color:var(--label2);font-weight:500;margin-left:.375rem}
.ticks{position:relative;height:1.125rem;font-size:.6875rem;color:var(--label3);letter-spacing:.01em}
.ticks span{position:absolute;top:.0625rem;transform:translateX(-50%);white-space:nowrap}
.ticks span.day{color:var(--label2);font-weight:600}
.attrib{font-size:.6875rem;color:var(--label3);padding:.5rem 1rem .625rem;position:relative}
.attrib::before{content:"";position:absolute;top:0;left:1rem;right:0;border-top:.5px solid var(--sep)}

body.embed .dir{font-size:2.125rem;height:2.4rem}
body.embed .eyebrow{font-size:.75rem}
@media (max-width:820px){
  .conditions{width:15rem}.row{padding:.625rem .875rem}.row-value{font-size:1.0625rem}
  .dir{font-size:1.875rem;height:2.2rem}.dir-sub{font-size:.8125rem}.hero{left:1rem;top:1rem}
  .seg button{padding:.25rem .625rem}.ticks span:not(.day){display:none}
  .popover{right:4.25rem;width:15rem}
}
.caption{display:none}
body.card .hero,body.card .conditions,body.card .dock,body.card .scrim{display:none}
body.card .caption{display:flex;position:absolute;left:.75rem;top:.75rem;gap:0;border-radius:14px;padding:.5rem .25rem;pointer-events:none}
.caption span{display:flex;align-items:center;gap:.4375rem;padding:0 .875rem;font-size:.875rem;white-space:nowrap}
.caption span+span{border-left:.5px solid var(--sep)}
.caption b{font-weight:600;letter-spacing:-.01em}
.caption small{color:var(--label2);font-size:.8125rem}
.caption i{width:.625rem;height:.625rem;border-radius:3px}
body.card .stack{display:none} /* the dashboard puts its own small full-screen button on the card */
body.card .ib{width:2.375rem;height:2.375rem}
body.card .ib+.ib{border-top:0;border-left:.5px solid var(--sep)}
body.card .lbl.rwy small,body.card .lbl.rwy b.dim{display:none}
body.card .lbl.place{font-size:.6875rem;opacity:.75}
/* the dashboard card is small and the page around it already says the hour and direction: runways + buttons only */
body.card .lbl.place,body.card .lbl.ac,body.card .lbl.flow,body.card .lbl.axis,body.card .lbl.landmark,body.card .lbl.rwy .chip:not(.closed),body.card .caption{display:none}
body.card .popover{bottom:1rem}
#app.light{--label:#0b0b0b;--label2:#52514e;--label3:#8a8984;--sep:rgba(11,11,11,.09);
  --fill:rgba(11,11,11,.05);--fill2:rgba(11,11,11,.1);--tint:#0b0b0b;
  --mat:rgba(252,252,251,.78);--edge:rgba(11,11,11,.06);--bg:#f4f4f2;--seg-thumb:#fff;--chip:rgba(252,252,251,.94);
  --place:#52514e;--halo:0 0 2px #fff,0 0 6px rgba(255,255,255,.95),0 0 12px rgba(255,255,255,.8);
  --inner:rgba(255,255,255,.9);--shadow:rgba(15,23,42,.14);--scrim:244,244,242;--scrim-a:.82}
#app.light .chip{box-shadow:0 1px 3px rgba(15,23,42,.12)}
#app.light .seg .thumb{box-shadow:0 3px 8px rgba(0,0,0,.12),0 3px 1px rgba(0,0,0,.04),0 0 0 .5px rgba(0,0,0,.04)}
#app.light .thumb-knob{box-shadow:0 .5px 4px rgba(0,0,0,.12),0 6px 13px rgba(0,0,0,.12),0 0 0 .5px rgba(0,0,0,.04)}
#app.light .compass .axis{stroke:rgba(60,60,67,.2)}
#app:fullscreen{width:100vw;height:100vh}
body.bare .hero,body.bare .conditions,body.bare .dock,body.bare .scrim,body.bare .caption,body.bare #b-theme,body.bare #b-fs{display:none}
body.bare .stack{flex-direction:row;right:auto;left:calc(var(--pad-l,0px) + 1rem);bottom:calc(var(--pad-b,0px) + .75rem);border-radius:12px}
body.bare .ib{width:2.375rem;height:2.375rem}
body.bare .ib+.ib{border-top:0;border-left:.5px solid var(--sep)}
body.bare .popover{right:auto;left:calc(var(--pad-l,0px) + 1rem);bottom:calc(var(--pad-b,0px) + 3.75rem);transform-origin:0 100%}
/* live + simulated aircraft, orientation */
.lbl.ac{display:flex;align-items:center;gap:.3125rem;font-size:.6875rem;font-weight:600;letter-spacing:.01em;padding:.0625rem .4375rem;
  border-radius:6px;background:var(--chip);text-shadow:none;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.lbl.ac i,.aclegend i,.lbl.flow i{width:.5rem;height:.5rem;border-radius:50%;flex:none}
.lbl.cmp{font-size:1.375rem;font-weight:700;color:var(--label3);letter-spacing:.04em}
.lbl.landmark{font-size:.75rem;font-weight:600;color:var(--label2);letter-spacing:.01em}
.lbl.axis{display:flex;align-items:center;gap:.25rem;font-size:.75rem;font-weight:700;letter-spacing:.14em;color:var(--label2)}
.lbl.axis svg,.lbl.flow svg{width:1rem;height:1rem;transform:rotate(var(--a,0deg))}
.lbl.flow{display:flex;align-items:center;gap:.4375rem;font-size:.8125rem;font-weight:600;padding:.25rem .5rem .25rem .625rem;border-radius:999px;
  background:var(--chip);text-shadow:none;box-shadow:0 1px 4px rgba(0,0,0,.15)}
.actip{position:absolute;left:0;top:0;z-index:5;max-width:20rem;padding:.5rem .75rem;border-radius:12px;pointer-events:none;font-size:.8125rem;line-height:1.35}
.actip b{display:block;font-size:.875rem}.actip span{display:block;color:var(--label2)}.actip small{display:block;color:var(--label3);font-size:.6875rem;margin-top:.125rem}
.aclegend{position:absolute;left:1rem;bottom:7.5rem;display:flex;align-items:center;gap:.75rem;padding:.375rem .75rem;border-radius:12px;font-size:.75rem;
  color:var(--label2);white-space:nowrap;pointer-events:none}
.aclegend span{display:flex;align-items:center;gap:.3125rem}
.aclegend b{font-size:.6875rem;letter-spacing:.06em;text-transform:uppercase;color:var(--label)}
.aclegend b.on::before,.livebadge i{content:"";display:inline-block;width:.4375rem;height:.4375rem;border-radius:50%;background:#0ca30c;margin-right:.3125rem;vertical-align:.05em}
.aclegend b.stale::before{content:"";display:inline-block;width:.4375rem;height:.4375rem;border-radius:50%;background:#fab219;margin-right:.3125rem}
.aclegend b.sim{color:var(--label2)}
.livebadge{position:absolute;left:1.5rem;top:12.5rem;display:flex;align-items:center;font-size:.8125rem;font-weight:600;padding:.375rem .75rem;border-radius:999px;
  color:var(--label2);transition:transform .1s ease-out}
.livebadge.on{color:var(--label)}.livebadge.stale i{background:#fab219}.livebadge:active{transform:scale(.96)}
.livebadge[hidden],.actip[hidden]{display:none}
.rose{position:absolute;right:1rem;bottom:25rem;width:4.25rem;height:4.25rem;border-radius:50%;display:grid;place-items:center;pointer-events:none}
.rose b{position:absolute;font-size:.6875rem;font-weight:700;color:var(--label2);will-change:transform}
.rose b[data-d=N]{color:#d03b3b}
.rose i{position:absolute;width:2px;height:1.5rem;border-radius:1px;background:linear-gradient(#d03b3b 50%,var(--label3) 50%);will-change:transform}
body.bare .rose{right:auto;left:calc(var(--pad-l,0px) + 1rem);bottom:calc(var(--pad-b,0px) + 3.75rem)}
body.card .rose{right:.5rem;left:auto;top:.5rem;bottom:auto;transform:scale(.75);transform-origin:100% 0}
body.card .aclegend,body.card .livebadge{display:none}
body.bare .aclegend{left:calc(var(--pad-l,0px) + 1rem + 13rem);bottom:calc(var(--pad-b,0px) + .875rem)}
@media (prefers-reduced-transparency:reduce){
  #app{--mat:#1c1c1e;--mat-blur:none}#app.light{--mat:#fff}
}
@media (prefers-contrast:more){
  #app{--edge:rgba(255,255,255,.45);--label2:rgba(235,235,245,.85);--label3:rgba(235,235,245,.6);--sep:rgba(160,160,170,.8)}
}
`;
