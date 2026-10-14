const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
const obj = (id) => D.objects.find(o => o.id === id);
const allstar = 200e18 * 907.18474;
for (const [oid, kg, Dd] of [['baseball', allstar, 30], ['baseball', 1e20, 30], ['car', 1e22, 100], ['baseball', allstar, 3000]]) {
  const res = {};
  for (const s of [0, 0.5, 0.9]) {
    const cR = ctxOf(kg, { airAbsorb: s }), cO = ctxOf(kg, { airAbsorb: s }, ollie());
    const L = P.catchLeg(cR, cO, obj(oid), Dd, 'hard');
    res[s] = L;
    const fb = L.fireball;
    console.log(oid, kg.toExponential(1), 'D', Dd, 'share', s, L.result, fb ? ('Egap ' + fb.Egap.toExponential(3) + ' E ' + fb.E.toExponential(3) + ' kind ' + fb.kind + ' sweep ' + fb.sweep.toExponential(2)) : '');
  }
  const f0 = res[0].fireball, f5 = res[0.5].fireball;
  if (f0 && f5) {
    const fa0 = P.fastAir(obj(oid), f0.E, 0, 1), fa5 = P.fastAir(obj(oid), f0.E, 0, 0.5);
    console.log('  catch Egap ratio 50/0 =', (f5.Egap / f0.Egap).toFixed(3), '; throw-tab fastAir ratio (level path) =', (fa5.E / fa0.E).toFixed(3));
    // snowplow on the gap itself at k x
    const m = obj(oid).m, A = obj(oid).area, E = f0.E, gm1 = E / (m * P.K.c ** 2), unit = m / (P.K.rho0 * A), xg = Dd / unit;
    const heat = (x) => 2 * E * x / (Math.sqrt((1 + x) ** 2 + 2 * gm1 * x) + 1 + x);
    console.log('  snowplow over the gap at k x: ratio', (heat(0.5 * xg) / heat(xg)).toFixed(3), ' xg', xg.toExponential(2));
  }
}
