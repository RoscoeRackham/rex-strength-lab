// Does each power change the ladder's predicates (working-tree engine)? thKey today = [mode, H, m, surface, anchor, groundHolds]
global.window = {};
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(ROOT + '/src/engine.js'); require(ROOT + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface = D.surfaces.find((x) => x.id === 'sand'), car = D.objects.find((o) => o.id === 'car');
for (const kg of [1e5, 1e7, 1e9]) {
  const c = { F: kg * g, mode: 'comic', body, surface, anchor: 'friction' };
  const row = {};
  for (const [lab, x] of [['off', {}], ['air', { airAbsorb: 1 }], ['form', { keepForm: true }], ['unbr', { unbreakable: true }], ['recoil', { ownRecoil: true }]]) {
    const cc = Object.assign({}, c, x);
    row[lab] = [P.throwObject(cc, car, 45).v.toPrecision(5), P.jump(cc).v.toPrecision(5), P.punch(cc).vFist.toPrecision(5)].join('/');
  }
  console.log(kg.toExponential(0), JSON.stringify(row));
}
