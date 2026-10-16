const path = require('path');
const ENG = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js';
global.window = global;
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const P = require(ENG);
const D = window.DINO_DATA, g = P.K.g;
const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const conc = D.surfaces.find((x) => x.id === 'concrete');
for (const ub of [false, true]) for (const own of [true, false]) for (const anc of ['friction', 'bolted']) {
  const c = { F: Infinity, mode: 'comic', body: R3, surface: conc, anchor: anc, airAbsorb: 1, keepForm: true, unbreakable: ub, ownRecoil: own };
  const cO = Object.assign({}, c, { body: O3, anchor: 'bolted' });
  const r = P.shove(c, cO), b = P.shoveBoth(c, cO);
  console.log('ub', ub, 'own', own, 'rex', anc, JSON.stringify({ clash: r.clash, tearA: r.tearA, tearB: r.tearB, vA: r.vA, vB: r.vB, slideA: r.slideA, stalled: r.stalled, rA: r.recoilAbsorbed }), 'both', b.clash, b.shover);
}
