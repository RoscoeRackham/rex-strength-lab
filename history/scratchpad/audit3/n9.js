global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({});
for (const sid of ['concrete','sand','granite']) {
const surface = D.surfaces.find((s) => s.id === sid);
for (const mode of ['comic','real']) {
for (let lg = 20; lg <= 31; lg += 0.25) {
  const c = { F: Math.pow(10, lg) * g, mode, body, surface, groundHolds: false, anchor: 'friction' };
  const r = P.stomp(c);
  console.log(sid, mode, lg, 'E=' + r.E.toExponential(2), 'D=' + (r.crater/1000).toFixed(0) + 'km', 'D/RE=' + (r.crater/P.K.R_E).toFixed(3), 'ps=' + r.planetScale, 'disr=' + r.disrupts, 'extrap=' + r.craterExtrapolated, 'vFoot=' + r.vFoot.toExponential(2));
}}}
