const { P, g, M, surf, rex, ON, ctxOf } = require('./envfix2.js');
const fmt = (x) => Number(x).toPrecision(4);
for (const sf of ['sand', 'gravel', 'softclay', 'stiffclay', 'asphalt', 'concrete', 'granite']) {
  let worst = 0, at = null;
  for (let lg = 2; lg <= 12.4; lg += 0.05) {
    const c0 = ctxOf(Math.pow(10, lg) * g, { surface: surf(sf) }), c1 = Object.assign({}, c0, ON);
    const r0 = P.jump(c0), r1 = P.jump(c1);
    if (!r1.landing.landed || !(r1.landing.v > 0)) continue;
    const l1 = M.jump.shake(r1, Object.assign({ surface: c1.surface, body: rex, m: rex.m }, ON)).slice(0, 2), l0 = M.jump.shake(r0, { surface: c0.surface, body: rex, m: rex.m });
    const k = P.ppvAt(l1, 5) / P.ppvAt(l0, 5), kp = (P.plasterReach(l1) || 0) / (P.plasterReach(l0) || 1e-300);
    if (k > worst) { worst = k; at = lg.toFixed(2) + ' (v on ' + fmt(r1.landing.v) + ', off ' + fmt(r0.landing.v) + ')'; }
  }
  console.log(sf, 'max landing ppv5 on/off', fmt(worst), 'at', at);
}
