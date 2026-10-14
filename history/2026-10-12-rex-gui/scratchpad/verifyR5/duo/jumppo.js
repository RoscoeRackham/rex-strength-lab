// solo Jump tab: the push-off source's plaster reach versus effort (powers on, concrete)
const { P, ctxOf, sig, rex } = require('./h.js');
for (const lg of [5, 6, 7, 7.25, 8, 9, 10, 11]) {
  const c = ctxOf(Math.pow(10, lg)), r = P.jump(c);
  if (!r.pushOff || !(r.pushOff.J > 0)) { console.log(lg, 'no push-off'); continue; }
  const s = P.impulseSource(c.surface, r.pushOff.J, Math.max(1e-9, r.pushOff.T));
  console.log('10^' + lg, 'push-off J', sig(r.pushOff.J), 'T', sig(r.pushOff.T), 'plaster', sig(P.plasterReach(s)), 'ppv5', sig(P.ppvAt(s, 5) * 1000));
}
