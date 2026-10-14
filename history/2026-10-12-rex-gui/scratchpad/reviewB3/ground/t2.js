const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const src of ['sprint','jump']) for (const anchor of ['bolted','friction']) for (const kg of [1e4, 9.07e4, 1e6, 1e7, 1e9]) {
  const cA = Object.assign(ctxOf(kg*g, ON), { body: ollie }), cB = ctxOf(kg*g, Object.assign({anchor}, ON));
  const r = P.collide(cA, cB, { source: src });
  if (r.noCharge) { console.log(src, anchor, kg, 'noCharge', r.noCharge); continue; }
  const s = r.toGround ? P.impulseSource(cB.surface, r.toGround.J, r.toGround.T) : null;
  console.log(src, anchor, sig(kg), 'v0', sig(r.v0), r.outcome, r.toGround ? r.toGround.how+' J '+sig(r.toGround.J)+' T '+sig(r.toGround.T)+' tc '+sig(r.contact.soft.t) : '-', 'ppv5', sig(P.ppvAt(s,5)), 'plaster', s? sig(P.plasterReach(s)) : 0, 'limit', s? sig(P.plasterLimitHz(1/s.T)):'');
}
