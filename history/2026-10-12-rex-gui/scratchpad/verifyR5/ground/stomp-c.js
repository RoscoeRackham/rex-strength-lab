const { P, g, M, surf, rex, ON, ctxOf } = require('./env.js');
const fmt = (x) => x == null ? '-' : Number(x).toPrecision(5);
for (const sf of ['concrete', 'sand']) for (const lg of [20, 24, 25, 26, 26.4, 26.5, 26.6, 26.7, 26.8, 26.9, 27, 27.5, 30, 34, Infinity]) {
  const c = ctxOf(Math.pow(10, lg) * g, Object.assign({}, ON, { surface: surf(sf) })), r = P.stomp(c);
  const o = Object.assign({ surface: c.surface, body: rex }, ON), b = M.stomp.blow(r, o);
  const pE = isFinite(r.E) ? Math.sqrt(r.E * r.E + 2 * r.E * rex.legEff * P.K.c * P.K.c) / P.K.c : Infinity;
  console.log(sf, lg, 'vF/c', fmt(r.vFoot / P.K.c), 'E', fmt(r.E), 'J', fmt(b.J), 'whole', fmt(b.whole), 'whole/pE', fmt(b.whole / pE), 'supplied', fmt(b.supplied), 'T', fmt(b.T), 'plaster', fmt(P.plasterReach(M.stomp.shake(r, o))));
}
