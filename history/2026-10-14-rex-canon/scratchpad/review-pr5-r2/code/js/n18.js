const H = require('./h.js')();
const { P, D, g, obj, R3, PE, sig } = H;
let n = 0, bind = 0, worst = 0;
for (const id of D.objects.filter((o) => !o.noThrow).map((o) => o.id)) for (const th of [0, 10, 30, 45, 60, 80, 90]) for (let e = 3; e <= 21; e += 0.25) {
  const ob = obj(id), c = H.c9(Math.pow(10, e) * g, R3), r = P.throwObject(c, ob, th);
  if (!r.canMove || !r.flight || r.fallsBack || r.flight.relativistic || !isFinite(r.Eobj)) continue;
  const fl = { v0: r.vOut, thetaDeg: th, h0: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, tally: true };
  const f = P.fly(fl); if (f.landed) continue;
  n++; const E1 = P.keFromV(r.vOut, ob.m) + PE(ob.m, R3.releaseHeight);
  if (f.air.E > E1) { bind++; worst = Math.max(worst, f.air.E / E1); }
}
console.log('non-landing full-drag flights', n, 'where the tally exceeds E1:', bind, 'worst ratio', worst);
