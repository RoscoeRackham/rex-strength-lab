const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const sid of ['concrete', 'sand', 'granite']) for (const [oid, th] of [['car', 45], ['bus', 45], ['baseball', 45]]) for (const lg of [5, 9]) {
  const c = ctxOf(Math.pow(10, lg), Object.assign({ surface: surf(sid) }, ON));
  const o = { obj: obj(oid), angle: th, target: 30, near: 5 };
  const p = P.RESTRAINT.planNow('throw', c, o);
  const out = [sid, oid, th, '1e' + lg];
  for (const n of ['preset:rattle', 'preset:plaster', 'hazard:plaster']) {
    const r = p.result(n);
    if (!r || r.never) { out.push(n + ' never'); continue; }
    const run = p.run(r.use);
    const sh = M.throw.shake(run, p.opt);
    const land = M.throw.landShake(run, p.opt);
    out.push(n + ' ' + sig(r.use / g, 3) + ' kg from ' + M.throw.shakeFrom(run, p.opt) + ' (ppv5 total ' + sig(P.ppvAt(sh, 5), 3) + ', landing ' + sig(P.ppvAt(land, 5), 3) + ', plaster reach landing ' + sig(P.plasterReach(land), 3) + ')');
  }
  console.log(out.join(' | '));
}
