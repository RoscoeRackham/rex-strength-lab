const root = process.argv[2];
const P = require(root + '/rex-strength-lab/src/engine.js'); global.window = {}; require(root + '/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surface = D.surfaces.find(s => s.id === 'concrete');
const kg = 90718.474;
const out = [];
for (const o of D.objects) {
  const c = { F: kg * P.K.g, mode: 'comic', body, surface, anchor: 'bolted', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: false };
  const r = P.pull(c, o);
  out.push(o.id + ':' + (r.canMove ? r.t10m.toPrecision(3) + 's' : 'stuck'));
}
console.log(out.join(' '));
