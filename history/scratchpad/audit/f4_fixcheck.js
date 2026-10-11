// Compare the auditor's minimal fix (RA = anc.R + RB) with the clamp-after-add fix where the ground
// cannot even carry dino + object statically (Rbear clamped to 0 by the engine).
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const g = P.K.g, body = P.makeBody({});
function run(objId, sid, liftKg, deg, mode) {
  const o = D.objects.find(x => x.id === objId), s = D.surfaces.find(x => x.id === sid);
  const c = { F: liftKg * g, mode, body, surface: s, groundHolds: false, anchor: 'friction' };
  const r = P.throwObject(c, o, deg);
  const th = deg * Math.PI / 180, sin = Math.sin(th), cos = Math.cos(th);
  const armMass = (o.m > 20 ? 2 : 1) * body.handEff, mA = body.m - armMass, mB = o.m + armMass;
  const RB = mB * g * sin, Nmax = s.qult * 2 * body.footArea;
  const RbearTrue = Math.max(0, (Nmax - mA * g - mB * g * cos * cos) / sin);
  const RhorTrue = (s.mu * (mA * g + mB * g * cos * cos) + mB * g * sin * cos) / (cos - s.mu * sin);
  const Rtrue = Math.min(RbearTrue, cos - s.mu * sin > 0 ? RhorTrue : Infinity);
  const base = { F: r.F, d: body.strokes.throw, mA, mB, RB, mode, vmax: P.MUSCLE.throwPush.vmax * body.s };
  const pT = P.pushApart(Object.assign({ RA: Rtrue }, base));
  const pM = P.pushApart(Object.assign({ RA: r.anchor.R + RB }, base));
  console.log(`${objId} on ${sid}, ${liftKg} kg, ${deg} deg, ${mode}: Nmax=${Nmax.toExponential(3)} static load=${((mA + mB) * g).toExponential(3)}`);
  console.log(`  engine R=${r.anchor.R.toExponential(3)} recoil=${r.recoilV.toFixed(2)} v=${r.v.toFixed(3)}`);
  console.log(`  true   R=${Rtrue.toExponential(3)} recoil=${pT.vA.toFixed(2)} v=${pT.vB.toFixed(3)}`);
  console.log(`  R+RB   R=${(r.anchor.R + RB).toExponential(3)} recoil=${pM.vA.toFixed(2)} v=${pM.vB.toFixed(3)}`);
}
run('car', 'sand', 10 * 907.18474, 60, 'comic');
run('tank', 'sand', 425000, 45, 'comic');
run('tank', 'concrete', 425000, 45, 'comic');
