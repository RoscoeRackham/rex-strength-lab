global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const objs = process.argv[2] ? process.argv[2].split(',') : ['car'];
const angles = process.argv[3] ? process.argv[3].split(',').map(Number) : [0, 45];
const logs = process.argv[4] ? process.argv[4].split(',').map(Number) : [8];
for (const oid of objs) for (const lk of logs) for (const ang of angles) for (const s of [0, 0.5, 0.9, 0.99]) {
  const o = D.objects.find(x => x.id === oid);
  const c = { F: Math.pow(10, lk) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: s, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.throwObject(c, o, ang);
  const f = r.flight;
  console.log(oid, 'log', lk, 'ang', ang, 's', s, 'v', r.v.toFixed(1), 'Eobj', r.Eobj.toExponential(3), 'dragLoss', r.dragLoss && r.dragLoss.toExponential(3), 'dragLoss0', r.dragLoss0 && r.dragLoss0.toExponential(3), 'ratio', r.dragLoss0 ? (r.dragLoss / r.dragLoss0).toFixed(3) : '-', 'Eimpact', r.Eimpact && r.Eimpact.toExponential(3), 'range', f.range && f.range.toFixed(0), 'landed', f.landed, 'rel', f.relativistic);
}
