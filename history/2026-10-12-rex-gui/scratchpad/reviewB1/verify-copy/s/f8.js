const { P, D, ctx } = require('./env');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const ball = D.objects.find(o => o.id === 'baseball');
const g = P.K.g;
for (const share of [1, 0.5, 0]) {
  const cR = ctx(1e5, { airAbsorb: share }), cO = ctx(1e5, { airAbsorb: share, body: ollie });
  const L = P.catchLeg(cR, cO, ball, 10, 'easy');
  const dh = L.hStop - L.h0, Dl = L.Dfl; const vv = Math.sqrt(g * (dh + Math.hypot(Dl, dh)));
  console.log('share', share, 'vL', L.aim.vL.toFixed(4), 'vv', vv.toFixed(4), 'pct', (100 * (L.aim.vL / vv - 1)).toFixed(4), 'theta', L.aim.thetaDeg.toFixed(3));
}
