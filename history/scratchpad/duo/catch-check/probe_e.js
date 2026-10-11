global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA, K = P.K, g = K.g;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
function slideCatch(L, o) {
  const ctxC = mk(), M = 180, m = o.m, v = L.vArrive, gm = L.angleDeg * Math.PI / 180, d = 0.6;
  const anc = P.anchorCapacity({ body: ctxC.body, surface: ctxC.surface, theta: gm, anchor: 'friction', mA: M, mB: m });
  const need = (F) => F / m + Math.max(0, F - anc.Rslide(F)) / M - v * v / (2 * d);
  let lo = 0, hi = 1e8; for (let i = 0; i < 200; i++) { const mid = 0.5 * (lo + hi); if (need(mid) > 0) hi = mid; else lo = mid; }
  const F = hi, aC = (F - anc.Rslide(F)) / M, t = v / (F / m + aC), vc = aC * t;
  const Rs = P.anchorCapacity({ body: ctxC.body, surface: ctxC.surface, theta: 0, anchor: 'friction', mA: M + m }).R;
  const kAir = 0.5 * K.rho0 * Math.max(0.8, 1.75 * o.area), uH = vc * Math.cos(gm);
  return { F, slide: 0.5 * aC * t * t * Math.cos(gm) + (M + m) / (2 * kAir) * Math.log1p(kAir * uH * uH / Rs), gravLine: m * g * Math.sin(gm) };
}
{ const L = P.catchLeg(mk(), mk(), obj('car'), 30, 'easy'); const r = slideCatch(L, obj('car'));
  console.log('T17 engine F', L.catch.F.toFixed(0), 'slide', L.catch.slide.toFixed(2), '| with Rslide F', r.F.toFixed(0), 'slide', r.slide.toFixed(2), '+ gravity along line', r.gravLine.toFixed(0)); }
// T13b relativistic snowplow in a cancellation-free form
{ const c = mk({ F: 1e30 * g, anchor: 'bolted' }); const L = P.catchLeg(c, c, obj('pyramid'), 10, 'hard'); const fb = L.fireball, m = obj('pyramid').m;
  const mc2 = m * K.c ** 2, mu = K.rho0 * obj('pyramid').area * 10, muc2 = mu * K.c ** 2, E0 = fb.E + mc2;
  const Mc2 = Math.sqrt(mc2 * mc2 + 2 * E0 * muc2 + muc2 * muc2);
  const heat = Mc2 - mc2 - muc2;
  console.log('T13b gamma', (E0 / mc2).toExponential(3), 'swept', mu.toExponential(3), 'kg; heat in lump (rel. snowplow)', heat.toExponential(3), 'J =', (heat / mc2).toFixed(3), 'x rest energy =', (heat / m / 1e7).toExponential(2), 'x its vaporisation energy (1e7 J/kg); classical design Eair', fb.Eair.toExponential(3));
  // at exactly 1% c, what share of a pyramid's vaporisation energy does 10 m of air deposit (classical: 1/2 mu v^2)
  const v = 0.01 * K.c; console.log('   at 1% c over 10 m: 1/2 mu v^2 =', (0.5 * mu * v * v).toExponential(3), 'J =', (0.5 * mu * v * v / (m * 1e7)).toFixed(1), 'x the pyramid vaporisation energy'); }
// summary claim: no survivable speed gets a baseball to 1 km
{ const o = obj('baseball'); const fl = (v, th) => P.flyTo({ v0: v, thetaDeg: th, h0: 1.8, hStop: 1.8, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, Rn: Math.sqrt(o.area / Math.PI) });
  for (const v of [3e3, 1e4, 3e4, 5e4, 1e5, 1e6, 2.99e6]) { let best = [0, 0, 0]; for (const th of [10, 15, 20, 25, 30, 35, 40, 50]) { const f = fl(v, th); if (f.range > best[0]) best = [f.range, th, f.heatLoad * o.area / (o.m * 1e6)]; }
    console.log('baseball v', v.toExponential(2), 'best range', best[0].toFixed(0), 'm at', best[1], 'deg; heat share', best[2].toExponential(2), 'ram/known-safe-pressure?', (K.rho0 * v * v).toExponential(2), 'Pa'); } }
