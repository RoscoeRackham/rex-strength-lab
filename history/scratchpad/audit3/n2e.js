global.window = {};
const A = require('/home/user/dino-strength-sim/src/engine.js');
const B = require('./engine-n2.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = 9.80665;
function ctx(P, L, mode) { return { F: Math.pow(10, L) * g, mode, body: P.makeBody({H:2,m:180}), surface: D.surfaces.find(x=>x.id==='concrete'), groundHolds:false, anchor:'friction' }; }
let diffNonHeld = 0, n=0;
for (const mode of ['comic','real']) for (const L of [2.8,3.5,4,4.96,6,10,34]) for (const ang of [30,45,60]) for (const o of D.objects) {
  if (!o.crush) continue;
  const a = A.throwObject(ctx(A,L,mode), o, ang), b = B.throwObject(ctx(B,L,mode), o, ang);
  n++;
  if (a.canMove && !a.heldBack && Math.abs(a.gripRatio - b.gripRatio) > 1e-9*Math.max(1,a.gripRatio)) { diffNonHeld++; if (diffNonHeld<6) console.log('nonheld diff', mode, L, ang, o.id, a.gripRatio, b.gripRatio, a.basis); }
  if (a.v !== b.v) console.log('v changed!', o.id);
}
console.log('cases', n, 'non-heldBack gripRatio changes', diffNonHeld);
const c1 = B.throwObject(ctx(B,4,'comic'), D.objects.find(o=>o.id==='car'), 45);
const c2 = B.throwObject(ctx(B,34,'real'), D.objects.find(o=>o.id==='tank'), 30);
console.log('car fixed', c1.gripRatio, c1.plateNeeded, 'tank fixed', c2.gripRatio, c2.plateNeeded);
