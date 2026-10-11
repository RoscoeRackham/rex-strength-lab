global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = 9.80665;
function ctx(s) {
  const body = P.makeBody({ H: 2, m: 180 });
  const surface = D.surfaces.find((x) => x.id === 'concrete');
  return { F: Math.pow(10, s.logKg) * g, mode: s.mode, body, surface, groundHolds: false, anchor: 'friction' };
}
const def = { logKg: Math.log10(100*907.18474), mode:'comic' };
const r = P.throwObject(ctx(def), D.objects.find(o=>o.id==='car'), 45);
const perp = r.mB*g*Math.cos(Math.PI/4);
console.log('default car heldBack', r.heldBack, 'grip', r.gripRatio, 'basis', r.basis, 'handF ratio', Math.hypot(r.anchor.R*(1-1e-9), perp)/0.03/3e6);
const t0=Date.now();
const flips = {};
for (const mode of ['comic','real']) for (const L of [4,6,10,20,34]) for (const o of D.objects) {
  if (!o.crush) continue;
  let rr; try { rr = P.throwObject(ctx({logKg:L, mode}), o, 45); } catch(e){ continue; }
  if (!rr.canMove || !(rr.gripRatio > 1) || !rr.heldBack) continue;
  const perp = rr.mB*g*Math.cos(Math.PI/4);
  const ratio = Math.hypot(rr.anchor.R*(1-1e-9), perp)/(rr.hands*P.makeBody({H:2,m:180}).palmArea)/o.crush;
  if (ratio <= 1) (flips[o.id] = flips[o.id]||[]).push(mode+':'+L+':'+rr.gripRatio.toExponential(1)+'->'+ratio.toFixed(3));
}
console.log(flips, Date.now()-t0, 'ms');
