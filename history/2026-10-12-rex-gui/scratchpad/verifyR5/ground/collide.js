const { P, g, M, surf, rex, ollie, ON, ctxOf } = require('./env.js');
const fmt = (x) => x == null ? '-' : Number(x).toPrecision(5);
for (const sf of ['sand', 'gravel', 'softclay', 'stiffclay', 'concrete']) for (const src of ['jump', 'stomp', 'sprint']) for (const lg of [5, 8, Infinity]) {
  const cA = ctxOf(Math.pow(10, lg) * g, Object.assign({}, ON, { body: ollie, surface: surf(sf) })), cB = Object.assign({}, cA, { body: rex });
  const r = P.collide(cA, cB, { source: src }), tg = r.toGround;
  const Nmax = P.qultFor(surf(sf), rex.footB) * 2 * rex.footArea;
  const want = tg ? Math.min(tg.whole != null ? tg.whole : tg.J, Math.max(0, Nmax - (ollie.m + rex.m) * g) * tg.T) : null;
  console.log(sf, src, lg, 'held', r.held, 'why', r.hold && r.hold.why, 'horiz?', r.horiz, 'J', fmt(tg && tg.J), 'whole', fmt(tg && tg.whole), 'supplied', fmt(tg && tg.supplied), 'T', fmt(tg && tg.T), 'want', fmt(want), tg && tg.whole != null ? (Math.abs(tg.J - want) <= 1e-9 * Math.max(1, want) ? 'OK' : 'MISMATCH') : '');
}
