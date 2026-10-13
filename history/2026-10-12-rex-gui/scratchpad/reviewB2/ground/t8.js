const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
for (const [share, kg, oid, Dd, style] of [[0.5, 1e20, 'baseball', 1000, 'hard'], [0, 1e20, 'baseball', 1000, 'hard'], [0.5, 1e12, 'car', 30, 'hard'], [1, 1e12, 'car', 30, 'hard'], [0.9, 1e15, 'car', 1000, 'hard'], [0.5, 1e9,'car', 1e5, 'hard']]) {
  const cR = Object.assign(ctx({ F: kg*K.g }), ON, { airAbsorb: share }), cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, obj(oid), Dd, style);
  const t = P.throwObject(cR, obj(oid), L.thetaDeg != null ? L.thetaDeg : (L.aim ? L.aim.thetaDeg : 0));
  console.log(share, kg.toExponential(0), oid, Dd, style, '->', L.result, 'toGroundT', L.toGroundT ? L.toGroundT.J.toExponential(2) : 'none', 'Throw tab same throw toGround J', t.toGround ? t.toGround.J.toExponential(2) : 'none', 'v', (L.vL||0).toExponential(2));
}
