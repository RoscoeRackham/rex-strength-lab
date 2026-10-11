global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
console.log(JSON.stringify(D.calibration));
const human = D.tiers.find(t=>t.id==='human');
console.log('human liftKg', human.liftKg);
const surface = D.surfaces.find(s=>s.id==='concrete');
for (const H of [0.4, 1, 2, 2.0001, 3, 50]) for (const mode of ['comic','real']) {
  const m = 180*Math.pow(H/2,3);
  const body = P.makeBody({H, m});
  const c = { F: human.liftKg*P.K.g, mode, body, surface, groundHolds:false, anchor:'friction' };
  const rows = D.calibration.map(k => { const o = D.objects.find(x=>x.id===k.obj); const r = P.throwObject(c, o, k.angle); return k.label+': '+(k.metric==='range'? r.flight.range.toFixed(3)+' m' : r.v.toFixed(2)+' m/s'); });
  console.log(H, mode, m.toFixed(2), rows.join(' | '));
}
// mass-only change at 2 m
for (const m of [90, 360]) for (const mode of ['comic','real']) {
  const body = P.makeBody({H:2, m});
  const c = { F: human.liftKg*P.K.g, mode, body, surface, groundHolds:false, anchor:'friction' };
  const rows = D.calibration.map(k => { const o = D.objects.find(x=>x.id===k.obj); const r = P.throwObject(c, o, k.angle); return k.label+': '+(k.metric==='range'? r.flight.range.toFixed(3)+' m' : r.v.toFixed(2)+' m/s'); });
  console.log('H2 m', m, mode, rows.join(' | '));
}
