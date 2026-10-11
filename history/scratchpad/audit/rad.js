const fs = require('fs');
const src0 = fs.readFileSync('/home/user/dino-strength-sim/src/engine.js', 'utf8');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
function load(h) {
  const s = src0.replace('const RAD_H = 30e3;', 'const RAD_H = ' + h + ';');
  const f = __dirname + '/eng_rad_' + h + '.js'; fs.writeFileSync(f, s); delete require.cache[f]; return require(f);
}
const surf = D.surfaces.find((s) => s.id === 'concrete');
for (const h of [30e3, 90e3]) {
  const P = load(h);
  const mk = (kg) => ({ F: kg * 9.80665, mode: 'comic', body: P.makeBody({ H: 3.048, m: 637.129, build: 'rex' }), surface: surf, groundHolds: false, anchor: 'bolted' });
  for (const [oid, logKg, logD, style] of [['pyramid', 14, 7.31, 'easy'], ['car', 9, 6, 'easy'], ['car', 9, 7, 'easy'], ['shot', 7, 6, 'easy'], ['car', 10, 7, 'hard']]) {
    const obj = D.objects.find((o) => o.id === oid);
    if (!obj) { console.log('no', oid); continue; }
    const kg = Math.pow(10, logKg);
    try {
      const g = P.catchGame(mk(kg), mk(kg), obj, Math.pow(10, logD), style);
      const a = g.a;
      const fl = a.flight || a.fly || {};
      console.log('RAD_H', h, oid, logKg, logD, style, 'result', a.result, 'heat', JSON.stringify(a.heat || {}).slice(0, 300));
    } catch (e) { console.log('err', e.message); }
  }
}
