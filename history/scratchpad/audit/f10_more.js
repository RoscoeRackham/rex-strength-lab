const fs = require('fs'), vm = require('vm');
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const win = {}; vm.runInNewContext(fs.readFileSync('/home/user/dino-strength-sim/src/data.js','utf8'), { window: win });
const D = win.DINO_DATA;
const cdSphere = (M) => M <= 0.722 ? 0.45*M*M + 0.424 : 2.1*Math.exp(-1.2*(M+0.35)) - 8.9*Math.exp(-2.2*(M+0.35)) + 0.92;
const cdCube = (M) => M <= 1.15 ? 0.60*M*M + 1.04 : 2.1*Math.exp(-1.16*(M+0.35)) - 6.5*Math.exp(-2.23*(M+0.35)) + 1.67;
const src = fs.readFileSync('/home/user/dino-strength-sim/src/engine.js','utf8');
const m = { exports: {} }; vm.runInNewContext(src.replace('const dk = -beta * rho * v;', 'const dk = -beta * rho * v * (o.cdFn ? o.cdFn(v / K.a0) / Cd : 1);'), { module: m, self: undefined, Math, isFinite, Infinity });
const P2 = m.exports;
const body = P.makeBody({}); const surf = D.surfaces.find(s=>s.id==='concrete');
const ball = D.objects.find(o=>o.id==='baseball'), shot = D.objects.find(o=>o.id==='shot'), tank = D.objects.find(o=>o.id==='tank');
const ballCd = (M)=> M < 0.7 ? 0.35 : Math.max(0.35, cdSphere(M));
console.log('baseball (0.35 subsonic, sphere fit above M0.7):');
for (const v of [600,1000,3000]) { const a=P.fly({v0:v,thetaDeg:45,h0:1.8,m:ball.m,A:ball.area,Cd:0.35}); const b=P2.fly({v0:v,thetaDeg:45,h0:1.8,m:ball.m,A:ball.area,Cd:0.35,cdFn:ballCd}); console.log(' v',v,(a.range/b.range).toFixed(2)); }
// Strength needed (comic, concrete, friction, 45 deg) for shot to reach given speeds
for (const vt of [400, 600, 1000, 3000]) {
  const F = P.threshold((F)=> P.throwObject({F, mode:'comic', body, surface:surf, groundHolds:false, anchor:'friction'}, shot, 45).v >= vt);
  console.log('shot reaches', vt, 'm/s at lift', (F/g/1000).toExponential(2), 't  (', (F/g/907.18474).toExponential(2), 'short tons)');
}
// Tank at Secret Wars: sensitivity to supersonic bluff-body Cd multiplier
const t = D.tiers.find(x=>x.id==='secretwars');
const r = P.throwObject({F:t.liftKg*g, mode:'comic', body, surface:surf, groundHolds:false, anchor:'friction'}, tank, 45);
console.log('tank v', r.v.toFixed(0), 'engine range km', (r.flight.range/1e3).toFixed(1), 'apex km', (r.flight.apex/1e3).toFixed(1), 'vImp', r.flight.vImpact.toFixed(0));
for (const sup of [1.3, 1.5, 1.67]) {
  const fn = (M)=> M < 0.8 ? 1.0 : M > 1.5 ? sup : 1.0 + (sup-1.0)*(M-0.8)/0.7;
  const b = P2.fly({v0:r.v,thetaDeg:45,h0:body.releaseHeight,m:tank.m,A:tank.area,Cd:1.0,cdFn:fn});
  console.log(' supersonic Cd', sup, 'range km', (b.range/1e3).toFixed(1), 'ratio', (r.flight.range/b.range).toFixed(2));
}
