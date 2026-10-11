global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const kind = (ratio) => ratio <= 1 ? 'holds' : 'fails';
let bad = 0, badPct = 0, n = 0;
for (const mode of ['comic', 'real']) for (const s of D.surfaces) for (let lk = 1; lk < 12; lk += 0.01) {
  const c = { F: Math.pow(10, lk) * g, mode, body, surface: s, groundHolds: false, anchor: 'friction' };
  const r = P.jump(c);
  const oldR = r.groundFails ? c.F / r.groundLimitForce : c.F / Math.max(r.groundLimitForce, 1);
  const newR = r.F / r.groundLimitForce;
  n++;
  if ((kind(oldR) === 'fails') !== r.groundFails) bad++;
  if ((kind(newR) === 'fails') !== r.groundFails) console.log('FIX MISMATCH', mode, s.id, lk);
  if (Math.abs(oldR / newR - 1) > 0.01) badPct++;
}
console.log('cases', n, 'old chip verdict contradicts groundFails:', bad, '| old chip ratio off by >1%:', badPct, '| fixed chip mismatches: see above (none if blank)');
// example of the % being wrong while holding
const s = D.surfaces.find((x) => x.id === 'concrete');
const c = { F: 0.95 * 9e5, mode: 'comic', body, surface: s, groundHolds: false };
const r = P.jump(c);
console.log('concrete c.F/RB 0.95 comic: old chip', (c.F / r.groundLimitForce * 100).toFixed(0) + '% of limit', 'true', (r.F / r.groundLimitForce * 100).toFixed(0) + '%');
const c2 = { F: 2 * 9e5, mode: 'comic', body, surface: s, groundHolds: false };
const r2 = P.jump(c2);
console.log('concrete c.F/RB 2 comic: old chip', (c2.F / r2.groundLimitForce).toFixed(2) + 'x', 'true', (r2.F / r2.groundLimitForce).toFixed(2) + 'x');
