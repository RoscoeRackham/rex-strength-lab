const which = process.argv[2];
const E = which === 'main' ? require('./envm.js') : require('./env.js');
const { P, D, rex, surf } = E;
const kgf = (x) => (x == null ? x : isFinite(x) ? Math.round(x / P.K.g) : String(x));
const cases = JSON.parse(process.argv[3]);
const out = [];
for (const [oid, sid, ang, kg, what] of cases) {
  const ctx = { F: kg * P.K.g, mode: 'comic', body: rex, surface: surf(sid), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const o = D.objects.find((x) => x.id === oid);
  const p = P.RESTRAINT.planNow('throw', ctx, { obj: o, angle: ang, target: 30, near: 5 });
  const ce = p.ceiling(); const pr = Object.fromEntries(p.presets().map((x) => [x.id, x.never ? 'never' : kgf(x.use)]));
  let reach = null;
  if (what === 'reach') { const r = p.run(ctx.F); const rc = P.RESTRAINT.reach('throw', r, Object.assign({}, p.opt)); reach = rc.plaster; }
  out.push([oid, sid, ang, kg, 'ceil', kgf(ce.use), ce.by, 'rattle', pr.rattle, 'plaster', pr.plaster, 'ground', pr.ground, reach != null ? 'plasterReach ' + reach.toFixed(1) : ''].join(' '));
}
console.log(out.join('\n'));
