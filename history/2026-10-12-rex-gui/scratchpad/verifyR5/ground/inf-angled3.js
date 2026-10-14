const { P, g, M, surf, obj, rex, ollie, ON, ctxOf } = require('./envfix3.js');
for (const sf of ['concrete', 'sand']) for (const ang of [30, 45, 60, 89, 90]) for (const pw of [ON, Object.assign({}, ON, { ownRecoil: false }), { unbreakable: true, anchor: 'bolted' }]) {
  const c = ctxOf(Infinity, Object.assign({}, pw, { surface: surf(sf) })), r = P.throwObject(c, obj('car'), ang);
  const tg = r.toGround;
  const o = { surface: c.surface, body: rex, m: rex.m, obj: obj('car'), angle: ang, ...pw };
  let reach = null; try { reach = P.RESTRAINT.reach('throw', r, o); } catch (e) { reach = e.message; }
  console.log(sf, ang, JSON.stringify(pw), 'sinkRatioRaw', r.sinkRatioRaw, 'toGround', tg && JSON.stringify({ J: String(tg.J), whole: String(tg.whole), supplied: String(tg.supplied), dn: String(tg.suppliedDown), sd: String(tg.suppliedSide), T: tg.T }), 'plaster', reach && reach.plaster);
}
