// Quiet solid panels over the scene, IBM Plex Sans / Mono like the dashboard, springs do the motion (no CSS keyframes).
export const css = () => `
/* one rule per selector and breakpoint where the cascade allows (consolidated) */
#app{--label:#f0efec;--label2:#c3c2b7;--label3:#8f8e88;--sep:rgba(240,239,236,.1);--fill:rgba(240,239,236,.07);--fill2:rgba(240,239,236,.13);--tint:#f0efec;--mat:#1c1c1e;--mat-blur:none;--edge:rgba(240,239,236,.08);--bg:#0e0e0d;--ok:#3f7a52;--night:#3a3a38;--seg-thumb:#3a3a37;--chip:rgba(20,20,19,.82);--place:rgba(240,239,236,.75);--halo:0 1px 3px rgba(0,0,0,.9),0 0 10px rgba(0,0,0,.6);--inner:rgba(255,255,255,.16);--shadow:rgba(0,0,0,.45);--scrim:14,14,13;--scrim-a:.78;position:fixed;inset:0;overflow:hidden;background:var(--bg);color:var(--label);transition:background-color .3s;font:400 15px/1.4 "IBM Plex Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:0;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums;user-select:none}
#app canvas{display:block;touch-action:none}
:where(#app) button{font:inherit;color:inherit;border:0;background:none;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
#app :focus-visible{outline:2px solid var(--tint);outline-offset:2px}
.scrim{position:absolute;left:0;right:0;pointer-events:none;z-index:-1}
.scrim.top{top:0;height:11rem;background:linear-gradient(rgba(var(--scrim),var(--scrim-a)),rgba(var(--scrim),0))}
.scrim.bottom{bottom:0;height:9rem;background:linear-gradient(rgba(var(--scrim),0),rgba(var(--scrim),calc(var(--scrim-a) - .06)))}
.labels{position:absolute;inset:0;pointer-events:none;z-index:2}
.lbl{position:absolute;left:0;top:0;white-space:nowrap;text-shadow:var(--halo)}
.lbl.place{font-size:13px;font-weight:600;color:var(--label);letter-spacing:0}
.lbl.rwy{font-size:13px}
.lbl.rwy b{font-weight:600;letter-spacing:-.01em}
.lbl.rwy b.dim{color:var(--label3);font-weight:600}
.lbl.rwy small{font-size:11px;color:var(--label2);letter-spacing:.01em}
.chip{font-style:normal;font-size:11px;font-weight:600;letter-spacing:.01em;padding:.125rem .5rem .125rem .4375rem;border-radius:999px;background:var(--chip);text-shadow:none;display:inline-flex;align-items:center;gap:.3125rem}
.chip::before{content:"";width:.375rem;height:.375rem;border-radius:50%;background:currentColor}
.chip.arr{color:var(--arr)}
.chip.dep{color:var(--dep)}
.chip.closed{color:var(--closed)}
.hud{position:absolute;inset:0;pointer-events:none;z-index:3}
.hud .panel,.hud button,.hud .seg,.hud .track,.hud select{pointer-events:auto}
.panel{background:var(--mat);-webkit-backdrop-filter:var(--mat-blur);backdrop-filter:var(--mat-blur);border:.5px solid var(--edge);box-shadow:inset 0 .5px 0 var(--inner),0 18px 50px var(--shadow)}
.hero{left:1.5rem;top:1.25rem}
.eyebrow{font-size:13px;font-weight:600;color:var(--label2);letter-spacing:.005em}
.dir{height:2.9rem;font-size:36px;line-height:1.05;font-weight:600;letter-spacing:-.01em}
.dir span{white-space:nowrap}
.dir span i{display:inline-block;width:.38em;height:.38em;border-radius:.1em;margin-right:.24em;vertical-align:.14em}
.dir-sub{font-size:15px;color:var(--label2);margin-top:.25rem;letter-spacing:-.01em}
.dir-sub b{color:var(--label);font-weight:600}
.dir-sub .dot-live,.dir-sub .dot-stale{display:inline-block;width:.5rem;height:.5rem;border-radius:50%;margin-right:.375rem;vertical-align:.08em;background:#2e9d54}
.dir-sub .dot-stale{background:var(--label3)}
.dir-sub .late{display:inline-flex;align-items:center;gap:.375rem;padding:.1875rem .5rem;border-radius:6px;background:#fdecea;color:#a3271d;font-weight:500}
.dir-sub .late svg{width:.875rem;height:.875rem}
#app:not(.light) .dir-sub .late{background:#3a1d1a;color:#ffb4ab}
.dir-next{font-size:15px;color:var(--label);margin-top:.25rem;font-weight:500}
.dir-next+.dir-sub{margin-top:.375rem;font-size:13px}
.dir-next b{font-weight:600}
.seg{position:relative;display:inline-flex;padding:2px;border-radius:9px;background:var(--fill);isolation:isolate}
.seg button{position:relative;z-index:1;font-size:13px;font-weight:500;padding:.3125rem .875rem;border-radius:7px;color:var(--label);transition:opacity .1s ease-out}
.seg button[aria-checked=true]{font-weight:600}
.seg button:active{opacity:.55}
.seg .thumb{position:absolute;z-index:0;top:2px;bottom:2px;left:0;border-radius:7px;background:var(--seg-thumb);box-shadow:0 3px 8px rgba(0,0,0,.18),0 3px 1px rgba(0,0,0,.06);will-change:transform,width}
.seg.small button{font-size:13px;padding:.25rem .625rem}
.conditions{width:18.5rem}
.row{padding:.75rem 1rem;position:relative}
.row+.row::before{content:"";position:absolute;top:0;left:1rem;right:0;border-top:.5px solid var(--sep)}
.row-main{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem}
.row-title{font-size:13px;font-weight:600;color:var(--label2);letter-spacing:.005em}
.row-value{font-size:18px;font-weight:600;letter-spacing:-.01em}
.row-value small{font-size:13px;font-weight:600;color:var(--label2);margin-left:.375rem;letter-spacing:0}
.row-sub{font-size:13px;color:var(--label2);margin-top:.125rem}
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
.menu select{font:inherit;font-size:13px;font-weight:600;color:var(--tint);cursor:pointer}
.menu select option{color:#000}
.menu svg{position:absolute;right:.5625rem;width:.625rem;height:.625rem;color:var(--tint);pointer-events:none}
.stack{display:flex}
.stack .ib:first-child{border-radius:14px 14px 0 0}
.stack .ib:last-child{border-radius:0 0 14px 14px}
.ib[data-tip]:hover::after,.ib[data-tip]:focus-visible::after{content:attr(data-tip);position:absolute;right:calc(100% + .5rem);top:50%;transform:translateY(-50%);white-space:nowrap;padding:.3125rem .625rem;border-radius:8px;background:var(--chip);color:var(--label);font-size:13px;font-weight:500;box-shadow:0 2px 8px var(--shadow);pointer-events:none}
.ib{position:relative;width:2.75rem;height:2.75rem;display:grid;place-items:center;color:var(--label);transition:transform .1s ease-out,background-color .15s}
.ib+.ib{border-top:.5px solid var(--sep)}
.ib svg{width:1.25rem;height:1.25rem;fill:currentColor}
.ib:active{transform:scale(.92);background:var(--fill)}
.ib[aria-pressed=true]{color:var(--tint)}
.ib .needle{will-change:transform}
.popover{position:absolute;right:4.5rem;bottom:7.5rem;width:17rem;border-radius:18px;padding:.875rem 1rem;transform-origin:100% 85%;will-change:transform,opacity,filter}
.popover h3{margin:0 0 .5rem;font-size:15px;font-weight:600;letter-spacing:-.01em}
.lg{display:flex;align-items:center;gap:.625rem;font-size:13px;padding:.25rem 0}
.lg i{flex:none;width:1.375rem;height:.5rem;border-radius:3px}
.lg .src{font-size:11px;color:var(--label3);margin-top:.5rem;line-height:1.4}
.dock{left:1rem;right:1rem;bottom:1rem;border-radius:24px;display:flex;padding:.75rem 1.125rem .5rem .75rem}
.play{background:var(--fill)}
.play:active{transform:scale(.92);background:var(--fill2)}
.scrub{flex:1;min-width:0}
.track{height:2.5rem;cursor:grab}
.track.dragging{cursor:grabbing}
.segs{height:.875rem}
.segs i{border-radius:2px}
.segs i:first-child{border-radius:7px 2px 2px 7px}
.segs i:last-child{border-radius:2px 7px 7px 2px}
.marks{left:0;right:0;top:1.9375rem;display:flex}
.nights{height:2.5rem}
.nights span{position:absolute;left:.25rem;top:.0625rem;font-size:11px;font-weight:500;color:var(--label3);white-space:nowrap}
.nowline{position:absolute;top:0;bottom:-1.25rem}
.ticks span.nowtick{transform:translateX(5px);color:var(--label);font-weight:600;top:.0625rem}
.dkey{display:grid;grid-template-columns:repeat(3,auto);gap:.25rem .625rem;margin-bottom:1rem;font-size:11px;color:var(--label2);white-space:nowrap;flex:none;align-self:center}
.dkey span{display:flex;align-items:center;gap:.3125rem}
.dkey i{width:.625rem;height:.625rem;border-radius:2px}
body.card .dkey{display:none}
.seg button:disabled{opacity:.38;cursor:not-allowed;text-decoration:line-through}
.when{font-size:13px;color:var(--label2)}
.when b{color:var(--label);font-weight:600}
.rowlbl{font-size:11px;color:var(--label2);white-space:nowrap}
body.card .rowlbl{display:none}
.segs,.marks{z-index:1}
.marks i{flex:1;border-radius:2px}
.thumb-knob{position:absolute;top:.5rem;left:0;width:1.625rem;height:1.625rem;margin-left:-.8125rem;border-radius:50%;background:#fff;box-shadow:0 .5px 4px rgba(0,0,0,.12),0 6px 13px rgba(0,0,0,.35)}
.bubble{white-space:nowrap;font-size:13px;font-weight:600;letter-spacing:-.005em}
.bubble span{color:var(--label2);font-weight:500;margin-left:.375rem}
.ticks{font-size:11px;color:var(--label3);letter-spacing:.01em}
.ticks span{position:absolute;top:.0625rem;transform:translateX(-50%);white-space:nowrap}
.ticks span.day{color:var(--label2);font-weight:600}
.ticks span.start{left:0;transform:none;color:var(--label2);font-weight:600}
.attrib{right:1rem;bottom:6.25rem;font-size:11px;color:var(--label2);pointer-events:none;white-space:nowrap}
body.card .attrib{display:none}
body.embed .dir{font-size:36px;height:2.4rem}
body.embed .eyebrow{font-size:13px}
@media (max-width:820px){
  .conditions{width:15rem}
  .row{padding:.625rem .875rem}
  .row-value{font-size:18px}
  .dir{font-size:36px;height:2.2rem}
  .dir-sub{font-size:13px}
  .hero{left:1rem;top:1rem}
  .seg button{padding:.25rem .625rem}
  .ticks span:not(.day){display:none}
  .popover{right:4.25rem;width:15rem}
}
.caption{display:none}
body.card .hero,body.card .conditions,body.card .dock,body.card .scrim{display:none}
body.card .caption{display:flex;position:absolute;left:.75rem;top:.75rem;gap:0;border-radius:14px;padding:.5rem .25rem;pointer-events:none}
.caption span{display:flex;align-items:center;gap:.4375rem;padding:0 .875rem;font-size:15px;white-space:nowrap}
.caption span+span{border-left:.5px solid var(--sep)}
.caption b{font-weight:600;letter-spacing:-.01em}
.caption small{color:var(--label2);font-size:13px}
.caption i{width:.625rem;height:.625rem;border-radius:3px}
body.card .stack{display:none}
body.card .ib{width:2.375rem;height:2.375rem}
body.card .ib+.ib{border-top:0;border-left:.5px solid var(--sep)}
body.card .lbl.rwy small,body.card .lbl.rwy b.dim{display:none}
body.card .lbl.place{font-size:11px;opacity:.75}
body.card .lbl.cmp,body.card .lbl.place,body.card .lbl.ac,body.card .lbl.flow,body.card .lbl.axis,body.card .lbl.landmark,body.card .lbl.rwy .chip:not(.closed),body.card .caption{display:none}
body.card .popover{bottom:1rem}
#app.light{--label:#0b0b0b;--label2:#52514e;--label3:#6b6a66;--sep:rgba(11,11,11,.09);--fill:rgba(11,11,11,.05);--fill2:rgba(11,11,11,.1);--tint:#0b0b0b;--mat:#fff;--edge:rgba(11,11,11,.06);--bg:#eceeef;--ok:#7cc392;--night:#c9c8c3;--seg-thumb:#fff;--chip:rgba(252,252,251,.94);--place:#52514e;--halo:0 0 2px #fff,0 0 6px rgba(255,255,255,.95),0 0 12px rgba(255,255,255,.8);--inner:rgba(255,255,255,.9);--shadow:rgba(15,23,42,.14);--scrim:244,244,242;--scrim-a:.82}
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
.lbl.ac{display:flex;align-items:center;gap:.3125rem;font-size:11px;font-weight:600;letter-spacing:.01em;padding:.0625rem .4375rem;border-radius:6px;background:var(--chip);text-shadow:none;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.lbl.ac i,.aclegend i,.lbl.flow i{width:.5rem;height:.5rem;border-radius:50%;flex:none}
.lbl.cmp{font-size:24px;font-weight:600;color:var(--label3);letter-spacing:.04em}
.lbl.landmark{font-size:13px;font-weight:600;color:var(--label2);letter-spacing:.01em}
.lbl.axis{display:flex;align-items:center;gap:.25rem;font-size:13px;font-weight:600;letter-spacing:.02em;color:var(--label2)}
.lbl.axis svg,.lbl.flow svg{width:1rem;height:1rem;transform:rotate(var(--a,0deg))}
.lbl.flow{display:flex;align-items:center;gap:.4375rem;font-size:13px;font-weight:600;padding:.25rem .5rem .25rem .625rem;border-radius:999px;background:var(--chip);text-shadow:none;box-shadow:0 1px 4px rgba(0,0,0,.15)}
.actip{position:absolute;left:0;top:0;z-index:5;max-width:20rem;padding:.5rem .75rem;border-radius:12px;pointer-events:none;font-size:13px;line-height:1.35}
.actip b{display:block;font-size:15px}
.actip span{display:block;color:var(--label2)}
.actip small{display:block;color:var(--label3);font-size:11px;margin-top:.125rem}
.aclegend{display:flex;font-size:13px;color:var(--label2);white-space:nowrap}
.aclegend span{display:flex;align-items:center;gap:.3125rem}
.aclegend b{font-size:13px;color:var(--label)}
.aclegend b.on::before,.livebadge i{content:"";display:inline-block;width:.4375rem;height:.4375rem;border-radius:50%;background:#0ca30c;margin-right:.3125rem;vertical-align:.05em}
.aclegend b.stale::before{content:"";display:inline-block;width:.4375rem;height:.4375rem;border-radius:50%;background:#fab219;margin-right:.3125rem}
.aclegend b.sim{color:var(--label2)}
.livebadge{position:absolute;left:1.5rem;top:12.5rem;display:flex;align-items:center;font-size:13px;font-weight:600;padding:.375rem .75rem;border-radius:999px;color:var(--label2);transition:transform .1s ease-out}
.livebadge.on{color:var(--label)}
.livebadge.stale i{background:#fab219}
.livebadge:active{transform:scale(.96)}
.livebadge[hidden],.actip[hidden]{display:none}
.rose{position:absolute;left:1rem;bottom:10.25rem;transition:opacity .3s;width:4.25rem;height:4.25rem;border-radius:50%;display:grid;place-items:center;pointer-events:none}
.rose b{position:absolute;font-size:11px;font-weight:600;color:var(--label2);will-change:transform}
.rose b[data-d=N]{color:#d03b3b}
#app:not(.light) .rose b[data-d=N]{color:#ef5b4f} /* dark: the lighter red, >= 4.5:1 on the scene */
.rose i{position:absolute;width:2px;height:1.5rem;border-radius:1px;background:linear-gradient(#d03b3b 50%,var(--label3) 50%);will-change:transform}
body.bare .rose{right:auto;left:calc(var(--pad-l,0px) + 1rem);bottom:calc(var(--pad-b,0px) + 3.75rem)}
body.card .rose{right:.5rem;left:auto;top:.5rem;bottom:auto;transform:scale(.75);transform-origin:100% 0}
body.card .aclegend,body.card .livebadge{display:none}
body.bare .aclegend{left:calc(var(--pad-l,0px) + 1rem + 13rem);bottom:calc(var(--pad-b,0px) + .875rem)}
@media (prefers-reduced-transparency:reduce){
  #app{--mat:#1c1c1e;--mat-blur:none}
  #app.light{--mat:#fff}
}
@media (prefers-contrast:more){
  #app{--edge:rgba(255,255,255,.45);--label2:rgba(235,235,245,.85);--label3:rgba(235,235,245,.6);--sep:rgba(160,160,170,.8)}
}
.lbl.ac::after{content:"";position:absolute;left:50%;top:100%;width:1px;height:14px;background:var(--label3);opacity:.7}
.ground{font-size:15px;line-height:1.45;color:var(--label2)}
.seg[hidden],.ib[hidden]{display:none}
.aclegend b{letter-spacing:0;font-weight:600;color:var(--label)}
.aclegend .off{color:var(--label3)}
.acring{position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;box-shadow:0 0 0 2px var(--label);pointer-events:none}
.acring[hidden]{display:none}
.chip{color:var(--label2)}
.chip::before{display:none}
.nowline::after{left:5px;top:-.0625rem;font-size:11px;font-weight:600;color:var(--label)}
.dkey{grid-template-columns:repeat(4,auto)}
.dkey .lessk{background:repeating-linear-gradient(135deg,var(--east) 0 2px,rgba(255,255,255,.7) 2px 4px)}
.dkey .closedk{background:var(--closed)}
.dkey .riskk{background:repeating-linear-gradient(135deg,var(--closed) 0 2px,transparent 2px 4px);box-shadow:inset 0 0 0 1px var(--closed)}
.ticks span.day{transform:translateX(3px)}
.play svg{fill:var(--label);width:.875rem;height:.875rem}
.stack .ib{height:2rem;display:flex;align-items:center;gap:.375rem;padding:0 .75rem;font-size:13px;font-weight:500;white-space:nowrap}
.stack .ib svg{width:.875rem;height:.875rem}
.stack .ib+.ib{border-top:0;border-left:.5px solid var(--sep)}
.stack .ib:first-child{border-radius:12px 0 0 12px}
.stack .ib:last-child{border-radius:0 12px 12px 0}
.attrib{bottom:.125rem;right:1rem;font-size:11px}
.row.run{padding-top:.5rem;padding-bottom:.5rem}
.row.run .row-title{font-weight:500;color:var(--label3)}
.row.run .menu select{font-size:13px;background:transparent;color:var(--label2)}
.stack .ib[hidden]{display:none}
.row-sub .pilot{display:block;margin-top:.25rem;font-size:13px;color:var(--label3)}
.lbl.place,.lbl.landmark{display:none}
.lbl.town{font-size:15px;font-weight:600;color:var(--label);text-shadow:var(--halo)}
.lbl.ptag{font-size:13px;font-weight:600;color:var(--label2);text-shadow:var(--halo);white-space:nowrap}
.lbl.parrow svg{width:1.375rem;height:1.375rem;transform:rotate(var(--a,0deg));filter:drop-shadow(0 0 2px var(--bg))}
body.card .lbl.town{font-size:11px}
body.card .lbl.ptag,body.card .lbl.river,body.card .lbl.rwy{display:none}
.marks i.o{background:var(--fill2)} /* open: a plain cell, as on the dashboard (an outlined pill read as a "0" at phone widths) */
.marks i.n{opacity:.7} /* night ban: the hour's state, dimmed (dashboard: .l18 .n) */
#app:not(.light) .marks i.o{background:#4a4b50} /* dark: open hours >= 1.5:1 on the card, as on the dashboard */
.marks i.x{background:var(--closed)}
.marks i.r{background:repeating-linear-gradient(135deg,var(--closed) 0 2px,transparent 2px 4px);box-shadow:inset 0 0 0 1px var(--closed)}
.dkey .openk{background:var(--mat);box-shadow:inset 0 0 0 1px var(--label3)}
.dkey{grid-template-columns:repeat(2,auto)}
.nights span{font-size:11px;font-weight:600;color:var(--label2)}
.ticks span.end{left:auto;right:0;transform:none;color:var(--label2);font-weight:600}
.conditions{position:absolute;right:1rem;top:1rem;border-radius:22px;padding:.25rem 0;width:16.5rem}
.row-value{font-size:15px;font-weight:600}
.row-value small{font-weight:400}
details{font-size:13px;color:var(--label3);margin-top:.25rem}
details summary{cursor:pointer;color:var(--label2);font-weight:500;list-style:none}
.row.how{font-size:13px;line-height:1.45}
.compass{display:none}
.aclegend:empty{display:none}
.dir{position:relative;margin-top:.125rem;font-size:36px;height:2.5rem}
.dir-next{font-weight:400;line-height:1.45}
.ground{font-size:13px;color:var(--label3)}
.lbl.town{font-size:13px;font-weight:500;color:var(--label);text-shadow:var(--halo)}
.lbl.town i{position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:50%;background:var(--label);box-shadow:0 0 0 2px var(--bg)}
.lbl.town span{white-space:nowrap;line-height:18px}
.lbl.town[data-side=r] span{left:10px;top:-9px}
.lbl.town[data-side=l] span{right:10px;top:-9px}
.lbl.town[data-side=t] span{left:0;top:-27px;transform:translateX(-50%)}
.lbl.town[data-side=rd] span{left:10px;top:4px}
.lbl.town[data-side=ru] span{left:10px;top:-22px}
.lbl.town[data-side=ld] span{right:10px;top:4px}
.lbl.town[data-side=lu] span{right:10px;top:-22px}
.lbl.town[data-side=b] span{left:0;top:9px;transform:translateX(-50%)}
.lbl.river{font-size:13px;font-style:italic;font-weight:500;color:#5a7fa6}
body.card .lbl.river{display:none}
.row-value{font-weight:500}
.segs{height:.75rem}
.segs i:first-child,.segs i:last-child{border-radius:2px}
.risk{left:0;right:0;top:1.75rem;height:.75rem}
.risk .base{stroke:var(--sep);stroke-width:1}
.marks{top:2.625rem}
.marks[hidden],.rowlbl span[hidden]{display:none}
.track{height:3.125rem}
.nights{height:3.125rem}
.dock{padding-top:2.5rem}
.dkey .riskk2{height:.375rem;background:color-mix(in srgb,var(--c) 35%,transparent);box-shadow:inset 0 1px 0 var(--c)}
.play{font-size:13px;font-weight:500;color:var(--label)}
.attrib{left:1rem;right:auto;bottom:9.25rem}
details summary::before{content:"";display:inline-block;width:.375rem;height:.375rem;margin-right:.375rem;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);vertical-align:.1em;transition:transform .15s}
details[open] summary::before{content:"";transform:rotate(45deg)}
.menu select{appearance:none;-webkit-appearance:none;border:0;padding:.3125rem 1.625rem .3125rem .75rem;background:var(--fill)!important;color:var(--label)!important;border-radius:8px}
.row.wind .row-sub{margin-top:.25rem}
.risk{height:1rem}
.marks{top:2.875rem}
.dir-next{font-size:15px}
.dir-next b{font-weight:600}
.ground{font-size:13px;color:var(--label2)}
.lbl.ptag{color:var(--label)!important;font-weight:500}
.risk{height:1rem}
.risk .lim{stroke:var(--closed);stroke-width:1;stroke-dasharray:3 3;vector-effect:non-scaling-stroke}
.pgmark{position:absolute;top:.75rem;height:1rem;pointer-events:auto}
.pgmark span{position:absolute;right:0;top:-1.05rem;font-size:11px;font-weight:600;color:var(--label);white-space:nowrap}
.pgmark[hidden]{display:none}
.dkey .limk{height:.375rem;background:transparent;border-top:1.5px dashed var(--closed)}
.play{flex:none;place-items:center;transition:transform .1s ease-out,background-color .15s;width:auto;height:2rem;padding:0 .75rem;border-radius:10px;gap:.375rem;display:none}
.row.how{font-size:11px;color:var(--label3);line-height:1.4}
.risk{height:2rem;top:1.75rem}
.risk .grid{stroke:var(--sep);stroke-width:1}
.risk .zone{fill:rgba(208,59,59,.35)}
.marks{top:4rem}
.rowlbl small{display:block;font-size:11px;color:var(--label3)}
.aclegend .pl{width:1.5rem;height:0;border-radius:0;background:transparent;border-top:3px dashed var(--c)}
.aclegend .pl.solid{border-top:2px solid var(--label)}
.aclegend:empty{display:none}
.attrib{bottom:12.75rem}
.dir-next .flag{display:block;margin-top:.5rem;border-radius:8px;background:var(--fill);font-size:15px}
.risk[hidden],.rowlbl span[hidden]{display:none}
.marks{top:2rem}
.lbl.river{display:none}
.attrib{left:1rem;right:auto;bottom:.25rem;font-size:11px}
.ticks span.end{font-weight:500;font-size:11px}
.hero{position:absolute;background:var(--mat);border-radius:16px;padding:.875rem 1.125rem 1rem;box-shadow:0 1px 3px rgba(0,0,0,.08),0 0 0 1px var(--edge);max-width:34rem;pointer-events:auto}
.ground{max-width:30rem;font-size:15px;color:var(--label);margin-top:.125rem;font-weight:500}
.dir-next{max-width:38rem;line-height:1.5;font-size:15px;color:var(--label2);margin-top:.375rem}
.dir-next .flag{display:block;margin-top:.5rem;border-radius:0;background:transparent;border-left:3px solid #e08a00;color:var(--label)}
.dir-next .flag.ok{border-left-color:var(--sep)}
.badge{display:inline-flex;align-items:center;gap:.375rem;padding:.0625rem .625rem .0625rem .5rem;border-radius:999px;background:var(--fill);font-size:15px;font-weight:500}
.badge::before{background:var(--label3)}
.badge.closed::before{background:var(--closed)}
.lbl.river{text-shadow:var(--halo);display:block;font-size:13px;font-style:italic;color:#5a7fa6}
.lbl.windtag{display:flex;font-size:13px;font-weight:600;color:var(--label);text-shadow:var(--halo)}
.lbl.windtag svg{width:2.25rem;height:2.25rem;transform:rotate(var(--a,0deg));stroke-width:2}
body.card .lbl.windtag span{display:none}
.aclegend .cred{color:var(--label3);font-size:11px}
.rail{left:1rem;top:1rem;bottom:10.5rem;width:22rem;gap:.75rem;overflow:auto}
.rail>*{pointer-events:auto}
.rail .conditions{position:static;width:auto;flex:none}
body.card .rail{display:none}
.lbl.town.under{font-weight:700}
.row.wind>*:not(.wcomp):not(.wcomp-t){grid-column:2}
.wcomp i{position:absolute;left:50%;top:50%;margin:-.875rem 0 0 -1px;transform:rotate(var(--wd,0deg));border-radius:1px}
.wcomp i::after{position:absolute;left:-4px;bottom:-1px;border:5px solid transparent;border-top:7px solid var(--label);border-bottom:0}
.wcomp b{position:absolute;top:-.15rem;left:50%;transform:translateX(-50%);font-size:11px;color:var(--closed)}
.wcomp-t{font-size:11px;color:var(--label2);margin-top:.25rem}
.lbl.windtag{align-items:center;gap:.5rem;display:none}
.segs i{flex:1;border-radius:0}
.segs i:first-child{border-radius:4px 0 0 4px}
.segs i:last-child{border-radius:0 4px 4px 0}
.dir-next .flag{padding:.125rem 0 .125rem .625rem;border-left-color:var(--sep);color:var(--label2)}
.dir-next b{color:var(--label);font-weight:600}
.badge::before{background:#2e9d54}
.rail{bottom:auto;overflow:visible}
.attrib{left:auto;right:1rem;top:.5rem;bottom:auto;font-size:11px;color:var(--label3)}
.row.wind{grid-template-columns:2.5rem 1fr;column-gap:.75rem;display:block}
.wcomp i{position:absolute;left:50%;top:50%;width:1.5px;height:.875rem;margin:-.4375rem 0 0 -.75px;background:var(--label);transform:rotate(var(--wd,0deg))}
.wcomp i::after{content:"";position:absolute;left:-3px;bottom:-1px;border:3.75px solid transparent;border-top:5px solid var(--label);border-bottom:0}
.wcomp-t{grid-column:1;text-align:center;display:none}
.risk{top:2rem;height:.75rem}
.risk .base{stroke:var(--sep)}
.track,.nights{height:3rem}
.nights{height:2.25rem}
.rail{overflow:auto}
.aclegend .ring{width:.625rem;height:.625rem;border-radius:50%;background:var(--bg);box-shadow:0 0 0 2px var(--east)}
.lbl.town{display:block;width:0;height:0;color:var(--label)}
.rail{overflow:visible;gap:.5rem;width:21rem}
.rail .hero{padding:.75rem 1rem .875rem}
.rail .dir{font-size:24px;height:2.1rem}
.rail .ground{font-size:15px}
.rail .dir-next{font-size:13px;margin-top:.25rem}
.rail .dir-next .flag{font-size:13px}
.rail .row{padding:.5rem 1rem}
.rail .row-sub{margin-top:0}
.rail .row.how{padding:.375rem 1rem}
.rail .row.run{padding:.375rem 1rem}
.rail .row-sub:empty{display:none}
.lbl.rwy{align-items:center;gap:.375rem;display:flex;font-size:13px}
.lbl.rwy b{padding:.0625rem .3125rem;border-radius:4px;font-weight:600;letter-spacing:.01em;text-shadow:none;background:#55575d!important;color:#fff!important}
body.card .lbl.rwy{display:none}
.lbl.town:not(.under){font-size:13px;font-weight:400}
.segs i.pgc{box-shadow:none;outline-offset:-2px;outline:none}
.segs i.lo{opacity:.5}

@media (min-width:640px){.dock{grid-template-columns:0 124px minmax(0,1fr)!important;column-gap:12px!important}} /* the dashboard's gutter: the plot starts 160 px in */
#app:not(.light) .dkey .lessk{box-shadow:0 0 0 1px rgba(255,255,255,.35)}
.dkey .lessk{background:var(--east);opacity:.5}
.dkey .nightk{background:repeating-linear-gradient(135deg,#d6d5d0 0 2px,#ecebe7 2px 4px)}
.pgmark{top:.375rem;height:.375rem;background:none}
.ticks span.day::before{position:absolute;left:-3px;top:-.25rem}
.hero .dash{display:inline-block;font-size:13px;font-weight:500;color:var(--label2);text-decoration:underline;text-decoration-color:var(--sep);text-underline-offset:3px}
.hero .dash:hover{color:var(--label);text-decoration-color:currentColor}
body.embed .hero .dash{display:none}
.bubble,.ticks,.caption,.row-value,.dkey{font-variant-numeric:tabular-nums}
.dkey{display:flex;flex-direction:column;align-items:flex-start;gap:.25rem}
#app:not(.light) .dkey .nightk{background:repeating-linear-gradient(135deg,rgba(127,127,127,.5) 0 2px,transparent 2px 4px)}
.risknext{margin-top:.5rem}
.rchip{display:inline-flex;align-items:center;background:var(--fill2);color:var(--label);font-size:13px;font-weight:600}
.rchip.hi{background:var(--east);color:#fff}
.acc{margin-top:.5rem;font-size:13px;color:var(--label2);cursor:help}
.acc b{color:var(--label);font-weight:600}
.acc:empty{display:none}
.howpg:empty{display:none}
.more{display:none}
.rail .dir-next .flag{margin-top:.375rem;display:none}
.risk{top:2rem;height:2.25rem}
.risk .grid{stroke:var(--sep);stroke-width:1;stroke-dasharray:2 2}
.risk .base{stroke:var(--label3);stroke-opacity:.35;stroke-width:1;vector-effect:non-scaling-stroke}
.rgl{right:0;top:calc(2rem + 1.125rem - .5625rem);font-size:11px;line-height:1;color:var(--label3)}
.marks{top:4.625rem}
.track{height:5.125rem}
.nights{height:4.625rem}
.track:not(:has(.marks:not([hidden]))){height:4.5rem}
.nights span{top:-.875rem;display:none}
.rowlbl>span{line-height:1.1}
.rowlbl #r18-l:not([hidden]){height:1rem;margin-top:.375rem;display:flex;align-items:center}
.lbl.windind{text-shadow:none;font-size:13px;line-height:1.3;color:var(--label2)}
.lbl.windind:empty{display:none}
.lbl.windind b{color:var(--label);font-weight:600}
.lbl.windind svg{width:1.75rem;height:1.75rem;flex:none;fill:none;stroke:var(--label);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transform:rotate(var(--a,0deg))}
body.card .lbl.windind span{display:none}
@media (max-width:639px){
  .rail{left:.5rem;right:.5rem;top:.5rem}
  .rail .hero{padding:.625rem .875rem .75rem}
  .rail .eyebrow{font-size:11px}
  .rail .dir{font-size:24px;height:1.85rem}
  .rail .ground{font-size:13px}
  .hero .seg{display:none}
  .more{display:block;margin-top:.5rem;font-size:13px;font-weight:500;color:var(--label2);text-decoration:underline;text-decoration-color:var(--sep);text-underline-offset:3px}
  .rail .conditions{display:none}
  #app.sheet .rail .conditions{display:block;position:fixed;left:.5rem;right:.5rem;bottom:calc(var(--dock-h,11rem) + 1rem);top:auto;height:auto;min-height:0;max-height:45vh;overflow:auto;z-index:6}
  .aclegend,.rose{display:none}
  .stack{display:none}
  .attrib{top:auto;bottom:.125rem;left:.5rem;right:.5rem;white-space:normal;text-align:center;font-size:11px}
  .dock{left:.5rem;right:.5rem;bottom:1rem;display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:.5rem;padding:2.25rem .75rem .5rem .625rem}
  .dock .rowlbl{grid-column:1;grid-row:1;font-size:11px}
  .rowlbl small{display:none}
  .dock .scrub{grid-column:2;grid-row:1}
  .dock .dkey{grid-column:1/-1;grid-row:2;flex-direction:row;flex-wrap:wrap;gap:.25rem .75rem;margin:.25rem 0 0;white-space:normal}
  .ticks span.end,.ticks span.start{display:none}
  .ticks span.day{font-size:11px}
  .bubble{white-space:normal;font-size:13px}
  .lbl.town:not(.under),.lbl.ptag{display:none}
}
.dir .dbadge{min-width:2.6rem;height:2rem;color:#f6f6f1;font-size:18px;font-weight:600;vertical-align:.25rem}
.rchip{gap:.375rem;padding:.25rem .625rem;border-radius:8px;background:rgba(224,138,0,.15);color:#6b3d00}
#app:not(.light) .rchip{background:rgba(224,138,0,.24);color:#ffd28a}
.dock{grid-template-columns:auto auto minmax(0,1fr);padding:.75rem 1.125rem .625rem .75rem}
.dock .rowlbl{grid-column:2;grid-row:1}
.dock .scrub{grid-column:3;grid-row:1}
.dock .dkey{grid-column:3;grid-row:2;flex-direction:row;flex-wrap:wrap;gap:.25rem 1rem;margin:0;font-size:13px}
.segs{height:2rem}
.risk{top:3.25rem;height:3.75rem}
.rgl{top:calc(3.25rem + 1.875rem - .4375rem);font-size:13px;line-height:1}
.marks{top:7.25rem}
.track{height:7.75rem}
.track:not(:has(.marks:not([hidden]))){height:7.25rem}
.nights{height:6.75rem}
.pgmark{top:calc(.75rem - 7px);height:6px}
.pgmark::after{left:-2px;right:-2px;top:0;height:6.25rem}
.rowlbl{font-size:13px}
.rowlbl>span:first-child{display:flex;align-items:center;height:2rem}
.rowlbl small{font-size:13px}
.ticks{font-size:13px;color:var(--label2)}
.selcol{position:absolute;margin-left:-1px;border:2px solid var(--label);border-radius:4px;pointer-events:none;z-index:3;box-sizing:content-box;padding:0 0;top:.75rem;height:1rem;display:none}
.thumb-knob{top:0;height:100%;width:2px;margin-left:-1px;border-radius:1px;background:var(--knob,#2c3e66);box-shadow:none}
.thumb-knob::before{left:50%;top:-6px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--knob,#2c3e66);box-shadow:0 0 0 2px var(--mat)}
#app:not(.light) .thumb-knob{--knob:#c9d3f0}
.lbl.windind{align-items:center;gap:.5rem;padding:.3125rem .625rem .3125rem .375rem;border-radius:10px;background:var(--chip);box-shadow:0 1px 4px rgba(0,0,0,.14);transform-origin:0 0;display:none}
.stack .windchip{font-size:13px;color:var(--label2);cursor:default}
.stack .windchip svg{width:1rem;height:1rem;fill:none;stroke:var(--label);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transform:rotate(var(--a,0deg))}
.stack .windchip b{color:var(--label);font-weight:600}
.stack .windchip:empty{display:none}
.stack .windchip+.ib{border-left:.5px solid var(--sep)}
.ticks span{top:auto}
.ticks span.day,.ticks span.start,.ticks span.end{top:0;transform:none;font-weight:600;color:var(--label)}
.ticks span.day::before{top:0;left:-4px}
.ticks span.hr{color:var(--label2)}
.ticks span.end{font-weight:400;color:var(--label2);font-size:13px}
.rowlbl{display:flex;flex-direction:column;flex:none;margin-bottom:.75rem;gap:0;justify-content:flex-start;align-self:flex-start;margin:0;padding-top:.75rem;padding-right:2.25rem}
.rgl{left:-.5rem;right:auto;color:var(--label2)}
.rail .ground{font-size:15px;font-weight:400;color:var(--label2);line-height:1.45}
.rstat{display:flex;flex-direction:column;gap:.125rem;margin-top:.25rem}
.rstat span{font-size:13px;color:var(--label2)}
.rstat b{font-size:18px;font-weight:600;color:var(--label)}
.rstat b small{font-size:15px;font-weight:400;color:var(--label2)}
.rstat.hi b{color:var(--label)}
.sumbar{display:none}
.aclegend{position:absolute;align-items:center;gap:.75rem;padding:.375rem .75rem;border-radius:12px;pointer-events:none;top:1rem;bottom:auto;left:24rem;display:none!important}
.lbl.ptag{display:none!important}
.wcomp{grid-row:1/span 3;align-self:start;position:relative;border-radius:50%;box-shadow:none!important;width:1.125rem;height:1.125rem;display:inline-flex;align-items:center;justify-content:center;vertical-align:-.2rem;margin-right:.375rem}
.wcomp i,.wcomp i::after{display:none}
.wcomp svg{width:1rem;height:1rem;fill:none;stroke:var(--label);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transform:rotate(var(--a,0deg))}
.dkey .plk{width:1rem;height:0;border-radius:0;background:none;border-top:2.5px dashed var(--east)}
.dkey .tok{width:1rem;height:0;border-radius:0;background:none;border-top:2px solid var(--label)}
.dkey .twk{width:.625rem;height:.625rem;border-radius:50%;background:var(--mat);box-shadow:inset 0 0 0 2px var(--east),inset 0 0 0 3.5px var(--mat),inset 0 0 0 10px var(--east)}
.ticks span.day{transform:translateX(6px)}
@media (max-width:499px){
  .rail .hero{padding:.5rem .75rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
  .rail .hero>*:not(.sumbar):not(.more){display:none!important}
  .sumbar{font-size:13px;font-weight:600}
  .rail .hero .more{margin:0;font-size:0}
  .rail .hero .more::after{content:"Details";font-size:13px}
  .pbar{height:5.25rem;align-content:center;gap:.375rem .5rem;padding:0 .75rem}
  .pbrand{flex-basis:100%;font-size:15px;gap:.375rem}
  .pbrand span{display:none}
  .pbrand svg{width:1.375rem;height:1.375rem}
  .ptabs a{padding:.25rem .5rem;font-size:13px}
  .ptz{margin-left:auto}
  .pthm{margin-left:0;order:9;width:1.75rem;height:1.75rem}
  .ptz button{height:1.5rem;padding:0 .5rem;font-size:13px}
  .ptz #tzl3{font-size:0}
  .ptz #tzl3::after{content:"Local";font-size:13px}
  .rail{top:5.75rem}
  .sumbar{display:block;flex:1;min-width:0;color:var(--label);text-overflow:ellipsis;white-space:normal!important;overflow:visible!important}
  .keyb{display:grid;place-items:center;position:absolute;right:.625rem;top:.5rem;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--fill);font:600 13px/1 var(--sans);color:var(--label2)}
  .dock .dkey{display:none}
  #app.keyon .dock .dkey{display:flex}
}
.pbar{height:3.25rem;display:flex;align-items:center;gap:1.25rem;padding:0 .75rem 0 1rem}
body.embed .pbar{display:none}
.pbrand{font-size:18px;font-weight:600;color:var(--label);white-space:nowrap}
.pbrand span{font-size:15px;font-weight:400;color:var(--label2)}
.ptabs a{font-size:13px;font-weight:500;color:var(--label2)}
.ptabs a[aria-current]{background:var(--fill);color:var(--label)}
.ptz button{height:1.75rem;padding:0 .75rem;border-radius:6px;font-size:13px;font-weight:500;color:var(--label2)}
.ptz button[aria-pressed=true]{background:var(--mat);color:var(--label);box-shadow:0 1px 2px rgba(0,0,0,.12)}
.hero .dash{margin-bottom:.375rem;pointer-events:auto;display:none}
.rail{top:4.75rem}
.attrib{top:auto;bottom:.25rem;right:1.25rem;font-size:11px}
.dock{bottom:1.25rem;padding-top:2.25rem}
.lbl.town span{text-shadow:0 0 3px var(--bg),0 0 3px var(--bg),0 0 6px var(--bg)}
.keyb{display:none}
.pbar a{text-decoration:none}
.ptabs{display:flex;gap:.25rem;align-items:center}
.ptabs a{padding:.25rem .75rem;border-radius:8px;display:inline-block;line-height:1.5}
.pbar{height:3.5rem;padding:0 1.5rem;background:#f1f1ef!important;box-shadow:0 1px 0 rgba(0,0,0,.06)!important}
#app:not(.light) .pbar{box-shadow:0 1px 0 rgba(255,255,255,.06)!important}
#app:not(.light) .pbar .pbrand svg rect:first-child{fill:#3a3b40}
.pbrand{font-size:18px}
.pthm{color:var(--label2)}
.pthm:hover{background:var(--fill)}
.pthm svg{width:1rem;height:1rem}
.ptz{display:flex;padding:2px;border-radius:8px;background:var(--fill);margin-left:.25rem}
.rail{top:4.5rem}
.acc .rstat b{font-size:15px}
.risk{top:3.25rem;height:2.5rem}
.rgl{top:calc(3.25rem + 1.25rem - .4375rem)}
.marks{top:6rem}
.track{position:relative;touch-action:none;outline-offset:4px;border-radius:8px;height:6.5rem}
.track:not(:has(.marks:not([hidden]))){height:6rem}
.nights{height:5.5rem}
.pgmark::after{height:5rem}
.rowlbl #risk-l:not([hidden]){display:flex;flex-direction:column;margin-top:.5rem;justify-content:flex-start;height:2.5rem}
@media (max-width:639px){
  .dock{grid-template-columns:auto minmax(0,1fr);padding:2.25rem .75rem .5rem .625rem}
  .dock .scrub{grid-column:2}
  .dock .rowlbl{font-size:13px}
  .ticks span.day{font-size:13px}
  .attrib{font-size:11px}
  .segs{height:1.5rem}
  .risk{top:2.75rem;height:2.75rem}
  .rgl{top:calc(2.75rem + 1.375rem - .4375rem)}
  .marks{top:5.75rem}
  .track{height:6.25rem}
  .track:not(:has(.marks:not([hidden]))){height:5.75rem}
  .nights{height:5.25rem}
  .rowlbl>span:first-child{height:1.5rem}
  .rowlbl #risk-l:not([hidden]){height:2.75rem}
  .pgmark::after{height:4.75rem}
  .lbl.windind span{display:inline}
  .ticks span.hr{display:block}
  .lbl.rwy.hide{visibility:hidden}
  .dir .dbadge{height:1.6rem;min-width:2.2rem;font-size:15px;vertical-align:.2rem}
  .dock{bottom:2.5rem}
  .attrib{bottom:.25rem;font-size:11px;line-height:1.25}
}
.prun{margin-left:auto;display:flex;font-size:13px;color:var(--label2);white-space:nowrap}
.prun .menu select{font-size:13px;font-weight:500;padding:.3125rem 1.625rem .3125rem .625rem}
.pthm{width:2rem;height:2rem;border-radius:8px;display:grid;place-items:center;margin-left:0}
.rail .hero{padding:.875rem 1rem .5rem}
.hsec{padding-top:.375rem;border-top:.5px solid var(--sep)}
.hsec .risknext,.hsec .acc{margin:0}
.kv{font-size:13px;color:var(--label2)}
.kv b{font-size:15px;font-weight:600;color:var(--label);white-space:nowrap}
.kv b small{font-size:13px;font-weight:400;color:var(--label2)}
.acc .kv{border-top:0}
.hero .conditions{position:static;width:auto;background:none;border:0;box-shadow:none;border-radius:0;padding:0}
.hero .conditions .row{padding:.4375rem 0}
.hero .conditions .row+.row::before{left:0}
.hero .conditions .row-title{font-size:13px;font-weight:400;color:var(--label2)}
.hero .conditions .row-value{font-size:15px;font-weight:600}
.hero .seg{margin-top:.5rem}
.dir .dbadge{color:#fff}
#app:not(.light) .dir .dbadge{color:#10131c}
.dock{padding:.75rem 1.125rem .625rem .75rem}
.dock .rowlbl{width:6.25rem}
.dock .rowlbl>span{left:0;right:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;height:auto;margin:0;font-size:13px;font-weight:500;color:var(--label);line-height:1.25}
.dock .rowlbl small{display:block;font-size:13px;font-weight:400;color:var(--label2)}
.dock .rowlbl #risk-l:not([hidden]){justify-content:flex-start}
.dock .rowlbl #r18-l:not([hidden]){top:calc(34px + var(--mt) - 3px);height:auto;margin:0;align-items:flex-start} /* left-aligned like the other row names */
.dock .rowlbl #wind-l:not([hidden]){top:calc(34px + var(--wt));justify-content:flex-start}
.dock .rowlbl [hidden]{display:none!important}
.ticks{position:relative;height:34px;border-bottom:1px solid var(--sep);font-size:13px}
.ticks span{position:absolute;white-space:nowrap;line-height:1}
.ticks span.start,.ticks span.day,.ticks span.end{top:2px;font-weight:600;color:var(--label);font-size:13px;transform:none}
.ticks span.day{transform:translateX(4px)}
.ticks span.day::before{content:"";width:1px;background:var(--label3);height:2rem;display:none}
.ticks span.start{left:0}
.ticks span.end{right:0;left:auto;font-weight:400;color:var(--label2)}
.ticks span.hr{top:auto;bottom:5px;transform:translateX(-50%);color:var(--label2);display:block}
.ticks i.tk{position:absolute;bottom:0;width:1px;height:4px;background:var(--label3);opacity:.5}
.ticks span.nowtick{font-weight:600;color:var(--label)}
.ticks span.pgl{top:auto;bottom:3px;padding:0 5px;border-radius:3px;background:rgba(224,138,0,.14);color:#9a5a00;font-weight:500;line-height:16px}
#app:not(.light) .ticks .pgl{color:#f0a24a}
.ticks .pgl[hidden]{display:none}
#track{height:var(--th)}
.segs{position:absolute;left:0;right:0;display:flex;gap:0;top:var(--dt);height:var(--dh)}
.risk{position:absolute;width:100%;overflow:visible;top:var(--rt);height:var(--rh)}
.rgl{font-size:13px;line-height:13px;color:var(--label2)}
.marks{position:absolute;gap:2px;top:var(--mt);height:10px}
.windrow{position:absolute;left:0;top:var(--wt);overflow:visible;pointer-events:none}
.windrow .zone{fill:rgba(208,59,59,.13)}
#app:not(.light) .windrow .zone{fill:rgba(239,91,79,.2)}
.windrow .grid{stroke:var(--sep);stroke-width:1}
.windrow .zero{stroke:var(--label3);stroke-width:1}
.windrow .lim{stroke:var(--closed);stroke-width:1;stroke-dasharray:3 3}
.windrow .ln{fill:none;stroke:var(--label2);stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round}
.windrow .chip{fill:var(--mat)}
.windrow text{font:400 13px "IBM Plex Sans",system-ui,sans-serif;fill:var(--label2)}
.windrow .limt{font-size:11px;font-weight:600;fill:var(--closed);paint-order:stroke;stroke:var(--mat);stroke-width:3px}
.nights{position:absolute;left:0;right:0;pointer-events:none;top:var(--dt);bottom:0;height:auto}
.nights i{position:absolute;top:0;bottom:0;overflow:hidden;border-radius:0;background:rgba(127,127,127,.07)!important}
.pgmark{top:calc(var(--dt) - 7px)}
.pgmark::after{top:6px;height:calc(var(--th) - var(--dt) + 1px)}
.nowline{width:2px;margin-left:-1px;background:var(--label);border-radius:1px;z-index:2;pointer-events:none;top:20px;bottom:0}
.nowline::after{content:attr(data-t);position:absolute;display:none}
.bubble{color:var(--mat);font-size:13px;font-weight:600;line-height:20px}
.bubble span{color:var(--mat);opacity:.75;font-weight:500}
.dkey .limk{width:1rem;height:0;border-radius:0;background:none;border-top:2px dashed var(--closed)}
@media (max-width:499px){
  .pbar{height:5.25rem;flex-wrap:wrap;align-content:center;gap:.375rem .5rem;padding:0 .75rem}
  .rail{top:5.75rem}
}
@media (max-width:639px){
  .pbar{gap:.625rem .75rem;padding:.75rem 1rem}
  .pthm{margin:0}
  .ptz{margin:0}
  .prun{display:none}
  .rail{width:auto;gap:.375rem;top:6.25rem}
  .ticks span.start,.ticks span.nowtick,.ticks span.pgl{display:block}
  .ticks span.pgl[hidden]{display:none}
  .bubble{width:max-content;max-width:100%;overflow:hidden;text-overflow:ellipsis}
  .dock .rowlbl{width:4.75rem}
  .dock .rowlbl small{display:none}
}
.pbrand{display:flex;align-items:center;gap:.625rem;letter-spacing:-.01em;font-size:15px}
.pbrand span{font-size:15px}
.ptabs a,.ptz button{font-size:15px}
.prun{font-size:15px}
.prun .menu select{font-size:15px;font-weight:500;color:var(--label)!important;background:var(--fill)!important}
.rail .eyebrow{font-size:13px;font-weight:500;color:var(--label2)}
.rail .dir{font-size:24px}
.dir .dbadge{display:inline-flex;align-items:center;justify-content:center;background:var(--dc);box-shadow:none;font-size:.625em;height:1.733em;min-width:2.2em;padding:0 .3em;border-radius:4px;margin-right:.35em;vertical-align:.12em}
.rail .ground{font-size:15px}
.kv{font-size:15px}
.kv b{font-size:15px}
.hero .conditions .row-title,.hero .conditions .row-value{font-size:15px}
.row-sub,.row.how,details{font-size:13px}
.pstat .p1{display:flex;align-items:baseline;gap:.375rem}
.pstat .p1 b{font-size:24px;font-weight:600;letter-spacing:-.02em;color:var(--label)}
.pstat .p1 span{font-size:15px;font-weight:600;color:var(--label)}
.pstat .p2{font-size:15px;font-weight:500;color:var(--label)}
.pstat .p3{font-size:13px;color:var(--label2)}
.acc{cursor:default}
.rpk{font-size:13px;font-weight:600;line-height:1;color:var(--label);white-space:nowrap;text-shadow:0 0 3px var(--mat),0 0 3px var(--mat),0 0 6px var(--mat)}
.dkey{font-size:13px}
@media (max-width:639px){
  .pstat .p1 b{font-size:18px}
}
.segs .dlab{font-size:13px;font-weight:600;line-height:1;color:#fff;white-space:nowrap}
#app:not(.light) .segs .dlab{color:#10131c}
.track .pgl{background:rgba(224,138,0,.14);color:#9a5a00;font-size:13px;font-weight:500;line-height:16px;white-space:nowrap}
#app:not(.light) .track .pgl{color:#f0a24a}
.track .pgl[hidden]{display:none}
.ticks span.h00{display:block}
.dock .dkey{margin-top:10px}
.hsec{border-top:1px solid var(--sep);padding-top:.5rem;margin-top:.625rem}
.pstat{padding:.5rem 0 .25rem;border-top:0!important}
.sbw{display:none}
.prun .menu select{line-height:20px}
@media (max-width:639px){
  .ticks span.h00{display:block}
  .lbl.windind{display:none!important}
  .sbw{display:inline-flex;margin-left:auto;font-weight:500;color:var(--label2);white-space:nowrap}
  .sbw svg{width:.875rem;height:.875rem;fill:none;stroke:var(--label);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transform:rotate(var(--a,0deg))}
  .sbw b{font-weight:600;color:var(--label)}
}
.hero .hsec.conditions{border-top:1px solid var(--sep);padding-top:.375rem;margin-top:.5rem}
.dock .rowlbl>span{justify-content:center!important}
.dock .rowlbl #risk-l:not([hidden]){margin:0;top:calc(34px + var(--rt));height:var(--rh)!important;justify-content:center!important;white-space:nowrap}
.dock .rowlbl #dir-l{top:calc(34px + var(--dt));height:var(--dh)}
.rgl{color:var(--label2)}
.rgl[hidden]{display:none}
.risk .base.calm{stroke:var(--label2);stroke-opacity:.6}
.dock .rowlbl{width:7rem}
.track .pgl{background:var(--tagbg,#9a5a00);color:var(--tagink,#fff);font-weight:600;font-size:11px} /* siteui.STYLE.tag_bg: the dashboard's tag */
#app:not(.light) .track .pgl{background:var(--tagbg,#f0a030);color:var(--tagink,#1b1c1f)}
.segs .dlab.e,.segs .dlab.w{color:#fff}
#app:not(.light) .segs .dlab.w,#app:not(.light) .dir .dbadge[data-d="25"]{color:#10131c}
#app:not(.light) .dir .dbadge{color:#fff}
.dir span{position:absolute;left:0;top:0;will-change:transform,opacity;color:var(--label)!important}
.pbar{position:absolute;z-index:5;left:0;right:0;top:0;border-radius:0;backdrop-filter:none!important;gap:24px!important;padding:0 24px!important;box-shadow:0 1px 0 rgba(27,28,30,.09)!important}
#app:not(.light) .pbar{background:#111214!important;box-shadow:0 1px 0 rgba(255,255,255,.1)!important}
.pbrand svg{width:24px;height:24px;color:var(--label)}
.prun .menu select:hover{background:var(--fill2)!important}
.stack .windchip{align-items:center;gap:.375rem;height:2rem;padding:0 .75rem;border-left:0;border-radius:12px 0 0 12px;display:none!important}
@media (max-width:639px){
  .ptz #tzl3{font-size:13px}
  .ptz #tzl3::after{content:none!important}
  .sumbar{white-space:nowrap!important;text-overflow:ellipsis}
  .dock .rowlbl{grid-column:1;width:4.25rem}
}
.pstat .p1 span{font-size:15px;font-weight:500;opacity:1;color:var(--label2)}
.pgmark::after{content:"";position:absolute;background:rgba(224,138,0,.06);pointer-events:none;display:none!important}
.track .pgl{line-height:14px;font-size:11px}
.ticks span.nowtick{color:var(--mat);font-size:11px;font-weight:600;line-height:14px}
.lbl.town span{position:absolute;text-shadow:0 0 2px var(--bg),0 0 3px var(--bg),0 0 5px var(--bg),0 0 8px var(--bg),0 0 12px var(--bg)!important}
.lbl.place{text-shadow:0 0 2px var(--bg),0 0 4px var(--bg),0 0 8px var(--bg)}
.prun .menu select{border-radius:8px;cursor:pointer;transition:background-color .15s;background:transparent!important;padding:5px 22px 5px 6px!important;font-weight:500;color:var(--label)!important}
.prun .menu select:hover{background:var(--fill)!important}
.prun .menu svg{display:block;right:6px;width:.625rem;height:.625rem;color:var(--label2)}
#app:not(.light) .segs .dlab.e{color:#fff}
.prun b{font-weight:500;color:var(--label)}
.row.run{padding:.375rem 0!important}
.row.run .menu select{font-size:13px;padding:4px 22px 4px 8px;background:var(--fill)!important;border-radius:6px;color:var(--label)!important}
.row-title small{font-size:13px;color:var(--label2);font-weight:400}
.attrib{font-size:11px;color:var(--label2)!important}
@media (max-width:639px){
  .rose{left:auto;right:.75rem;top:9.25rem;bottom:auto;transform:scale(.8);transform-origin:100% 0;display:none!important}
  .dock{left:0!important;right:0!important;bottom:0!important}
  .attrib{bottom:.375rem!important}
}
.tarr{display:inline-block;width:1.15em;height:.8em;margin:0 .3em;vertical-align:-.05em;fill:none;stroke:currentColor;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}
.row.accrow{padding:.5rem 0 .25rem!important}
.row.accrow .pstat{border-top:0;padding:0}
#app:not(.light) .lbl.rwy b{background:#55575d!important;color:#fff!important}
.lbl.town:not(.under){font-size:13px;font-weight:600}
.lbl.town:not(.under) i{left:-3px;top:-3px;width:6px;height:6px;background:var(--label2);box-shadow:none;display:none}
.attrib{font-size:11px}
@media (max-width:639px){
  .dock .dkey{flex-wrap:wrap;gap:.25rem .75rem;grid-column:1/-1;margin-top:.375rem;font-size:11px;display:none!important}
  .dock .dkey .mapk:not(:first-of-type){display:none}
  .attrib{bottom:.5rem!important;left:.75rem!important;right:.75rem!important;text-align:left}
}
.pstat .p3{font-size:13px;color:var(--label);margin-top:.25rem}
.pstat .p3 b{font-weight:600;color:#9a5a00}
#app:not(.light) .pstat .p3 b{color:#f0a24a}
.pstat .p3 span{color:var(--label2);font-size:13px}
@media (max-width:639px){
  .sbw{align-items:center;gap:.25rem;display:none!important}
  .sumbar{white-space:normal!important}
}
.dock{bottom:1.75rem}
@media (max-width:639px){
  .dock{bottom:0}
}
.lbl.town:not(.under){opacity:1;font-weight:400!important;font-size:13px;color:var(--label2)!important;font-style:normal;display:none!important}
.ticks span.day.dend{transform:none!important;text-align:right}
.rail .outl{margin-top:.5rem;font-size:15px;font-weight:600;color:var(--label);line-height:1.35}
.rail .disl{margin-top:.25rem;font-size:13px;color:var(--label);line-height:1.4}
.rail .disl b{font-weight:600;color:#9a5a00}
#app:not(.light) .rail .disl b{color:#f0a24a}
.rail .disl[hidden]{display:none}
.dkey .ksep{width:1px;height:.875rem;background:var(--sep);margin:0 .5rem}
.rgl0{position:absolute;right:calc(100% + 4px);top:calc(var(--rt) + var(--rh) - 9px);font-size:13px;line-height:1;color:var(--label2);pointer-events:none}
.rgl2{position:absolute;right:calc(100% + 4px);top:calc(var(--rt) - 4px);font-size:13px;line-height:1;color:var(--label2);pointer-events:none}
.rgl2[hidden]{display:none}
#app .dock .rgl{display:none!important} /* only 0 and the top carry values (phones too); the mid gridline stays */
@media (max-width:639px){.rgl2{right:calc(100% + 4px);font-size:11px;z-index:6}}
@media (max-width:639px){
  .dkey .ksep{display:none}
}
.pstat .pm{font-size:15px;color:var(--label)}
.pstat .p3 span{display:none}
.rpk{font-weight:400!important;color:var(--label2)!important}
@media (min-width:640px){
  .pthm{margin-left:-12px!important}
  .ptz{margin-left:-12px!important}
  .pbar{border:0!important}
}
.rail .dir{font-size:18px;line-height:1.75rem}
.rail .dir .dbadge{font-size:13px}
.rail .ground{font-size:13px;color:var(--label2)!important;margin-top:.375rem}
.rail .eyebrow{font-size:13px}
.kv{display:flex;justify-content:space-between;align-items:baseline;gap:.75rem;padding:.3125rem 0;font-size:13px;color:var(--label2)}
.kv b{font-size:15px;font-weight:500!important;color:var(--label)}
.hero .conditions .row-title{font-size:13px;font-weight:400!important;color:var(--label2)!important}
.hero .conditions .row-value{font-size:15px;font-weight:500!important}
.hero .conditions .row-value small{font-size:13px!important}
.row-sub,.row-sub *{font-size:13px;color:var(--label2)}
.pstat .p1 b{font-size:24px}
.pstat .pm,.pstat .p2{font-size:13px;color:var(--label2);font-weight:400}
.pstat .p2{color:var(--label);margin-top:.125rem}
.pstat .p3{display:flex;margin-top:.25rem;padding:.3125rem 0 0;border-top:.5px solid var(--sep)}
.pstat .p3 b{color:#9a5a00!important}
#app:not(.light) .pstat .p3 b{color:#f0a24a!important}
.mapkey{position:absolute;z-index:3;display:flex;align-items:center;gap:.875rem;padding:.4375rem .75rem;border-radius:12px;font-size:13px;color:var(--label2);pointer-events:none;white-space:nowrap}
.mapkey span{display:inline-flex;align-items:center;gap:.375rem}
.mapkey .plk{width:1rem;height:0;border-top:2.5px dashed var(--east)}
.mapkey .tok{width:1rem;height:0;border-top:2px solid var(--label)}
.mapkey .twk{width:.625rem;height:.625rem;border-radius:50%;background:var(--mat);box-shadow:inset 0 0 0 2px var(--east),inset 0 0 0 3.5px var(--mat),inset 0 0 0 10px var(--east)}
.mapkey:empty{display:none}
body.card .mapkey{display:none}
@media (max-width:639px){
  .mapkey{display:none}
}
.pstat .p3 span{display:inline!important;font-size:13px!important;color:var(--label2)!important}
@media (min-width:640px){ /* compact at every desktop size: the panels are zoomed to a 810 px high canvas */
  .hero .conditions .row,.row.run,.row.accrow{padding-top:.3125rem!important;padding-bottom:.3125rem!important}
  .kv{padding:.25rem 0!important}
  .rail .row.how{display:none!important}
  .rail .hero{padding-top:.625rem;padding-bottom:.375rem}
  .hsec{margin-top:.375rem;padding-top:.25rem}
  .rail .outl{margin-top:.25rem}
}
@media (min-width:640px){
  .rail{overflow-y:auto;overflow-x:hidden;scrollbar-width:thin}
}
.lbl.town.under i{background:var(--eastLine)!important;box-shadow:0 0 0 2px var(--bg),0 0 0 4px var(--eastLine)!important}
.rail .dir{font-size:24px;line-height:2.25rem;font-weight:600}
.rail .dir .dbadge{font-size:15px}
.pstat .p1{display:flex;align-items:baseline;flex-wrap:wrap;gap:.25rem}
.pstat .p1 b{font-size:18px!important;font-weight:600}
.pstat .pofl{font-size:13px;color:var(--label2)}
.pstat .pofl em{font-style:normal;font-size:18px;font-weight:600;color:#9a5a00}
#app:not(.light) .pstat .pofl em{color:#f0a24a}
.pstat .pm{font-size:13px!important}
.row.mapkey{display:flex!important;font-size:13px;color:var(--label2);white-space:normal}
.row.mapkey:empty{display:none!important}
.row.mapkey .twk{box-shadow:inset 0 0 0 2px var(--eastLine),inset 0 0 0 3.5px var(--mat),inset 0 0 0 10px var(--eastLine)!important}
.attrib{position:absolute;display:block;bottom:.375rem!important;left:24px!important;right:auto!important;text-align:left!important;font-size:13px;color:var(--label2)!important;white-space:nowrap}
@media (max-width:639px){
  .row.mapkey{display:none!important}
  .attrib{white-space:normal}
}
.pgmark{border-top:3px solid var(--label);border-bottom:0;z-index:2;top:var(--dt)!important;height:3px!important;border:0!important;background:#e08a00!important;border-radius:0!important}
#app:not(.light) .pgmark{background:#f0a030!important}
.track .pgl{line-height:14px}
@media (max-width:639px){
  .attrib{font-size:11px;line-height:1.3}
}
.rail .ground:empty{display:none}
.rail .outl{font-weight:500!important}
.pstat .kv b{font-size:15px!important;font-weight:600!important}
.pofl2{font-size:15px;font-weight:400;color:#9a5a00}
#app:not(.light) .pofl2{color:#f0a24a}
.kv span,.hero .conditions .row-title{color:var(--label2)!important;font-size:13px;text-transform:none;letter-spacing:0;font-weight:400!important}
.kv b,.hero .conditions .row-value{font-size:15px;font-weight:600!important}
.mapchip{position:absolute;z-index:3;display:flex;align-items:center;gap:.875rem;padding:.375rem .75rem;border-radius:12px;font-size:13px;color:var(--label2);pointer-events:none;white-space:nowrap}
.mapchip span{display:inline-flex;align-items:center;gap:.375rem}
.mapchip .plk{width:1rem;height:0;border-top:2.5px dashed var(--eastLine)}
.mapchip .tok{width:1rem;height:0;border-top:2px solid var(--label)}
.mapchip .twk{width:.625rem;height:.625rem;border-radius:50%;background:var(--mat);box-shadow:inset 0 0 0 2px var(--eastLine),inset 0 0 0 3.5px var(--mat),inset 0 0 0 10px var(--eastLine)}
.mapchip:empty{display:none}
body.card .mapchip{display:none}
.prun{display:flex}
#livedot{width:8px;height:8px;border-radius:50%;flex:none;margin-right:.375rem}
#livedot.ok{background:#5c9a0f} /* yellow-green, as on the dashboard (--live): never read as the West teal */
#app:not(.light) #livedot.ok,body:has(#app:not(.light)) #livedot.ok{background:#8cc63f}
#livedot.old{background:var(--label3)}
.prun .age{font-weight:400;color:var(--label2)}
@media (max-width:639px){
  .mapchip{display:none}
}
.track .pgl{font-size:11px;font-weight:600!important}
@media (max-width:639px){
  .pbar{align-items:center;display:grid!important;height:auto!important;gap:.375rem .75rem!important;padding:.5rem .75rem!important;align-content:start;grid-template-columns:minmax(0,1fr) auto auto!important;grid-template-areas:"brand thm tz" "tabs run run"!important;column-gap:8px!important}
  .pbrand{flex-basis:auto;grid-area:brand;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px}
  .pthm{grid-area:thm;display:grid!important;margin:0!important}
  .ptz{grid-area:tz;justify-self:end;display:flex!important;margin:0!important}
  .prun{font-size:13px;white-space:nowrap}
  .prun .age .uh{display:none}
  .rail .hero{display:block!important;padding:.625rem .875rem!important}
  .rail .hero>*:not(.sumbar){display:none!important}
  .sumbar{align-items:center;gap:.5rem;overflow:hidden!important;display:block!important;white-space:normal!important;font-weight:400!important;pointer-events:auto;position:relative}
  .sb1{display:flex;align-items:center;gap:.5rem;font-size:18px;font-weight:600;color:var(--label);flex-wrap:nowrap}
  .sb1 .dbadge{display:inline-flex;align-items:center;justify-content:center;height:1.5rem;min-width:2.1rem;padding:0 .3rem;border-radius:4px;background:var(--dc);color:#fff;font-size:15px;font-weight:600}
  #app:not(.light) .sb1 .dbadge[data-d="25"]{color:#10131c}
  .sb2{margin-top:.25rem;font-size:15px;font-weight:500;color:var(--label)}
  .sb3{font-size:13px;color:var(--label);margin-top:2px}
  .sb3 b{color:var(--label);font-weight:600}
  .sb3 em{font-style:normal;color:#9a5a00}
  #app:not(.light) .sb3 em{color:#f0a24a}
}
.pofl2{margin-top:.125rem;font-size:13px!important;color:var(--label2)!important;font-weight:400}
.pofl2 em{font-style:normal;color:#9a5a00;font-weight:600}
#app:not(.light) .pofl2 em{color:#f0a24a}
.pgwash3{background:rgba(224,138,0,.09)}
.rgl{font-size:11px;color:var(--label3)!important}
.risk .grid{vector-effect:non-scaling-stroke;stroke-opacity:.6}
.ticks span.start{top:0!important}
.stack .ib{width:auto;height:2rem!important;border-radius:0!important}
.stack{position:absolute;right:1rem;flex-direction:row;gap:0;bottom:auto;top:4.5rem;border-radius:8px!important;overflow:hidden}
.stack .ib:first-child{border-radius:8px 0 0 8px!important}
.stack .ib:last-child{border-radius:0 8px 8px 0!important}
.rgl{font-size:13px;color:var(--label2)!important}
.ticks span.day.off{opacity:0}
.track .pgl{position:absolute;z-index:7!important;left:auto;line-height:14px!important;height:14px!important;padding:0 6px!important;letter-spacing:.02em;font-weight:500!important;top:calc(var(--dt) - 15px)!important;border-radius:3px 3px 0 0!important}
.dock{bottom:2rem!important}
.ticks span.day{transform:translateX(4px)!important}
@media (max-width:639px){
  .dock{bottom:0!important}
}
.rail .dir{font-size:24px;line-height:2rem}
.rail .dir .dbadge{font-size:15px}
.rail .outl,.kv b,.hero .conditions .row-value,.pstat .kv b{font-size:15px}
.rail .eyebrow,.rail .disl,.kv span,.hero .conditions .row-title,.row-sub,.row-sub *,.pofl2,.kvs,.row.how,details,.row.mapkey{font-size:13px}
.kvs{color:var(--label2);text-align:right;margin-top:-.125rem;padding-bottom:.25rem}
.row.mapkey{background:none!important;border:0!important;box-shadow:none!important;border-radius:0!important;position:static!important;display:flex!important;flex-wrap:wrap;gap:.375rem .875rem;padding:.5rem 0!important;color:var(--label2)}
.row.mapkey span{display:inline-flex;align-items:center;gap:.375rem}
.row.mapkey .plk{border-top-color:var(--eastLine)!important;width:1rem;height:0;border-top:2.5px dashed var(--eastLine)}
.row.mapkey .tok{width:1rem;height:0;border-top:2px solid var(--label)}
.row.mapkey .twk{width:.625rem;height:.625rem;border-radius:50%;background:var(--mat);box-shadow:inset 0 0 0 2px var(--eastLine),inset 0 0 0 3.5px var(--mat),inset 0 0 0 10px var(--eastLine)}
.badge::before{background:none!important;color:var(--label2);font-size:13px}
.dock{bottom:2.5rem!important}
.dkey .pgk{outline-offset:-1.5px;margin-top:.25rem;box-shadow:none;border-bottom:0;border-top:3px solid #e08a00!important;outline:none!important;margin:0!important;width:1rem!important;height:.5625rem!important;border:0!important;border-radius:2px!important;background:#e08a00!important}
@media (max-width:639px){
  .row.mapkey{display:none!important}
  .ptabs{grid-area:tabs;padding:2px;border-radius:8px;background:var(--fill);justify-self:start!important;width:auto!important}
  .ptabs a{padding:3px 10px!important;border-radius:6px;flex:0 0 auto}
  .ptabs a[aria-current]{background:var(--mat)!important;box-shadow:0 1px 2px rgba(0,0,0,.12)}
}
.dock{grid-template-rows:auto auto auto}
.dock .dhd{grid-column:2/-1;grid-row:1}
.dhl{flex-direction:column;gap:2px}
.dmenu{flex:none;gap:8px;font-size:13px;color:var(--label2);pointer-events:auto}
.dmenu select{font-size:13px;font-weight:500!important;line-height:20px;padding:4px 24px 4px 8px!important;border-radius:6px!important;background:var(--fill)!important;color:var(--label)!important;cursor:pointer}
.dmenu svg{right:8px!important}
.rail .row.how{display:none!important}
.dock .play{grid-column:1;align-self:center;grid-row:2!important}
.dock .rowlbl{position:relative;height:calc(34px + var(--th,120px));padding:0;margin:0;gap:0;align-self:start;grid-row:2!important}
.dock .scrub{grid-row:2!important}
.dock .dkey{align-self:start;grid-row:3!important;margin-top:14px}
.dtitle{font-size:15px;font-weight:600;color:var(--label);line-height:20px}
.dhd .readout{font-size:13px;color:var(--label2)}
.dhd .ro{min-width:0;overflow:visible;white-space:normal;text-overflow:clip}
.dhd .ro b{font-weight:500;color:var(--label)} /* the readout regular, only its time in medium */
.dhd .rback{flex:none;pointer-events:auto;height:28px!important;padding:0 12px!important;border-radius:8px!important;background:var(--fill)!important;box-shadow:none!important;font-size:13px;font-weight:500!important;color:var(--label)!important;line-height:28px!important}
.dhd .rback:hover{background:var(--fill);color:var(--label)}
.dhd .rback[hidden]{display:none}
.bubble{font-size:11px;font-weight:600!important;line-height:18px!important}
.bubble span{display:none}
.thumb-knob{will-change:transform;top:0!important;bottom:0!important;height:auto!important;width:1.5px!important;margin-left:-.75px!important;border-radius:0!important;background:var(--label)!important;box-shadow:none!important;z-index:5!important}
.thumb-knob::before{content:"";position:absolute;display:none!important}
.ticks span.hr,.ticks span.nowtick{transition:opacity .15s}
.ticks span.hr.off,.ticks span.nowtick.off,.rpk.off{opacity:0!important}
.rpk{font-size:11px;line-height:14px!important}
.pgwash3{position:absolute;pointer-events:none;z-index:0;top:var(--rt)!important;height:var(--rh)!important}
.rgl{position:absolute;pointer-events:none;z-index:1;border-radius:2px;transform:none;background:none;padding:0;left:auto!important;right:calc(100% + 8px)!important;top:calc(var(--rt) + var(--rh) * (1 - var(--gf,.5)) - 7px)!important}
.mids i{position:absolute;top:0;bottom:0;width:1px;background:rgba(240,239,236,.14)}
#app.light .mids i{background:rgba(27,28,30,.14)}
.ticks i.dl{position:absolute;top:0;bottom:-1px;width:1px;opacity:1;background:rgba(240,239,236,.14)!important}
#app.light .ticks i.dl{background:rgba(27,28,30,.14)!important}
.ticks span.day.dend{left:auto!important;right:0!important;transform:none!important}
.kv b .swb{display:inline-block;position:relative;width:28px;height:6px;margin-right:8px;border-radius:3px;background:var(--fill2);vertical-align:1px;overflow:hidden}
.kv b .swb i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:#4b4d53}
#app:not(.light) .kv b .swb i{background:#9aa0a8}
@media (max-width:599px){
  .dock .dhd,.dock .scrub,.dock .dkey{grid-column:1/-1!important}
  .dock .play{display:none!important}
  .dock .rowlbl>span{left:6px!important;right:auto!important;height:16px!important;font-size:11px;font-weight:600!important}
  .dock .rowlbl #dir-l{top:calc(34px + var(--dt) - 22px)!important}
  .dock .rowlbl #risk-l:not([hidden]){top:calc(34px + var(--rt) - 21px)!important;height:13px!important}
  .dock .rowlbl #r18-l:not([hidden]){top:calc(34px + var(--mt) - 21px)!important} /* 6 px above its cells, clear of the chance baseline */
  .dock .rowlbl small{display:none!important}
  .dhd .readout{font-size:11px}
  .dtitle{font-size:13px}
  .dmenu{display:none!important}
}
#wind-s summary{margin-left:-2px}
.mids{position:absolute;inset:0;pointer-events:none;z-index:1!important}
.ticks span.day,.ticks span.start{background:var(--mat);padding:0 3px;margin-left:-3px;z-index:1}
.ticks,.ticks span,.ticks span.day,.ticks span.start,.ticks span.hr{font-size:13px!important}
.ticks span.nowtick{z-index:1;transform:translateX(-100%)!important;height:14px;padding:0 5px;border-radius:3px;background:var(--label);top:auto!important;bottom:2px!important;pointer-events:auto;cursor:help}
.dhd .readout{white-space:nowrap;min-width:0;height:20px;overflow:hidden;display:flex;align-items:center;gap:16px}
@media (min-width:600px){
  .dock .rowlbl #risk-l:not([hidden]){justify-content:center!important;padding-bottom:0} /* centred on the plot, as on the dashboard */
}
.row-value .wcomp{width:14px;height:14px}
.row-value .wcomp svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transform:rotate(var(--a,0deg))}
#r18-v .badge{background:none!important;padding:0!important;box-shadow:none!important;font-weight:600;font-size:15px}
.dock .rowlbl>span{position:absolute;font-size:13px}
.dock .rowlbl small{font-size:13px!important}
.dtitle{font-size:15px;white-space:nowrap}
@media (max-width:639px){
  .rgl{display:block!important;left:auto!important;right:calc(100% + 4px)!important;top:calc(var(--rt) + var(--rh) * (1 - var(--gf,.5)) - 15px)!important;font-size:11px;color:var(--label2)!important;z-index:6}
  .rgl0{display:block!important;left:auto!important;right:calc(100% + 4px)!important;top:calc(var(--rt) + var(--rh) - 14px)!important;font-size:11px;z-index:6}
  .dhd .readout{line-height:16px;align-items:flex-start;height:16px!important;white-space:nowrap!important}
  .dhd .ro{overflow:visible}
  .prun{display:flex!important;overflow:hidden;min-width:0;margin-left:0!important;justify-content:flex-start!important;justify-self:end!important;grid-area:run}
  .dock .rowlbl>span{font-size:11px}
}
.row-value .wcomp,.row-value .wcomp svg{width:13px!important;height:13px!important}
.hero .conditions .row-value{display:flex;gap:6px;align-items:baseline!important}
.row-value .wcomp{display:inline-flex;margin:0;align-self:center;transform:translateY(1px)}
.rail details>summary{display:inline-flex}
.rail details>summary::-webkit-details-marker{display:none}
.rail details>summary::before{content:"";width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);transition:transform .15s;margin:0 2px}
.rail details[open]>summary::before{transform:rotate(45deg)}
.segs .dlab{position:absolute;top:50%;transform:translateY(-50%);z-index:2;pointer-events:none;padding-left:0}
@media (max-width:639px){
  .attrib{z-index:6;pointer-events:none;left:.75rem!important;right:.75rem!important;bottom:.375rem!important;display:none!important}
  .dock{padding:.625rem .75rem .5rem .625rem;border-radius:16px 16px 0 0!important;box-shadow:0 -8px 24px rgba(0,0,0,.12)!important;bottom:0!important;padding-left:16px!important;padding-right:16px!important;padding-top:8px!important;padding-bottom:16px!important}
}
.dock{position:absolute;gap:.875rem;display:grid;column-gap:.875rem;align-items:start;padding-top:10px!important;row-gap:4px!important;padding-bottom:16px!important}
@media (max-width:599px){
  .dock .rowlbl{grid-column:1/-1!important;grid-row:2!important;width:auto!important;height:auto!important;align-self:stretch;pointer-events:none;z-index:6;margin-left:28px}
  .dock .rowlbl>span{flex-direction:row!important;align-items:center!important;left:8px!important}
  .dock .dkey{margin-left:0}
}
@media (min-width:600px){
  .dhl{gap:16px!important;flex-direction:row!important;column-gap:16px;row-gap:2px;flex-wrap:nowrap!important;align-items:baseline}
  .dhl .readout{height:auto!important;overflow:visible!important;flex-basis:auto;order:0;min-width:0;white-space:nowrap!important}
}
.badge::before{border-radius:50%;width:auto!important;height:auto!important;content:none!important;display:none!important}
.badge .ck{width:14px;height:14px;margin-right:4px;vertical-align:-2px;color:var(--label2)}
#app.light .nowline{background:#4b4d53!important}
.bubble{color:var(--label)!important}
.bubble .pinG{display:none;width:10px;height:10px}
.bubble.pin{background:var(--label)!important;color:var(--mat)!important;box-shadow:none!important}
.bubble.pin .pinG{display:inline}
.thumb-knob.pin{width:2px!important;margin-left:-1px!important}
.track:focus{outline:none}
.track:focus-visible{outline:2px solid var(--label2)}
.hero .conditions .row-title,.kv span{font-size:13px;font-weight:400!important;color:var(--label2)!important}
.hero .conditions .row-value,.kv b{font-size:15px;font-weight:600!important;color:var(--label)!important}
.hero .conditions .row-sub,.hero .conditions .row-sub *{font-size:13px;color:var(--label2)!important;text-align:right}
.rail details>summary{list-style:none;align-items:center;gap:6px;cursor:pointer;justify-content:flex-end;width:100%}
.pstat .kv b{font-size:24px!important}
.pstat .pofl2{text-align:right}
.rail .dir{margin-top:.25rem;font-size:24px;height:36px!important;line-height:36px!important;font-weight:600}
.rail .dir .dbadge{height:29px!important;min-width:40px!important;font-size:15px!important;border-radius:5px!important;vertical-align:4px!important} /* the title's cap height (24 px type: 17) plus 6 px above and below, on its baseline */
.rail .dir{line-height:30px!important}
.rail .hero .outl{margin-top:6px!important}
.rail .hero .conditions .row{padding-top:2px!important;padding-bottom:2px!important}
.rail .hero .disl{margin-top:2px!important;line-height:18px!important}
.pstat .kv b{letter-spacing:-.02em;font-size:15px!important} /* the panel's other values' size */
.pstat .pofl2,.pstat .pofl2 *{text-align:left!important}
#wind-why{text-align:right;color:var(--label3)!important}
#wind-s{text-align:left!important;margin:4px 0 0}
.rail #wind-s details>summary{width:100%;padding:4px 0;border-top:1px solid var(--sep);margin-top:2px;justify-content:flex-start!important}
.rail #wind-s details>summary::before{margin-left:0!important}
.prun{align-items:center;gap:8px!important}
.prun b{font-weight:400!important;color:var(--label)}
.prun b:empty{display:none}
.lbl.town.num span{display:none!important}
.lbl.town.num i{color:var(--bg);font:600 11px/1 "IBM Plex Sans",system-ui,sans-serif;font-style:normal}
.row.mapkey .tkey{display:inline-flex;align-items:center;gap:4px}
.row.mapkey .plk.gh{opacity:1} /* the map draws these lines at full strength (GHOST_OP): the dashes say hypothetical */
.row.mapkey .tkey b{display:inline-grid;place-items:center;width:15px;height:15px;border-radius:50%;background:var(--eastLine);color:var(--mat);font:600 11px/1 "IBM Plex Sans",system-ui,sans-serif}
.prun .frs{color:var(--label2);font-variant-numeric:tabular-nums}
.prun .frs b{font-weight:600;color:var(--label2)}
.prun .age{margin-left:8px;display:none}
.row.mapkey .kbr{flex-basis:100%;height:0}
.sb4{margin-top:4px;font-size:13px;line-height:1.4;color:var(--label2)}
.prun .frs b{font-weight:600!important}
.probl{margin-top:4px;font-size:13px;line-height:1.4;color:var(--label2)}
.pofl2 em,.sb3 em{font-weight:600}
.rpk .rpkc{display:none}
@media (max-width:599px){
  .dock .scrub{margin-left:28px;width:calc(100% - 28px)!important;min-width:0;box-sizing:border-box}
  .dock{grid-template-columns:minmax(0,1fr)!important;padding:12px 16px 12px!important;padding-right:16px!important}
  .dock .rowlbl #dir-l{height:14px!important;top:calc(34px + var(--dt) - 22px)!important}
}
#rpk.off~#rpkc,.rpk.off+.rpkc3{opacity:0}
.row.mapkey.mapov{left:calc(min(22rem, 40%) + 32px);bottom:calc(var(--dock-top-h, 260px) + 12px);gap:6px 16px;max-width:calc(100% - min(22rem,40%) - 64px);font-size:13px;color:var(--label2)}
.row.mapkey.mapov span{display:inline-flex;align-items:center;gap:6px}
.row.mapkey.mapov .kbr{display:none}
.lbl.town.num i{display:grid!important;place-items:center;border-radius:50%;background:var(--eastLine)!important;pointer-events:auto;cursor:default;width:22px!important;height:22px!important;margin:-11px 0 0 -11px!important;font-size:13px;box-shadow:0 0 0 2.5px var(--bg)!important}
.labels .lbl.town.num{pointer-events:none}
.lbl.town.num i{box-shadow:0 0 0 3px var(--bg)!important} /* a 3 px halo in the scene's colour: the landing line breaks around the disc */
#app:not(.light) .lbl.town.num i{background:#2f4a7a!important;color:#fff!important;box-shadow:0 0 0 1.5px #16233b,0 0 0 4px var(--bg)!important} /* dark: the 07 badge's navy, white numerals, a darker ring */
#app:not(.light) .row.mapkey .tkey b{background:#2f4a7a!important;color:#fff!important}
@media (min-width:640px){
  .hero .conditions .row,.row.accrow,.kv{padding-top:3px!important;padding-bottom:3px!important}
  .probl{-webkit-box-orient:vertical;display:block;-webkit-line-clamp:unset;overflow:visible}
  .rail .hsec{margin-top:4px!important;padding-top:4px!important}
}
.rail:not(:hover){scrollbar-width:none}
.rpk{position:absolute;pointer-events:none;transition:opacity .15s;z-index:6!important;overflow:visible;white-space:nowrap;background:none;padding:0;border-radius:0;font-size:11px;color:var(--label2);text-shadow:0 0 3px var(--mat),0 0 3px var(--mat)} /* no box: a halo, as on the dashboard */
.rpkc3{position:absolute;z-index:6;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid var(--label2);pointer-events:none;display:none!important}
#app:not(.light) .pgwash3{background:rgba(255,165,50,.08)!important}
@media (max-width:639px){
  .row.mapkey.mapov{left:12px;right:12px;bottom:calc(var(--dock-h,300px) + 8px);font-size:11px}
}
.kv b .kvn{display:block;font-size:13px!important;font-weight:400!important;color:var(--label2);text-align:right}
.row.mapkey.mapov{position:absolute!important;z-index:4;display:flex!important;padding:6px 10px!important;pointer-events:none;background:var(--mat)!important;box-shadow:0 0 0 1px var(--edge),0 2px 8px var(--shadow)!important;border-radius:8px!important;left:var(--rail-l,16px)!important;top:calc(var(--rail-b,400px) + 12px)!important;bottom:auto!important;width:var(--rail-w,352px)!important;box-sizing:border-box;flex-wrap:wrap!important;white-space:normal!important;max-width:none!important;transform:none!important}
.rail{position:absolute;display:flex;flex-direction:column;pointer-events:none;max-height:none;-webkit-mask-image:none;mask-image:none}
.rail.over{-webkit-mask-image:linear-gradient(#000 calc(100% - 24px),transparent);mask-image:linear-gradient(#000 calc(100% - 24px),transparent)}
.rail .hero{position:static;max-width:none;will-change:transform;padding-bottom:16px!important}
.dpk{margin-left:auto;font-size:11px;color:var(--label2);white-space:nowrap;align-self:center;display:none}
.dhl{display:flex;min-width:0;flex:1}
.dock .scrub,.dock .rowlbl{margin-top:0}
.dock .dhd{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;min-width:0;margin:0 0 6px;margin-bottom:0!important}
.bubble{position:absolute;left:0;pointer-events:none;will-change:transform;border:0;bottom:auto!important;height:18px!important;padding:0 6px!important;border-radius:4px!important;z-index:6;background:var(--mat)!important;box-shadow:inset 0 0 0 1.5px var(--label)!important;display:inline-flex!important;align-items:center;gap:3px;top:calc(-34px + 1px)!important}
.ticks span.hr.off,.ticks span.nowtick.off,.ticks span.day.off{opacity:1!important}
@media (max-width:639px){
  .row.mapkey.mapov{transform:none!important;max-width:none!important;gap:4px 12px;pointer-events:auto;scrollbar-width:none;display:flex!important;flex-wrap:wrap!important;white-space:normal!important;overflow-x:visible;justify-content:center!important;top:auto!important;bottom:calc(var(--dock-h,300px) + 8px)!important;width:auto!important;left:12px!important;right:12px!important}
  .prun .fw{display:none}
  .dpk{display:none}
}
.ticks span.day.near{opacity:0!important}
.prun .fi{display:none}
@media (max-width:639px){
  .prun .fi{display:inline}
}
.sb5{margin-top:4px;font-size:13px;line-height:1.4;color:var(--label)}
.sb5 b{font-weight:600;color:#9a5a00}
#app:not(.light) .sb5 b{color:#f0a24a}
.rpkl{position:absolute;z-index:6;width:1px;background:var(--label3);pointer-events:none}
.dir.fut .dbadge{opacity:1!important}
.ticks span.day.near,.ticks span.hr.near,.ticks span.nowtick.near{opacity:0!important;transition:opacity .12s}
@media (max-height:760px) and (min-width:640px){
  .probl{display:none}
}
@media (max-width:639px){
  .sb0{font-size:13px;color:var(--label2);margin-bottom:2px}
  .sb0 .nw{white-space:nowrap}
  .sb1 .tarr{width:1.1em;height:.8em;margin-left:0}
}
.rail .probl,.rail .disl{font-size:15px;line-height:1.4;color:var(--label2)}
.hero .conditions .row-title small{display:none}
@media (max-width:639px){
  .sbx{margin-top:0}
  .sbx>summary{list-style:none;cursor:pointer;font-size:13px;font-weight:500;color:var(--label2);display:inline-flex;align-items:center;gap:4px;pointer-events:auto;position:absolute;right:14px;top:10px}
  .sb1{padding-right:84px}
  .sbx>summary{flex-direction:row-reverse;min-height:24px;padding:0 4px;border-radius:6px;left:auto!important;width:auto!important}
  #app .rail details.sbx>summary::before{content:"";display:inline-block;width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg);margin:0 2px 3px;transition:transform .15s}
  #app .rail details.sbx[open]>summary::before{transform:rotate(-135deg);margin-bottom:-2px}
  .sbx>summary::-webkit-details-marker{display:none}
  .sbx>summary::after{font-size:11px;content:none}
  .sbx[open]>summary::after{content:"▴"}
  .rail details.sbx>summary::before{display:none}
}
.pofl3{font-size:13px;color:var(--label);margin-top:2px}
@media (max-width:639px){
  .ptz button{height:26px!important;font-size:13px;padding:0 8px!important}
  .ticks span.hr.h00{display:none!important}
}
#app:not(.light) .nights i{background:rgba(0,0,0,.22)!important} /* dark: darker than the plot, as on the dashboard */
.rail .probl,.rail .disl,.rail .outl{text-wrap:pretty}
.rail .hero.fut .probl,.rail .hero.fut .disl{display:none!important}
@media (min-width:640px){
  .dock .rowlbl{width:186px!important;padding-right:36px!important;box-sizing:border-box}
  .dock .rowlbl>span{right:36px!important;white-space:nowrap}
  .dhl .dkey{margin:0 0 0 auto!important;display:flex!important;flex-wrap:nowrap;gap:12px;font-size:13px;align-self:center}
}
@media (max-width:639px){
  .dhl .dkey{display:none!important}
}
.pdet>summary{list-style:none;cursor:pointer;font-size:13px;color:var(--label2);padding:4px 0;display:inline-flex;align-items:center;gap:6px;pointer-events:auto;width:100%;justify-content:flex-start}
.pdet>summary::-webkit-details-marker{display:none}
.pdet>summary::after{font-size:11px;content:none}
.pdet[open]>summary::after{content:"▴"}
.pdet .probl{margin-top:4px}
.badge.nb{color:var(--label2);font-weight:500}
.pstat .kv b small{font-size:13px;font-weight:400;color:var(--label2)}
.pstat .kv b small em{font-style:normal;font-weight:600;color:#9a5a00}
#app:not(.light) .pstat .kv b small em{color:#f0a24a}
.rail .probl,.rail .disl,.rail .outl,.sb4,.sb5{text-wrap:pretty}
@media (max-width:639px){
  .row.mapkey.mapov .kbr{display:block!important;flex-basis:100%;height:0}
}
.pdet>summary::before{content:"";width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);transition:transform .15s;margin:0 2px}
.pdet[open]>summary::before{transform:rotate(45deg)}
.rail .pdet>summary{justify-content:flex-start!important;width:100%;font-weight:500;color:var(--label)}
.rail .pdetrow{padding:6px 0!important}
@media (max-width:639px){
  .sbx>summary::before{content:"";width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);transition:transform .15s;margin:0 2px}
  .sbx[open]>summary::before{transform:rotate(45deg)}
}
.dhl .dkey{display:none!important}
@media (min-width:640px){
  #app.keyfree .row.mapkey.mapov{left:calc(var(--rail-r,368px) + 16px)!important;top:auto!important;bottom:calc(var(--dock-top-h,260px) + 16px)!important;width:var(--rail-w,336px)!important;flex-wrap:wrap!important;white-space:normal!important}
}
.rpkl::after{content:"";position:absolute;left:-1.5px;bottom:-2px;width:4px;height:4px;border-radius:50%;background:var(--label)}
.risk .grid.half{stroke-opacity:.3}
.rail .disl .ofn{font-weight:400;color:#9a5a00}
.rail .dir.nbh{font-size:18px!important;white-space:nowrap} /* the night headline is longer */
.sb1.nbh{font-size:18px!important}
.sb1.nbh .dbadge,.dir.nbh .dbadge{background:transparent!important;color:var(--label2)!important;box-shadow:inset 0 0 0 1.5px var(--label3)!important}
.segs{position:relative}
#knob{-webkit-mask:var(--mk,none);mask:var(--mk,none)} /* a gap where the line crosses an in-bar label */
@media (max-width:639px){.dhd .readout{height:auto!important;flex-wrap:wrap;overflow:visible!important;row-gap:4px} .dhd .readout .ro{flex:1 1 100%} .dhd .rback{margin-left:0!important}} /* phones: "Back to now" on its own row under the readout */

.segs i.lo{opacity:1!important}
.segs i.e.lo{background:color-mix(in srgb,var(--east) 38%,var(--mat))!important}
.segs i.w.lo{background:color-mix(in srgb,var(--west) 38%,var(--mat))!important}
#app:not(.light) .segs i.e.lo{background:color-mix(in srgb,var(--east) 40%,var(--label))!important}
#app:not(.light) .segs i.w.lo{background:color-mix(in srgb,var(--west) 40%,var(--label))!important}
.dkey .lessk{background:linear-gradient(90deg,color-mix(in srgb,var(--east) 38%,var(--mat)) 50%,color-mix(in srgb,var(--west) 38%,var(--mat)) 50%)!important;opacity:1!important}
#app:not(.light) .dkey .lessk{background:linear-gradient(90deg,color-mix(in srgb,var(--east) 40%,var(--label)) 50%,color-mix(in srgb,var(--west) 40%,var(--label)) 50%)!important}
.track .swchip{position:absolute;top:calc(var(--dt) - 15px);height:14px;padding:0 6px;border-radius:3px 3px 0 0;font:500 11px/14px "IBM Plex Sans",system-ui,sans-serif;color:#fff;background:var(--dc);z-index:8;white-space:nowrap;pointer-events:none}
#app .track .swchip.w{color:#0f1a17} /* dark ink on teal, white on navy: >= 4.5:1 in both themes */
#app .track .swchip.e{color:#fff}
@media (max-width:599px){#track > #dkey.inbar{display:flex!important;position:absolute;left:0;right:0;top:calc(var(--dt) + var(--dh) + 6px);margin:0!important;z-index:7;background:var(--mat);flex-wrap:wrap;row-gap:2px;padding:2px 0;grid-column:auto!important}}
.segs .swtab{position:absolute!important;top:0;bottom:0;flex:none!important;border-radius:0 6px 6px 0!important;z-index:2}
.risk rect.hov{fill:var(--label)!important;opacity:1!important;filter:none!important}
@media (max-width:639px){.eof{display:block}.eofs{display:none}}
.eof{white-space:nowrap;font-weight:400;color:var(--label2)} /* "(end of forecast)": secondary, never split */
.rail .outl,.sb2{text-wrap:balance}
.ticks span.pgl.ra::after,.track .pgl.ra::after{content:'';position:absolute;left:var(--tk);bottom:-4px;width:1px;height:4px;background:inherit}
#app:not(.light) .rail .disl .ofn{color:#f0a24a}
@media (min-width:640px){
  .row.mapkey.mapov .kbr{display:block!important;flex-basis:100%;height:0}
  .row.mapkey.mapov{border-radius:16px!important;padding:8px 14px!important}
  .rail .row.mapkey.inrail{font-size:13px;gap:2px 12px;padding:10px 0 0!important;margin-top:0;border-top:1px solid var(--sep)!important;line-height:18px} /* a hairline and 12 px above the key */
  .rail .row.mapkey.inrail::before{display:none!important}
  .rail .hero .conditions .row.pdetrow{padding-top:0!important;padding-bottom:0!important}
  .rail .row.mapkey.inrail .tkey b{width:13px;height:13px}
  .rail .row.mapkey.inrail .kbr{display:block;flex-basis:100%;height:0}
}
@media (max-width:639px){
  .row.mapkey.mapov{border-radius:16px!important} /* one corner radius for the cards and the bottom sheet */
}
@media (max-width:599px){ /* phones: every control in the header is a 44 px touch target, as on the dashboard */
  .ptabs a{min-height:44px;display:inline-flex;align-items:center}
  .ptz button{height:44px!important}
  .pthm{height:44px!important}
}
/* the in-bar direction label on a solid chip of its bar colour, so the night hatch never runs behind it (as on the dashboard) */
.segs .dlab{padding:3px 6px;margin-left:-6px;border-radius:3px;line-height:14px}
.segs .dlab.e{background:var(--east)}
.segs .dlab.w{background:var(--west);color:#10131c!important} /* dark ink on teal in both themes (>= 4.5:1), as the switch chip */
/* the run picker in the dashboard's control style: a 2 px track round a raised 28 px pill, 8 px outer radius */
.dmenu select{height:28px;margin:2px;padding:0 26px 0 10px!important;line-height:28px;border-radius:6px!important;background:var(--mat)!important;box-shadow:0 0 0 2px var(--fill2),0 1px 2px rgba(0,0,0,.12)!important}
.dmenu select:hover{background:var(--mat)!important}
.dmenu svg{right:10px!important}
/* Runway 18 in use now, closed later: the closure in the secondary ink */
#r18-v .r18c{font-size:13px;font-weight:400;color:var(--label2);white-space:nowrap;margin-left:4px}
#r18-v:has(.r18c){display:flex;flex-wrap:nowrap;align-items:baseline;justify-content:flex-end;white-space:nowrap}
#r18-v:has(.r18c) .badge{white-space:nowrap}
.row-main:has(.r18c) .row-title{white-space:nowrap}
@media (max-width:599px){
  /* the 48 h legend under the last row, full width */
  .dock > .dkey{display:flex!important;grid-column:1/-1;grid-row:2;flex-direction:row;flex-wrap:wrap;gap:4px 12px;margin:10px 0 0;font-size:13px;white-space:normal;align-self:start}
  /* "Back to now" on the readout line, over its right end: no reserved row under the readout */
  .dhd .readout{position:relative;flex-wrap:nowrap!important}
  .dhd .rback{position:absolute;right:0;top:50%;transform:translateY(-50%)}
  .dhd .readout{height:32px!important;align-items:center}
  .dhd .readout .ro{white-space:normal!important;line-height:16px;max-height:32px;overflow:hidden}
  .dhd .readout:has(.rback[style*="visible"]) .ro{padding-right:112px} /* pinned: up to two 16 px lines beside the button, in the same 32 px row */
  /* segmented controls: the track shows 4 px round the selected pill */
  .ptz,.ptabs{padding:4px!important}
  /* Details: a pill-shaped button, a 44 px target */
  #app .sbx>summary{min-height:44px;padding:0 14px 0 16px;border-radius:22px;background:var(--fill);box-shadow:inset 0 0 0 1px var(--sep);color:var(--label);gap:6px}
}
/* the switch chip names its hour (as on the dashboard); the tick marks the hour when the chip sits left of it */
.track .swchip{top:calc(var(--dt) - 16px);height:16px;font-size:13px;line-height:16px}
.track .swtick{position:absolute;top:var(--dt);height:var(--dh);width:2px;margin-left:-1px;background:var(--label);z-index:3;pointer-events:none}
/* dark: the night band a step lighter than the card, with hairline edges (as on the dashboard) */
#app:not(.light) .nights i{background:rgba(255,255,255,.06)!important;box-shadow:inset 1px 0 rgba(255,255,255,.09),inset -1px 0 rgba(255,255,255,.09)}
/* axis values at the 13 px step on every width (as on the dashboard) */
.dock .rgl0,.dock .rgl2{font-size:13px!important}
@media (max-width:599px){
  /* row names on a chip of the sheet's colour: day lines and night bands stop at the name */
  .dock .rowlbl{z-index:5;pointer-events:none}
  .dock .rowlbl>span{background:var(--mat);border-radius:4px;width:max-content;padding-right:6px}
}
/* Runway 18 in use now, closing later: one baseline for the check, "In use now" and the closure; a red dot keys the closure to the red cells */
#r18-v:has(.r18c) .badge{display:inline-block;padding:0;background:none;line-height:20px}
#r18-v .badge .ck{vertical-align:-3px;margin-right:4px}
#r18-v:has(.r18c) .badge .ck{display:none}
#r18-v .r18c .r18d{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--closed);margin:0 5px 0 0;vertical-align:1px}
#r18-v:has(.r18c) .r18c{margin-left:0}
.row-main:has(.r18c){gap:6px}
/* the official amber one step darker in light mode (>= 6:1 on the card) */
#app.light .pstat .pofl em,#app.light .sb3 em,#app.light .pofl2 em,#app.light .pstat .kv b small em{color:#8a5000}
/* the peak note and the compass at the 12 px floor */
.rpk{font-size:12px!important}
.rose b{font-size:12px}
@media (min-width:640px){
  /* the left card's text inset equals the chart card's (24 px) */
  .rail{width:22rem!important}
  .rail .hero{padding-left:24px!important;padding-right:24px!important}
  /* Details: an outlined pill, as on phones */
  .rail .pdet>summary{width:auto!important;display:inline-flex;flex-direction:row-reverse;min-height:30px;padding:0 12px 0 14px;border-radius:15px;background:var(--fill);box-shadow:inset 0 0 0 1px var(--sep);gap:8px;color:var(--label)}
  .rail .pdet>summary:hover{background:var(--fill2)}
  .rail .pdet>summary::before{transform:rotate(45deg);margin:0 2px 3px}
  .rail .pdet[open]>summary::before{transform:rotate(-135deg);margin:3px 2px 0}
  /* how to move the map: one quiet line in the free area's bottom-right corner */
  .hint3{position:absolute;right:1rem;bottom:calc(var(--dock-top-h,260px) + 10px);zoom:var(--hz,1);font-size:12px;line-height:16px;color:var(--label2);background:color-mix(in srgb,var(--mat) 82%,transparent);padding:2px 8px;border-radius:8px;pointer-events:none;white-space:nowrap;z-index:3}
}
@media (max-width:639px){.hint3{display:none}}
body.card .hint3,body.bare .hint3{display:none}
@media (max-width:599px){
  /* the bottom sheet inset like the cards above it, every corner rounded */
  .dock{left:8px!important;right:8px!important;bottom:8px!important;border-radius:16px!important;padding-left:12px!important;padding-right:12px!important}
  /* the plot starts 38 px into the content: the Now pill keeps 12 px from the sheet's edge */
  .dock .scrub,.dock .rowlbl{margin-left:38px!important}
  .dock .scrub{width:calc(100% - 38px)!important}
  /* value labels inside the plot, 4 px clear of the Now line (as on the dashboard) */
  .dock .rgl0,.dock .rgl2{left:9px!important;right:auto!important;z-index:6}
  /* row names at the 13 px step, each on a chip of its text width + 4 px */
  .dock .rowlbl>span{font-size:13px!important;padding:0 2px!important;margin-left:-2px}
  .dhd .readout .ro,#dro{font-size:13px!important}
  /* the map key at the 12 px floor on one line of paths: inset 8 px like the cards above and below it */
  .row.mapkey.mapov{font-size:12px!important;gap:4px 8px!important;padding:6px!important;left:8px!important;right:8px!important}
  .row.mapkey.mapov span{gap:4px!important}
  /* runway tags about a fifth smaller on the small map */
  .lbl.rwy b{font-size:12px!important;line-height:14px;padding:1px 4px!important}
}
/* the Runway 18 row: "In use now" right-aligned like every other value, the later closure as a muted second line under it */
#r18-v:has(.r18c){flex-direction:column;align-items:flex-end!important;justify-content:flex-start;row-gap:1px}
#r18-v:has(.r18c) .r18c{line-height:16px}
.row-main:has(.r18c){align-items:baseline}
@media (min-width:640px){
  /* one divider weight for every row of the left card */
  .rail .row+.row::before,.rail .hsec,.rail .row.mapkey.inrail{border-top-width:1px!important;border-top-color:var(--sep)!important}
  /* one page gutter: the cards and the buttons on the header's 24 px, the footer under them 12 px further down */
  .rail{left:24px!important}
  .dock{left:24px!important;right:24px!important;bottom:48px!important}
  .attrib{line-height:16px!important;bottom:4px!important}
  /* the space the closure line and the footer gap take, given back by the left card's spacing (it never scrolls) */
  .rail .hero{padding-bottom:12px!important}
  .rail .hero .dir{margin-top:2px!important}
  .rail .hero .outl{margin-top:4px!important}
  .rail .row.wind .row-sub{margin-top:2px!important}
  .rail .pdet>summary{min-height:28px!important}
  .rail .row.mapkey.inrail{padding-top:8px!important;line-height:16px!important}
  .rail .row.mapkey.inrail>span{line-height:16px!important}
  .stack{right:24px!important}
  .rose{left:24px}
  .hint3{right:24px}
}
@media (min-width:640px) and (min-height:801px){
  /* the legend row 8 px further from the Runway 18 strip (short windows keep the space for the left card) */
  .dock .dkey{margin-top:22px!important}
}
@media (min-width:640px) and (max-height:800px){
  /* short windows (1366 x 768): the left card's spacing tightened so it never scrolls */
  .rail .hero .outl{margin-top:2px!important}
  .rail .hsec{margin-top:2px!important;padding-top:2px!important}
  .rail .conditions>.row{padding-top:0!important;padding-bottom:0!important}
  .rail .row-sub{line-height:16px!important}
  .rail .row-sub+.row-sub{margin-top:0!important}
  .rail .row.mapkey.inrail{padding-top:6px!important}
  .rail .pdet{margin-top:2px!important}
  .rail .hero{padding-bottom:8px!important}
  .rail .kv{padding-top:1px!important;padding-bottom:1px!important}
  .rail .hero{padding-top:6px!important}
  .rail .hero .dir{margin-top:0!important}
  .rail .row.mapkey.inrail{padding-top:4px!important}
}
@media (max-width:599px){
  /* the map key: the bottom sheet's 12 px inset, two left-aligned rows (paths, then towns) */
  .row.mapkey.mapov{padding:8px 12px!important;justify-content:flex-start!important;gap:4px 7px!important}
  .row.mapkey.mapov .kbr{flex-basis:100%;height:0}
  .row.mapkey.mapov .plk,.row.mapkey.mapov .tok{width:14px!important}
  .row.mapkey.mapov span{gap:3px!important}
  /* a thin Now line: still the darkest rule, no longer an axis */
  .dock .nowline{width:1px!important;margin-left:-.5px!important}
}
/* the map hint on a quiet chip with a hairline edge, so it reads on the pale map */
.hint3{background:color-mix(in srgb,var(--mat) 92%,transparent)!important;box-shadow:0 0 0 1px var(--sep)}
/* one outlined control style on the 3D map and card: Reset view, Full screen and Details (28 px, a 14 px radius, a 1 px edge) */
#app{--ctl-edge:color-mix(in srgb,var(--label) 24%,var(--mat))}
@media (min-width:640px){
  #app .stack.panel{background:none!important;box-shadow:none!important;border:0!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;gap:8px;overflow:visible!important;border-radius:0!important}
  #app .stack .ib{height:28px!important;min-height:28px;box-sizing:border-box;padding:0 12px!important;border:1px solid var(--ctl-edge)!important;border-radius:14px!important;background:var(--mat)!important;color:var(--label)!important;font-size:13px;font-weight:500;box-shadow:0 1px 2px rgba(0,0,0,.06)}
  #app .stack .ib:hover{background:var(--fill)!important}
  #app .rail .pdet>summary{height:28px;min-height:28px!important;box-sizing:border-box;border:1px solid var(--ctl-edge)!important;border-radius:14px!important;background:var(--mat)!important;box-shadow:0 1px 2px rgba(0,0,0,.06)!important;color:var(--label)!important}
  #app .rail .pdet>summary:hover{background:var(--fill)!important}
  /* the run picker keeps the zoom pills' track (as on the dashboard), at the same 28 px height and text colour */
  #app .dmenu select{color:var(--label)}
  /* the map hint a step darker */
  #app .hint3{color:color-mix(in srgb,var(--label2) 50%,var(--label))!important;background:color-mix(in srgb,var(--mat) 96%,transparent)!important}
}
/* runway tags on the light map: a white tag with a dark hairline and dark text, secondary to the path lines */
#app.light .lbl.rwy b{background:#fff!important;color:#1b1c1e!important;box-shadow:inset 0 0 0 1px #55575d}
@media (max-width:599px){
  /* the map key is the map's footer: no card of its own, two left-aligned rows on a light wash just above the bottom sheet */
  #app .row.mapkey.mapov{background:color-mix(in srgb,var(--mat) 82%,transparent)!important;box-shadow:none!important;border:0!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;padding:3px 12px!important;bottom:calc(var(--dock-h,300px) + 4px)!important;border-radius:10px!important;row-gap:2px!important;line-height:16px}
  /* the 48 h legend as an aligned grid: three columns with equal starts, the closure key across the last two */
  #app .dock > .dkey{display:grid!important;grid-template-columns:repeat(3,minmax(8em,max-content));justify-content:space-between;column-gap:10px;row-gap:4px}
  #app .dock > .dkey > .kr18{grid-column:span 2}
}
/* round 7, desktop: one chevron, theme glyph, footer air, the Now tag on its line, the map key as a strip on the map */
@media (min-width:640px){
  /* the theme toggle: an 18 px glyph at the other icons' 1.5 px stroke (24-unit box at 2 units), in the 32 px hit area */
  .pthm svg{width:18px!important;height:18px!important}
  /* the run picker: the Details chevron (a 5 px corner, 1.5 px strokes, pointing down) in the label colour; the zoom-pill
     track kept, with the map buttons' 1 px edge colour round it */
  #app .dmenu .chev,#app .rail .pdet>summary::before{box-sizing:content-box;width:5px;height:5px;border:0;border-right:1.5px solid var(--label);border-bottom:1.5px solid var(--label)}
  #app .dmenu .chev{position:absolute;right:12px;top:50%;margin-top:-5px;transform:rotate(45deg);pointer-events:none}
  #app .dmenu select{box-shadow:0 0 0 2px var(--fill2),0 0 0 3px var(--ctl-edge)!important}
  /* the footer: 24 px under the chart card, 16 px over the window's bottom */
  .dock{bottom:57px!important}
  .attrib{bottom:16px!important}
  /* the Now tag hangs off the top of its line, 3 px left of it (the dashboard's tag), the line up to the tag */
  #app .dock .nowline{width:1.5px!important;margin-left:-.75px!important;top:-12px!important}
  #app .ticks span.nowtick{transform:translateX(calc(-100% - 4px))!important}
  /* the map key: a compact strip at the map's bottom-left, on the page gutter, 12 px over the chart card; one grid of
     three columns (paths, then towns), on a light chip with a hairline edge like the map hint */
  #app .row.mapkey.mapov{top:auto!important;bottom:calc(var(--dock-top-h,260px) + 12px)!important;width:auto!important;display:grid!important;grid-template-columns:repeat(3,minmax(8em,max-content));column-gap:16px!important;row-gap:2px!important;padding:3px 12px!important;border-radius:10px!important;background:color-mix(in srgb,var(--mat) 94%,transparent)!important;box-shadow:0 0 0 1px var(--sep)!important;font-size:13px!important;line-height:16px!important;white-space:nowrap!important}
  #app .row.mapkey.mapov .kbr{display:none!important}
  #app .row.mapkey.mapov .kbr+span{grid-column-start:1}
  #app .row.mapkey.mapov:has(.gh){grid-template-columns:minmax(8em,max-content) minmax(8em,max-content) minmax(18.75em,max-content)}
  /* (columns as wide as the longest town name, "Neu-Isenburg", and "East (if switched)": the key keeps its
     width when hovering an hour shows other towns) */
}
/* round 8 (desktop): the Now tag points at its line; the chart card's bottom padding as its top; the run picker's
   edge reads as one 1 px line (an opaque near-white track inside the buttons' edge colour); the theme toggle outlined
   like a control; the footer as two short lines: the sources on the gutter, the backtest note ending on the chart
   card's right edge */
@media (min-width:640px){
  #app .ticks span.nowtick{overflow:visible}
  #app .ticks span.nowtick::after{content:'';position:absolute;left:100%;top:50%;margin-top:-4px;border-style:solid;border-width:4px 0 4px 4px;border-color:transparent;border-left-color:var(--label)}
  #app .dock{padding-bottom:10px!important}
  #app.light .dmenu select{box-shadow:0 0 0 2px color-mix(in srgb,var(--label) 3%,var(--mat)),0 0 0 calc(round(calc(2px * var(--hz,1) + 1px),1px) / var(--hz,1)) var(--ctl-edge)!important} /* an opaque, near-white track (a shadow spread paints under the ones listed before it: a translucent track lets the edge show through it); the edge's outer side on a device pixel */
  #app .pthm{box-shadow:inset 0 0 0 1px var(--ctl-edge);border-radius:8px}
  #app .pthm:hover{background:var(--fill)}
  #app .pthm:focus-visible{outline:2px solid var(--label);outline-offset:2px;border-radius:8px}
  .attrib .al{white-space:nowrap}
}
@media (min-width:1200px){
  .attrib{right:24px!important;display:flex!important;justify-content:space-between;column-gap:24px}
}
/* round 9 (desktop). One radius for the secondary controls: Reset view, Full screen and Details take the segmented
   controls' 8 px corners (the run picker's 6 px plus its 2 px track); the headline's drawn arrow; no unexplained wind glyph;
   the switch chip and the official tag 3 px over the bar; the "18 closed" annotation as on the dashboard; neutral town
   markers on a 2 px halo; the Main named; the 48 h legend on the row names' edge; the map key sized to its content */
@media (min-width:640px){
  #app .stack .ib,#app .rail .pdet>summary{border-radius:8px!important}
  #app .dir .harr{width:1em;height:.7em;margin:0 0 0 .25em;stroke-width:3.4;vertical-align:.02em}
  #app .wcomp{display:none!important}
  #app .track .swchip{top:calc(var(--dt) - 19px)!important;border-radius:3px!important}
  #app .track .pgl{top:calc(var(--dt) - 18px)!important;border-radius:3px!important}
  #app .track .pgl.ra::after{bottom:-7px;height:7px}
  #app .track .r18tag{position:absolute;z-index:8;height:16px;padding:0 6px;border-radius:3px;font:500 13px/16px "IBM Plex Sans",system-ui,sans-serif;white-space:nowrap;background:#2b2c2f;color:#f6f6f1;box-shadow:inset 0 -2px 0 var(--closed);pointer-events:none}
  #app .track .r18lead{position:absolute;width:1px;background:var(--closed);opacity:.6;pointer-events:none;z-index:2}
  #app .track .swstem{position:absolute;top:calc(var(--dt) - 3px);height:3px;width:1px;z-index:8;pointer-events:none}
  #app .track .r18brk{position:absolute;height:3px;border:1px solid var(--closed);border-bottom:0;border-radius:2px 2px 0 0;opacity:.6;pointer-events:none;box-sizing:border-box;z-index:2}
  #app .dock > .dkey{grid-column:2/-1!important} /* from the row names' column, the dashboard legend's edge */
  #app .row.mapkey.mapov:has(.gh){grid-template-columns:minmax(8em,max-content) minmax(8em,max-content) var(--kc3,18.75em)!important}
}
#app .lbl.town.num i,#app:not(.light) .lbl.town.num i{background:var(--mat)!important;color:var(--label)!important;box-shadow:inset 0 0 0 1.5px var(--label2),0 0 0 2px var(--mat)!important}
#app .row.mapkey .tkey b,#app:not(.light) .row.mapkey .tkey b{background:var(--mat)!important;color:var(--label)!important;box-shadow:inset 0 0 0 1.5px var(--label2)!important}
#app .lbl.rvl{font:italic 600 13px "IBM Plex Sans",system-ui,sans-serif;color:#244f72;white-space:nowrap;pointer-events:none;text-shadow:0 0 1px var(--bg),0 0 2px var(--bg),0 0 3px var(--bg),0 0 5px var(--bg)} /* a darker blue on a light halo: >= 4.5:1 against the map behind it */
#app:not(.light) .lbl.rvl{color:#8fb3d1}
/* round 10 (desktop): the map key as wide as the info card above it (one left and one right edge): two rows (paths, then
   towns) in three columns spread to both paddings */
@media (min-width:640px){
  #app .row.mapkey.mapov,#app .row.mapkey.mapov:has(.gh){width:var(--rail-w,352px)!important;max-width:none!important;box-sizing:border-box!important;grid-template-columns:repeat(3,max-content)!important;justify-content:space-between!important;column-gap:8px!important} /* the gap is a minimum: the columns spread to the paddings */
}
/* round 10: the peak note on a knockout of the card colour (no day line or gridline runs through its text) and a 1 px
   leader from its end to the peak dot, as on the dashboard */
#app .rpk{background:var(--mat);box-shadow:0 0 0 2px var(--mat)}
#app .rpk:empty{display:none}
.rpkh{position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:6;transition:opacity .15s}
.rpkh path{fill:none;stroke:var(--label2);stroke-width:1}
.track .swstem{display:none}
@media (min-width:640px){#app .track .swstem{display:block}}
/* round 11: the Runway 18 row names what a closure moves, right-aligned under the closure; the map hint is plain grey
   text on the map's halo (it is not a control); the accuracy row sits under Details */
#r18-s.r18is{display:block;text-align:right;margin-top:1px}
#r18-s .r18i{font-size:13px;line-height:16px;font-weight:400;color:var(--label2);white-space:nowrap}
.pdet .acc{margin-top:6px}
.pdet .acc .pstat{border-top:0;padding:0}
@media (min-width:640px){
  #app .rail>.hero{flex:1 0 auto} /* the card fills the rail, whose height sets one 12 px gap to the map key */
  #app .hint3{font-size:13px!important;line-height:18px!important;padding:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;border:0!important;color:var(--label2)!important;text-shadow:var(--halo)}
}
/* round 11 (phones): the outlook names the switch as "Sat 7 Nov, 14:00": it keeps clear of the Details button on the
   headline row: the compact card writes it "Switch to West · Sat 7 Nov, 14:00", one line beside the button */
@media (max-width:639px){
  .sumbar .sb2{padding-right:104px}
  .sumbar .sb2 .nw,.rail .outl .nw{white-space:nowrap}
}
/* round 12 (desktop). The left stack on the 16 px page gutter: the card, the map key and the timeline 16 px apart; the card
   wide enough for the kicker on one line, one padding on all four sides. The Runway 18 row as on the dashboard: the next
   closure is the value (a hollow ring while scheduled, a filled dot while in effect), its date and what it moves the lines
   under it. */
@media (min-width:640px){
  #app{--rail-w:400px}
  #app .rail{width:25rem!important}
  #app .rail .hero{padding:24px!important} /* the chart card's text inset, on all four sides */
  #app .row.wind .row-main #wind-why{margin:0 auto 0 0;font-size:13px;text-align:left;white-space:nowrap}
  #app .row.wind .row-main #wind-why::before{content:"· "}
  #r18-v:has(.r18b){display:flex;flex-direction:column;align-items:flex-end}
  .row-main:has(.r18b){align-items:baseline}
  #app .row.mapkey.mapov{bottom:calc(var(--dock-top-h,260px) + 16px)!important}
  /* the card is as tall as the stack allows: any spare height goes above the Details row, never under it */
  #app .rail>.hero{display:flex!important;flex-direction:column}
  #app .rail .hero>.conditions{flex:1 0 auto;display:flex;flex-direction:column}
  #app .rail .conditions>.pdetrow{margin-top:auto}
}
#r18-v .r18d{display:inline-block;box-sizing:border-box;width:10px;height:10px;margin:0 8px 0 0;border-radius:50%;border:2px solid var(--closed);background:var(--closed);vertical-align:0}
#r18-v .r18d.ring{background:transparent}
#r18-v .badge.r18b{display:inline-block;white-space:nowrap} /* inline-block: the row keeps the text baseline, not the ring's */
#r18-s.r18is{display:block;text-align:right} /* under the status, right-aligned with it, as the wind's compass line under its value */
#r18-s .r18w,#r18-s .r18i{display:block;font-size:13px;line-height:16px;font-weight:400;color:var(--label2);white-space:nowrap}
/* round 13 (desktop). The wind row: the label is "Wind now" alone, the compass wind a quiet line under the value. Every row of
   the card one hairline and one pitch. The map key below the card on the card's surface, radius and shadow. */
@media (min-width:640px){
  #app .row.wind #wind-why{display:block;margin:0;line-height:15px;text-align:right;white-space:nowrap}
  #app #r18-s .r18w,#app #r18-s .r18i{line-height:15px}
  #app .rail .hero>.dir{margin-top:0!important} /* the headline's badge carries its own air under the kicker */
  #app .row.wind #wind-why::before{content:none}
  #app #r18-s.r18is,#app #r18-s .r18w,#app #r18-s .r18i{text-align:right}
  #app .row.mapkey.mapov{background:var(--mat)!important;border:0!important;border-radius:16px!important;box-shadow:0 1px 3px rgba(0,0,0,.08),0 0 0 1px var(--edge)!important}
  #app .rail .hsec{margin-top:0!important;padding-top:0!important}
  #app .rail .hsec.conditions{padding-top:0!important}
  #app .rail .conditions>.row:not(.pdetrow):not(.mapkey){padding-top:4px!important;padding-bottom:4px!important}
  /* the timeline card's header as on the dashboard: the title at the dashboard card title's inset from the card top (the
     4 px come from the space under the header, so the card keeps its height) */
  #app .dock .dhd{margin-top:4px!important;margin-bottom:-4px!important}
}
@media (min-width:640px) and (max-height:800px){
  /* short windows (1366 x 768): one tighter pitch for every row; the compass wind is left to the map's wind chip, so the key
     still fits under the card */
  #app .rail .hsec{margin-top:0!important;padding-top:1px!important}
  #app .rail .hero>.hsec:not(.conditions){margin-top:-2px!important}
  #app .rail .hsec:not(.conditions) .kv{padding-bottom:2px!important}
  #app .rail .hsec.conditions{padding-top:0!important}
  #app .rail .conditions>.row:not(.pdetrow):not(.mapkey){padding-top:2px!important;padding-bottom:2px!important}
  #app .row.wind #wind-why{display:none}
}
/* round 12: the switch chip and the official tag 4 px over the direction bar (4 px under the hour axis); its stem 4 px */
@media (min-width:640px){
  #app .track .swchip{top:calc(var(--dt) - 20px)!important}
  #app .track .pgl{top:calc(var(--dt) - 19px)!important}
  #app .track .swstem{top:calc(var(--dt) - 4px)!important;height:4px!important}
}
/* round 14 (desktop). The map key on the info card's content edges (its 24 px side padding), 6 px above and below its rows
   (about 10 px to the glyphs, as the card's rows sit under their hairlines). The card: the kicker >= 6 px clear of the headline,
   whose box is no taller than its badge; Details as far under its hairline as the other rows' text. The page keeps its
   height (the key stays under the card): the kicker's line box and the rows' second lines give up their spare pixels. */
@media (min-width:640px){
  #app .row.mapkey.mapov,#app .row.mapkey.mapov:has(.gh){padding:12px 24px!important;row-gap:0!important}
  #app .rail .hero>.eyebrow{line-height:15px}
  #app .rail .hero>.dir{margin-top:7px!important;height:29px!important}
  #app .rail .hero>.outl{margin-top:3px!important}
  #app .row.wind #wind-why,#app #r18-s.r18is{margin-top:0!important}
  #app .rail .hero .conditions>.row.pdetrow details.pdet{margin-top:7px!important}
}
/* round 15 (desktop). The map key 12 px over and under its rows; the 12 px come from the space under Details (24 -> 12), so
   the gutters stay 16 px and the timeline card keeps its place */
@media (min-width:640px){
  #app:not(.keyfree) .rail .hero{padding-bottom:12px!important}
}
`;
