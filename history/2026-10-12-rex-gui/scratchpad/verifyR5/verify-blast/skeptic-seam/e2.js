const root = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
global.window = {}; const P = require(root + '/src/engine.js'); require(root + '/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const R = P.RESTRAINT, M = R.MOVES.throw;
function run(objId, logKg, a, angle = 0) {
  const obj = D.objects.find(o => o.id === objId);
  const F = Math.pow(10, logKg) * P.K.g;
  const ctx = { F, use: F, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), anchor: 'friction', airAbsorb: a, keepForm: true, unbreakable: true, ownRecoil: true };
  const o = { near: R.R.NEAR, m: body.m, body, surface: ctx.surface, anchor: ctx.anchor, airAbsorb: a, keepForm: true, unbreakable: true, ownRecoil: true, obj, angle };
  const r = M.run(ctx, o);
  const re = R.reach('throw', r, o);
  const k = 1 - a;
  // energy e-fold length of drag at release: m / (0.5 Cd rho A k)  (speed e-fold twice that)
  return { objId, logKg, a, mach: (r.v / 343).toFixed(1), v_kms: (r.v/1e3).toFixed(1), range_km: r.flight.range / 1e3, vImpact: r.flight.vImpact, Eobj: r.Eobj, Eimpact: r.Eimpact, dragLoss: r.dragLoss, dragLoss0: r.dragLoss0, parts: M.blastParts(r, o), air_km: re.air / 1e3, airIfAll_km: P.blastRadius(r.dragLoss + (M.blastParts(r,o).hand||0), 100) / 1e3, rel: r.flight.relativistic };
}
for (const L of [8, 9, 10, 12, 14]) for (const a of [0, 0.5, 0.9]) console.log(JSON.stringify(run('car', L, a)));
console.log(Object.keys(D.objects.find(o => o.id === 'car')));
