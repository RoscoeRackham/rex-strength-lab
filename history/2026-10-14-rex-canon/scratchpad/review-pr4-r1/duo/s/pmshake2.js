const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
const T0 = 0.06419420534596561; // the limb pulse the engine reports for these bodies
for (const kg of [DIAL, 1e5, 2e5, 1e6]) {
  const cR = ctx(kg, rex, Object.assign({}, ON, { anchor: 'bolted' })), cO = ctx(kg, ollie, ON);
  const r = P.pushMatch(cR, cO);
  const src = P.impulseSource(cR.surface, r.footA, Math.max(r.t, T0));
  console.log(kg, r.outcome, 'footA', Math.round(r.footA), 't', r.t.toFixed(4), 'plaster@5m', P.plasterOver([src], 5), 'ppv', (P.ppvAt(src, 5) * 1000).toFixed(1), 'mm/s', 'vB', r.vB.toFixed(1), 'slideB', r.slideB.toFixed(0));
}
