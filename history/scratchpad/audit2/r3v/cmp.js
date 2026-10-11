global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const PB = require(process.argv[2]), PC = require(process.argv[3]);
const g = 9.80665;
const obj = (id) => D.objects.find((o) => o.id === id);
let worst = { rel: 0 };
for (const H of [0.4, 2, 50]) for (const surf of D.surfaces.map(s=>s.id)) for (const anchor of ['friction','braced','bolted']) for (const gh of [false, true]) for (let lk = 2; lk <= 34; lk += 2) {
  const mk = (P) => ({ F: Math.pow(10, lk) * g, mode: 'real', body: P.makeBody({ H, m: 180 * Math.pow(H/2, 3) }), surface: D.surfaces.find((x) => x.id === surf), groundHolds: gh, anchor });
  const fns = {
    punch: (P) => { const r = P.punch(mk(P)); return [r.vFist, r.recoilV, r.E]; },
    ball: (P) => { const r = P.throwObject(mk(P), obj('baseball'), 45); return [r.v, r.recoilV, r.flight ? r.flight.range : 0]; },
    car: (P) => { const r = P.throwObject(mk(P), obj('car'), 45); return [r.v, r.recoilV]; },
    jump: (P) => { const r = P.jump(mk(P)); return [r.v]; },
    stomp: (P) => { const r = P.stomp(mk(P)); return [r.vFoot, r.vBody, r.E]; },
  };
  for (const [k, fn] of Object.entries(fns)) {
    const a = fn(PB), b = fn(PC);
    a.forEach((x, i) => { const y = b[i]; const rel = Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-9); if (rel > worst.rel) worst = { rel, k, i, x, y, H, surf, anchor, gh, lk }; });
  }
}
console.log(JSON.stringify(worst));
