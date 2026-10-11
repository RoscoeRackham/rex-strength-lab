const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const g = P.K.g;
console.log('comicFrac / forceFrac per action:');
for (const k of ['throwPush','throwWhip','punch','clap','jump','stomp']) console.log(k.padEnd(10), 'comic', (P.MUSCLE[k].comicFrac*100).toFixed(2)+'%', ' real F0 share', (P.MUSCLE[k].forceFrac*100)+'%');
function ctx(mode, kg, surf='concrete') {
  return { F: kg*g, mode, body: P.makeBody({H:2,m:180}), surface: D.surfaces.find(s=>s.id===surf), groundHolds:false, anchor:'friction' };
}
const obj = id => D.objects.find(o=>o.id===id);
for (const kg of [511, 511*10, 9072, 90718, 1e6]) {
  console.log('\n=== strength', kg, 'kg');
  for (const mode of ['comic','real']) {
    const c = ctx(mode, kg);
    const shot = P.throwObject(c, obj('shot'), 37);
    const ball = P.throwObject(c, obj('baseball'), 0);
    const car = P.throwObject(c, obj('car'), 45);
    console.log(mode.padEnd(5), 'punch', P.punch(c).vFist.toFixed(3), 'clap', P.clap(c).vHand.toFixed(3),
      'jump', P.jump(c).v.toFixed(3), 'stomp', P.stomp(c).vFoot.toFixed(3),
      'shot', shot.v.toFixed(3), '->', shot.flight.range.toFixed(2), 'm',
      'pitch', ball.v.toFixed(3), 'car canMove', car.canMove, car.v.toFixed(3));
  }
}
