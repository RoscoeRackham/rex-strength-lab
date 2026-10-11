global.window = {};
const A = require('/home/user/dino-strength-sim/src/engine.js');
const B = require('./eng-final.js');
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA; const g = A.K.g;
let tA = 0, tB = 0, worstA = 0, worstB = 0, maxRel = 0, where = '', n = 0, diffCanMove = 0;
const objs = D.objects.filter(o => !o.noThrow).map(o => o.id);
const step = Number(process.argv[2] || 0.5);
for (const mode of ['real', 'comic']) for (const id of objs) for (const ang of [10, 45, 89]) for (const surf of ['concrete', 'sand']) for (let lg = 1; lg <= 20; lg += step) {
  const mk = (P) => ({ F: Math.pow(10, lg) * g, mode, body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === surf), groundHolds: false, anchor: 'friction' });
  const o = D.objects.find(x => x.id === id);
  let t = process.hrtime.bigint(); const ra = A.throwObject(mk(A), o, ang); const da = Number(process.hrtime.bigint() - t) / 1e6;
  t = process.hrtime.bigint(); const rb = B.throwObject(mk(B), o, ang); const db = Number(process.hrtime.bigint() - t) / 1e6;
  tA += da; tB += db; worstA = Math.max(worstA, da); worstB = Math.max(worstB, db); n++;
  if (ra.canMove !== rb.canMove) diffCanMove++;
  for (const k of ['v', 'recoilV', 'Eobj']) {
    const a = ra[k], b = rb[k];
    if (a === b) continue;
    const rel = Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
    if (rel > maxRel) { maxRel = rel; where = [mode, id, ang, surf, lg.toFixed(2), k, a, b].join(' '); }
  }
  const fa = ra.flight && ra.flight.range, fb = rb.flight && rb.flight.range;
  if (fa !== fb && fa > 0) { const rel = Math.abs(fa - fb) / fa; if (rel > maxRel) { maxRel = rel; where = [mode, id, ang, surf, lg.toFixed(2), 'range', fa, fb].join(' '); } }
}
console.log('states', n, 'cur total', tA.toFixed(0), 'ms worst', worstA.toFixed(1), '| fast total', tB.toFixed(0), 'ms worst', worstB.toFixed(1), '| canMove diffs', diffCanMove, '| max rel diff', maxRel.toExponential(2), where);
