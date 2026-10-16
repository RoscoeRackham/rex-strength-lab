const H = require('./h.js')();
const { P, D, g, obj, R3, PE, sig } = H;
const k = 1 - 1e-12;
let rows = [];
for (const id of D.objects.filter((o) => !o.noThrow).map((o) => o.id)) for (const th of [0, 30, 60, 90]) for (let e = 0; e <= 21; e++) {
  const ob = obj(id), c = H.c9(Math.pow(10, e) * g, R3, { airAbsorb: 1 }), r = P.throwObject(c, ob, th);
  if (!r.canMove || !r.flight || r.fallsBack || r.flight.relativistic) continue;
  const fl = { v0: r.vOut, thetaDeg: th, h0: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup };
  const f0 = P.fly(fl); if (!f0.landed) continue;
  const ft = P.fly(Object.assign({}, fl, { tally: true }));
  const E1 = P.keFromV(r.vOut, ob.m) + PE(ob.m, R3.releaseHeight), ec = E1 - P.keFromV(f0.vImpact, ob.m), ta = ft.air.E;
  rows.push({ id, th, e, E1, ec, ta, rel: Math.abs(ec - ta) / Math.max(ta, 1e-30), share: ta / E1 });
}
rows.sort((a, b) => b.rel - a.rel);
for (const x of rows.slice(0, 12)) console.log(x.id, x.th, '1e' + x.e, 'E1', sig(x.E1), 'EC', sig(x.ec), 'tally', sig(x.ta), 'rel', x.rel.toExponential(2), 'share of E1', x.share.toExponential(2));
console.log('cases', rows.length, 'with rel>1%:', rows.filter((x) => x.rel > 0.01).length, 'max share among those', Math.max(...rows.filter((x) => x.rel > 0.01).map((x) => x.share)).toExponential(2));
console.log('neg EC (clamped to 0):', rows.filter((x) => x.ec < 0).length);
