const { P, g, ctx, obj, surf } = require('./lib.js');
const body = P.makeBody({ H: 50 });
const s = surf('sand');
console.log('kaiju weight', (body.m * g).toExponential(3), 'N vs sand bearing 2*foot', (s.qult * 2 * body.footArea).toExponential(3), 'N');
for (const deg of [0, 0.01, 1, 10, 45]) {
  const a = P.anchorCapacity({ body, surface: s, theta: deg * Math.PI / 180, anchor: 'friction' });
  console.log('theta', deg, 'deg -> R', a.R.toExponential(3), 'limit', a.limit);
}
// human-size dino holding the Moon (throw at 0 vs 1 deg)
const b2 = P.makeBody({});
for (const deg of [0, 1]) {
  const a = P.anchorCapacity({ body: b2, surface: surf('concrete'), theta: deg * Math.PI / 180, anchor: 'friction', extraMass: 7.342e22 });
  console.log('2 m dino holding the Moon on concrete, theta', deg, '-> anchor R', a.R.toExponential(3), a.limit);
}
