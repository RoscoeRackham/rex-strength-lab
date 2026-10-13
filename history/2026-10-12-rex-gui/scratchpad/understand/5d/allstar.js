global.window = {};
const P = require(process.argv[2] || './engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g, c = P.K.c;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ball = obj('baseball');
console.log('ball', JSON.stringify(ball));
console.log('surfaces', D.surfaces.map(s=>s.id).join(','));
for (const sid of ['concrete','ice','granite','sand']) for (const anchor of ['friction','bolted']) {
  const ctx = { F: 1.8e23 * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor };
  const r = P.throwObject(ctx, ball, 0);
  console.log(sid, anchor, 'basis', r.basis||'comic', 'v/c', r.v / c, '1-v/c', 1 - r.v/c, 'recoilV/c', r.recoilV / c, 'recoilE', r.recoilE.toExponential(4), 'Eobj', r.Eobj.toExponential(4), 'pA', r.push.pA.toExponential(4), 'pB', r.push.pB.toExponential(4), 't', r.push.t.toExponential(4), 'xA', r.push.xA, 'xB', r.push.xB, 'F', r.F.toExponential(4), 'R', r.anchor.R.toExponential(3), 'heldBack', r.heldBack, 'flight.rel', r.flight.relativistic, 'sinkRatio', r.sinkRatio);
}
// groundHolds too
{ const ctx = { F: 1.8e23 * g, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: true, anchor: 'friction' };
  const r = P.throwObject(ctx, ball, 0); console.log('concrete groundHolds friction recoilV/c', r.recoilV/c, 'v/c', r.v/c, 'R', r.anchor.R); }
