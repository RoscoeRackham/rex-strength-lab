global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA, g = P.K.g;
const conc = D.surfaces.find(s => s.id === 'concrete');
const b747 = D.objects.find(o => o.id === 'b747');
const body = P.makeBody({ H: 2, m: 180 });
const F = 511 * g;
for (const crr of [0.005, 0.001]) for (const deg of [0, 15, 20]) {
  const th = deg * Math.PI / 180;
  const a = P.anchorCapacity({ body, surface: conc, theta: th, anchor: 'friction' });
  const horiz = Math.min(F, a.R) * Math.cos(th);
  const resist = crr * b747.m * g;
  const net = horiz - resist;
  const acc = net > 0 ? net / (b747.m + body.m) : 0;
  console.log(`crr ${crr} rope ${deg}deg: axial R ${a.R.toFixed(0)} N, horizontal usable ${horiz.toFixed(0)} N (x${(horiz/(0.8*180*g)).toFixed(2)}), resist ${resist.toFixed(0)} N, moves ${net>0}, t10m ${net>0?Math.sqrt(20/acc).toFixed(0)+' s':'inf'}`);
}
// strength threshold for 747 at crr 0.005
console.log('lift kg needed to overcome crr 0.005 747 by strength:', (0.005*b747.m).toFixed(0));
