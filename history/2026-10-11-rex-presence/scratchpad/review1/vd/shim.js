const { P, surf, rex } = require('./base.js');
const sf = surf('concrete');
// split near/far at 3 m for a source
function parts(src, d) {
  const { rho, cs, xi } = src.ground, r = Math.max(d, 1);
  const ramp = src.kind === 'ramp', T = ramp ? src.tau : src.T;
  const near = (ramp ? 0.1875 : 0.375) * src.F / (rho * cs * cs * T * r);
  const far = (ramp ? 0.181 : 0.620) * src.F / (rho * Math.pow(cs, 2.5) * Math.pow(T, 1.5) * Math.sqrt(r));
  const z = xi * r / (0.919 * cs * T);
  const Dm = ramp ? Math.pow(1 + Math.pow(z / 0.195, 2.05), -1.5 / 2.05) : Math.pow(1 + Math.pow(z / 0.224, 1.4), -2.5 / 1.4);
  return { near: near * Dm, far: far * Dm };
}
for (const e of [0, 0.28, 0.5]) {
  const st = P.walkStep(rex, sf, { pace: 'walk', effort: e });
  console.log('effort', e, 'ppv(3)', (P.ppvAt(st.src, 3) * 1e3).toFixed(4), 'mm/s');
  for (const s of st.src) { const p = parts(s, 3); console.log('  ', s.kind, 'near', (p.near * 1e3).toFixed(4), 'far', (p.far * 1e3).toFixed(4)); }
}
const o = { pace: 'walk', effort: 0.5 };
const ripE = P.walkEffortFor(rex, sf, o, P.VIB.TH.shimmer, 3);
console.log('ripE (vertical vs 0.2)', ripE);
// horizontal estimate: H = 1/3 near + 0.68 far, per source, max over sources
function ppvH(st, d) { return Math.max(...st.src.map((s) => { const p = parts(s, d); return Math.max(p.near / 3, 0.68 * p.far); })); }
function ppvH2(st, d) { return Math.max(...st.src.map((s) => { const p = parts(s, d); return p.near / 3 + 0.68 * p.far; })); }
function effFor(fn, v, d) { const f = (e) => fn(P.walkStep(rex, sf, { pace: 'walk', effort: e }), d) >= v; if (f(0)) return 0; if (!f(1)) return Infinity; let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (f(m)) hi = m; else lo = m; } return hi; }
console.log('ripE horizontal max(near/3, .68 far):', effFor(ppvH, 2e-4, 3));
console.log('ripE horizontal near/3+.68 far:', effFor(ppvH2, 2e-4, 3));
console.log('ripE if H=0.68V:', effFor((st, d) => 0.68 * P.ppvAt(st.src, d), 2e-4, 3));
console.log('ripE if H=V/3:', effFor((st, d) => P.ppvAt(st.src, d) / 3, 2e-4, 3));
const pr = P.presence(rex, sf, { pace: 'walk', effort: 0 });
console.log('soft-footed shimmer reach', pr.reach.shimmer);
function reach(fn, st, v) { let lo = 1, hi = 1e4; if (fn(st, 1) < v) return 0; for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi); if (fn(st, m) >= v) lo = m; else hi = m; } return lo; }
const st0 = P.walkStep(rex, sf, { pace: 'walk', effort: 0 });
console.log('soft reach H=0.68V', reach((s, d) => 0.68 * P.ppvAt(s.src, d), st0, 2e-4), 'H=V/3', reach((s, d) => P.ppvAt(s.src, d) / 3, st0, 2e-4), 'mixed', reach(ppvH2, st0, 2e-4));
console.log('stepWord-ish: what words? see app');
