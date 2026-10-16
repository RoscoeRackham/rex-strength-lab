const { P, D, g, surf, obj, rex, ON, ctxOf, DEF, sig } = require('./hv.js');
const R = P.RESTRAINT;
for (const [F, dl] of [[1e9 * g, '1e9'], [DEF, 'def']]) for (const sid of ['concrete', 'sand', 'gravel']) for (const oid of ['loco', 'tank', 'semi']) for (const th of [0, 45, 90]) {
  const o = obj(oid);
  const ctx = ctxOf(F, Object.assign({ surface: surf(sid), use: F }, ON));
  const p = R.planNow('throw', ctx, { obj: o, angle: th, target: 30, near: 5 });
  const ce = p.ceiling(), pr = p.presets();
  console.log(dl, sid, oid, th, 'ceil', ce.by, sig(ce.use / g, 4), '| presets', pr.map(x => x.id + ':' + (x.never ? 'never' : x.onlyUnlimited ? 'unl' : sig(x.use / g, 4))).join(' '));
}
