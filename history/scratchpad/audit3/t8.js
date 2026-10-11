const {P,D,g,ctx,obj}=require('./h.js');
const objs = D.objects.filter((o) => !o.noThrow).map((o) => o.id);
let bad = 0, n = 0;
const isBad = (x) => typeof x === 'number' && Number.isNaN(x);
for (const mode of ['comic','real']) for (const anchor of ['friction','braced','bolted']) for (const lg of [1, 3, 5, 9, 14, 20, 26, 34, 'inf']) for (const oid of objs) for (const ang of [0, 30, 60, 89, 90]) {
  const c = ctx({mode, anchor, logKg: lg === 'inf' ? 34 : lg, inf: lg === 'inf', surface: 'concrete'});
  const r = P.throwObject(c, obj(oid), ang); n++;
  const fields = { v: r.v, Eobj: r.Eobj, recoilV: r.recoilV, recoilE: r.recoilE, sinkRatio: r.sinkRatio, gripRatio: r.gripRatio, crater: r.crater, quake: r.quake, Eimpact: r.Eimpact };
  if (r.flight) Object.assign(fields, { range: r.flight.range, apex: r.flight.apex, time: r.flight.time, vImpact: r.flight.vImpact });
  const nanKeys = Object.entries(fields).filter(([k, v]) => isBad(v)).map(([k]) => k);
  if (nanKeys.length) { bad++; if (bad < 15) console.log('NaN', mode, anchor, lg, oid, ang, nanKeys.join(',')); }
}
console.log('checked', n, 'NaN cases', bad);
