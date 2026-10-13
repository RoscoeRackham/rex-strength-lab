global.window = {};
const PB = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const surf = D.surfaces.find(s => s.id === 'concrete'), g = 9.80665;
for (const m of [1e20, 1e22, 1e23, 1e24, 1e25, 1e26]) for (const style of ['easy','hard']) {
  const R = { F: Infinity, mode: 'comic', body: PB.makeBody({ build: 'rex', H: 3.048, m }), surface: surf, anchor: 'friction' }; const O = Object.assign({}, R, { body: PB.makeBody({ build: 'ollie', H: 3.048, m }) });
  const L = PB.catchLeg(R, O, D.objects.find(o => o.id === 'baseball'), 30, style);
  console.log(m, style, L.result, L.vArrive, L.vArrive / PB.K.c, PB.isBlackHole(R.body));
}
