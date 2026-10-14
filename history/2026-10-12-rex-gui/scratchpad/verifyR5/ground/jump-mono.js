const { P, g, M, surf, rex, ollie, ON, ctxOf } = require('./env.js');
const step = +process.argv[2] || 0.01, lgMax = +process.argv[4] || 34;
const sets = process.argv[3] === 'on' ? { ON } : { ON, unbOnly: { unbreakable: true }, off: {} };
const surfaces = ['sand', 'gravel', 'softclay', 'stiffclay', 'asphalt', 'concrete', 'granite'];
const fmt = (x) => x == null ? '-' : Number(x).toPrecision(4);
for (const body of [rex, ollie]) for (const [sn, pw] of Object.entries(sets)) for (const sf of surfaces) {
  let prev = null; const drops = [];
  const t0 = Date.now();
  const lgs = []; for (let lg = 1.5; lg <= lgMax + 1e-9; lg += step) lgs.push(lg); if (lgMax >= 34) lgs.push(Infinity);
  for (const lg of lgs) {
    const c = ctxOf(Math.pow(10, lg) * g, Object.assign({ body }, pw, { surface: surf(sf) })), r = P.jump(c);
    const o = Object.assign({ surface: c.surface, body, m: body.m }, pw), src = M.jump.shake(r, o);
    const list = Array.isArray(src) ? src : src ? [src] : [];
    const v5 = P.ppvAt(src, 5), v15 = P.ppvAt(src, 1.5), pr = src ? P.plasterReach(src) : 0;
    const parts = list.map((s) => P.ppvAt(s, 5));
    const cur = { lg, v5, v15, pr, parts, ratio: r.landRatioReal, landed: r.landing && r.landing.landed, po: r.pushOff };
    if (prev) for (const k of ['v5', 'v15', 'pr']) if (cur[k] < prev[k] * (1 - 1e-9)) drops.push(k + ' ' + prev.lg.toFixed(3) + '->' + lg.toFixed(3) + ': ' + fmt(prev[k]) + '->' + fmt(cur[k]) + ' parts5 [' + prev.parts.map(fmt) + ']->[' + cur.parts.map(fmt) + '] ratio ' + fmt(prev.ratio) + '->' + fmt(cur.ratio) + ' landed ' + prev.landed + '->' + cur.landed + (cur.po ? ' pushOff J ' + fmt(prev.po && prev.po.J) + '/' + fmt(prev.po && prev.po.T) + '->' + fmt(cur.po.J) + '/' + fmt(cur.po.T) : ''));
    if (!(v5 >= 0) || (isNaN(pr))) drops.push('NaN at ' + lg);
    prev = cur;
  }
  console.log(body.build, sn, sf, (Date.now() - t0) + 'ms', 'drops', drops.length, '\n   ' + drops.slice(0, 6).join('\n   '));
}
