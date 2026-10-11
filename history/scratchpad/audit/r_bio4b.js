const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({H:2,m:180});
const ctx = (mode, F, surf='concrete') => ({ F, mode, body, surface: D.surfaces.find(s=>s.id===surf), groundHolds:false, anchor:'friction' });
const obj = id => D.objects.find(o=>o.id===id);
for (const id of ['car','bus','tank']) {
  for (const ang of [45, 0]) {
    const tReal = P.threshold(F => P.throwObject(ctx('real',F), obj(id), ang).canMove);
    const tComic = P.threshold(F => P.throwObject(ctx('comic',F), obj(id), ang).canMove);
    // crossover where comic speed >= real speed
    const cross = P.threshold(F => { const a=P.throwObject(ctx('comic',F),obj(id),ang), b=P.throwObject(ctx('real',F),obj(id),ang); return a.canMove && a.v >= b.v; }, Math.max(tReal,1e2));
    console.log(id, 'angle', ang, 'min strength to throw (kg): real', (tReal/g).toFixed(0), 'comic', (tComic/g).toFixed(0), 'ratio', (tComic/tReal).toFixed(2), '| comic speed >= real above', (cross/g).toFixed(0), 'kg');
  }
}
// sample "can't throw" panel numbers at 5110 kg, car 45 deg comic
const r = P.throwObject(ctx('comic', 5110*g), obj('car'), 45);
const rr = P.throwObject(ctx('real', 5110*g), obj('car'), 45);
console.log('5110 kg, car 45: comic canMove', r.canMove, 'F', r.F.toFixed(0), 'N =', (P.MUSCLE.throwPush.comicFrac*100).toFixed(1)+'% ; real canMove', rr.canMove, 'v', rr.v.toFixed(2), 'F0', rr.F.toFixed(0));
console.log('need RB', ((1360+2*body.handEff)*g*Math.sin(Math.PI/4)).toFixed(0), 'UI need (1 hand)', ((1360+body.handEff)*g*Math.sin(Math.PI/4)).toFixed(0));
// Hill force at zero speed vs comic force: real F at v=0 = forceFrac*F
for (const k of ['throwPush','throwWhip','punch','clap','jump','stomp']) console.log(k, 'comic/realF0 at v=0 =', (P.MUSCLE[k].comicFrac/P.MUSCLE[k].forceFrac).toFixed(3));
