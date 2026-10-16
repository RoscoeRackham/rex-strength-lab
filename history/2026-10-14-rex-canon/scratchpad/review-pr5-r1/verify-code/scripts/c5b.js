const { P, g, R3, O3, c9, obj, sig } = require('./common.js');
for (let e = 8; e <= 18; e += 0.5) { const A = c9(Math.pow(10, e) * g, R3), t = P.tossPartner(A, O3, 'Ollie', 'hard', 10, 'friction');
  let f0 = null; if (t.v > 0 && t.v < P.CATCH.V_FIREBALL) { const ob = t.obj; f0 = P.flyTo({ v0: t.v, thetaDeg: 90, h0: R3.releaseHeight, hStop: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup }); }
  console.log('10^' + e, t.result, sig(t.v, 3), 'dragLoss0', t.dragLoss0, f0 ? 'f0 landed ' + f0.landed + ' esc ' + f0.escaped + ' orbit ' + f0.orbit + ' timedOut ' + f0.timedOut + ' vImp ' + sig(f0.vImpact, 3) : ''); }
// 02: falls-back search
let found = 0;
for (const mR of [1e9, 1e10, 3e10, 1e11, 3e11, 1e12, 1e13]) for (const id of ['baseball', 'car', 'person']) for (let e = 0; e <= 8; e += 0.25) { const body = P.makeBody({ build: 'rex', H: 3.048, m: mR }), c = c9(Math.pow(10, e) * g, body), r = P.throwObject(c, obj(id), 45);
  if (r.fallsBack && found++ < 3) console.log('fallsBack:', id, 'Rex', sig(mR, 2), 'dial 10^' + e, 'canMove', r.canMove, 'v', sig(r.v, 3), 'flight', !!r.flight); }
console.log('fallsBack found', found);
