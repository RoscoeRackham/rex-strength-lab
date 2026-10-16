const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/verify-physics/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const o = D.objects.find((x) => x.id === 'person'), surface = D.surfaces.find((s) => s.id === 'concrete');
const M = P.RESTRAINT.MOVES.throw, orig = M.landShake;
for (const logKg of [Math.log10(90718.474), 6, 8, 9.15]) {
  const kg = Math.pow(10, logKg);
  const c = { F: kg * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, use: kg * P.K.g };
  const r = P.throwObject(c, o, 45), oo = Object.assign({}, c, { obj: o, angle: 45, near: 5 });
  M.landShake = orig; const a = P.RESTRAINT.reach('throw', r, oo); const nl = P.ppvNonlinear(orig(r, oo), 5);
  M.landShake = (r2, o2) => { const L = Math.cbrt(6 * o.m / (Math.PI * 1000)), v = r2.flight.vImpact, T = Math.max(1e-3, L / v); const J = Math.min(o.m * v, Math.max(0, surface.qult * 0.67 - o.m * P.K.g) * T); return P.impulseSource(surface, J, T); };
  const b = P.RESTRAINT.reach('throw', r, oo); M.landShake = orig;
  console.log(logKg.toFixed(3), 'plaster uncapped', a.plaster.toFixed(1), 'capped', b.plaster.toFixed(1), '| rattle', a.rattle.toFixed(0), '->', b.rattle.toFixed(0), '| nonlinear at 5 m:', nl);
}
