global.window = {};
const PB = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const surf = D.surfaces.find(s => s.id === 'concrete'), g = 9.80665;
let best = 0;
for (let lm = 22; lm <= 23.2; lm += 0.05) for (const Dd of [5, 10, 30, 100, 1e3, 1e4]) for (const oid of ['baseball','car']) {
  const m = Math.pow(10, lm);
  const R = { F: Infinity, mode: 'comic', body: PB.makeBody({ build: 'rex', H: 3.048, m }), surface: surf, anchor: 'friction' }; const O = Object.assign({}, R, { body: PB.makeBody({ build: 'ollie', H: 3.048, m }) });
  const L = PB.catchLeg(R, O, D.objects.find(o => o.id === oid), Dd, 'easy');
  if (L.vArrive / PB.K.c > best) { best = L.vArrive / PB.K.c; console.log(lm.toFixed(2), Dd, oid, L.result, (L.vArrive / PB.K.c).toFixed(5), L.catch ? L.catch.E1 : null); }
}
