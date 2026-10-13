global.window = {};
const S = process.argv[2];
require(S + '/branch/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const { canon } = require(S + '/branch/rex-strength-lab/test/powers-off-cases.js');
const surf = D.surfaces.find((s) => s.id === 'concrete');
const res = {};
for (const n of ['base', 'E8']) {
  const P = require(n === 'base' ? S + '/branch/rex-strength-lab/src/engine.js' : S + '/f7/E8/src/engine.js');
  const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
  res[n] = [6, 9, 12, 14.5].map((lg) => { const t = P.tossPartner(Object.assign({ F: 10 ** lg * P.K.g, mode: 'comic', body: rex, surface: surf, anchor: 'friction', airAbsorb: 1 }), ollie, 'Ollie', 'easy', 10, 'friction'); return lg + ':' + t.result + ' v=' + (t.v || 0).toPrecision(4) + ' same=' ; });
  res[n + 'c'] = [6, 9, 12, 14.5].map((lg) => canon(P.tossPartner(Object.assign({ F: 10 ** lg * P.K.g, mode: 'comic', body: rex, surface: surf, anchor: 'friction', airAbsorb: 1 }), ollie, 'Ollie', 'hard', 10, 'friction')));
}
console.log(res.base.join(' | ')); console.log(res.E8.join(' | '));
console.log('hard toss canon equal per dial:', res.basec.map((x, i) => x === res.E8c[i]));
