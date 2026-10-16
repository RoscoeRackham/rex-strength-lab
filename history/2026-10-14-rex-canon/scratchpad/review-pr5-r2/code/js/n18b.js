const H = require('./h.js')();
const { P, D, g, obj, R3, PE, sig, TB } = H;
const rows = [];
for (const id of D.objects.filter((o) => !o.noThrow).map((o) => o.id)) for (const th of [0, 10, 30, 45, 60, 80, 90]) for (let e = 3; e <= 21; e += 0.25) {
  const ob = obj(id), c = H.c9(Math.pow(10, e) * g, R3), r = P.throwObject(c, ob, th);
  if (!r.canMove || !r.flight || r.fallsBack || r.flight.relativistic || !isFinite(r.Eobj)) continue;
  const f = P.fly({ v0: r.vOut, thetaDeg: th, h0: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, tally: true }); if (f.landed) continue;
  const E1 = P.keFromV(r.vOut, ob.m) + PE(ob.m, R3.releaseHeight);
  if (f.air.E > E1) rows.push({ id, th, e, kind: f.escaped ? 'escaped' : f.orbit ? 'orbit' : f.timedOut ? 'timedOut' : '?', ratio: f.air.E / E1, v: r.vOut, apex: f.apex, time: f.time, drag: TB('throw', r, Object.assign({}, c, { obj: ob, angle: th })).parts.drag, E1 });
}
const kinds = {}; for (const x of rows) kinds[x.kind] = (kinds[x.kind] || 0) + 1;
console.log(kinds);
for (const x of rows.slice(0, 12)) console.log(x.id, x.th, '1e' + x.e, x.kind, 'v', sig(x.v), 'apex', sig(x.apex), 'time', sig(x.time), 'ratio', x.ratio.toFixed(5), 'drag/E1', (x.drag / x.E1).toFixed(5));
