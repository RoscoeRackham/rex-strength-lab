global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const pullable = D.objects.filter(o => !o.noPull);
const tally = { capsMoving: 0, capsStatic: 0, loadTakesBinds: 0, loadTakesFree: 0 };
let ex = [];
for (const m of [3007, 3e5, 3e7, 3e9, 3e12]) for (const s of D.surfaces) for (const o of pullable) for (const lk of [6, 10, 14, 20, 30]) {
  const body = P.makeBody({ build: 'rex', H: 3.048, m });
  const ctx = { F: Math.pow(10, lk) * P.K.g, mode: 'comic', body, surface: s, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: false };
  const r = P.pull(ctx, o);
  const rope = r.canMove ? o.m * r.accel + r.resist : 0;
  const caps = !r.canMove || rope >= r.anchor.R * (1 - 1e-6);
  const binds = r.usable >= r.anchor.R * (1 - 1e-9);
  if (caps) { if (r.canMove) { tally.capsMoving++; ex.push([m, s.id, o.id, lk]); } else tally.capsStatic++; }
  else if (binds) tally.loadTakesBinds++; else tally.loadTakesFree++;
}
console.log(tally, ex.slice(0, 5));
