const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
function kepler(v0, thDeg, h0) {
  const GM = K.GM, R = K.R_E, r0 = R + h0, th = thDeg*Math.PI/180;
  const h = r0*v0*Math.cos(th), eps = v0*v0/2 - GM/r0;
  const p = h*h/GM, e = Math.sqrt(1+2*eps*h*h/GM/GM);
  const a = -GM/(2*eps), ra = a*(1+e);
  // f at r0 ascending
  const f0 = Math.acos((p/r0-1)/e) * (th>0?1:-1); // ascending: f in (0,pi) has vr>0? vr = sqrt(GM/p) e sin f >0 for f in (0,pi)
  const f1 = 2*Math.PI - Math.acos((p/R-1)/e);
  return { apex: ra - R, range: R*(f1-f0) };
}
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
console.log('releaseHeight', body.releaseHeight);
for (const id of ['car','baseball','bus','pyramid']) {
  const o = D.objects.find(x=>x.id===id);
  for (const v0 of [30, 300, 1000, 3000, 7000]) {
    for (const th of [45, 10, 80]) {
      const f1 = P.fly({ v0, thetaDeg: th, h0: body.releaseHeight, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 0 });
      const fv = P.fly({ v0, thetaDeg: th, h0: body.releaseHeight, m: o.m, A: o.area, Cd: 0, CdSup: 0 });
      const kp = kepler(v0, th, body.releaseHeight);
      console.log(id, v0, th, 'dragK0 range', f1.range.toPrecision(7), 'apex', f1.apex.toPrecision(7), '| vac', fv.range.toPrecision(7), fv.apex.toPrecision(7), '| kepler', kp.range.toPrecision(7), kp.apex.toPrecision(7), 'relerr', ((f1.range-kp.range)/kp.range).toExponential(2), ((f1.apex-kp.apex)/kp.apex).toExponential(2), 'ocean', f1.ocean && f1.ocean.E.toExponential(3), f1.ocean && f1.ocean.P.toExponential(3), 'air', f1.air && f1.air.E);
    }
  }
}
