const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
const RS = P.RESTRAINT;
for (const s of ['concrete', 'sand']) for (const F of [Infinity, 1e30 * 9.81, 1e20 * 9.81]) {
  const c = Object.assign(ctx(Object.assign({ s }, ON)), { F });
  const r = P.jump(c);
  const o = Object.assign({ near: 5, body: rex, surface: surf(s), anchor: 'friction', m: rex.m }, ON);
  const src = RS.MOVES.jump.shake(r, o);
  console.log(s, F, 'v/c', r.v / P.K.c, 'pushOff', JSON.stringify(r.pushOff), 'push.t', r.push.t, 'ppv5', P.ppvAt(src, 5), 'plaster', P.plasterReach(src));
}
