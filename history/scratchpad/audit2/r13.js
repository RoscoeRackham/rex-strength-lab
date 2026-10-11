global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
console.log('keys', Object.keys(P).slice(0,40));
// feats with liftKg and obj
for (const f of D.feats || []) {
  const r = f.run || {};
  if (!r.liftKg || !isFinite(r.liftKg)) continue;
  const back = Math.pow(10, Math.log10(r.liftKg));
  const obj = r.obj ? D.objects.find(o => o.id === r.obj) : null;
  console.log(f.title, '|', r.liftKg, back, back >= r.liftKg ? 'OK' : 'SHORT', '| action', r.action, 'obj', r.obj, obj ? obj.m : '', obj && back < obj.m ? '<<< FAILS LIFT' : '');
}
