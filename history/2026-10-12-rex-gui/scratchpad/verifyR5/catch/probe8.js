const { P, K, ON, leg, sig, obj } = require('./common.js');
const c2 = K.c * K.c;
// the sheath catch's flight time: chord / arrival speed (engine) vs the snowplow's own time, integral of ds / v(s)
for (const [kg, sh, Dd] of [[1e17, 0.5, 62], [1e17, 0.5, 200], [1e17, 0, 1000], [1e15, 0.5, 1000], [1e15, 0, 11000], [2e13, 0, 11500], [1e15, 0.9, 1000], [1e19, 0.5, 1000]]) {
  const L = leg(kg, Object.assign({}, ON, { airAbsorb: sh }), 'baseball', Dd);
  const o = obj('baseball'), k = 1 - sh, Dl = L.chord;
  const E = L.sheath.E / L.sheath.share, p = Math.sqrt(E * E + 2 * E * o.m * c2) / K.c;
  // v(s) = p c^2 / E_tot(s), E_tot(s) = E + m c^2 + k rho0 A c^2 s (energy and momentum kept; the swept air starts at rest)
  const t = ((E + o.m * c2) * Dl + k * K.rho0 * o.area * c2 * Dl * Dl / 2) / (p * c2);
  console.log(JSON.stringify({ kg, sh, D: Dd, vL_c: sig(L.aim.vL / K.c), vArr_c: sig(L.vArrive / K.c), timeShown: sig(L.time), timeSnowplow: sig(t), ratio: sig(L.time / t, 3) }));
}
