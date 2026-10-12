global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const car = D.objects.find((o) => o.id === 'car');
const base = { F: Infinity, mode: 'real', body: rex, surface: D.surfaces.find((s) => s.id === 'concrete'), groundHolds: false, anchor: 'friction' };
for (let i = 0; i < 3; i++) for (const lg of [5.59, 7.0, 10.15]) P.throwObject(Object.assign({}, base, { use: Math.pow(10, lg) * g }), car, 45);
