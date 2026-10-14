const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
for (const kg of [9.07e4, 1e6, 1e8]) for (const oAnc of ['friction', 'bolted']) {
  const cR = Object.assign(ctx({ F: kg*K.g }), ON), cO = Object.assign(ctx({ F: kg*K.g, anchor: oAnc }), ON, { body: ollie });
  const r = P.shove(cR, cO);
  if (!r.toGround) { console.log(kg, oAnc, 'no toGround', r.stalled); continue; }
  const fB = P.anchorCapacity({ body: ollie, surface: cO.surface, theta: 0, anchor: oAnc, groundHolds: true });
  const net = r.push.pB;   // the partner's (plus arms) momentum = net impulse into the ground during the push
  const s1 = P.impulseSource(cR.surface, r.toGround.J, r.toGround.T), s2 = P.impulseSource(cR.surface, net, r.toGround.T);
  console.log(kg.toExponential(2), 'Ollie', oAnc, 'vB', r.vB.toFixed(2), 'J(shover feet)', r.toGround.J.toExponential(2), 'partner footing impulse', (fB.R*r.push.t).toExponential(2), 'net (pB)', net.toExponential(2), '| plaster reach J', P.plasterReach(s1).toFixed(1), 'net', P.plasterReach(s2).toFixed(1), '| feel', P.ppvReach(s1, P.VIB.TH.feel).toFixed(1), P.ppvReach(s2, P.VIB.TH.feel).toFixed(1));
}
