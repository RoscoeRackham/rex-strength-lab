const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const D = (function(){ const window = {}; eval(require('fs').readFileSync('/home/user/dino-strength-sim/src/data.js','utf8')); return window.DINO_DATA; })();
const surf = D.surfaces.find(s => s.id === 'concrete');
const body = P.makeBody({});
const ctx = (kg, mode) => ({ F: kg * g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' });
const obj = (id) => D.objects.find(o => o.id === id);
const hits = [];
for (const id of ['tank', 'b747', 'bus', 'car', 'shot']) {
  for (const th of [30, 45, 60, 90]) {
    // find transition region: kg where outcome changes from landing to escaped
    const esc = (lk) => { const r = P.throwObject(ctx(10 ** lk, 'comic'), obj(id), th); return r.flight.escaped || r.flight.relativistic; };
    let lo = 1, hi = 34;
    if (!esc(hi)) continue;
    for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (esc(mid)) hi = mid; else lo = mid; }
    // scan slider grid points near transition
    const base = Math.round(hi * 100) / 100;
    for (let k = -5; k <= 5; k++) {
      const lk = +(base + k * 0.01).toFixed(2);
      const r = P.throwObject(ctx(10 ** lk, 'comic'), obj(id), th);
      if (r.flight.timedOut) hits.push({ id, th, lk, v: r.v, range: r.flight.range, apex: r.flight.apex, time: r.flight.time });
    }
    console.log(id, th, 'escape transition logKg', hi.toFixed(5));
  }
}
console.log('slider-grid timedOut hits:', hits.length);
for (const h of hits) console.log(JSON.stringify(h));
