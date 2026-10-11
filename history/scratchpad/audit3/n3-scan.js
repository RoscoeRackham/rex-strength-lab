global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({});
// default state
{
  const c = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find(s=>s.id==='concrete'), groundHolds: false, anchor: 'friction' };
  const r = P.throwObject(c, D.objects.find(o=>o.id==='car'), 45);
  console.log('default', r.heldBack, r.gripRatio, r.anchor.R, r.basis);
}
let total = 0, hb = 0, wrong = 0; const ex = {};
for (const mode of ['comic','real']) for (const anchor of ['friction','braced']) for (const s of D.surfaces) for (const gh of [false, true])
for (const o of D.objects.filter(o=>o.crush)) for (const ang of [0, 15, 30, 45, 60, 75]) for (let lg = 2.7; lg <= 34; lg += 0.5) {
  const c = { F: Math.pow(10, lg) * g, mode, body, surface: s, groundHolds: gh, anchor };
  const r = P.throwObject(c, o, ang); total++;
  if (!r.canMove || !r.heldBack) continue; hb++;
  const perp = r.mB * g * Math.cos(ang*Math.PI/180);
  const trueRatio = Math.hypot(r.anchor.R, perp) / (r.hands * body.palmArea) / o.crush;
  if (r.gripRatio > 1 && trueRatio <= 1) { wrong++; const k = mode+'/'+o.id; ex[k] = (ex[k]||0)+1; }
}
console.log({ total, hb, wrongChip: wrong }, ex);
console.log('objects with crush:', D.objects.filter(o=>o.crush).map(o=>o.id+':'+o.crush+':'+o.m).join(' '));
