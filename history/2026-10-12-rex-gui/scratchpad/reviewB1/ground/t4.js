const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig } = require('./common.js');
// Ollie charges standing Rex ('set' speeds), unbreakable on, concrete
for (const sid of ['concrete', 'sand', 'granite']) {
for (const gb of [1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 5e-3, 9e-3]) {
  const cA = Object.assign(ctxOf(1e30, ON), { body: ollie, surface: surf(sid) }), cB = ctxOf(1e30, Object.assign({}, ON, { surface: surf(sid) }));
  const r = P.collide(cA, cB, { source: 'set', gb });
  const tg = r.toGround;
  const src = tg ? P.impulseSource(cB.surface, tg.J, tg.T) : null;
  console.log(sid, 'gb', gb, 'v', sig(r.v0, 3), r.outcome, 'held', r.held, 'tg', tg && tg.how, 'J', sig(tg && tg.J, 3), 'T', sig(tg && tg.T, 3), 'ppv5', sig(P.ppvAt(src, 5), 3), 'plasterOver5', src ? P.plasterOver(src, 5) : null, 'reach', sig(src ? P.plasterReach(src) : 0, 3), 'H', sig(r.hold.H, 3));
}
}
