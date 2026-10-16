const h = require('./h.js'); const { P, TB, PE } = h;
const PART = ['drag', 'footing', 'soft', 'silent', 'hit', 'stop', 'passenger', 'catch', 'growth'];
let n = 0; const bad = [], res = {}; const t0 = Date.now();
for (const id of ['baseball', 'car', 'person', 'bowling']) for (const D0 of [10, 300, 1e4, 3e5]) for (const st of ['easy', 'hard']) for (const e of [5, 8, 11, 14, 17]) for (const x of [{}, { airAbsorb: 0.5 }, { keepForm: false, airAbsorb: 0.5 }, { airAbsorb: 0.999 }]) {
  const F = Math.pow(10, e) * h.g, cR = h.ctx(F, h.R3, x), cO = h.ctx(F, h.O3, x), ob = h.obj(id);
  let L; try { L = P.catchLeg(cR, cO, ob, D0, st); } catch (err) { bad.push(['throw', id, D0, st, e, err.message]); continue; }
  n++; res[L.result] = (res[L.result] || 0) + 1;
  const tb = TB('catch', { a: L }, { A: cR, B: cO, whoA: 'rex', obj: ob });
  const nums = [tb.E].concat(PART.map((k) => tb.parts[k]));
  if (nums.some((v) => typeof v !== 'number' || Number.isNaN(v) || v < 0)) bad.push(['nan', id, D0, st, e, JSON.stringify(x), L.result]);
  // thrown energy
  const vL = L.aim ? L.aim.vL : L.vL;
  const E0 = L.result === 'fireball' && L.fireball ? Math.max(L.fireball.E, 0) : L.fast ? (L.miss ? L.miss.E : 0) + (L.sheath ? L.sheath.E : 0) : vL > 0 ? P.keFromV(vL, ob.m) + PE(ob.m, L.h0 || 0) : 0;
  const s = x.airAbsorb != null ? x.airAbsorb : 1;
  if (tb.parts.drag > s * E0 * (1 + 1e-6) + 1e-9) bad.push(['drag>E0', id, D0, st, e, JSON.stringify(x), L.result, tb.parts.drag.toPrecision(3), E0.toPrecision(3)]);
  // total taken back should not exceed what was thrown (KE + PE) by much: arrival + drag-excess
  if (isFinite(tb.E) && tb.E > E0 * 1.001 + 1 && L.result !== 'hits-ground') bad.push(['E>E0', id, D0, st, e, JSON.stringify(x), L.result, tb.E.toPrecision(3), E0.toPrecision(3), JSON.stringify(tb.parts)]);
}
console.log('legs', n, res, 'bad', bad.length, (Date.now() - t0) / 1000 + ' s');
for (const b of bad.slice(0, 15)) console.log(b.join(' | '));
