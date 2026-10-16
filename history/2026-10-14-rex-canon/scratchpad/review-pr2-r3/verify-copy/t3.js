const root = process.argv[2];
const P = require(root + '/rex-strength-lab/src/engine.js'); global.window = {}; require(root + '/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surface = D.surfaces.find(s => s.id === 'concrete');
const pullObjs = D.objects.filter(o => true);
for (const kg of [3000, 10000, 30000, 90718.474, 1e6]) {
  const line = [];
  for (const o of D.objects) {
    for (const anchor of ['bolted', 'friction']) {
      const c = { F: kg * P.K.g, mode: 'comic', body, surface, anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: false };
      const r = P.pull(c, o);
      if (['car','piano','bus','semi'].includes(o.id)) line.push(o.id + '/' + anchor[0] + ':' + (r.canMove ? r.t10m.toFixed(3) + 's' : 'stuck'));
    }
  }
  console.log(kg, line.join(' '));
}
console.log(D.objects.map(o=>o.id).join(','));
