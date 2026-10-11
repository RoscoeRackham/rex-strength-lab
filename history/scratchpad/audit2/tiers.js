global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({});
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const t of D.tiers) {
  const F = isFinite(t.liftKg) ? t.liftKg * P.K.g : Infinity;
  const r = P.stomp({ F, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' });
  console.log((t.chip || t.label), t.liftKg, 'crater km', (r.crater/1000).toFixed(1), 'disrupts', r.disrupts, 'quake', r.quake.toFixed(2));
}
