global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(process.argv[2] || R + '/src/engine.js'); require(R + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const cR = { F: 200e18 * 907.18474 * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true }, cO = Object.assign({}, cR, { body: ollie });
const L = P.catchLeg(cR, cO, obj('baseball'), 100, 'hard'), k = L.catch;
const E0 = P.momentumToKE(k.pIn, obj('baseball').m);
console.log('carried', k.carried, 'E0', E0.toPrecision(6), 'Ecatch + Eride', (k.Ecatch + k.Eride).toPrecision(6), 'rel err', ((k.Ecatch + k.Eride - E0) / E0).toExponential(2));
