const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/verify-copy/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surface = D.surfaces.find(s => s.id === 'concrete');
const car = D.objects.find(o => o.id === 'car');
const kg = 43.6;
const ctx = { F: 90718.474 * P.K.g, mode: 'comic', body: rex, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, use: kg * P.K.g };
const r = P.pull(ctx, car);
console.log('car', car.name, car.m, 't10m', r.t10m.toFixed(2), 'vEnd', r.vEnd.toFixed(3), 'car p', (car.m * r.vEnd).toFixed(0), 'ocean J', r.recoilAbsorbed && r.recoilAbsorbed.J.toFixed(0));
