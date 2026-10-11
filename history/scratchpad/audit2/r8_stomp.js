global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const P = require('/home/user/dino-strength-sim/src/engine.js');
const D = window.DINO_DATA;
if (P.calibrateComic) { try { P.calibrateComic(); } catch(e){} }
const g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 });
for (const surf of ['concrete','granite','sand']) {
  const surface = D.surfaces.find(s => s.id === surf);
  for (const gh of [false, true]) {
    for (const lk of [6,7,8,8.5,9,10,12]) {
      const c = { F: Math.pow(10, lk)*g, mode:'comic', body, surface, groundHolds: gh, anchor:'friction' };
      const r = P.stomp(c);
      console.log(surf, 'gh=' + gh, 'logKg', lk, 'vFoot', r.vFoot.toFixed(0), 'crater', r.crater.toFixed(2), 'hole', r.holeDepth.toFixed(3), 'quake', r.quake.toFixed(2));
    }
  }
}
// threshold where vFoot crosses 2000 with comic ground
const surface = D.surfaces.find(s => s.id === 'concrete');
let lo=5, hi=12; for (let i=0;i<60;i++){ const m=(lo+hi)/2; const r=P.stomp({F:Math.pow(10,m)*g, mode:'comic', body, surface, groundHolds:true, anchor:'friction'}); if (r.vFoot>=2000) hi=m; else lo=m; }
console.log('crater onset logKg', hi, (Math.pow(10,hi)).toExponential(3), 'kg');
for (const mode of ['real']) { const r=P.stomp({F:Infinity, mode, body, surface, groundHolds:true, anchor:'friction'}); console.log('real inf', r.vFoot, r.crater); }
const r=P.stomp({F:Infinity, mode:'comic', body, surface, groundHolds:true, anchor:'friction'}); console.log('comic inf', r.vFoot, r.crater);
