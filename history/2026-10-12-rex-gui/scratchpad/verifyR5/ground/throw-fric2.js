const { P, g, M, surf, obj, rex, ON, ctxOf } = require('./env.js');
const fmt = (x) => x == null ? '-' : Number(x).toPrecision(4);
for (const sf of ['sand', 'gravel', 'softclay', 'stiffclay', 'concrete']) for (const ang of [0, 30, 45, 60]) for (const oid of ['car', 'baseball', 'bus']) {
  const pw = Object.assign({}, ON, { ownRecoil: false, surface: surf(sf) });
  let prev = null; const drops = [];
  for (let lg = 1.5; lg <= 12; lg += 0.02) {
    const c = ctxOf(Math.pow(10, lg) * g, pw), r = P.throwObject(c, obj(oid), ang), tg = r.toGround;
    if (!tg || !(tg.J > 0)) { prev = null; continue; }
    const src = P.impulseSource(c.surface, tg.J, Math.max(1e-9, tg.T));
    const cur = { lg, v5: P.ppvAt(src, 5), v20: P.ppvAt(src, 20), feel: P.ppvReach(src, P.VIB.TH.feel), rattle: P.ppvReach(src, P.VIB.TH.rattle), pr: P.plasterReach(src), sd: tg.suppliedSide || 0 };
    if (prev) for (const k of ['v5', 'v20', 'feel', 'rattle', 'pr']) if (cur[k] < prev[k] * (1 - 1e-6)) drops.push(k + ' ' + prev.lg.toFixed(2) + '->' + lg.toFixed(2) + ' ' + fmt(prev[k]) + '->' + fmt(cur[k]) + ' sd ' + fmt(prev.sd) + '->' + fmt(cur.sd));
    prev = cur;
  }
  if (drops.length) console.log(sf, ang, oid, 'drops', drops.length, '\n  ' + drops.filter((d, i) => i < 3 || i === drops.length - 1).join('\n  '));
}
