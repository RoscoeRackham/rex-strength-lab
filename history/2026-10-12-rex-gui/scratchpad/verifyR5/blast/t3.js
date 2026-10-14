const tree = process.argv[2];
const L = require('./lib.js')(tree);
const { P, rex, conc, obj, ctxOf, g } = L;
const ON = { keepForm: true, unbreakable: true, ownRecoil: true };
const objs = (process.argv[3] || 'baseball,car,pyramid').split(',');
const shares = (process.argv[4] || '0.5,0.9,0.99').split(',').map(Number);
const dials = (process.argv[5] || '15,20,inf').split(',');
const nears = (process.argv[6] || '5,100,1000').split(',').map(Number);
const angles = (process.argv[7] || '0,45').split(',').map(Number);
const out = {};
let tTot = 0;
for (const id of objs) for (const sh of shares) for (const dl of dials) for (const near of nears) for (const ang of angles) {
  const F = dl === 'inf' ? Infinity : Math.pow(10, +dl) * g;
  const ctx = Object.assign({ F, mode: 'comic', body: rex, surface: conc, anchor: 'friction', airAbsorb: sh }, ON);
  const t0 = Date.now();
  const p = P.RESTRAINT.planNow('throw', ctx, { obj: obj(id), angle: ang, target: 10, near });
  const res = {};
  for (const h of P.RESTRAINT.HAZARDS) res['h:' + h.id] = p.result('hazard:' + h.id);
  for (const q of P.RESTRAINT.PRESETS) res['p:' + q.id] = p.result('preset:' + q.id);
  res.ceiling = p.ceiling();
  const rAll = p.run(undefined);
  res.reachAll = P.RESTRAINT.reach('throw', rAll, p.opt);
  const dt = Date.now() - t0; tTot += dt;
  res.ms = dt; res.runs = p.runs();
  out[[id, sh, dl, near, ang].join('|')] = res;
}
console.error(tree, 'total ms', tTot);
console.log(JSON.stringify(out));
