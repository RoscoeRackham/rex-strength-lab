global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({});
let total = 0, hb = 0, wrong = 0, over10 = 0; const ex = {};
const objs = D.objects.filter(o=>o.crush);
for (const mode of ['comic','real']) for (const anchor of ['friction','braced']) for (const sid of ['concrete'])
for (const o of objs) for (const ang of [30, 45]) for (let lg = 3; lg <= 12; lg += 1) {
  const c = { F: Math.pow(10, lg) * g, mode, body, surface: D.surfaces.find(s=>s.id===sid), groundHolds: false, anchor };
  const r = P.throwObject(c, o, ang); total++;
  if (!r.canMove || !r.heldBack) continue; hb++;
  const perp = r.mB * g * Math.cos(ang*Math.PI/180);
  const trueRatio = Math.hypot(r.anchor.R, perp) / (r.hands * body.palmArea) / o.crush;
  if (r.gripRatio > 1 && trueRatio <= 1) { wrong++; const k = mode+'/'+o.id; ex[k] = (ex[k]||0)+1; }
  if (r.gripRatio > 10 * Math.max(trueRatio,1)) over10++;
}
console.log({ total, hb, wrongChip: wrong, overstated10x: over10 }, ex);
console.log('objects with crush:', objs.map(o=>o.id+':'+o.crush+':'+o.m).join(' '));
