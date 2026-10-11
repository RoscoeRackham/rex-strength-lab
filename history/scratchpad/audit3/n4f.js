global.window = {};
const A = require('/home/user/dino-strength-sim/src/engine.js');
delete require.cache[require.resolve('/home/user/dino-strength-sim/src/engine.js')];
const B = require('./engine_fix.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = A.K.g;
const body = A.makeBody({});
const rows = [];
let diff = 0, tot = 0;
const lgs = [2.71, 3, 3.5, 4, 4.5, 5, 5.2, 5.5, 6, 7, 8, 9, 12, 15, 20, Infinity];
for (const mode of ['real', 'comic']) for (const sid of ['concrete', 'sand']) for (const o of D.objects.filter((x) => !x.noThrow)) for (const ang of [0, 2, 15, 30, 45, 60, 89]) for (const lg of lgs) {
  const surface = D.surfaces.find((s) => s.id === sid);
  if (!surface) continue;
  const F = lg === Infinity ? Infinity : Math.pow(10, lg) * g;
  const c = { F, mode, body, surface, groundHolds: false, anchor: 'friction' };
  let a, b;
  try { a = A.throwObject(c, o, ang); b = B.throwObject(c, o, ang); } catch (e) { continue; }
  if (!a.canMove) continue;
  tot++;
  const sa = a.sinkRatio > 1, sb = b.sinkRatio > 1;
  if (sa !== sb) { diff++; rows.push([mode, sid, o.id, o.m, ang, lg, a.sinkRatio.toPrecision(3), b.sinkRatio.toPrecision(3), a.v.toPrecision(4), a.heldBack, (a.basis||'')].join(' ')); }
}
console.log('total', tot, 'flagged differently', diff);
const byObj = {};
for (const r of rows) { const k = r.split(' ').slice(0, 4).join(' '); byObj[k] = (byObj[k] || 0) + 1; }
console.log(byObj);
console.log(rows.filter(r => !/baseball/.test(r)).slice(0, 40).join('\n'));
