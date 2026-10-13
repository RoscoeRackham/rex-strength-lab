const root = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
global.window = {}; const P = require(root + '/src/engine.js'); require(root + '/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const obj = D.objects.find(o => o.id === 'car');
const R = P.RESTRAINT, M = R.MOVES.throw;
function run(logKg, k, powers = true) {
  const F = Math.pow(10, logKg) * P.K.g;
  const ctx = { F, use: F, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), anchor: 'friction', airAbsorb: k, keepForm: powers, unbreakable: powers, ownRecoil: powers };
  const o = { near: R.R.NEAR, m: body.m, body, surface: ctx.surface, anchor: ctx.anchor, airAbsorb: k, keepForm: powers, unbreakable: powers, ownRecoil: powers, obj, angle: 0 };
  const r = M.run(ctx, o);
  const re = R.reach('throw', r, o);
  const b = M.blastParts(r, o);
  const at = M.blastAt ? M.blastAt(r, o, 1e5) : "none";
  return { logKg, k, v_c: r.v / P.K.c, rel: !!(r.flight && r.flight.relativistic), range: r.flight && r.flight.range, Eobj: r.Eobj, dragLoss: r.dragLoss, dragLoss0: r.dragLoss0, blast: M.blast(r, o), land: b.land, path: b.path, hand: b.hand, blastAt: at, air_km: re.air / 1e3 };
}
const ks = [0, 0.5, 0.9, 0.99];
for (const k of ks) for (const L of [14.9, 14.92, 14.94, 14.95]) {
  const x = run(L, k);
  console.log(JSON.stringify({ absorb: k, L, v_c: x.v_c.toFixed(5), rel: x.rel, range_km: x.range && (x.range/1e3).toFixed(2), Eobj: x.Eobj.toExponential(3), dragLoss: x.dragLoss && x.dragLoss.toExponential(3), dragLoss0: x.dragLoss0 && x.dragLoss0.toExponential(3), blast: x.blast.toExponential(3), blastAt: x.blastAt, air_km: x.air_km.toFixed(1) }));
}
