global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, surf = D.surfaces.find((s) => s.id === 'concrete'), ball = D.objects.find((o) => o.id === 'baseball');
for (const Dd of [30, 1000, 1e5]) {
  const leg = (share) => { const R = { F: 1e20 * g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf, anchor: 'friction', airAbsorb: share }; const O = Object.assign({}, R, { body: P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }) }); return P.catchLeg(R, O, ball, Dd, 'hard'); };
  const L0 = leg(0), L5 = leg(0.5);
  const fb0 = L0.fireball, fb5 = L5.fireball;
  // the snowplow at half the rate over the same gap (what the Throw tab's fastAir does): heat(x/2)
  const E = fb0.E, m = ball.m, c = P.K.c, gm1 = E / (m * c * c), unit = fb0.unit, x = (L0.Dfl) / unit;
  const heat = (xx) => 2 * E * xx / (Math.sqrt((1 + xx) ** 2 + 2 * gm1 * xx) + 1 + xx);
  console.log('gap', Dd, 'm:', L0.result, L5.result, '| air heat in the gap at 50% absorbed: catch gives', (fb5.Egap / fb0.Egap).toFixed(3), 'of 0%; the snowplow at half the rate (Throw tab rule) gives', (heat(x / 2) / heat(x)).toFixed(3), '| gap heat at 0% is', (100 * fb0.Egap / E).toFixed(1) + '% of E');
}
