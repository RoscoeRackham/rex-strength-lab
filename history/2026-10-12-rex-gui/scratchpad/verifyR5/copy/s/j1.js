const { P, D, rex, surf, ON, ctxOf, g } = require('./eng.js');
const M = P.RESTRAINT.MOVES;
for (const m of [3007, 5000, 30000]) for (const sf of ['sand', 'gravel', 'softclay', 'concrete']) for (const lg of [4, 5, 6]) {
  const body = P.makeBody({ build: 'rex', H: 3.048, m });
  const c = ctxOf(Math.pow(10, lg) * g, Object.assign({}, ON, { surface: surf(sf), body }));
  const r = P.jump(c), L = r.landing;
  const sh = M.jump.shake(r, Object.assign({ surface: c.surface, body, m }, ON));
  console.log(m, sf, lg, 'v', r.v.toFixed(2), 'landed', L.landed, 'landBear', r.landBear.toFixed(0), 'landRatioReal', (r.landRatioReal||0).toFixed(2), 'pushOff', JSON.stringify(r.pushOff), 'shake srcs', sh.map(s => s ? 'src' : 'null').join(','));
}
