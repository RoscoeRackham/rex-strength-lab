global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const human = D.tiers.find(t => t.id === 'human');
const F = Math.pow(10, Math.log10(human.liftKg)) * 9.80665;
const objs = D.objects.filter(o => !o.noThrow);
for (const mode of ['real','comic']) {
  let found = [];
  for (let H = 0.1; H <= 500; H *= 1.05) {
    const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
    for (const surface of D.surfaces) for (const anchor of ['friction','braced','bolted']) {
      const c = { F, mode, body, surface, groundHolds: false, anchor };
      const shot = P.throwObject(c, D.objects.find(o=>o.id==='shot'), 37);
      if (shot.flight) continue;
      for (const o of objs) for (const ang of [0, 2, 37, 45, 89]) {
        const r = P.throwObject(Object.assign({}, c, {record:true}), o, ang);
        if (r.canHold && r.canMove) { found.push([H.toFixed(2), surface.id, anchor, o.id, ang, r.v.toFixed(2)]); }
      }
    }
  }
  console.log(mode, found.length, JSON.stringify(found.slice(0, 10)));
}
