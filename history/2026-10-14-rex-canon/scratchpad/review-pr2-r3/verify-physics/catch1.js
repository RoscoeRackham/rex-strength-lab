const R = process.env.R || (__dirname + '/repo/rex-strength-lab');
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const surf = D.surfaces.find(s => s.id === 'concrete');
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ol = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const base = { mode: 'comic', surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const cR = Object.assign({ F: 90718.474 * P.K.g, body: rex }, base), cO = Object.assign({ F: 2000 * P.K.g, body: ol }, base);
const car = D.objects.find(o => o.id === 'car');
const legs = [P.catchLeg(cR, cO, car, 30, 'easy'), P.catchLeg(cO, cR, car, 30, 'easy')];
for (const L of legs) console.log(L && { result: L.result, rAT: L.recoilAbsorbedT, rAC: L.recoilAbsorbedC, tgT: L.toGroundT, tgC: L.toGroundC, keys: Object.keys(L).join(',') });
