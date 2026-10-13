const { P, K, ON, leg, sig, obj } = require('./common.js');
const c2 = K.c * K.c;
// a slowed sheath lump: how far gravity pulls it below the straight chord the engine assumes, and the true flight time
for (const [kg, sh, Dd] of [[2e13, 0, 11500], [2e13, 0, 11000], [2e13, 0, 10000], [2e13, 0, 8000], [3e13, 0, 11500], [1e14, 0, 11500], [2e13, 0.5, 11500], [1e15, 0, 11500]]) {
  const L = leg(kg, Object.assign({}, ON, { airAbsorb: sh }), 'baseball', Dd);
  if (!L.sheath) { console.log(kg, sh, Dd, L.result); continue; }
  const o = obj('baseball'), unit = o.m / (K.rho0 * o.area), k = 1 - sh, R = K.R_E, h = L.h0, Dl = L.Dfl;
  const E = L.sheath.E / L.sheath.share, p = Math.sqrt(E * E + 2 * E * o.m * c2) / K.c, Etot0 = E + o.m * c2;
  // exact snowplow time to s (total energy grows by the swept air's rest energy; v = p c^2 / E_tot)
  const tOf = (s) => (Etot0 * s + k * K.rho0 * o.area * c2 * s * s / 2) / (p * c2);
  let minClear = Infinity, at = 0;
  for (let i = 0; i <= 4000; i++) { const s = Dl * i / 4000, t = tOf(s), cl = h - s * (Dl - s) / (2 * R) - 0.5 * K.g * t * t; if (cl < minClear) { minClear = cl; at = s; } }
  console.log(JSON.stringify({ kg, sh, D: Dd, result: L.result, vL_c: sig(L.aim.vL / K.c), vArr: sig(L.vArrive), timeShown: sig(L.time), timeSnowplow: sig(tOf(Dl)), dropAtOllie_m: sig(0.5 * K.g * tOf(Dl) ** 2), chordMinClear_m: sig(h - Dl * Dl / (8 * R)), minClearWithGravity_m: sig(minClear), at: sig(at) }));
}
