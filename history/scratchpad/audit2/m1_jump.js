global.window = {};
const E = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const surfaces = D.surfaces || D.SURFACES;
console.log('surface keys', Array.isArray(surfaces) ? surfaces.map(s=>s.id||s.name) : Object.keys(surfaces||{}));
const body = E.makeBody({});
const list = Array.isArray(surfaces) ? surfaces : Object.values(surfaces);
for (const surf of list.slice(0,3)) {
for (const gh of [false, true]) {
for (const F of [1e20*9.80665, 1e34*9.80665, Infinity]) {
  for (const mode of ['real','comic']) {
    const ctx = { F, body, surface: surf, groundHolds: gh, anchor: 'friction', mode };
    const j = E.jump(ctx);
    console.log((surf.id||surf.name), 'gh', gh, mode, 'F', F, 'v', j.v, 'apex', j.flight && (j.flight.apex||j.flight.maxH||j.flight.hMax), 'Eground', j.Eground, 'groundFails', j.groundFails, 'heldBack', j.heldBack, 'Ebody', j.Ebody, 'p.vA', j.push.vA, 'stalled', j.push.stalled);
  }
}}}
