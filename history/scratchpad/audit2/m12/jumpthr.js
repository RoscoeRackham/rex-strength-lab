global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
console.log('jump comicFrac', P.MUSCLE.jump.comicFrac, 'forceFrac', P.MUSCLE.jump.forceFrac);
for (const H of [2, 50]) for (const mode of ['real', 'comic']) {
  const body = P.makeBody({ H });
  const surface = D.surfaces.find(s => s.id === 'concrete');
  const base = { mode, body, surface, groundHolds: false, anchor: 'friction' };
  const thr = P.threshold((kg) => P.jump(Object.assign({}, base, { F: kg * g })).v > 0, 1e-3, 1e12);
  const at = (frac) => { const j = P.jump(Object.assign({}, base, { F: frac * body.m * g })); return [frac, j.v.toFixed(3), (j.flight.apex*100).toFixed(2)+' cm']; };
  console.log(H, mode, 'jump v>0 above F/W =', (thr / body.m).toFixed(4), at(0.75), at(0.9), at(0.99), 'sprint cantStand at 0.99:', P.sprint(Object.assign({}, base, { F: 0.99 * body.m * g })).cantStand);
}
