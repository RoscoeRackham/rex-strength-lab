global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA, K = P.K, g = K.g;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
console.log('MUSCLE', JSON.stringify(P.MUSCLE));
// 1. Gravity during the catch stroke (missing in F)
for (const [id, D] of [['baseball', 10], ['car', 10], ['car', 30]]) {
  const L = P.catchLeg(mk(), mk(), obj(id), D, 'easy');
  const k = L.catch, m = obj(id).m, gm = L.angleDeg * Math.PI / 180, v = L.vArrive, d = k.stroke;
  const Fdec = m * v * v / (2 * d);
  const Fline = Fdec + m * g * Math.sin(gm), Fperp = m * g * Math.cos(gm);
  console.log(id, D, 'result', L.result, 'angle', L.angleDeg.toFixed(1), 'F engine', k.F.toFixed(1), '| no-slip decel force', Fdec.toFixed(1), 'line force incl. gravity', Fline.toFixed(1), 'total hand force', Math.hypot(Fline, Fperp).toFixed(1), 'ratio', (Math.hypot(Fline, Fperp) / Math.max(k.F, k.holdLoad)).toFixed(3), 'slide', k.slide.toFixed(3), 'R', k.R.toFixed(0));
}
// 2. Slide with Rslide(F) instead of static R (T5 car 10 m)
{
  const ctxC = mk(), o = obj('car'), L = P.catchLeg(mk(), ctxC, o, 10, 'easy');
  const M = 180, m = o.m, v = L.vArrive, gm = L.angleDeg * Math.PI / 180, d = 0.6;
  const anc = P.anchorCapacity({ body: ctxC.body, surface: ctxC.surface, theta: gm, anchor: 'friction', groundHolds: false, mA: M, mB: m });
  // solve F such that relative motion closes over d with a_C = (F - Rslide(F))/M
  const need = (F) => F / m + Math.max(0, F - anc.Rslide(F)) / M - v * v / (2 * d);
  let lo = 0, hi = 1e7; for (let i = 0; i < 200; i++) { const mid = 0.5 * (lo + hi); if (need(mid) > 0) hi = mid; else lo = mid; }
  const F = hi, aC = (F - anc.Rslide(F)) / M, t = v / (F / m + aC), vc = aC * t;
  const Rs = P.anchorCapacity({ body: ctxC.body, surface: ctxC.surface, theta: 0, anchor: 'friction', mA: M + m }).R;
  const kAir = 0.5 * K.rho0 * Math.max(1.0 * 0.8, 1.75 * o.area), uH = vc * Math.cos(gm);
  const after = (M + m) / (2 * kAir) * Math.log1p(kAir * uH * uH / Rs), during = 0.5 * aC * t * t * Math.cos(gm);
  console.log('T5 car: engine F', L.catch.F.toFixed(0), 'slide', L.catch.slide.toFixed(3), 'R', anc.R.toFixed(0), '| with Rslide: F', F.toFixed(0), 'Rslide(F)', anc.Rslide(F).toFixed(0), 'pair speed along line', vc.toFixed(3), 'slide', (during + after).toFixed(3));
  // 2-D horizontal-momentum estimate: horizontal momentum minus friction impulse mu*(normal impulse)
  const mu = 0.6, vxh = v * Math.cos(gm), vyv = v * Math.sin(gm);
  const Jn = (M + m) * g * t + m * vyv;  // ground must also stop the object's downward momentum
  const ph = Math.max(0, m * vxh - mu * Jn);
  console.log('   2-D impulse check: horizontal momentum', (m * vxh).toFixed(0), 'friction impulse', (mu * Jn).toFixed(0), 'pair horiz speed', (ph / (M + m)).toFixed(3), 'vs engine', (L.catch.uAfter * Math.cos(gm)).toFixed(3));
}
// 3. Partner toss: feet load should include the partner's weight
for (const st of ['easy', 'hard']) {
  const t = P.tossPartner(mk(), P.makeBody({}), 'Ollie', st, 10);
  const F = t.catch.F, Nmax = 2.5e6 * 0.09;
  console.log('toss', st, 'F', F.toFixed(0), 'sink engine', t.catch.sinkRatio.toFixed(4), 'with partner weight', ((180 * g + 180 * g + F) / Nmax).toFixed(4), 'hand force incl. weight', (F + 180 * g).toFixed(0));
}
