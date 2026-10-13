const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const R = P.RESTRAINT;
const fmt = (r) => r ? (r.never ? 'never' : (r.use/K.g).toExponential(2)) : 'null';
for (const sid of ['sand','gravel','softclay','concrete']) {
  for (const pw of [ON, {}]) {
    const c = Object.assign(ctx({ F: 1e12*K.g, surface: surf(sid) }), pw);
    const pl = R.plan('stomp', c, {});
    while (!pl.step());
    const ps = pl.presets().map(p => p.id + '=' + fmt(p)).join(' ');
    const ce = pl.ceiling();
    console.log(sid, pw.unbreakable ? 'ON ' : 'OFF', 'ceiling', fmt(ce), ce.by, '|', ps);
    // blast at windows preset effort and 10x it
    const w = pl.result('preset:windows');
    if (w && !w.never) { for (const f of [1, 10, 100]) { const r = pl.run(w.use*f); console.log('   at', (w.use*f/K.g).toExponential(2), 'kgf: vFoot', r.vFoot.toFixed(0), 'E', r.E.toExponential(2), 'hole', r.holeDepth.toFixed(2), 'crater', r.crater.toFixed(1), 'absorbed', (r.absorbed||0).toExponential(2), 'blastE', R.reach('stomp', r, Object.assign({}, pl.opt)).windows.toFixed(1),'m windows reach'); } }
  }
}
