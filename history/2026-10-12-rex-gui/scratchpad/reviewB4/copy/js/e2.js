const P = require('../lab/src/engine.js'); global.window = {}; require('../lab/src/data.js'); const D = window.DINO_DATA;
const o = (id) => D.objects.find((x) => x.id === id);
const c = P.K.c;
const pyr = o('pyramid'), base = o('baseball');
for (const [ob, v, ang] of [[pyr, 0.0101 * c, 90], [pyr, 0.0101 * c, 0], [pyr, 0.0101 * c, 45]]) {
  const g = 1 / Math.sqrt(1 - (v / c) ** 2), E = (g - 1) * ob.m * c * c;
  const a0 = P.fastAir(ob, E, ang, 1), a5 = P.fastAir(ob, E, ang, 0.5);
  console.log(ob.id, ang, 'x', a0.x, 'E0', a0.Eair / E, 'E50', a5.Eair / E, 'ratio', a5.Eair / a0.Eair);
}
// allstar baseball
const E = 6.5e21; const a0 = P.fastAir(base, E, 0, 1), a5 = P.fastAir(base, E, 0, 0.5);
console.log('allstar x', a0.x, a5.Eair / E, 1 - a5.Eair / E);
