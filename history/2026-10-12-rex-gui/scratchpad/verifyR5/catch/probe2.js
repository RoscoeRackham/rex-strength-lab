const { P, K, ON, leg, sig, obj, ctxOf, rex } = require('./common.js');
// a missed sheath lump below 100%: does it still leave the Earth in the lab's own snowplow (fastAir, the Throw tab's rule)?
const cases = [[1e15, 0.5, 1000], [1e15, 0, 11000], [1e15, 0.5, 100], [1e17, 0.5, 200], [1e16, 0.5, 1000], [1e19, 0.5, 1000], [1e15, 0.9, 1000]];
for (const [kg, sh, Dd] of cases) {
  const L = leg(kg, Object.assign({}, ON, { airAbsorb: sh }), 'baseball', Dd);
  const b = obj('baseball'), fb = L.sheath;
  // the whole path as one snowplow: the throw's E, sweeping D then the exit column at the share (path-additive in x)
  const r0 = P.throwObject(ctxOf(kg * K.g, Object.assign({}, ON, { airAbsorb: sh })), b, 0);
  const lump = Object.assign({}, b, { m: L.catch ? (L.catch.mh, null) : null });
  // exit column with the lump itself: m = lump rest mass, E = its KE
  const k = L.catch;
  // lump rest mass from relCatch isn't exposed; rebuild from x: m(1+x) + Egap/c^2
  const x = (1 - sh) * L.Dfl / (b.m / (K.rho0 * b.area));
  const mL = b.m * (1 + x) + L.sheath.E / (K.c * K.c);
  const fa = P.fastAir(Object.assign({}, b, { m: mL }), L.miss.E, 0, 1 - sh);
  const faWhole = P.fastAir(b, r0.Eobj, 0, 1 - sh);   // the Throw tab's figure for the same level throw
  console.log(JSON.stringify({ kg, sh, D: Dd, result: L.result, vArr_kms: sig(L.vArrive / 1000), missE: sig(L.miss.E), missV_kms: sig(L.miss.vImpact / 1000), lumpKg: sig(mL), exitColumnSweptKg: sig((1 - sh) * fa.column * b.area), vOutAfterAir_kms: sig(fa.vOut / 1000), throwTabVout_kms: sig(faWhole.vOut / 1000), escape_kms: 11.19 }));
}
