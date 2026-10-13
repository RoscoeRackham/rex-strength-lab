const { P, D, rex, surf, obj, ctx, ON } = require('./h.js');
for (const o of ['car','bus','baseball']) for (const kg of [1e4, 1e5, 1e6]) {
  const th = 90;
  const c = ctx(Object.assign({ kg, s: 'sand' }, ON));
  const r = P.throwOnce(c, obj(o), th);
  if (!r.canMove) { console.log(o, kg, 'cannot'); continue; }
  const q = P.qultFor(surf('sand'), rex.footB), Nmax = q * 2 * rex.footArea;
  const stat = (rex.m - r.armMass) * P.K.g;
  const Nfeet = r.sinkRatioRaw * Nmax;
  const tg = r.toGround;
  const Jfull = tg.J + (tg.supplied || 0);
  const shareCode = 1 / Math.max(1, r.sinkRatioRaw);
  const shareRight = Math.max(0, Math.min(1, (Nmax - stat) / (Nfeet - stat)));
  // jump-style: (bearing - weight) * T
  const Jjump = Math.min(Jfull, Math.max(0, Nmax - stat) * tg.T);
  console.log(o, kg, 'v', r.v.toFixed(2), 'Nfeet', Nfeet.toFixed(0), 'Nmax', Nmax.toFixed(0), 'static', stat.toFixed(0), 'J code', tg.J.toFixed(0), 'J right', (Jfull*shareRight).toFixed(0), 'J jump rule', Jjump.toFixed(0), 'T', tg.T.toFixed(3), 'ratio', (tg.J/(Jfull*shareRight)).toFixed(2));
}
