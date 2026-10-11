const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, c = P.K.c;
const body = P.makeBody({});
const surf = (D.surfaces || D.default?.surfaces || []).find(s => s.id === 'concrete') || { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
console.log('surface', surf);
const mk = (F, mode) => ({ F, mode, body, surface: surf, groundHolds: false, anchor: 'friction' });
// Collins eq.21 for stony impactor equal energy at 20 km/s
function collinsEq(E, v, rhoI, rhoT) {
  const m = 2 * E / (v * v);
  const L = Math.cbrt(6 * m / (Math.PI * rhoI));
  const Dtc = 1.161 * Math.pow(rhoI / rhoT, 1/3) * Math.pow(L, 0.78) * Math.pow(v, 0.44) * Math.pow(g, -0.22);
  return { L, Dtc, Dfr_simple: 1.25 * Dtc };
}
for (const mode of ['comic', 'real']) {
  for (const lk of [Math.log10(511), 6, 8, 10, 12, 13, 14, 15, 16, 18, 20, 22, 25, 30, 34, Infinity]) {
    const F = isFinite(lk) ? Math.pow(10, lk) * g : Infinity;
    const r = P.stomp(mk(F, mode));
    const eq = (r.E > 0 && isFinite(r.E)) ? collinsEq(r.E, 20000, 3000, surf.rho) : null;
    console.log(mode, 'logKg', isFinite(lk) ? lk.toFixed(2) : 'inf', 'E', r.E.toExponential(3), 'vFoot/c', (r.vFoot / c).toExponential(3),
      'crater m', r.crater.toFixed(1), '| equiv 20km/s stony Dfr(simple 1.25x)', eq ? eq.Dfr_simple.toExponential(3) : '-', 'ratio', eq ? (eq.Dfr_simple / r.crater).toFixed(2) : '-');
  }
}
