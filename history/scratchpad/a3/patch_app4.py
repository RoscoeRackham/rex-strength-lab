import sys
p='/home/user/dino-strength-sim/src/app.html'; s=open(p).read()
def R(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit('count %d != %d for: %s'%(n,count,old[:160]))
    s=s.replace(old,new)
# L-02: room above the axis for the infinity rule; leaders at full contrast; only the bottom stack moves
R("    const padT = 24, padB = 24;\n    const H = padT + (LMAX - LMIN) * pxDec + padB;","    const padT = 40, padB = 24;\n    const H = padT + (LMAX - LMIN) * pxDec + padB;")
R("""      if (over > 0) { let next = Infinity; for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; it.ty = Math.min(it.ty - over, next - it.h); next = it.ty; } }""",
  """      if (over > 0) { let next = bottom + 16; for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; it.ty = Math.min(it.ty, next - it.h); next = it.ty; } }""")
R("""stroke: 'var(--ink-3)', 'stroke-width': 1, 'stroke-opacity': 0.6, 'pointer-events': 'none' }));""","""stroke: 'var(--ink-3)', 'stroke-width': 1, 'pointer-events': 'none' }));""")
# L-13 + L-03: visible focus box on the label hit area; dot hit targets split between neighbouring dots
R("""      g2.append(sv('rect', { x: left ? 0 : axisX + 9, y: it.ty - 13, width: axisX - 9, height: it.h - 2, fill: 'transparent' }));""",
  """      g2.append(sv('rect', { class: 'hit', rx: 4, x: left ? 1 : axisX + 9, y: it.ty - 13, width: axisX - 10, height: it.h - 2, fill: 'transparent' }));
      // dot hit target: its own half of the axis band, split at the midpoint to the nearest dot on the same side
      {
        const ys = (left ? tierItems : thItems).map((o) => y(o.lg)).sort((a, b) => a - b), k = ys.indexOf(yy);
        const top = Math.max(yy - 9, k > 0 ? (ys[k - 1] + yy) / 2 : -Infinity), bot = Math.min(yy + 9, k < ys.length - 1 ? (yy + ys[k + 1]) / 2 : Infinity);
        if (bot > top) g2.append(sv('rect', { x: left ? axisX - 9 : axisX, y: top, width: 9, height: bot - top, fill: 'transparent' }));
      }""")
# ux N3: tooltip never covers the focused marker
R("""        const scale = wrap.querySelector('svg').getBoundingClientRect().height / (H + 30);
        let top = it.ty * scale + 22;
        if (top + 90 > rect.height) top = Math.max(0, it.ty * scale - 100);
        tip.style.top = top + 'px';""","""        const gr = g2.getBoundingClientRect(), th2 = tip.offsetHeight;
        let top = gr.bottom - rect.top + 6;                                           // below the whole marker
        if (top + th2 > rect.height) top = Math.max(0, gr.top - rect.top - 6 - th2);  // else above it
        tip.style.top = top + 'px';""")
R("""      g2.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); it.set(); } });""",
  """      g2.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); it.set(); } else if (e.key === 'Escape') tip.hidden = true; });""")
# CSS: focus ring, narrow tabs
R(""".ladder-wrap svg .mk:focus { outline: none; }
.ladder-wrap svg .mk:focus .ring, .ladder-wrap svg .mk:hover .ring { stroke: var(--ink); }""",
""".ladder-wrap svg .mk:focus { outline: none; }
.ladder-wrap svg .mk:focus-visible .hit { stroke: var(--accent); stroke-width: 2px; }
.ladder-wrap svg .mk:focus-visible .ring, .ladder-wrap svg .mk:hover .ring { stroke: var(--ink); }""")
R(""".tab[aria-selected="true"] { background: var(--accent); border-color: var(--accent); color: #000; }""",
""".tab[aria-selected="true"] { background: var(--accent); border-color: var(--accent); color: #000; }
@media (max-width: 359px) { #tabs .tab { padding-left: 4px; padding-right: 4px; font-size: 1rem; } }""")
# perf: coalesce strength-slider renders to one per frame
R("""    $('#strength').addEventListener('input', (e) => { state.inf = false; state.logKg = Number(e.target.value); update(); });""",
  """    let strengthFrame = 0;
    $('#strength').addEventListener('input', (e) => {
      state.inf = false; state.logKg = Number(e.target.value);
      renderDial();
      if (strengthFrame) return;   // one bay render per frame while dragging
      strengthFrame = requestAnimationFrame(() => { strengthFrame = 0; save(); renderBay(true); scheduleLadder(); });
    });""")
open(p,'w').write(s); print('ok')
