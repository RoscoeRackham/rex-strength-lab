const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const sid of ['sand','gravel','softclay','stiffclay','asphalt','concrete','granite']) {
  const cA = Object.assign(ctxOf(1e9*g, Object.assign({surface: surf(sid)}, ON)), { body: ollie }), cB = ctxOf(1e9*g, Object.assign({ anchor: 'friction', surface: surf(sid) }, ON));
  for (const src of ['sprint']) { const r = P.collide(cA, cB, { source: src });
    const s = r.toGround ? P.impulseSource(cB.surface, r.toGround.J, r.toGround.T) : null;
    console.log(sid, src, r.outcome, 'v0', sig(r.v0), r.toGround ? 'J '+sig(r.toGround.J) : '', 'ppv5', sig(P.ppvAt(s,5)), 'plaster', P.plasterOver(s,5), 'reach', sig(P.plasterReach(s))); }
}
