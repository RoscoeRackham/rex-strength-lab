const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = global; require('/home/user/dino-strength-sim/src/data.js'); const data = global.DINO_DATA;
const K = P.K, g = K.g, c = K.c;
const objs = (data.objects || []);
const obj = (id) => objs.find(o => o.id === id);
const surf = (data.surfaces || []).find(s => s.id === 'concrete');
// independent KE from momentum using BigInt-free high-precision: E = pc*pc/(sqrt(mc2^2+pc^2)+mc2) (no cancellation) — cross-check with log-domain
function keP(p, m) { const mc2 = m*c*c, pc = p*c; return pc*pc/(Math.hypot(mc2, pc)+mc2); }
function run(lgKg, objId, theta, H) {
  const body = P.makeBody(H ? { H } : {});
  const ctx = { F: Math.pow(10, lgKg)*g, mode: 'comic', body, surface: surf, groundHolds: false, anchor: 'friction' };
  const o = obj(objId);
  const r = P.throwObject(ctx, o, theta);
  const mB = o.m + r.hands * (r.style === 'whip' ? body.whipEff : body.handEff);
  const pObj = r.push.pB * o.m / mB;
  const Etrue = keP(pObj, o.m);
  return { lgKg, objId, H: body.H, v: r.v, vMinusC: r.v - c, Eobj: r.Eobj, Etrue, relErr: (r.Eobj - Etrue)/Etrue, pB: r.push.pB, EB_engine_push: r.push.EB, work: r.F * body.strokes[r.style==='whip'?'whip':'throw'] };
}
console.log('objects:', objs.map(o=>o.id).join(','));
for (const lg of [20,21,22,23,23.3,24,24.5,25,26,28,30,34]) {
  const x = run(lg, 'baseball', 0);
  console.log(`baseball lg=${lg} v-c=${x.vMinusC.toExponential(3)} Eobj=${x.Eobj.toExponential(4)} Etrue=${x.Etrue.toExponential(4)} relErr=${x.relErr.toExponential(2)} workBound=${x.work.toExponential(3)}`);
}
for (const lg of [28,30,32,34]) for (const H of [2,50,500]) {
  const x = run(lg, 'tank', 45, H);
  console.log(`tank H=${H} lg=${lg} v-c=${x.vMinusC} Eobj=${x.Eobj} Etrue=${x.Etrue.toExponential(4)}`);
}
// momentumToV raw check
const vv = P.momentumToV(1e30, 1);
console.log('momentumToV(1e30,1) - c =', vv - c, 'gammaOf=', P.gammaOf(vv), 'keFromV=', P.keFromV(vv,1));
// jump Ebody
for (const lg of [20,24,26,28,30]) {
  const body = P.makeBody({});
  const ctx = { F: Math.pow(10, lg)*g, mode: 'comic', body, surface: surf, groundHolds: false, anchor: 'friction' };
  const j = P.jump(ctx);
  console.log(`jump lg=${lg} v-c=${(j.v-c).toExponential(3)} Ebody=${j.Ebody.toExponential ? j.Ebody.toExponential(4) : j.Ebody} Etrue=${keP(j.push.pA, body.m).toExponential(4)}`);
}
