global.window = {};
const L = '/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(L + 'src/engine.js'); require(L + 'src/data.js');
const D = window.DINO_DATA;
const R = Object.fromEntries(require(L + 'research/final-presence.json').facts.map((f) => [f.key, f]));
const hum = JSON.parse(R.elephant_steinmann2025_other_animals.values_json).rows.find((x) => x.animal === 'human');
console.log('record', JSON.stringify(hum));
const sand = D.surfaces.find((s) => s.id === 'sand'), firm = Object.assign({}, sand, { id: 'firmsand' });
const man = P.makeBody({ build: 'human', H: 1.75, m: 76.7 });
for (const [n, s] of [['sand', sand], ['firmsand', firm]]) for (const e of [0, 0.5]) {
  const v = P.presence(man, s, { effort: e }).ppv(hum.distance_m) * 1000;
  console.log(n, 'effort', e, v.toExponential(2), 'mm/s', 'ratio model/record', (v / hum.ppv_mm_s).toFixed(2));
}
// elephant comparison at 20 m: Rex walking soft-footed
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const [n, s] of [['sand', sand], ['firmsand', firm]]) console.log('rex', n, (P.presence(rex, s, { effort: 0 }).ppv(20) / P.elephantPPV(20)).toFixed(1), 'x elephant');
console.log(R.elephant_steinmann2025_other_animals.display);
console.log(R.elephant_steinmann2025_other_animals.status, R.elephant_steinmann2025_other_animals.notes.slice(0, 1500));
