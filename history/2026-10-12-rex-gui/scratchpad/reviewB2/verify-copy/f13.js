const { P, D, body, surf, ctx } = require('./eng.js');
const pyr = D.objects.find((x) => /pyramid/i.test(x.id));
const allstar = D.objects.find((x) => x.id === 'baseball');
const c2 = 299792458 ** 2;
for (const beta of [0.0101, 0.011, 0.012]) {
  const g = 1 / Math.sqrt(1 - beta * beta), E = (g - 1) * pyr.m * c2;
  const out = [90, 45, 0].map((a) => { const h = P.fastAir(pyr, E, a, 0.5), z = P.fastAir(pyr, E, a, 1); return a + '°: ' + (100 * h.Eair / z.Eair).toFixed(1) + '%'; });
  console.log('pyramid at', beta, out.join('  '));
}
// throwBlast at 100% for the All-Star baseball
const c = ctx(1.8e23);
const r = P.throwObject(c, allstar, 0);
const b = P.RESTRAINT.throwBlast ? P.RESTRAINT.throwBlast(r, Object.assign({}, c, { obj: allstar, angle: 0 })) : null;
console.log('throwBlast at 100%:', JSON.stringify(b), 'relativistic', r.flight.relativistic);
const M = P.RESTRAINT.MOVES.throw;
for (const s of [1, 0.5, 0]) { const cc = ctx(1.8e23, { airAbsorb: s }); const rr = P.throwObject(cc, allstar, 0); const bp = M.blastParts(rr, Object.assign({}, cc, { obj: allstar, angle: 0 })); console.log('share', s, 'land', bp.land.toPrecision(3), 'path (hand)', bp.path.toPrecision(3)); }
