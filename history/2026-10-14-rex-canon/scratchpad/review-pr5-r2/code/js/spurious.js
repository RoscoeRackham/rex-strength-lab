// count-once: legs whose arrival is taken back (a catch) but still leave a drag part, at the page's defaults
const H = require('./h.js')();
const { P, g, obj, R3, O3, c9, TB, sig, PE } = H;
const rows = []; let n = 0;
for (const id of ['baseball', 'car', 'person', 'bus', 'shot']) for (const st of ['hard', 'easy']) for (let ld = 1; ld <= 6.5; ld += 0.5) for (let e = 5; e <= 16; e += 0.5) {
  const F = Math.pow(10, e) * g, A = c9(F), B = c9(F, O3), ob = obj(id);
  let a; try { a = P.catchLeg(A, B, ob, Math.pow(10, ld), st); } catch (err) { continue; }
  if (!['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(a.result)) continue;
  n++;
  const tb = TB('catch', { a }, { A, B, whoA: 'rex', obj: ob });
  if (tb.parts.drag > 0) rows.push({ id, st, D: sig(Math.pow(10, ld), 2), kg: '1e' + e, res: a.result, vArr: sig(a.vArrive), drag: sig(tb.parts.drag), catch: sig(tb.parts.catch), rel: (tb.parts.drag / tb.parts.catch).toExponential(1) });
}
// the partner toss
const trows = [];
for (const st of ['hard', 'easy']) for (let lh = 0.5; lh <= 5; lh += 0.5) for (let e = 5; e <= 16; e += 0.5) {
  const F = Math.pow(10, e) * g, A = c9(F), B = c9(F, O3); const t = P.tossPartner(A, O3, 'Ollie', st, Math.pow(10, lh), 'friction');
  if (!(t.result === 'caught' || t.result === 'slams')) continue;
  const tb = TB('toss', t, { A, B, whoA: 'rex' }); if (tb.parts.drag > 0) trows.push({ st, h: sig(Math.pow(10, lh), 2), kg: '1e' + e, v: sig(t.v), drag: sig(tb.parts.drag), catch: sig(tb.parts.catch) });
}
console.log('legs reaching the catcher (defaults):', n, '; with a drag part beside the catch:', rows.length);
for (const r of rows.slice(0, 15)) console.log(JSON.stringify(r));
console.log('tosses caught with a drag part:', trows.length); for (const r of trows.slice(0, 5)) console.log(JSON.stringify(r));
