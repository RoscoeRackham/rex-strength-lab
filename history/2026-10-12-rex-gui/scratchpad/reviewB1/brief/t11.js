const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
const obj = (id) => D.objects.find(o => o.id === id);
for (const lg of [17, 18, 19]) for (const Dd of [40]) {
  for (const s of [0, 0.5]) {
    const cR = ctxOf(Math.pow(10, lg), { airAbsorb: s }), cO = ctxOf(Math.pow(10, lg), { airAbsorb: s }, ollie());
    const L = P.catchLeg(cR, cO, obj('baseball'), Dd, 'hard');
    const f = L.fireball;
    if (!f) { console.log(lg, s, L.result); continue; }
    const xg = Dd / f.unit, gm1 = f.gamma - 1, E = f.E;
    const heat = (x) => 2 * E * x / (Math.sqrt((1 + x) ** 2 + 2 * gm1 * x) + 1 + x);
    console.log('1e' + lg, 'share', s, 'v/c', (L.vL / P.K.c).toFixed(4), 'kind', f.kind, 'xr', (Dd / f.sweep).toFixed(2), 'Egap/E', (f.Egap / E).toFixed(3), 'Earr/E', (f.Earr / E).toFixed(3), '| snowplow at kx: heat/E', (heat((1 - s) * xg) / E).toFixed(3), 'xr_eff', (Dd * (1 - s) / f.sweep).toFixed(2));
  }
}
