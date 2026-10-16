const root = process.argv[2];
const P = require(root + '/rex-strength-lab/src/engine.js'); global.window = {}; require(root + '/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surface = D.surfaces.find(s => s.id === 'concrete');
const objs = D.objects || D.throwables;
function obj(id){ return (D.objects||[]).find(o=>o.id===id) || (D.throwables||[]).find(o=>o.id===id); }
for (const kg of [90718.474, 1e6]) for (const anchor of ['bolted','friction']) for (const ownRecoil of [true,false]) {
  const c = { F: kg * P.K.g, mode: 'comic', body, surface, anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil };
  const o = { near: 5, target: 10, obj: obj('car') };
  const p = P.RESTRAINT.planNow('pull', c, o);
  const ce = p.ceiling();
  const pr = p.presets().map(x => x.id + ':' + (x.never ? 'never' : Math.round(x.use/P.K.g))).join(' ');
  console.log(kg, anchor, 'ownRecoil=' + ownRecoil, 'ceiling by', ce.by, Math.round(ce.use / P.K.g), '|', pr);
}
