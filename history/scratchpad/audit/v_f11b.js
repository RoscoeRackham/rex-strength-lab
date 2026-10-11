const { P, D, g, S } = require('./common');
// Default body, real mode: what limits the jump? vmax 30 m/s
const body = P.makeBody({ H: 2, m: 180 });
for (const gh of [false, true]) for (const lg of [2.7, 4, 5, 6, 6.85, 7, 8, 10, 10.55, 12, 20, 34]) {
  const j = P.jump({ F: 10 ** lg * g, mode: 'real', body, surface: S.concrete, groundHolds: gh, anchor: 'friction' });
  console.log('H=2 concrete real gh=' + gh, 'lift 1e' + lg, 'v=' + j.v.toFixed(2), 'apex=' + j.flight.apex.toFixed(1), 'vacApex=' + j.vacuumApex.toFixed(1), 'groundFails=' + j.groundFails, 'sat=' + !!j.push.saturated);
}
console.log('vacuum apex at vmax 30 m/s:', (30 * 30 / (2 * g)).toFixed(2), 'm');
// H=5 granite real, groundHolds false: apex vs strength (non-monotone)
const b5 = P.makeBody({ H: 5, m: 180 * Math.pow(2.5, 3) });
for (let lg = 5; lg <= 12; lg += 0.5) { const j = P.jump({ F: 10 ** lg * g, mode: 'real', body: b5, surface: S.granite, groundHolds: false, anchor: 'friction' }); console.log('H=5 granite real gh0 lift 1e' + lg, 'apex=' + j.flight.apex.toFixed(1), 'groundFails=' + j.groundFails); }
