const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
for (const kg of [5470, 9060, DIAL, 1e6, 1e9]) {
  const cR = ctx(kg, rex, Object.assign({}, ON, { anchor: 'bolted' })), cO = ctx(kg, ollie, ON);
  const r = P.pushMatch(cR, cO);
  const src = P.impulseSource(cR.surface, r.footA, Math.max(r.t, 0.052));
  console.log(kg, r.outcome, 'footA', r.footA && r.footA.toExponential(3), 't', r.t && r.t.toFixed(4), 'plaster@5m', P.plasterOver([src], 5), 'ppv mm/s', (P.ppvAt(src, 5) * 1000).toFixed(2));
}
// compare: the single shove into a bolted partner with ownRecoil off, unbreakable on (counted by the lab)
for (const kg of [5470, DIAL]) {
  const cR = ctx(kg, rex, Object.assign({}, ON, { ownRecoil: false })), cO = ctx(kg, ollie, Object.assign({}, ON, { ownRecoil: false, anchor: 'bolted' }));
  const r = P.shove(cR, cO);
  console.log('shove off', kg, JSON.stringify(r.toGroundB), r.toGroundB ? P.plasterOver([P.impulseSource(cR.surface, r.toGroundB.J, r.toGroundB.T)], 5) : null, r.stalled);
}
