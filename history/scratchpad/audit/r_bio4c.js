const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({H:2,m:180});
const ctx = (mode, F, surf='concrete') => ({ F, mode, body, surface: D.surfaces.find(s=>s.id===surf), groundHolds:false, anchor:'friction' });
const obj = id => D.objects.find(o=>o.id===id);
let prev=null;
for (let lk = 2; lk <= 13; lk += 0.05) {
  const kg = 10**lk;
  const r = P.throwObject(ctx('real', kg*g), obj('car'), 45);
  const c = P.throwObject(ctx('comic', kg*g), obj('car'), 45);
  const s = `${r.canMove}/${c.canMove}`;
  if (s !== prev) { console.log('kg', kg.toExponential(3), 'real canMove', r.canMove, 'v', r.v.toFixed(3), 'stalled', r.push.stalled, 'sat', r.push.saturated, '| comic canMove', c.canMove, 'v', c.v.toFixed(3)); prev = s; }
}
// real threshold restricted to 1e3..1e6 kg
console.log('real thr', P.threshold(F => P.throwObject(ctx('real',F), obj('car'), 45).canMove, 1e3*g, 1e6*g)/g);
console.log('comic thr', P.threshold(F => P.throwObject(ctx('comic',F), obj('car'), 45).canMove, 1e3*g, 1e6*g)/g);
for (const id of ['bus','tank']) {
  console.log(id, 'real thr', (P.threshold(F => P.throwObject(ctx('real',F), obj(id), 45).canMove, 1e3*g, 1e8*g)/g).toFixed(0), 'comic thr', (P.threshold(F => P.throwObject(ctx('comic',F), obj(id), 45).canMove, 1e3*g, 1e8*g)/g).toFixed(0));
  const cross = P.threshold(F => { const a=P.throwObject(ctx('comic',F),obj(id),45), b=P.throwObject(ctx('real',F),obj(id),45); return a.canMove && a.v >= b.v; }, 1e4*g, 1e9*g);
  console.log(id, 'comic v >= real v above', (cross/g).toExponential(3), 'kg');
}
const cross = P.threshold(F => { const a=P.throwObject(ctx('comic',F),obj('car'),45), b=P.throwObject(ctx('real',F),obj('car'),45); return a.canMove && a.v >= b.v; }, 1e3*g, 1e8*g);
console.log('car comic v >= real v above', (cross/g).toExponential(3), 'kg');
