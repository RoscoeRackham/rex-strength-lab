const { P, D, g, surf, obj, ctx, rex, ollie } = require('./lib.js');
const s = surf('softclay');
for (const [n, b] of [['rex', rex()], ['ollie', ollie()]]) for (const e of [0, 0.5, 1]) {
  const st = P.walkStep(b, s, { pace: 'walk', effort: e });
  console.log(n, 'e', e, 'footArea', b.footArea.toFixed(3), 'footB', b.footB.toFixed(3), 'pressure kPa', (st.pressure/1e3).toFixed(0), 'q kPa', (st.q/1e3).toFixed(1), 'su', s.shear, 'rho', s.rho, 'footprint', JSON.stringify(st.footprint), 'v', st.v.toFixed(2), 'PPV3', (1e3*P.ppvAt(st.src,3)).toFixed(2), 'hip', st.h.toFixed(2));
}
// N_c curve vs table
const B = 1; const q = 129e3, su = 20e3; // placeholder
const f = (DB) => 1 + 0.46 * Math.min(1, Math.log1p(DB) / Math.log(5));
for (const DB of [0.5, 1, 2, 3, 4]) console.log('D/B', DB, 'code factor', f(DB).toFixed(3));
