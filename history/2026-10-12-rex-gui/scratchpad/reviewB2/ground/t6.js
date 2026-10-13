const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const lp = P.limbPulse(rex());
console.log('limbPulse', lp);
for (const kg of [1e4, 1e5, 1e6, 1e8]) {
  for (const anc of ['bolted', 'friction']) {
    for (const src of ['sprint', 'jump']) {
    const cA = Object.assign(ctx({ F: kg*K.g }), ON, { body: ollie }), cB = Object.assign(ctx({ F: kg*K.g, anchor: anc }), ON);
    const r = P.collide(cA, cB, { source: src });
    if (!r.toGround) { console.log(kg, anc, src, 'no toGround', r.outcome, r.noCharge||''); continue; }
    const s = P.impulseSource(cB.surface, r.toGround.J, r.toGround.T), s2 = P.impulseSource(cB.surface, r.toGround.J, Math.max(lp, r.toGround.T));
    console.log(kg.toExponential(0), anc, src, r.outcome, 'v0', r.v0.toFixed(1), 'J', r.toGround.J.toExponential(2), 'T', r.toGround.T.toExponential(2), 'how', r.toGround.how, '| ppv5', (P.ppvAt(s,5)*1000).toFixed(2), 'mm/s plasterReach', P.plasterReach(s).toFixed(1), '| with limb floor ppv5', (P.ppvAt(s2,5)*1000).toFixed(2), 'reach', P.plasterReach(s2).toFixed(1));
    }
  }
}
