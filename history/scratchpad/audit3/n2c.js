global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = 9.80665;
function ctx(s) {
  const body = P.makeBody({ H: 2, m: 180 });
  const surface = D.surfaces.find((x) => x.id === (s.surface||'concrete'));
  return { F: s.inf ? Infinity : Math.pow(10, s.logKg) * g, mode: s.mode, body, surface, groundHolds: !!s.groundHolds, anchor: s.anchor||'friction' };
}
const flips = {}; let total=0;
for (const mode of ['comic','real']) for (const surf of D.surfaces.map(s=>s.id)) for (const anchor of ['friction','claws']) for (let L=2.7; L<=40; L+=0.5) for (const ang of [15,30,45,60,75]) for (const o of D.objects) {
  if (!o.crush || o.throwable === false) continue;
  const c = ctx({logKg:L, mode, surface:surf, anchor});
  let r; try { r = P.throwObject(c, o, ang); } catch(e){ continue; }
  if (!r.canMove || !(r.gripRatio > 1)) continue;
  const th = ang*Math.PI/180; const perp = r.mB*g*Math.cos(th);
  // reconstruct Fused: if heldBack, Rlim
  if (!r.heldBack) continue;
  const handF = Math.hypot(r.anchor.R, perp);
  const ratio = handF / (r.hands*c.body.palmArea) / o.crush;
  total++;
  if (ratio <= 1) { flips[o.id] = (flips[o.id]||0)+1; }
}
console.log('heldBack & gripRatio>1 cases:', total, 'flip to holds:', flips);
// default state
const def = { logKg: Math.log10(100*907.18474), mode:'comic' };
const r = P.throwObject(ctx(def), D.objects.find(o=>o.id==='car'), 45);
console.log('default car', r.heldBack, r.gripRatio, r.basis);
