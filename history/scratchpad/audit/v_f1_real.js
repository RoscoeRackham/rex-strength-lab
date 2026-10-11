global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const pon = (m, A, q, rho, k, v) => m / (2 * k * rho * A) * Math.log1p(k * rho * v * v / q);
for (const sid of ['sand', 'concrete']) for (const t of D.tiers) {
  const body = P.makeBody({ H: 2 });
  const c = { F: isFinite(t.liftKg) ? t.liftKg * g : Infinity, mode: 'real', body, surface: S[sid], groundHolds: false, anchor: 'friction' };
  const r = P.stomp(c);
  console.log('real', sid, t.id.padEnd(10), 'vFoot', r.vFoot.toFixed(2), 'hole', r.holeDepth.toExponential(3), 'Pon k=1', pon(body.legEff, body.footArea, S[sid].qult, S[sid].rho, 1, r.vFoot).toExponential(3));
}
// Threshold where engine/Poncelet(k=1) ratio X/ln(1+X) = 2
let lo = 0.1, hi = 100; for (let i = 0; i < 100; i++) { const X = (lo + hi) / 2; (X / Math.log1p(X) > 2) ? hi = X : lo = X; }
console.log('X at ratio 2:', lo.toFixed(3));
for (const s of D.surfaces) console.log(s.id, 'v where engine 2x too deep (k=1):', Math.sqrt(lo * s.qult / s.rho).toFixed(1), 'm/s');
