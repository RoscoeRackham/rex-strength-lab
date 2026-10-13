const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
const RS = P.RESTRAINT;
const s = 'sand', Nmax = P.qultFor(surf(s), rex.footB) * 2 * rex.footArea;
for (const [o, kg, th] of [['baseball', 1e9, 90], ['shot', 1e9, 90], ['baseball', 1e7, 90], ['car', 1e5, 90]]) {
  const c = ctx(Object.assign({ kg, s }, ON));
  const r = P.throwObject(c, obj(o), th);
  const op = Object.assign({ near: 5, body: rex, surface: surf(s), anchor: 'friction', m: rex.m, obj: obj(o), angle: th }, ON);
  const own = P.impulseSource(surf(s), r.toGround.J, r.toGround.T), land = RS.MOVES.throw.landShake(r, op);
  const Jfull = r.toGround.J + (r.toGround.supplied || 0);
  const stat = (rex.m - r.armMass) * P.K.g + r.mB * P.K.g;
  const Jr = Math.min(Jfull, Math.max(0, Nmax - stat) * r.toGround.T);
  const own2 = P.impulseSource(surf(s), Jr, r.toGround.T);
  console.log(o, kg.toExponential(0), th, 'v', r.v.toPrecision(3), 'landed', r.flight.landed, 'over', r.sinkRatioRaw.toPrecision(3), 'page share %', (100 / r.sinkRatioRaw).toPrecision(2), 'J code', r.toGround.J.toPrecision(3), 'J beyond-weight', Jr.toPrecision(3), 'share %', (100 * Jr / Jfull).toPrecision(2), '| ppv5 code', (P.ppvAt(own, 5) * 1e3).toFixed(2), 'rule', (P.ppvAt(own2, 5) * 1e3).toFixed(2), 'landing', (P.ppvAt(land, 5) * 1e3).toFixed(2));
}
