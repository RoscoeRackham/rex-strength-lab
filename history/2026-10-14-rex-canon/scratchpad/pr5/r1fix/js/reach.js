const { P, D, g, R3, O3, c9, obj, PE, sig, TB, duo } = require('./common.js');
const t0 = Date.now();
// 04: an overshooting leg past 1% of light speed
let found04 = [];
for (const id of ['baseball', 'car', 'person']) for (let e = 8; e <= 20 && found04.length < 3; e += 0.25) for (const D0 of [1e3, 1e4, 1e5, 1e6, 3e6, 1e7]) for (const air of [1, 0.5, 0]) {
  const c = c9(Math.pow(10, e) * g, R3, { airAbsorb: air }), co = c9(Math.pow(10, e) * g, O3, { airAbsorb: air });
  let L; try { L = P.catchLeg(c, co, obj(id), D0, 'hard'); } catch (x) { continue; }
  if (L.result === 'overshoots' && (L.relativistic || L.vL >= P.CATCH.V_FIREBALL)) { found04.push([id, e, D0, air, L.vL]); break; }
}
console.log('04', JSON.stringify(found04), (Date.now() - t0) / 1000);
// 07: a missed person who flies on and leaves
let found07 = [];
for (let e = 4; e <= 20 && found07.length < 3; e += 0.5) for (const D0 of [10, 100, 1e3, 1e4, 3.16e4]) for (const st of ['hard', 'easy']) for (const air of [1, 0.5]) {
  const c = c9(Math.pow(10, e) * g, R3, { airAbsorb: air }), co = c9(Math.pow(10, e) * g, O3, { airAbsorb: air });
  let L; try { L = P.catchLeg(c, co, obj('person'), D0, st); } catch (x) { continue; }
  if (['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(L.result) && L.miss && L.miss.leaves && !L.miss.hits) { found07.push([e, D0, st, air, L.result, sig(L.miss.E)]); }
}
console.log('07', JSON.stringify(found07.slice(0, 5)), (Date.now() - t0) / 1000);
