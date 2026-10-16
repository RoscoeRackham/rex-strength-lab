const { P, g, c9, obj, PE, glow, sig } = require('./common.js');
const TB = P.RESTRAINT.takenBack;
for (const [mRex, kg] of [[1e12, 1e12], [1e13, 1e14]]) {
  const body = P.makeBody({ build: 'rex', H: 3.048, m: mRex });
  const ob = obj('car'), th = 45, c = c9(kg * g, body);
  const r = P.throwObject(c, ob, th);
  const tb = TB('throw', r, Object.assign({}, c, { obj: ob, angle: th }));
  const f0 = P.fly({ v0: r.vOut, thetaDeg: th, h0: body.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup });
  const f1 = P.fly({ v0: r.vOut, thetaDeg: th, h0: body.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, dragK: 1 - 1e-12 });
  const r0 = Math.max(P.eqRadius ? P.eqRadius(body) : 0, 0.25 * body.H);
  console.log('Rex', sig(mRex), 'kg, rho', sig(body.rho, 3), 'dial', sig(kg), 'v', sig(r.v, 4), 'vOut', sig(r.vOut, 4), 'fallsBack', r.fallsBack, 'landed', f0.landed);
  console.log('  Eobj', sig(r.Eobj), 'KE(vOut)', sig(P.keFromV(r.vOut, ob.m)), 'Eobj-KE(vOut)', sig(r.Eobj - P.keFromV(r.vOut, ob.m)), 'GMm/r0 (r0=' + sig(r0, 4) + ')', sig(P.K.G * mRex * ob.m / r0));
  console.log('  drag part', sig(tb.parts.drag), 'energy-cons from vOut', sig(P.keFromV(r.vOut, ob.m) + PE(ob.m, body.releaseHeight) - P.keFromV(f0.vImpact, ob.m)), 'full-drag air.E', sig(f1.air.E), 'dragLoss0', r.dragLoss0);
  console.log('  ', glow(tb.parts.drag).text, '|', glow(f1.air.E).text);
}
