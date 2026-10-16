const H = require('./h.js')();
const { P, g, obj, R3, O3, c9, TB, sig } = H;
let n = 0, both = [];
for (const th of [0, 15, 30, 45, 60, 75, 89]) for (let e = 1; e <= 20; e += 0.25) for (const s of [1, 0.5]) {
  const c = c9(Math.pow(10, e) * g, R3, { airAbsorb: s }), r = P.throwObject(c, obj('person'), th), tb = TB('throw', r, Object.assign({}, c, { obj: obj('person'), angle: th }));
  if (tb.parts.passenger > 0) { n++; if (tb.parts.drag > 0) both.push({ th, e, s, v: sig(r.v), drag: sig(tb.parts.drag), pass: sig(tb.parts.passenger) }); }
}
console.log('person throws with a landing taken back:', n, '; with a drag part too:', both.length); for (const x of both.slice(0, 8)) console.log(JSON.stringify(x));
// the Wrestle throw: footing beside a drag part
let w = 0, wb = [];
for (const th of [10, 30, 45, 60, 80]) for (let e = 5; e <= 16; e += 0.25) { const A = c9(Math.pow(10, e) * g), B = c9(Math.pow(10, e) * g, O3), t = P.throwPartner(A, B, th), tb = TB('wrestleThrow', t, { A, B, whoA: 'rex', angle: th }); if (tb.parts.footing > 0) { w++; if (tb.parts.drag > 0) wb.push({ th, e, drag: sig(tb.parts.drag), foot: sig(tb.parts.footing) }); } }
console.log('wrestle throws with a crater-sized landing:', w, '; with a drag part too:', wb.length); for (const x of wb.slice(0, 5)) console.log(JSON.stringify(x));
