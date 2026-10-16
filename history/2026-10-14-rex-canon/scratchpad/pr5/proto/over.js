global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const sf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
let AA = 1; const c9x = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: sf('concrete'), anchor: 'friction', airAbsorb: AA, keepForm: true }, x || {});
const seen = {};
for (const AA of [1, 0.9, 0.5]) for (const id of ['baseball']) for (const D0 of [3e5, 1e6, 3e6, 1e7]) for (let e = 5; e <= 12; e++) { const L = P.catchLeg(c9x(Math.pow(10, e) * g, R3, { airAbsorb: AA }), c9x(Math.pow(10, e) * g, O3, { airAbsorb: AA }), obj(id), D0, 'hard'); if (!seen[L.result]) { seen[L.result] = [AA, id, D0, e]; } }
console.log(seen);
