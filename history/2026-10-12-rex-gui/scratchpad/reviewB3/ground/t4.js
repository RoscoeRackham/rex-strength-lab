const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
// arm wrestling: Ollie at a lower strength so Rex pins
for (const lg of [3,4,5,6,7,8,9,10,12]) {
  const cA = ctxOf(Math.pow(10,lg)*g, ON), cB = Object.assign(ctxOf(Math.pow(10,lg)*g*0.5, ON), { body: ollie });
  const r = P.armWrestle(cA, cB);
  const s = r.toGround ? P.impulseSource(cA.surface, r.toGround.J, r.toGround.T) : null;
  console.log('1e'+lg, r.outcome, r.pin ? 'v '+sig(r.pin.v)+' t '+sig(r.pin.t)+' M '+sig(r.pin.M) : '', r.toGround ? 'J '+sig(r.toGround.J)+' T '+sig(r.toGround.T) : '', 'ppv5', sig(P.ppvAt(s,5)), 'plasterOver', P.plasterOver(s,5), 'quake', sig(r.quake), 'pinT/limb', r.pin ? sig(r.pin.t / P.limbPulse(rex)) : '');
}
