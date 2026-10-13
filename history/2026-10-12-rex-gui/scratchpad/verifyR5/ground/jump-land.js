// the landing parts alone (body stop + feet blow), and the push-off alone, vs effort; ON powers
const { P, g, M, surf, rex, ollie, ON, ctxOf } = require('./env.js');
const step = +process.argv[2] || 0.01;
const surfaces = ['sand', 'gravel', 'softclay', 'stiffclay', 'asphalt', 'concrete', 'granite'];
const fmt = (x) => x == null ? '-' : Number(x).toPrecision(4);
for (const body of [rex, ollie]) for (const sf of surfaces) {
  let prev = null; const drops = { land5: [], land15: [], landPr: [], feet5: [], body5: [], po5: [], poJ: [] };
  let peak = { v5: 0 }, endv = null;
  for (let lg = 1.5; lg <= 16; lg += step) {
    const c = ctxOf(Math.pow(10, lg) * g, Object.assign({ body }, ON, { surface: surf(sf) })), r = P.jump(c);
    const o = Object.assign({ surface: c.surface, body, m: body.m }, ON), src = M.jump.shake(r, o);
    const list = Array.isArray(src) ? src : src ? [src] : [];
    const landed = r.landing && r.landing.landed && r.landing.v > 0;
    const land = landed ? list.slice(0, 2) : [];
    const cur = { lg, landed, land5: P.ppvAt(land, 5), land15: P.ppvAt(land, 1.5), landPr: land.length ? P.plasterReach(land) : 0, body5: landed ? P.ppvAt(list[0], 5) : 0, feet5: landed && list[1] ? P.ppvAt(list[1], 5) : 0, po5: r.pushOff ? P.ppvAt(P.impulseSource(c.surface, r.pushOff.J, Math.max(1e-9, r.pushOff.T)), 5) : 0, poJ: r.pushOff ? r.pushOff.J : 0, v5: P.ppvAt(src, 5), ratio: r.landRatioReal };
    if (cur.v5 > peak.v5) peak = cur;
    if (prev && prev.landed && cur.landed) for (const k of Object.keys(drops)) if (cur[k] < prev[k] * (1 - 1e-9)) drops[k].push(prev.lg.toFixed(2) + '->' + lg.toFixed(2) + ' ' + fmt(prev[k]) + '->' + fmt(cur[k]) + ' ratio ' + fmt(cur.ratio));
    if (cur.landed) endv = cur;
    prev = cur;
  }
  console.log(body.build, sf, 'peak v5', fmt(peak.v5), 'at', peak.lg.toFixed(2), '| last landed', endv && endv.lg.toFixed(2), 'v5', fmt(endv && endv.v5), 'po5', fmt(endv && endv.po5), 'land5', fmt(endv && endv.land5));
  for (const [k, v] of Object.entries(drops)) if (v.length) console.log('   ', k, v.length, 'first', v[0], 'last', v[v.length - 1]);
}
