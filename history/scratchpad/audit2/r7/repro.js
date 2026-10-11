global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
function run(logKg, objId, ang, surfId='concrete', anchor='friction', mode='comic', gh=false) {
  const body = P.makeBody({H:2, m:180});
  const surface = D.surfaces.find(s=>s.id===surfId);
  const ctx = {F: Math.pow(10,logKg)*g, mode, body, surface, groundHolds: gh, anchor};
  const obj = D.objects.find(o=>o.id===objId);
  const r = P.throwObject(ctx, obj, ang);
  return {r, body, surface, obj, ctx};
}
for (const [lk, ang] of [[Math.log10(90718.474), 45],[4.5,45],[7,45],[4.5,20],[4.5,10],[5,30]]) {
  const {r, body, surface} = run(lk,'car',ang);
  const th = ang*Math.PI/180;
  console.log('logKg',lk.toFixed(3),'ang',ang,'mu',surface.mu,'F',r.F.toFixed(0),'R',r.anchor.R.toFixed(0),'limit',r.anchor.limit,'normalCapped',r.anchor.normalCapped,'Nmax',r.anchor.Nmax.toExponential(3),
   'v',r.v.toFixed(2),'recoil',r.recoilV.toFixed(2),'range',r.flight && r.flight.range && r.flight.range.toFixed(1),'sink',r.sinkRatio.toFixed(3),'N(F)/Nmax',(r.anchor.N(r.F)/r.anchor.Nmax).toFixed(2));
}
console.log(D.surfaces.map(s=>s.id+':'+s.mu).join(' '));
