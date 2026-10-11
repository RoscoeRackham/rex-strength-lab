const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = global.window.DINO_DATA;
const body = P.makeBody({ H: 2, m: 180 });
function bisect(pred, lo, hi, it = 50) { for (let i = 0; i < it; i++) { const m = (lo + hi) / 2; if (pred(m)) hi = m; else lo = m; } return hi; }
for (const surf of D.surfaces.map(s => s.id)) for (const gh of [false, true]) {
  const ctx = (lk) => ({ F: 10 ** lk * P.K.g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === surf), groundHolds: gh, anchor: 'friction' });
  for (const [nm, fn] of [['jump', (lk) => P.jump(ctx(lk)).flight], ['stomp', (lk) => P.stomp(ctx(lk)).bodyFlight]]) {
    const far = (lk) => { const f = fn(lk); return f.escaped || f.relativistic || f.timedOut; };
    const gone = (lk) => { const f = fn(lk); return f.escaped || f.relativistic; };
    if (!far(34)) { console.log(nm, surf, gh, 'never leaves'); continue; }
    const a = bisect(far, 1, 34), b = bisect(gone, 1, 34);
    let pts = [];
    for (let k = Math.ceil(a * 100 - 1e-9); k / 100 < b; k++) { const f = fn(k / 100); if (f.timedOut) pts.push(k / 100); }
    console.log(nm, surf, 'groundHolds', gh, 'band', a.toFixed(4), b.toFixed(4), 'slider pts', pts.join(','));
  }
}
