// Independent check: dino+object system momentum along the throw axis.
// External axial impulses during the push: ground reaction +RA*t on the dino (forward),
// gravity component -RB*t on the object. After release, nothing external acts on the
// dino except ground friction, which opposes his backward slide. So
//   |p_dino_final| <= p_obj - (RA - RB) t.
const P = require('/home/user/dino-strength-sim/src/engine.js');
const fs = require('fs'), vm = require('vm');
const sb = { window: {} }; vm.createContext(sb);
vm.runInContext(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'), sb);
const D = sb.window.DINO_DATA;
const K = P.K, g = K.g, c = K.c;
const body = P.makeBody({ H: 2, m: 180 });
const surf = D.surfaces.find(s => s.id === 'concrete');
const ST = 907.18474;
function run(objId, kg, mode, ang) {
  const o = D.objects.find(x => x.id === objId);
  const ctx = { F: kg * g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' };
  const r = P.throwObject(ctx, o, ang);
  const armMass = r.hands * (r.style === 'whip' ? body.whipEff : body.handEff);
  const mB = o.m + armMass, mA = body.m - armMass;
  const th = ang * Math.PI / 180;
  const RB = mB * g * Math.sin(th);
  const RA = r.anchor.R;
  const t = r.push.t;
  const pObj = r.push.pB * o.m / mB;
  const groundImp = (Math.min(RA, r.F) - RB) * t; // RA acts only while torso is sliding (F > RA here)
  const pDinoAllowed = pObj - groundImp;
  const pDinoEngine = body.m * r.recoilV; // momentum implied by "Rex flies backward at recoilV"
  // relativistic-correct CM velocity after the arm is stopped internally (energy kept in dino)
  const pArm = r.push.pB * armMass / mB;
  const Pn = r.push.pA - pArm;
  const E = mA * c * c + r.push.EA + armMass * c * c + P.momentumToKE(pArm, armMass);
  const vRel = Pn > 0 ? Pn * c * c / E : 0;
  const vSimple = P.momentumToV(Math.max(0, Pn), body.m);
  console.log(objId, (kg).toExponential(3), mode, ang, '| v_obj', r.v.toExponential(4),
    '| p_obj', pObj.toExponential(4), 'groundImp', groundImp.toExponential(3), 'p_dino allowed', pDinoAllowed.toExponential(4),
    '| engine m*recoilV', pDinoEngine.toExponential(4), '(x' + (pDinoEngine / pDinoAllowed).toFixed(2) + ')',
    '| vFix simple', vSimple.toPrecision(5), 'vFix rel', vRel.toPrecision(5), 'engine', r.recoilV.toPrecision(5));
}
run('baseball', 1e8, 'comic', 0);
run('baseball', 1e8, 'comic', 45);
run('shot', 1e8, 'comic', 0);
run('car', 100 * ST, 'comic', 45);
for (const t of D.tiers) if (isFinite(t.liftKg)) { run('baseball', t.liftKg, 'comic', 45); run('shot', t.liftKg, 'comic', 45); run('car', t.liftKg, 'comic', 45); }
// infinite strength
const r = P.throwObject({ F: Infinity, mode: 'comic', body, surface: surf, groundHolds: false, anchor: 'friction' }, D.objects[0], 45);
console.log('inf F: pA', r.push.pA, 'pB', r.push.pB, 'recoilV', r.recoilV, 'naive fix pA - pB*arm/mB =', r.push.pA - r.push.pB * 0.54 / 0.685);
