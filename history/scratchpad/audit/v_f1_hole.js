global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const e = (x) => (typeof x === 'number' ? x.toExponential(3) : x);
function ctx(liftKg, sid, mode) {
  const body = P.makeBody({ H: 2 });
  return { F: isFinite(liftKg) ? liftKg * g : Infinity, mode: mode || 'comic', body, surface: S[sid], groundHolds: false, anchor: 'friction' };
}
// Independent numeric integration of m dv/dx = -(q + k rho v^2) A (non-relativistic, valid for v << c)
function ponNumeric(m, A, q, rho, k, v0) {
  // integrate in log-velocity: dx = -m v dv / (A (q + k rho v^2))
  let x = 0, v = v0; const n = 200000;
  const lv0 = Math.log(v0), lv1 = Math.log(1e-6);
  const h = (lv0 - lv1) / n;
  for (let i = 0; i < n; i++) {
    const lv = lv0 - (i + 0.5) * h; const vv = Math.exp(lv);
    x += m * vv * vv / (A * (q + k * rho * vv * vv)) * h; // dx = m v^2 dlnv / R
  }
  return x;
}
const pon = (m, A, q, rho, k, v) => m / (2 * k * rho * A) * Math.log1p(k * rho * v * v / q);
for (const sid of ['sand', 'concrete', 'granite']) for (const t of D.tiers) {
  const c = ctx(t.liftKg, sid);
  const r = P.stomp(c);
  const m = c.body.legEff, A = c.body.footArea, q = S[sid].qult, rho = S[sid].rho;
  const pk1 = pon(m, A, q, rho, 1, r.vFoot), pk05 = pon(m, A, q, rho, 0.5, r.vFoot);
  const num = r.vFoot < 1e5 ? ponNumeric(m, A, q, rho, 1, r.vFoot) : NaN;
  const Dtc = r.crater / 1.25;
  console.log(sid.padEnd(8), t.id.padEnd(10), 'vFoot', e(r.vFoot), 'E', e(r.E), 'eng hole', e(r.holeDepth), '| E/(qA) check', e(r.E / (q * A)), '| Pon k=1', e(pk1), 'num', e(num), 'k=.5', e(pk05), '| Dfinal', e(r.crater), 'Dtc/2.83', e(Dtc / (2 * Math.SQRT2)), '| hole/R_E', e(r.holeDepth / P.K.R_E));
}
