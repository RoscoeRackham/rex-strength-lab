const { P, g, ctx, obj } = require('./lib.js');
const c0 = P.K.c;
for (const lg of [20, 22, 23, 24, 25, 26, 28, 30, 34]) {
  const c = ctx({ logKg: lg, mode: 'comic', surface: 'concrete' });
  const o = obj('baseball');
  const r = P.throwObject(c, o, 0);
  const mB = r.push ? (o.m + c.body.whipEff) : 0;
  // correct: object and arm share the velocity, so the object's momentum share is m_obj/mB of pB
  const pObj = r.push.pB * o.m / mB;
  const Ecorrect = P.momentumToKE(pObj, o.m);
  console.log('lift 1e' + lg, 'kg | v/c', (r.v / c0), '| engine Eobj', r.Eobj.toExponential(4), '| momentum-based Eobj', Ecorrect.toExponential(4), '| ratio', (r.Eobj / Ecorrect).toFixed(4));
}
// jump.Ebody similarly
const cj = ctx({ logKg: 30, mode: 'comic', surface: 'concrete', groundHolds: true });
const j = P.jump(cj);
console.log('jump 1e30 kg groundHolds: v', j.v, 'Ebody', j.Ebody, 'vs momentumToKE(pA, m)', P.momentumToKE(j.push.pA, cj.body.m).toExponential(4));
