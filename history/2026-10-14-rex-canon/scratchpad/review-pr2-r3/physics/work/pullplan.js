const which = process.argv[2];
const E = which === 'main' ? require('./envm.js') : require('./env.js');
const { P, D, rex, surf } = E;
const fmt = (x) => (x == null ? x : isFinite(x) ? Math.round(x / P.K.g) : x);
for (const anchor of ['friction', 'bolted']) for (const kg of [90718.474, 1e6, 1e9]) for (const oid of ['car', 'semi']) {
  const ctx = { F: kg * P.K.g, mode: 'comic', body: rex, surface: surf('concrete'), anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const o = D.objects.find((x) => x.id === oid);
  const p = P.RESTRAINT.planNow('pull', ctx, { obj: o, target: 10, near: 5 });
  const ce = p.ceiling(); const pr = p.presets(); const g = p.goal();
  const all = p.run(ctx.F);
  const sh = P.RESTRAINT.MOVES.pull.shake(all, Object.assign({}, p.opt));
  console.log(which, anchor, kg, oid, 'goal', fmt(g.use), 'ceiling', fmt(ce.use), ce.by, 'presets', pr.map((x) => x.id + ':' + (x.never ? 'never' : fmt(x.use))).join(' '), 'allout t', all.t10m.toFixed(3), 'ppv5', sh ? (P.ppvAt(sh, 5) * 1e3).toFixed(4) : null);
}
