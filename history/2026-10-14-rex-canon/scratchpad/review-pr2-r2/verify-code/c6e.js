const root = process.argv[2];
const P = require(root + '/src/engine.js'); global.window = {}; require(root + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, conc = D.surfaces.find((s) => s.id === 'concrete');
const body = (b) => P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const c = (kg, b) => Object.assign({ F: kg * g, mode: 'comic', body: body(b), surface: conc, anchor: 'friction', use: kg * g }, ON);
const L = P.catchLeg(c(1e5, 'rex'), c(500, 'ollie'), D.objects.find((o) => o.id === 'car'), 30, 'easy');
const k = L.catch; console.log(L.result, { clean: k.clean, canHold: k.canHold, Fcap: k.Fcap, holdLoad: k.holdLoad, Fneed: k.Fneed, vArrive: L.vArrive, v1: k.v1, vSlam: k.vSlam, J: L.recoilAbsorbedC && L.recoilAbsorbedC.J });
