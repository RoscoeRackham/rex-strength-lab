global.window = {};
const LAB = '/home/user/rex-strength-lab/rex-strength-lab';
const Pn = require(LAB + '/src/engine.js'), Pb = require('../before/src/engine.js');
require(LAB + '/src/data.js'); const D = window.DINO_DATA;
const g = Pn.K.g, obj = (id) => D.objects.find((x) => x.id === id), conc = D.surfaces.find((s) => s.id === 'concrete');
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
for (const [P, nm] of [[Pb, 'before'], [Pn, 'after']]) {
  const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  for (const kg of [1e9, 1e12]) { const c = Object.assign({ F: kg * g, mode: 'comic', body: R3, surface: conc, anchor: 'friction' }, DEF), r = P.throwObject(c, obj('car'), 45);
    console.log(nm, kg, P.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { obj: obj('car'), angle: 45 })).E, 'Eobj', r.Eobj, 'ke(vOut)', P.keFromV(r.vOut, obj('car').m), r.vOut === r.v); }
}
