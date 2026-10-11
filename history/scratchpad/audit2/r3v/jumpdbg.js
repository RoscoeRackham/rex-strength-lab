global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require(process.argv[2]);
const g = 9.80665;
const body = P.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'granite');
for (const lk of [8, 10, 12, 14, 16, 17]) {
  const c = { F: Math.pow(10, lk) * g, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' };
  const j = P.jump(c);
  const p = j.push;
  console.log(lk, 'Fj', (c.F*1.4).toExponential(2), 'RB', j.groundLimitForce.toExponential(3), 'heldBack', j.heldBack, 'groundFails', j.groundFails, 'vA', p.vA.toFixed(3), 'vB', p.vB.toExponential(3), 'xB', p.xB.toExponential(3), 'v', j.v.toFixed(3), 'Eground', j.Eground.toExponential(2));
}
