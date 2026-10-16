const root = process.argv[2];
const P = require(root + '/src/engine.js'); global.window = {}; require(root + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, conc = D.surfaces.find((s) => s.id === 'concrete');
const body = (b) => P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] });
const rex = body('rex'), ollie = body('ollie');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctx = (kg, b = rex) => Object.assign({ F: kg * g, mode: 'comic', body: b, surface: conc, anchor: 'friction', use: kg * g }, ON);
for (const kg of [1e6, 1e9]) { const t = P.tossPartner(ctx(kg), ollie, 'Ollie', 'hard', 10, 'friction'); console.log('toss', kg, t.result, 'sinkRatio', t.catch && t.catch.sinkRatio, 'sinkRatioRaw', t.catch && t.catch.sinkRatioRaw); }
const obj = (id) => D.objects.find((o) => o.id === id);
const k = P.catchIt(ctx(1e6, ollie), obj('car'), 60, 30, null); console.log('car catch sinkRatioRaw', k.sinkRatioRaw, 'expected', (ollie.m + obj('car').m) * g);
