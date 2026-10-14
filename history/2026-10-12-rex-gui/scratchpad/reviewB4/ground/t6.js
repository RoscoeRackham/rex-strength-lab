const { P, D, rex, surf, obj, ctx, ON } = require('./h.js');
const RS = P.RESTRAINT;
const s = 'sand', q = P.qultFor(surf(s), rex.footB), Nmax = q * 2 * rex.footArea;
for (const [o, kg, th] of [['car', 90718, 90], ['car', 90718, 80], ['bus', 1e6, 90], ['shot', 1e6, 90]]) {
  const c = ctx(Object.assign({ kg, s }, ON));
  const r = P.throwObject(c, obj(o), th);
  const op = Object.assign({ near: 5, body: rex, surface: surf(s), anchor: 'friction', m: rex.m, obj: obj(o), angle: th }, ON);
  const own = P.impulseSource(surf(s), r.toGround.J, r.toGround.T), land = RS.MOVES.throw.landShake(r, op);
  const t = th * Math.PI / 180, Jfull = r.toGround.J + (r.toGround.supplied || 0);
  const stat = (rex.m - r.armMass) * P.K.g + r.mB * P.K.g; // him plus the load held up (vertical throw)
  const Jv = Jfull * Math.sin(t), Jh = Jfull * Math.cos(t);
  const JvRight = Math.min(Jv, Math.max(0, Nmax - stat) * r.toGround.T);
  const own2 = P.impulseSource(surf(s), Math.hypot(Jh, JvRight), r.toGround.T);
  console.log(o, kg, th, 'v', r.v.toFixed(1), 'over', r.sinkRatioRaw.toFixed(1), 'J code', r.toGround.J.toFixed(0), 'of', Jfull.toFixed(0), '; static', stat.toFixed(0), 'Nmax', Nmax.toFixed(0), '-> J beyond-weight rule', Math.hypot(Jh, JvRight).toFixed(0),
    '| ppv5 own (code)', (P.ppvAt(own, 5) * 1e3).toFixed(2), 'own (rule)', (P.ppvAt(own2, 5) * 1e3).toFixed(2), 'landing', (P.ppvAt(land, 5) * 1e3).toFixed(2), 'from', RS.MOVES.throw.shakeFrom(r, op));
}
