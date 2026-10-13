const { P, D, g, ON, OFF, ctx } = require('./h.js');
const UN = Object.assign({}, OFF, { unbreakable: true });
for (const [nm, pw] of [['unb only', UN], ['ON', ON]]) for (const kg of [3e3, 1e4, 1e5, 1e6]) {
  const cR = ctx(kg, { pw }), cO = ctx(kg, { build: 'ollie', pw });
  const s = P.shove(cR, cO);
  const p = s.push;
  // reconstruct shover feet impulse: pB - pA + RB*t
  console.log(nm, kg.toExponential(0), 'stalled', s.stalled, 'vA', s.vA.toPrecision(3), 'vB', s.vB.toPrecision(3), 'push.pB', p && p.pB.toPrecision(4), 'push.pA', p && p.pA.toPrecision(4), 't', p && p.t.toPrecision(3), 'J', s.toGround && s.toGround.J, 'src', s.toGround && !!P.impulseSource(cR.surface, s.toGround.J, s.toGround.T), 'groundOf', !!P.groundOf(cR.surface));
}
