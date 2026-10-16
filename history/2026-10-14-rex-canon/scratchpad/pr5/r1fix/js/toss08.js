const { P, D, g, R3, O3, c9, obj, PE, sig, TB, duo } = require('./common.js');
for (const mO of [3e3, 1e6, 1e9, 1e12]) for (const e of [8, 10, 12, 14, 16, 18]) {
  const OB = P.makeBody({ build: 'ollie', H: 3.06, m: mO });
  for (const x of [{}, { ownRecoil: false }]) {
  const A = c9(Math.pow(10, e) * g, R3, x), B = c9(Math.pow(10, e) * g, OB, x), t = P.tossPartner(A, OB, 'Ollie', 'hard', 10, 'friction');
  if (!(t.v > 0) || t.v >= P.CATCH.V_FIREBALL) continue;
  const ob = t.obj, f0 = P.flyTo({ v0: t.v, thetaDeg: 90, h0: R3.releaseHeight, hStop: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup });
  if (!f0.landed || f0.escaped || f0.orbit || f0.timedOut) { const tb = TB('toss', t, duo(A, B, 'rex')); console.log('mO', mO, 'e', e, JSON.stringify(x), t.result, 'v', sig(t.v, 4), 'f0', f0.landed, f0.escaped, f0.timedOut, 'dragE', sig(f0.dragE), 'Ev', sig(P.keFromV(t.v, ob.m)), 'parts', JSON.stringify(Object.fromEntries(Object.entries(tb.parts).filter(([k, v]) => v > 0)))); }
  }
}
