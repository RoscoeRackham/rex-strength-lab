const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const s = surf('softclay');
const st = P.walkStep(rex, s, { effort: 1 });
console.log('walk stamp on soft clay: peak', (st.Fpeak / 1000).toFixed(0), 'kN =', (st.peakPressure / 1000).toFixed(0), 'kPa vs bearing', (st.q / 1000).toFixed(0), 'kPa; ratio shown', st.ratio.toFixed(2), 'footprint', JSON.stringify(st.footprint), 'impulse N s', (st.Fpulse * st.Tpulse / 2).toFixed(0));
// stomp tab at a foot speed near 3.7 m/s
const c = ctxOf(90718.474 * g, { surface: s });
const p = P.RESTRAINT.plan('stomp', c, {});
let best = null;
for (let lg = 2; lg <= 4; lg += 0.01) { const r = p.run(Math.pow(10, lg) * g); if (r.vFoot >= 3.7) { best = { lg: lg.toFixed(2), vFoot: r.vFoot.toFixed(2), hole: r.holeDepth.toFixed(3) }; break; } }
console.log('stomp tab, soft clay, foot at ~3.7 m/s:', JSON.stringify(best), 'penetrationDepth(legEff, footArea, 3.7):', P.penetrationDepth(rex.legEff, rex.footArea, 3.7, P.qultFor(s, rex.footB), s.rho).toFixed(3));
