global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({});
const surface = D.surfaces.find(s => s.id === 'concrete');
let maxD = 0, at = null;
for (const o of D.objects) for (const ang of [-10, 0, 15, 30, 45, 60, 75, 89]) for (let lg = 3; lg <= 34; lg += 0.5) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' };
  let r; try { r = P.throwObject(c, o, ang); } catch (e) { continue; }
  if (r.crater > maxD && r.flight && r.flight.landed) { maxD = r.crater; at = [o.id, o.m, ang, lg, r.Eimpact]; }
}
console.log('max landed throw crater km', maxD / 1000, at);
console.log('R_E', P.K.R_E);
// stomp crossover: where crater > Earth's diameter and where > 0.1 R_E
const c0 = { mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' };
for (let lg = 25; lg <= 34; lg += 0.1) {
  const r = P.stomp(Object.assign({}, c0, { F: Math.pow(10, lg) * g }));
  if (r.crater > 2 * P.K.R_E) { console.log('crater > Earth diameter from 10^' + lg.toFixed(1), r.crater); break; }
}
for (let lg = 20; lg <= 34; lg += 0.1) {
  const r = P.stomp(Object.assign({}, c0, { F: Math.pow(10, lg) * g }));
  if (r.crater > 0.1 * P.K.R_E) { console.log('crater > 0.1 R_E from 10^' + lg.toFixed(1), r.crater, 'E', r.E); break; }
}
for (let lg = 20; lg <= 34; lg += 0.01) {
  const r = P.stomp(Object.assign({}, c0, { F: Math.pow(10, lg) * g }));
  if (r.disrupts) { console.log('disrupts from 10^' + lg.toFixed(2), r.crater, 'E', r.E); break; }
}
// infinity case
const ri = P.stomp(Object.assign({}, c0, { F: Infinity }));
console.log('inf', ri.crater, ri.disrupts);
