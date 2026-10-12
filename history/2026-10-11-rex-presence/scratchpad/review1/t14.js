const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
for (const E of [1, 10, 100, 1e3, 1e4]) console.log('E', E, 'J -> 100 Pa radius', P.blastRadius(E, 100).toFixed(2), 'm');
const base = { mode: 'comic', surface: surf('concrete'), groundHolds: false, anchor: 'friction' };
for (const kg of [3200, 3500, 5000, 10000]) {
  const cR = Object.assign({}, base, { F: kg * g, body: rex }), cO = Object.assign({}, base, { F: kg * g, body: ollie });
  const t = P.throwPartner(cR, cO, 45);
  if (!t.r || !t.r.canMove) { console.log(kg, 'cannot throw'); continue; }
  console.log(kg, 'kg: v', t.r.v.toFixed(2), 'vImpact', t.r.flight.vImpact.toFixed(2), 'Eimpact', t.r.Eimpact.toExponential(2), '100Pa radius', P.blastRadius(t.r.Eimpact, 100).toFixed(1), 'm');
}
