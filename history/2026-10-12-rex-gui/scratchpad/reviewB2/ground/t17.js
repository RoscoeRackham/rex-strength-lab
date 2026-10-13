const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const lp = P.limbPulse(rex());
// scan efforts at the default dial (90.7 t): bolted Rex, sprint; and standing Rex, jump
for (const [anc, src] of [['bolted','sprint'], ['friction','jump']]) {
  let first = null, firstFloor = null;
  for (let lg = 3.6; lg <= 4.96; lg += 0.01) {
    const F = Math.pow(10, lg) * K.g;
    const cA = Object.assign(ctx({ F }), ON, { body: ollie }), cB = Object.assign(ctx({ F, anchor: anc }), ON);
    const r = P.collide(cA, cB, { source: src });
    if (!r.toGround) continue;
    const s = P.impulseSource(cB.surface, r.toGround.J, r.toGround.T), s2 = P.impulseSource(cB.surface, r.toGround.J, Math.max(lp, r.toGround.T));
    if (!first && P.plasterOver(s, 5)) first = { lg, reach: P.plasterReach(s), T: r.toGround.T, v: r.v0 };
    if (!firstFloor && P.plasterOver(s2, 5)) firstFloor = { lg, reach: P.plasterReach(s2) };
  }
  // at all-out (90.7 t)
  const F = 90718 * K.g, cA = Object.assign(ctx({ F }), ON, { body: ollie }), cB = Object.assign(ctx({ F, anchor: anc }), ON);
  const r = P.collide(cA, cB, { source: src });
  const s2 = P.impulseSource(cB.surface, r.toGround.J, Math.max(lp, r.toGround.T)), s = P.impulseSource(cB.surface, r.toGround.J, r.toGround.T);
  console.log(anc, src, 'plaster at 5 m first at log kg', first && first.lg.toFixed(2), JSON.stringify(first), '| with limb floor first:', JSON.stringify(firstFloor), '| all-out reach', P.plasterReach(s).toFixed(2), 'floored', P.plasterReach(s2).toFixed(2), 'T', r.toGround.T.toFixed(4));
}
