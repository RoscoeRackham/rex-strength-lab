const R='/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R+'src/engine.js'); global.window = {}; require(R+'src/data.js'); const D = window.DINO_DATA;
const surf = D.surfaces.find(s => s.id === 'concrete');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const mk = (kg, body, air) => ({ F: kg * P.K.g, mode: 'comic', body, surface: surf, anchor: 'friction', airAbsorb: air, keepForm: true, unbreakable: true, ownRecoil: true });
const ball = D.objects.find(o => o.id === 'baseball');
for (const [kg, Dist] of [[200e18 * 907.18474, 30], [1e17, 40]]) {
  const res = {};
  for (const air of [0, 0.5]) {
    const L = P.catchLeg(mk(kg, rex, air), mk(kg, ollie, air), ball, Dist, 'hard');
    res[air] = L;
    const f = L.fireball;
    console.log('kg', kg.toPrecision(3), 'D', Dist, 'air', air, 'result', L.result, f ? ('kind ' + f.kind + ' sweep ' + f.sweep.toPrecision(3) + ' Egap/E ' + (f.Egap / f.E).toPrecision(3) + ' Earr/E ' + (f.Earr/f.E).toPrecision(3) + ' Dfl ' + L.Dfl.toPrecision(3)) : '');
  }
  const f0 = res[0].fireball, f5 = res[0.5].fireball;
  if (f0 && f5) {
    console.log('  catch Egap ratio 50/0:', (f5.Egap / f0.Egap).toFixed(3));
    // snowplow at k*x for same path
    const E = f0.E, gm1 = f0.gamma - 1, unit = f0.unit, xg = res[0].Dfl / unit;
    const heat = (x) => 2 * E * x / (Math.sqrt((1 + x) ** 2 + 2 * gm1 * x) + 1 + x);
    console.log('  snowplow at k x ratio:', (heat(0.5 * xg) / heat(xg)).toFixed(3), ' heat(kx)/E', (heat(0.5*xg)/E).toPrecision(3));
    const fa0 = P.fastAir ? P.fastAir(ball, E, 0, 1) : null;
  }
}
console.log('fastAir exported?', typeof P.fastAir);
