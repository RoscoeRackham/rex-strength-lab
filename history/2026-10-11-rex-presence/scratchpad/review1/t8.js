const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const base = { mode: 'comic', surface: surf('concrete'), groundHolds: false, anchor: 'friction' };
for (const kg of [2577, 3000, 3100, 5000, 20000, 90718]) {
  const cR = Object.assign({}, base, { F: kg * g, body: rex }), cO = Object.assign({}, base, { F: kg * g, body: ollie });
  const r = P.collide(cO, cR, { source: 'sprint', gb: 100 / 299792458, bounce: false });
  const Q = r.Elocal != null && (r.relativistic || r.outcome === 'boltsLate') ? r.Elocal : r.h ? r.h.Q : 0;
  console.log(kg, 'v0', r.v0 && r.v0.toFixed(2), 'outcome', r.outcome, 'Q', Q && Q.toExponential(3), 'blastR100Pa', P.blastRadius(Q, 100).toFixed(2), 'TNT kg', (Q / 4.184e6).toFixed(3));
}
