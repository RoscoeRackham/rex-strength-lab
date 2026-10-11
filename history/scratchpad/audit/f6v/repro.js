const fs = require('fs');
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'));
const D = window.DINO_DATA;
const g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = (id) => D.surfaces.find((s) => s.id === id);
function ctx(kg, mode, extra) {
  const body = P.makeBody({ H: 2, m: 180 });
  return Object.assign({ F: kg * g, mode, body, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, extra || {});
}
console.log('comicFrac throwPush', P.MUSCLE.throwPush.comicFrac, 'forceFrac', P.MUSCLE.throwPush.forceFrac);
const tiers = D.tiers.map(t => [t.id, t.liftKg]);
console.log('tiers', JSON.stringify(tiers));
for (const mode of ['comic', 'real']) {
  for (const [id, kg] of [['car', 511], ['bus', 511], ['tank', 9072], ['b747', 9072], ['car', 1000], ['bus', 5000]]) {
    for (const ang of [0, 1, 2, 3, 5, 10, 45]) {
      const c = ctx(kg, mode);
      const o = obj(id);
      const L = P.lift(c, o);
      const r = P.throwObject(c, o, ang);
      const mB = o.m + r.hands * c.body.handEff;
      const perp = mB * g * Math.cos(ang * Math.PI / 180);
      console.log(mode, id.padEnd(5), kg, 'ang', String(ang).padStart(2), '| canLift', L.canLift, 'W', (L.weight/1e3).toFixed(1), 'kN | throwF', (r.F/1e3).toFixed(2), 'kN perpNeeded', (perp/1e3).toFixed(1), 'kN | canMove', r.canMove, 'v', r.v.toFixed(3), 'range', r.flight.range.toFixed(3), 'apex', r.flight.apex.toFixed(3), 'gLoad', r.gLoad.toFixed(3));
    }
  }
}
