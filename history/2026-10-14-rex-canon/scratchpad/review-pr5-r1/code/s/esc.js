const h = require('./h.js'); const { P, TB, PE } = h;
const esc = JSON.parse(require('fs').readFileSync('esc.json'));
const seen = new Set(); const rows = [];
for (const [id, th, e, s] of esc) { const k = id + th + e; if (seen.has(k) || s !== 1) continue; seen.add(k);
  const ob = h.obj(id), c = h.ctx(Math.pow(10, e) * h.g, h.R3, { airAbsorb: 1, safePassenger: false }), r = P.throwObject(c, ob, th);
  const f1 = P.fly({ v0: r.vOut, thetaDeg: th, h0: h.R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, dragK: 1 - 1e-12 });
  const d = TB('throw', r, Object.assign({}, c, { obj: ob, angle: th })).parts.drag;
  rows.push({ id, th, e, v: r.v, Eobj: r.Eobj, tally: d, realAirTook: f1.air ? f1.air.E : null, frac: f1.air ? f1.air.E / r.Eobj : null, escaped: f1.escaped, orbit: f1.orbit, timedOut: f1.timedOut });
}
rows.sort((a, b) => a.frac - b.frac);
console.log(rows.length, 'escaping throws at 100% (distinct)');
for (const r of rows.slice(0, 8)) console.log(r.id, r.th, '10^' + r.e, 'v', r.v.toPrecision(3), 'tally', r.tally.toPrecision(3), 'real air along its real path', r.realAirTook.toPrecision(3), 'frac', r.frac.toPrecision(3));
const fr = rows.map((r) => r.frac); console.log('median frac', fr[Math.floor(fr.length / 2)].toPrecision(3), 'max', Math.max(...fr).toPrecision(3));
const by = {}; for (const r of rows) if (!by[r.id] || r.frac < by[r.id].frac) by[r.id] = r;
for (const r of Object.values(by)) console.log(r.id, r.th, '10^' + r.e, 'v', r.v.toPrecision(3), 'frac', r.frac.toPrecision(3), 'Eobj', r.Eobj.toPrecision(3), 'air', r.realAirTook.toPrecision(3), r.escaped, r.orbit, r.timedOut);
