const { P, g, R3, O3, ON, dial, c3, sig } = require('./common.js');
// verbatim from engine.js:2307
function SW(mA, mB, v, s, H) {
  const mu = mA * mB / (mA + mB), arel = v * v / (2 * s);
  const F = mu * (arel + H / mB), tau = v / arel;
  const V = Math.max(0, v - F * tau / mA);
  const xB = 0.5 * ((F - H) / mB) * tau * tau;
  return { F, tau, V, Q: F * s, xB, Efoot: H * xB, Jearth: H * tau };
}
const on = (x) => Object.assign({}, ON, x || {});
const charge = (FO, o, xR, xO, FR) => P.collide(c3(FO, O3, xO || on()), c3(FR == null ? FO : FR, R3, xR || on()), o);
for (const [lab, r] of [['all-out', charge(dial, { source: 'sprint' })], ['least', charge(4260 * g, { source: 'sprint' }, on(), on(), dial)], ['1 m/s', charge(dial, { source: 'set', gb: 1 / P.K.c })], ['jump real ground', charge(dial, { source: 'jump' }, on({ unbreakable: false }), on({ unbreakable: false }))]]) {
  const k = r.carry, H = r.hold.H, s = r.contact.s;
  const x = SW(1e30, R3.m, k.v, s, H);
  console.log(lab, '| engine F', sig(k.F), 'T', sig(k.T), 'F*T', sig(k.F*k.T), 'footJ', sig(k.footJ), 'supplied', sig(k.supplied), '| SW(mA=1e30): F', sig(x.F), 'tau', sig(x.tau), 'Jearth', sig(x.Jearth), 'V', sig(x.V), 'xB', sig(x.xB), 'F*tau', sig(x.F * x.tau));
}
