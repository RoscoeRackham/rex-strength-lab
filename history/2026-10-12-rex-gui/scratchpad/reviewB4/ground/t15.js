const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
const RS = P.RESTRAINT;
const s = 'sand', Nmax = P.qultFor(surf(s), rex.footB) * 2 * rex.footArea, mu = surf(s).mu;
const pw = { airAbsorb: 1, keepForm: true, unbreakable: true };
for (const [o, kg, th] of [['baseball', 1e9, 45], ['car', 1e8, 45], ['car', 1e8, 60], ['bus', 1e7, 45]]) {
  const c = ctx(Object.assign({ kg, s }, pw));
  const r = P.throwObject(c, obj(o), th);
  const op = Object.assign({ near: 5, body: rex, surface: surf(s), anchor: 'friction', m: rex.m, obj: obj(o), angle: th }, pw);
  const own = P.impulseSource(surf(s), r.toGround.J, r.toGround.T), land = RS.MOVES.throw.landShake(r, op);
  const t = th * Math.PI / 180, Jfull = r.toGround.J + (r.toGround.supplied || 0);
  const JhCap = Math.min(Jfull * Math.cos(t), mu * Nmax * r.toGround.T);
  const own2 = P.impulseSource(surf(s), Math.hypot(JhCap, r.toGround.J * 0 + Math.sqrt(Math.max(0, r.toGround.J ** 2 - (Jfull * Math.cos(t)) ** 2))), r.toGround.T);
  console.log(o, kg.toExponential(0), th, 'v', r.v.toPrecision(3), 'landed', r.flight.landed, 'recoilV', r.recoilV.toFixed(1), 'J', r.toGround.J.toPrecision(3), 'Jh', (Jfull * Math.cos(t)).toPrecision(3), 'mu*Nmax*T', (mu * Nmax * r.toGround.T).toPrecision(3), '| ppv5 own', (P.ppvAt(own, 5) * 1e3).toFixed(1), 'capped', (P.ppvAt(own2, 5) * 1e3).toFixed(2), 'landing', (P.ppvAt(land, 5) * 1e3).toFixed(1), 'from', RS.MOVES.throw.shakeFrom(r, op), 'plaster own', P.plasterReach(own).toFixed(1), 'capped', P.plasterReach(own2).toFixed(1));
}
