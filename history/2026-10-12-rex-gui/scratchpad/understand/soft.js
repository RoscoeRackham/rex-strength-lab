// shots.js's soft-landing check: page jump vs engine ctx, with and without the new defaults (working-tree engine)
global.window = {};
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(process.argv[2] || ROOT + '/src/engine.js'); require(ROOT + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface = D.surfaces.find((x) => x.id === 'concrete');
const base = { F: 100 * 907.18474 * g, mode: 'comic', body, surface, anchor: 'friction', softLanding: true };
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const [lab, x] of [['off', {}], ['on', ON]]) {
  const p = P.RESTRAINT.planNow('jump', Object.assign({}, base, x), { target: 3, softLanding: true, near: P.RESTRAINT.R.NEAR });
  const gl = p.goal(), use = gl.reached ? gl.use : undefined;
  const L = P.jump(Object.assign({}, base, x, { use })).landing;
  console.log(lab, 'least use (t):', use && (use / g / 1000).toPrecision(4), 'absorbed J:', L.absorbed && L.absorbed.toPrecision(4), 'E J:', L.E && L.E.toPrecision(4), 'ratio', L.ratio && L.ratio.toPrecision(3));
}
