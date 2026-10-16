const { P, D, rex, ollie, surf, objs, ON, OFF, ctx } = require('./h.js');
const g = P.K.g;
// partner toss 10 m (easy) and the hard toss at the default dial; the car throw at 45 and 90
const c = ctx(90718.474, ON);
for (const style of ['easy', 'hard']) {
  const t = P.tossPartner(c, ollie, 'Ollie', style, 10, 'friction');
  const T = t.recoilAbsorbedT.T, J = t.recoilAbsorbedT.J, W = (t.obj.m) * g * T;
  console.log('toss', style, 'v', t.v.toFixed(2), 'J', J.toFixed(0), 'T', T.toFixed(4), "Ollie's weight x push time", W.toFixed(0), 'share', (W / (J + W)).toFixed(3));
}
for (const th of [45, 90]) {
  const r = P.throwObject(c, objs('car'), th);
  const RBt = r.mB * g * Math.sin(th * Math.PI / 180) * r.push.t;
  console.log('car', th, 'J', r.recoilAbsorbed.J.toFixed(0), 'push t', r.push.t.toFixed(4), 'weight along line x t (object+arm)', RBt.toFixed(0), 'basis', r.basis || 'comic');
}
