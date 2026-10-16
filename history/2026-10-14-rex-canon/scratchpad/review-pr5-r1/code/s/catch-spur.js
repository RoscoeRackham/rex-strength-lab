const h = require('./h.js'); const { P, TB, PE } = h;
const out = [];
for (const e of [Math.log10(100 * 907.18474), 6, 7, 8, 9]) for (const id of h.D.objects.filter((o) => !o.noThrow && !o.noCatch).map((o) => o.id)) for (const D0 of [10, 30, 100, 300, 1000, 3000, 1e4]) for (const st of ['easy', 'hard']) {
  const F = Math.pow(10, e) * h.g, cR = h.ctx(F), cO = h.ctx(F, h.O3), ob = h.obj(id);
  let L; try { L = P.catchLeg(cR, cO, ob, D0, st); } catch (err) { continue; }
  if (L.result !== 'caught') continue;
  const tb = TB('catch', { a: L }, { A: cR, B: cO, whoA: 'rex', obj: ob });
  if (tb.by.rex.parts.drag > 0) out.push({ dial: (F / h.g).toPrecision(3), id, D0, st, v: L.aim.vE.toPrecision(4), rexDrag: tb.by.rex.parts.drag.toPrecision(3), catch: tb.parts.catch.toPrecision(4), thrown: (P.keFromV(L.aim.vL, ob.m) + PE(ob.m, L.h0)).toPrecision(4), word: h.glow(tb.by.rex.E).text });
}
console.log(out.length); for (const o of out.slice(0, 40)) console.log(JSON.stringify(o));
