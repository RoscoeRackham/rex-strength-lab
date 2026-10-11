const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = global.window.DINO_DATA;
const body = P.makeBody({ H: 2, m: 180 });
const ctx = (lk) => ({ F: 10 ** lk * P.K.g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' });
const objs = D.objects.filter(o => !o.noThrow);
const T30 = 30 * 86400;
function bisect(pred, lo, hi, it = 50) { // pred false at lo, true at hi
  for (let i = 0; i < it; i++) { const m = (lo + hi) / 2; if (pred(m)) hi = m; else lo = m; }
  return hi;
}
let totalPts = 0, totalCombos = 0, stepcap = 0;
const rows = [];
for (const o of objs) {
  for (let ang = 0; ang <= 90; ang++) {
    totalCombos++;
    const fl = (lk) => P.throwObject(ctx(lk), o, ang).flight;
    // "leaves or is relativistic or long" predicate: monotone
    const far = (lk) => { const f = fl(lk); return f.escaped || f.relativistic || f.timedOut; };
    const gone = (lk) => { const f = fl(lk); return f.escaped || f.relativistic; };
    if (!far(34)) continue;
    const a = bisect(far, 1, 34), b = bisect(gone, 1, 34);
    // count grid points k/100 in [a, b)
    let n = 0, pts = [];
    for (let k = Math.ceil(a * 100 - 1e-9); k / 100 < b; k++) { const f = fl(k / 100); if (f.timedOut) { n++; pts.push(k / 100); } if (f.steps >= 3000000) stepcap++; }
    // also check the gone-boundary: is the outcome right after 'b' relativistic or escaped?
    const fb = fl(b + 1e-6);
    if (n) rows.push([o.id, ang, a.toFixed(4), b.toFixed(4), n, pts.slice(0, 3).join(','), fb.escaped ? 'esc' : 'rel']);
    totalPts += n;
  }
}
rows.forEach(r => console.log(r.join('\t')));
console.log('objects', objs.map(o => o.id).join(','), 'combos', totalCombos, 'timedOut slider points', totalPts, 'stepcap hits', stepcap);
