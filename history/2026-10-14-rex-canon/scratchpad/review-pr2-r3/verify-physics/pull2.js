const R = process.env.R || (__dirname + '/repo/rex-strength-lab');
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surf = D.surfaces.find(s => s.id === 'concrete');
const F = 90718.474 * P.K.g;
const ball = D.objects.find(o => o.id === 'baseball');
for (const anchor of ['friction', 'bolted']) for (const kg of [30, 43.8]) {
  const r = P.pull({ F, use: kg * P.K.g, mode: 'comic', body, surface: surf, anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, ball);
  const legs = r.walkPush.J / r.walkPush.T;
  console.log(anchor, kg, 'kgf: t', r.t10m.toPrecision(4), 'legs N', legs.toPrecision(4), 'legs / effort', (legs / (kg * P.K.g)).toPrecision(4), 'anc.R', r.anchor.R.toPrecision(4), 'footLimited', r.footLimited);
}
