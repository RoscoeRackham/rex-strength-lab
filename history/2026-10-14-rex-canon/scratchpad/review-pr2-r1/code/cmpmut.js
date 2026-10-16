// node cmpmut.js <mutant> : compare catch legs of the branch and a mutant engine over a grid (own recoil on)
global.window = {};
const path = require('path');
const B = require('./repo/rex-strength-lab/src/engine.js'); require('./repo/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const Mu = require('./mut/' + process.argv[2] + '/rex-strength-lab/src/engine.js');
const g = B.K.g, surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const diffs = [];
for (const lg of [9, 14, 16, 20, 26, 'inf']) for (const ub of [false, true]) for (const anchor of ['friction', 'bolted']) for (const [oid, D0, st] of [['baseball', 10, 'hard'], ['baseball', 1000, 'hard'], ['car', 30, 'hard'], ['car', 1000, 'hard'], ['car', 30, 'easy'], ['shot', 100, 'hard']]) {
  const mk = (P) => { const rex = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), ollie = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
    const c = { F: lg === 'inf' ? Infinity : Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor, airAbsorb: 1, keepForm: true, unbreakable: ub, ownRecoil: true };
    return P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj(oid), D0, st); };
  const a = mk(B), b = mk(Mu);
  const ka = a.catch || {}, kb = b.catch || {};
  for (const k of ['sinkRatio', 'sinkRatioRaw', 'uAfter', 'slide', 'carried']) if (String(ka[k]) !== String(kb[k])) diffs.push([lg, ub, anchor, oid, D0, st, a.result, k, ka[k], kb[k]].join(' '));
  if (a.result !== b.result) diffs.push([lg, ub, anchor, oid, D0, st, 'result', a.result, b.result].join(' '));
}
console.log(diffs.length); console.log(diffs.slice(0, 15).join('\n'));
