global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P1 = require('./engine_m9fix.js');
const g = 9.80665; let diffs=0, n=0;
for (const s of D.surfaces) for (const gh of [true,false]) for (const mode of ['comic','real']) for (let lk=0; lk<=34; lk+=0.5) for (const inf of [false,true]) {
  const mk = () => ({ F: inf?Infinity:Math.pow(10,lk)*g, mode, body: P0.makeBody({H:2,m:180}), surface: s, groundHolds: gh, anchor:'friction' });
  const a = P0.stomp(mk()), b = P1.stomp(mk()); n++;
  const same = JSON.stringify(a)===JSON.stringify(b);
  if (!gh && !same) { console.log('UNEXPECTED diff on breakable ground', s.id, lk); }
  if (gh && b.crater!==0) console.log('crater remains on comic ground', s.id, lk, inf);
  if (gh && b.holeDepth!==0) console.log('hole on comic ground', s.id, lk);
  if (!same) diffs++;
}
console.log('cases', n, 'changed (all comic ground)', diffs);
