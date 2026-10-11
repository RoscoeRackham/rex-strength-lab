global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const s = D.surfaces.find(x => x.id === 'concrete');
let maxV = {};
const t0 = Date.now();
for (const o of D.objects) for (const ang of [0, 5, 15, 30, 45, 60, 75, 90]) {
  for (let lg = 2; lg <= 34; lg += 0.5) {
    let r;
    try { r = P.throwObject({ F: Math.pow(10, lg)*g, mode: 'comic', body, surface: s, groundHolds: false, anchor: 'friction' }, o, ang); } catch (e) { continue; }
    if (r.flight && r.flight.landed && r.flight.vImpact > (maxV[o.id]?.v || 0)) maxV[o.id] = { v: r.flight.vImpact, lg, ang, crater: r.crater, ex: r.craterExtrapolated };
  }
}
console.log(JSON.stringify(maxV, null, 0).replace(/\},/g, '},\n'));
console.log('time', (Date.now()-t0)/1000);
