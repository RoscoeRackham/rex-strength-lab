global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({ H: 50 });
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const mode of ['comic', 'real']) {
  const c = { F: 90718.474 * g, mode, body, surface, groundHolds: false, anchor: 'friction' };
  const car = D.objects.find(o => o.id === 'car');
  let any = false;
  for (let a = 0; a <= 90; a++) { const t = P.throwObject(c, car, a); if (t.canMove) any = true; }
  const t = P.throwObject(c, car, 45);
  console.log(mode, 'any angle throws car:', any, 'armMass', t.armMass, 'Fdrive', t.Fdrive, 'arm weight N', t.armMass * g);
}
