const { P, g, sig, rex, ollie, ctx, ppv, ob, F0, sf } = require('./h.js');
const c = ctx();
for (const lg of [3, 4, 5, 6, 7, 8, 9, 10, 12]) {
  const cA = ctx({ F: Math.pow(10, lg) * g }), cB = ctx({ F: Math.pow(10, lg) * g / 2 }, ollie), r = P.armWrestle(cA, cB);
  if (!r.pin) { console.log(lg, r.outcome); continue; }
  const J = P.vToMomentum(r.pin.v, r.pin.M), T = P.limbPulse(rex), src = P.impulseSource(c.surface, J, T);
  console.log('1e' + lg, 'vs half: pin t', sig(r.pin.t), 'v', sig(r.pin.v), 'J', sig(J), 'ppv5 mm/s', sig(P.ppvAt(src, 5) * 1000), 'plaster reach m', sig(P.plasterReach(src)), 'today toGround', !!r.toGround);
}
