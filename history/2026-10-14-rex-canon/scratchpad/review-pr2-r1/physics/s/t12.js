const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
const R = P.RESTRAINT, M = R.MOVES.throw, H = R.HAZARDS.find(h => h.id === 'plaster');
let hits = 0, n = 0;
for (const F of [DEF, 1e6 * g, 1e7 * g, 1e8 * g, 1e9 * g, 1e10 * g, 1e12 * g, 1e15 * g]) for (const sid of ['concrete', 'sand', 'gravel', 'granite', 'softclay']) for (const oid of ['baseball', 'shot', 'bowling', 'person', 'car', 'motorcycle']) for (const th of [0, 45, 90]) {
  const s = surf(sid); if (!s) continue;
  const o = obj(oid);
  const ctx = ctxOf(F, Object.assign({ surface: s, use: F }, ON));
  const opt = Object.assign({ near: 5, obj: o, angle: th, surface: s, body: rex }, ON);
  // all-out with own recoil off
  const c0 = Object.assign({}, ctx, { ownRecoil: false }); delete c0.use;
  const o0 = Object.assign({}, opt, { ownRecoil: false });
  const r0 = M.run(c0, o0);
  if (!(H.test(M, r0, o0) && M.shakeFrom(r0, o0) === 'him')) continue;
  n++;
  const p = R.planNow('throw', ctx, { obj: o, angle: th, target: 30, near: 5 });
  const res = p.result('hazard:plaster');
  if (res.never) { hits++; console.log('FIRES', sig(F / g), sid, oid, th); }
}
console.log('candidates where all-out own-off cracks plaster from him:', n, 'credit fires:', hits);
