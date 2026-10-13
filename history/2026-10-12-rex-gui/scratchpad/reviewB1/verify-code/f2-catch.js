const R = process.argv[2] || 'branch';
const base = __dirname + '/' + R + '/rex-strength-lab/';
const P = require(base + 'src/engine.js');
global.window = {}; require(base + 'src/data.js'); const D = window.DINO_DATA;
const surf = D.surfaces.find((s) => s.id === 'concrete');
const o = D.objects.find((x) => x.id === 'baseball');
const mk = (kg, share, extra) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf, anchor: 'friction', airAbsorb: share, keepForm: false, unbreakable: false, ownRecoil: false }, extra || {});
for (const Dist of [30, 1000, 1e5]) {
  const res = {};
  for (const share of [0, 0.5]) {
    const L = P.catchLeg(mk(1e20, share), mk(1e20, share), o, Dist, 'hard');
    res[share] = L;
  }
  const f0 = res[0].fireball, f5 = res[0.5].fireball;
  if (!f0 || !f5) { console.log(Dist, res[0].result, res[0.5].result); continue; }
  // snowplow at half rate, computed from f0's numbers
  const E = f0.E, gm1 = E / (o.m * P.K.c ** 2), unit = f0.unit;
  const heat = (x) => 2 * E * x / (Math.sqrt((1 + x) ** 2 + 2 * gm1 * x) + 1 + x);
  const xg = Dist / unit;
  console.log('D', Dist, 'm  result', res[0].result, res[0.5].result,
    '| Egap0/E', (f0.Egap / E).toFixed(3), '| catch Egap50/Egap0', (f5.Egap / f0.Egap).toFixed(3),
    '| snowplow heat(x/2)/heat(x)', (heat(xg / 2) / heat(xg)).toFixed(3), '| Earr50/E catch', (f5.Earr / E).toFixed(3), 'snowplow', (1 - heat(xg / 2) / E).toFixed(3),
    '| sweep0', f0.sweep.toFixed(0), 'sweep50', f5.sweep.toFixed(0), 'kind', f0.kind, f5.kind);
}
// Throw tab rule
const fa0 = P.fastAir ? P.fastAir(o, 1e18, 0, 1) : null;
console.log('fastAir exported?', !!P.fastAir);
