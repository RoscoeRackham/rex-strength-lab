global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const car = D.objects.find(o => o.id === 'car');
const E = 7.32e15;
for (const k of [1, 0.5, 0.1]) {
  const fa = P.fastAir(car, E, 0, k);
  const keepAt = d => 1 - P.fastAirWithin(car, E, 0, k, d) / E;
  console.log(`k (drag share acting)=${k} absorbed=${(1-k).toFixed(1)} dHalf=${fa.dHalf.toFixed(1)} m`,
    `| energy left at dHalf=${keepAt(fa.dHalf).toFixed(3)}`,
    `| at dHalf/absorbed(${(fa.dHalf/(1-k||NaN)).toFixed(0)} m)=${keepAt(fa.dHalf/(1-k)).toFixed(3)}`,
    `| at dHalf/k(${(fa.dHalf/k).toFixed(0)} m)=${keepAt(fa.dHalf/k).toFixed(3)}`);
}
