// copy-1's figures at the 3,000 kg bodies: the shove's push back, Ollie's share and his feet's, at 8.74 t and 2.57 t
global.window = global;
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'), D = window.DINO_DATA, g = P.K.g;
const R = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, conc = D.surfaces.find((x) => x.id === 'concrete');
for (const kg of [8740, 2570, 100 * 907.18474]) {
  const c = Object.assign({ F: kg * g, mode: 'comic', body: R, surface: conc, anchor: 'friction' }, ON), cO = Object.assign({}, c, { body: O });
  const r = P.shove(c, cO), pO = P.vToMomentum(r.vB, O.m);
  console.log(kg, 'J', r.recoilAbsorbed.J.toFixed(0), 'Ollie', pO.toFixed(0), 'feet', (r.recoilAbsorbed.J - pO).toFixed(0), 'feet share', ((r.recoilAbsorbed.J - pO) / r.recoilAbsorbed.J).toFixed(3));
}
