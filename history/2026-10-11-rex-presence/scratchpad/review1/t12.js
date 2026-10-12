const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const s = surf('concrete');
const st = P.walkStep(rex, s, { effort: 1 });
console.log('walk stamp: F', st.Fpulse.toFixed(0), 'T', st.Tpulse.toFixed(4), 'impulse', (st.Fpulse * st.Tpulse / 2).toFixed(0), 'N s; ppv 3m', (P.ppvAt(st.src, 3) * 1000).toFixed(2), 'mm/s; 5m', (P.ppvAt(st.src, 5)*1000).toFixed(2));
console.log('leg momentum at 3.7 m/s', (rex.legEff * 3.7).toFixed(0), 'N s; 16% body at 3.7', (0.16*3007*3.7).toFixed(0));
const c = ctxOf(90718.474 * g);
const p = P.RESTRAINT.planNow('stomp', c, {});
for (const lg of [2.5, 3, 3.5, 4, 4.5, 5]) {
  const r = p.run(Math.pow(10, lg) * g);
  const src = P.RESTRAINT.MOVES.stomp.shake(r, p.opt);
  console.log('stomp use 10^' + lg, 'vFoot', r.vFoot.toFixed(2), 'impulse', (src.F*src.T/2).toFixed(0), 'T', src.T.toFixed(3), 'ppv 3m', (P.ppvAt(src, 3)*1000).toFixed(2), '5m', (P.ppvAt(src,5)*1000).toFixed(2), 'hole', r.holeDepth.toFixed(3));
}
console.log('stomp goal', JSON.stringify(p.goal()), 'ceiling', JSON.stringify(p.ceiling()));
