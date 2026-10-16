global.window = {};
const LAB = __dirname + '/../repo/rex-strength-lab';
const P = require(LAB + '/src/engine.js'); require(LAB + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, conc = D.surfaces.find((s) => s.id === 'concrete'), obj = (id) => D.objects.find((x) => x.id === id);
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const dial = 100 * 907.18474;
for (const s of [1, 0.5]) {
  const c = { F: dial * g, mode: 'comic', body: R3, surface: conc, anchor: 'friction', airAbsorb: s, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
  const r = P.throwObject(c, obj('car'), 20), t = P.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { obj: obj('car'), angle: 20 }));
  console.log('share', s, 'tile drag', t.parts.drag.toPrecision(3), 'Eobj', r.Eobj.toPrecision(3), 'dragLoss0', r.dragLoss0 && r.dragLoss0.toPrecision(3));
}
