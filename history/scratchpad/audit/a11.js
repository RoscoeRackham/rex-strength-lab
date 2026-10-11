const { P, D, g, S, O, T, ctx } = require('./common');
const c = ctx(511, { surface: 'granite' });
const pr = (kg) => { const j = P.jump(Object.assign({}, c, { F: kg * g })); return [j.v, j.flight.apex, j.flight.steps, j.flight.timedOut]; };
for (let lg = 4.6; lg <= 5.9; lg += 0.05) { const [v, a, s, to] = pr(10 ** lg); console.log(lg.toFixed(2), 'v', v.toFixed(2), 'apex', a.toFixed(2), 'steps', s, to); }
// threshold trace
let lo = 10, hi = 1e34; const p = (kg) => { const [v, a] = pr(kg); return v > 0 && a >= 93; };
for (let i = 0; i < 12; i++) { const mid = Math.sqrt(lo * hi); const r = p(mid); console.log('bisect', i, 'mid', mid.toExponential(2), r); if (r) hi = mid; else lo = mid; }
