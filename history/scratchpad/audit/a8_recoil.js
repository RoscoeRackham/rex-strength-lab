const { P, g, ctx, obj, D } = require('./lib.js');
for (const [id, ang] of [['baseball', 0], ['shot', 37], ['car', 45]]) for (const kg of [9072, 90718, 1e8]) {
  const c = ctx({ kg, mode: 'comic', surface: 'concrete' });
  const o = obj(id);
  const r = P.throwObject(c, o, ang);
  if (!r.canMove) { console.log(id, kg, 'cannot move'); continue; }
  const armMass = r.hands * (r.style === 'whip' ? c.body.whipEff : c.body.handEff);
  const mB = o.m + armMass;
  const pArm = r.push.pB * armMass / mB;            // arm shares the object's velocity at release
  // after release the arm is stopped by the shoulder: its forward momentum goes back into the body
  const pBodyFinal = r.push.pA - pArm;             // backward positive
  const vFinal = P.momentumToV(Math.max(0, pBodyFinal), c.body.m);
  const Efinal = P.momentumToKE(Math.max(0, pBodyFinal), c.body.m);
  console.log(id.padEnd(8), 'lift', kg.toExponential(2), '| anchor R', r.anchor.R.toExponential(2), '| engine recoilV', r.recoilV.toFixed(3), 'recoilE', r.recoilE.toExponential(3), 'Eobj', r.Eobj.toExponential(3),
    '| whole-dino recoil after arm stops: v', vFinal.toFixed(3), 'E', Efinal.toExponential(3), '| engine says recoilE > Eobj:', r.recoilE > r.Eobj, ' correct:', Efinal > r.Eobj);
}
