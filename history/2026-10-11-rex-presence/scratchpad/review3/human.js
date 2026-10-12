global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const sand = D.surfaces.find((s) => s.id === 'sand');
const firm = Object.assign({}, sand, { id: 'firmsand' });
const man = P.makeBody({ build: 'human', H: 1.75, m: 76.7 });
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const [n, s] of [['loose sand 120', sand], ['firm sand 280', firm]]) {
  for (const e of [0, 0.5]) {
    const v53 = P.presence(man, s, { effort: e }).ppv(53);
    const vR20 = P.presence(rex, s, { effort: e }).ppv(20);
    console.log(n, 'effort', e, 'man@53m', (v53*1000).toExponential(2), 'mm/s; ratio to 0.002:', (v53*1000/0.002).toFixed(2), '| rex@20m', (vR20*1000).toExponential(2), 'mm/s; ratio to elephant 0.005:', (vR20*1000/0.005).toFixed(1));
  }
}
