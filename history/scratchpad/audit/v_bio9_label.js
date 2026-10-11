const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const surf = D.surfaces.find(s => s.id === 'concrete');
// UI preset tiers at Kaiju size (state.H=50, state.m = 180*25^3)
const H = 50, m = 180 * Math.pow(H / 2, 3);
for (const t of D.tiers) {
  const c = { F: isFinite(t.liftKg) ? t.liftKg * g : Infinity, mode: 'comic', body: P.makeBody({ H, m }), surface: surf, groundHolds: false, anchor: 'friction' };
  const s = P.sprint(c), j = P.jump(c);
  console.log(`Kaiju @ ${t.chip}: F/W=${(c.F/(m*g)).toPrecision(3)} sprint vTop=${s.vTop.toPrecision(4)} m/s limit='${s.limit}' accel=${s.accelG.toPrecision(3)} g; UI text says friction caps push at ~${surf.mu} g | jump stalled=${j.push.stalled}`);
}
// default body, braced, default strength: label says shear but strength binds
const c2 = { F: 511 * g, mode: 'comic', body: P.makeBody({}), surface: surf, groundHolds: false, anchor: 'braced' };
const s2 = P.sprint(c2);
console.log('Default body, 511 kg, braced on concrete: thrust', s2.thrust.toFixed(0), 'N, shear+friction cap', (surf.mu*180*g + surf.shear*c2.body.digArea*0.25).toFixed(0), 'N, limit label =', s2.limit);
// Proposed fix check: Weyand-2000 style v ∝ (F/W - 1)
function fixedLeg(F, body, mode) {
  const W = body.m * g, Wc = 180 * g, Fc = 511 * g;
  if (!(F > W)) return 0;
  const ratio = isFinite(F) ? (F - W) / (Fc - Wc) : Infinity;
  let cap = 12.4 * Math.sqrt(ratio); if (mode === 'real') cap = Math.min(cap, 19.3); return cap * Math.sqrt(body.s);
}
for (const kg of [100, 180, 200, 300, 511, 1000, 1e4]) console.log('fix legCap default body', kg, 'kg ->', fixedLeg(kg*g, P.makeBody({}), 'comic').toFixed(2), ' (current', P.sprint({F: kg*g, mode:'comic', body:P.makeBody({}), surface: surf, groundHolds:false, anchor:'friction'}).vTop.toFixed(2), ')');
