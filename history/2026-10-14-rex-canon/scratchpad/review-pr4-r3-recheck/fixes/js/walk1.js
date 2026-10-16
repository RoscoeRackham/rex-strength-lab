const { P, D, g, R3, O3, surf, mk } = require('./eng.js')(process.argv[2]);
const f = (x) => (x == null ? '-' : typeof x === 'number' ? Number(x.toPrecision(5)) : x);
const at = (kg, oKg, extra, oextra) => P.pushMatch(mk(Object.assign({ F: kg * g }, extra || {})), mk(Object.assign({ F: (oKg || kg) * g, body: O3 }, oextra || {})));
const endOf = (r) => r.outcome === 'walkOut' ? r.endL : r.outcome === 'shovedOff' ? (r.winner === 'A' ? r.xB + r.slideB : r.xA + r.slideA) : r.outcome === 'bothShoved' ? Math.max(r.xA + r.slideA, r.xB + r.slideB) : 0;
for (const kg of [2571.5, 2800, 2999, 3001, 3100, 3200, 3300, 3310, 3400, 3544, 3500, 4000, 10000, 90718.474]) {
  const r = at(kg, 1000);
  console.log(kg, r.outcome, 'v', f(r.v), 'vCap', f(r.vCap), 'x', f(r.x), 'slideL', f(r.slideL), 'endL', f(r.endL), 'end', f(endOf(r)), 'walkPush', f(r.walkPush), 'HB', f(r.HB), 'DB', f(r.DB), 'aL', f(r.aLoser), 'aW', f(r.aFeet), 'J', f(r.recoilAbsorbedA && r.recoilAbsorbedA.J), 'ring', f(r.ring));
}
// 5 m point over the walk-out
let lo = 3000.0001, hi = 90718; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (endOf(at(m, 1000)) > 5) hi = m; else lo = m; }
console.log('end=5 m at', f(lo));
// harm function: is it monotone? scan
let prev = null; const pts = [];
for (let lg = Math.log10(2571.43); lg <= Math.log10(90718.474); lg += 0.002) { const kg = Math.pow(10, lg); const e = endOf(at(kg, 1000)); pts.push([kg, e]); }
const over = pts.filter(([k, e]) => e > 5); console.log('first >5 m at', f(over[0] && over[0][0]), 'end', f(over[0] && over[0][1]));
const below = pts.filter(([k, e], i) => i > 0 && e <= 5 && pts.slice(0, i).some(([k2, e2]) => e2 > 5)); console.log('non-monotone points (<=5 after >5):', below.length, below.slice(0, 3).map(([k, e]) => f(k) + ':' + f(e)).join(' '));
// the slide check: slideL vs slideStop with the loser's footing
const r2 = at(90718.474, 1000);
const k = 0.5 * P.K.rho0 * O3.Cd * O3.frontArea; const sl = O3.m / (2 * k) * Math.log1p(k * r2.v * r2.v / r2.holdB);
console.log('w2 slideL', f(r2.slideL), 'own formula', f(sl), 'holdB', f(r2.holdB), 'HB', f(r2.HB), 'RB?', f(r2.RB));
// power off
const r0 = at(90718.474, 1000, { ownRecoil: false }, { ownRecoil: false }); console.log('off', r0.outcome, 'slideL' in r0, 'endL' in r0);
