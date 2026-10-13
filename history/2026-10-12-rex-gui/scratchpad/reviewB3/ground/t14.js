const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const kg of [1e6, 1e7]) {
  const c = ctxOf(kg*g, ON), s = P.stomp(c), s0 = P.stomp(Object.assign({}, c, { ownRecoil: false }));
  const o = { surface: c.surface, body: rex, unbreakable: true, ownRecoil: true };
  const src = M.stomp.shake(s, o);
  const pull = P.impulseSource(c.surface, s.push.pB, Math.max(P.limbPulse(rex), s.push.t));
  console.log(sig(kg), 'kg: bolted', s.bolted, 'push.t', sig(s.push.t), 'limbPulse', sig(P.limbPulse(rex)), 'blow J', sig(P.vToMomentum(s.vFoot, rex.legEff)), 'standing-foot pull J', sig(s.push.pB), 'blow ppv5', sig(P.ppvAt(src,5)), 'plaster reach', sig(P.plasterReach(src)), '| without the power vBody', sig(s0.vBody), 'm/s');
}
