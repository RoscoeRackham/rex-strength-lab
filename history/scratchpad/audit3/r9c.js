global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const K = P.K || P.CONST;
const g = 9.80665;
const mk = (lk, o) => Object.assign({ F: Math.pow(10, lk) * g, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' }, o || {});
for (const mode of ['comic', 'real']) for (const surf of ['concrete', 'sand', 'water'].filter(s=>D.surfaces.some(x=>x.id===s))) {
  const rows = [];
  for (let lk = 20; lk <= 34; lk += 0.5) {
    const r = P.stomp(mk(lk, { mode, surface: D.surfaces.find(s => s.id === surf) }));
    rows.push(lk + ':' + (r.planetScale ? 'PS' : (r.crater / 1000).toFixed(0) + 'km') + (r.craterExtrapolated ? '*' : '') + ' E=' + r.E.toExponential(1));
  }
  console.log('stomp', mode, surf, rows.join(' | '));
}
// throws: bolted, all objects, angles 45, strengths
const big = [];
for (const o of D.objects) for (const ang of [10, 45, 80]) for (let lk = 3; lk <= 34; lk += 1) {
  const r = P.throwObject(mk(lk, { anchor: 'bolted' }), o, ang);
  if (r.crater > 3e5 || r.planetScale) big.push(o.id + ' a' + ang + ' lk' + lk + ' D=' + (r.crater/1000).toFixed(0) + 'km PS=' + r.planetScale + ' E=' + (r.Eimpact||0).toExponential(1));
}
console.log(big.join('\n'));
