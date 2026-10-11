global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const c0 = 299792458, g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find(s=>s.id==='concrete');
const band = {};
for (let L = 15; L <= 30; L += 0.01) {
  const c = { F: Math.pow(10, L) * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' };
  const vals = { punch: P.punch(c).vFist, clap: P.clap(c).vHand, jump: P.jump(c).v, stompFoot: P.stomp(c).vFoot, stompBody: P.stomp(c).vBody };
  for (const k in vals) { const x = 1 - vals[k]/c0; if (x > 1e-12 && x < 5e-9) { band[k] = band[k] || [L, L]; band[k][1] = L; } }
}
console.log(Object.fromEntries(Object.entries(band).map(([k,[a,b]])=>[k, `log10 kg ${a.toFixed(2)}..${b.toFixed(2)}`])));
// test proposed fixes
function sig(x, n) { const d = Math.floor(Math.log10(Math.abs(x))); const p = Math.pow(10, n - 1 - d); const r = Math.round(x * p) / p; return r.toLocaleString('en-US', { maximumFractionDigits: Math.max(0, n - 1 - d) }); }
const fixA = (b) => { const s = sig(b * 100, 8); return (s === '100' ? '99.999999' : s) + '%'; };
const fixB = (b) => { const s = sig(b*100, 8); if (parseFloat(s.replace(/,/g,'')) >= 100) return '99.' + '9'.repeat(Math.max(1, Math.floor(-Math.log10(1-b)) - 2)) + '%'; return s + '%'; };
for (const x of [0.0005, 1e-4, 3.2e-8, 5.0e-9, 4.9e-9, 5.77e-10, 4.4e-11, 1.62e-11, 1.1e-12]) { const b = 1 - x; console.log(x, 'current', sig(b*100,8).replace(/0+$/, '') + '%', 'fixA', fixA(b), 'fixB', fixB(b)); }
