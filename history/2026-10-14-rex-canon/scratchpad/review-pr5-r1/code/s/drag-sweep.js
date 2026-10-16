const h = require('./h.js'); const { P, TB, PE } = h;
const ids = h.D.objects.filter((o) => !o.noThrow).map((o) => o.id);
const shares = [1, 0.75, 0.5, 0.1];
const angles = [0, 30, 45, 70, 90];
let n = 0; const bad = [], over = [], oceanUsed = [], esc = [];
const t0 = Date.now();
for (const id of ids) { const ob = h.obj(id);
  for (const th of angles) for (let e = 1; e <= 20; e += 1) for (const F of e === 20 ? [Math.pow(10, e) * h.g, Infinity] : [Math.pow(10, e) * h.g]) for (const s of shares) {
    const c = h.ctx(F, h.R3, { airAbsorb: s, safePassenger: false });
    const r = P.throwObject(c, ob, th);
    if (!r.canMove) continue;
    n++;
    const tb = TB('throw', r, Object.assign({}, c, { obj: ob, angle: th }));
    const d = tb.parts.drag;
    // the object's energy: KE + release PE
    const top = r.Eobj + PE(ob.m, h.R3.releaseHeight);
    if (!(d <= s * top * (1 + 1e-9)) && !(r.Eobj === Infinity && d === Infinity)) over.push([id, th, e, s, d, top]);
    // my own real air take
    let want;
    if (r.fallsBack) want = 0;
    else if (!isFinite(r.Eobj)) want = Infinity;
    else if (r.flight.relativistic) want = r.Eobj;
    else { const f0 = P.fly({ v0: r.vOut, thetaDeg: th, h0: h.R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup });
      want = f0.landed && !f0.relativistic ? Math.max(0, r.Eobj + PE(ob.m, h.R3.releaseHeight) - P.keFromV(f0.vImpact, ob.m)) : r.Eobj;
      if (!f0.landed && !f0.relativistic && f0.escaped) esc.push([id, th, e, s, r.v]); }
    want = s * want;
    if (!(d === want || Math.abs(d - want) <= 1e-9 * want)) bad.push([id, th, e, s, d, want]);
    if (r.flight.ocean && Math.abs(d - s * r.flight.ocean.E) < 1e-9 * d && Math.abs(r.flight.ocean.E - want / s) > 1e-6 * want) oceanUsed.push([id, th, e, s]);
  } }
console.log('throws', n, 'bad', bad.length, 'over', over.length, 'oceanUsed', oceanUsed.length, 'escapes(full drag)', esc.length, 's', (Date.now() - t0) / 1000);
console.log(bad.slice(0, 5), over.slice(0, 5));
require('fs').writeFileSync('esc.json', JSON.stringify(esc));
