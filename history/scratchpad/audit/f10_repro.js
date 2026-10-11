const fs = require('fs'), vm = require('vm');
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const win = {}; vm.runInNewContext(fs.readFileSync('/home/user/dino-strength-sim/src/data.js','utf8'), { window: win });
const D = win.DINO_DATA;
// Build a patched fly with Carter et al. sphere Cd(M) (project's own verified research entry cd_sphere_mach_fit)
const cdSphere = (M) => M <= 0.722 ? 0.45*M*M + 0.424 : 2.1*Math.exp(-1.2*(M+0.35)) - 8.9*Math.exp(-2.2*(M+0.35)) + 0.92;
const src = fs.readFileSync('/home/user/dino-strength-sim/src/engine.js','utf8');
const patchedSrc = src.replace('const dk = -beta * rho * v;', 'const dk = -beta * rho * v * (o.cdFn ? o.cdFn(v / K.a0) / Cd : 1);');
if (patchedSrc === src) throw new Error('patch failed');
const m = { exports: {} }; vm.runInNewContext(patchedSrc, { module: m, self: undefined, Math, isFinite, Infinity });
const P2 = m.exports;
console.log('Cd sphere fit samples:', [0.3,0.722,0.9,1,1.2,1.5,1.7,2,3,5,10].map(M=>M+':'+cdSphere(M).toFixed(3)).join(' '));
const body = P.makeBody({});
const surf = D.surfaces.find(s=>s.id==='concrete');
const shot = D.objects.find(o=>o.id==='shot'), ball = D.objects.find(o=>o.id==='baseball');
for (const o of [shot, ball]) console.log(o.id, 'eFold engine (m)', P.fly({v0:10,thetaDeg:45,m:o.m,A:o.area,Cd:o.Cd}).eFold.toFixed(1),
  ' eFold at Cd 0.92/1.0:', (2*o.m/(K.rho0*0.92*o.area)).toFixed(1), (2*o.m/(K.rho0*1.0*o.area)).toFixed(1));
// Range ratios at 45 deg from release height 1.8 m
const scale = (o) => (M) => cdSphere(M) * (o.id==='baseball' ? 1 : 1); // absolute Cd from fit
for (const o of [shot, ball]) {
  for (const v of [100, 200, 300, 400, 600, 1000, 2000, 3000, 5000]) {
    const a = P.fly({ v0: v, thetaDeg: 45, h0: 1.8, m: o.m, A: o.area, Cd: o.Cd });
    // Mach fit, but keep the object's own low-speed Cd below M 0.722 crossover where fit < object's Cd? Use max(objCd, fit) for baseball to not reduce
    const cdFn = (M) => Math.max(o.Cd, cdSphere(M));
    const b = P2.fly({ v0: v, thetaDeg: 45, h0: 1.8, m: o.m, A: o.area, Cd: o.Cd, cdFn });
    console.log(o.id, 'v0', v, 'M', (v/K.a0).toFixed(2), 'range const-Cd', a.range.toFixed(0), 'range Cd(M)', b.range.toFixed(0), 'ratio', (a.range/b.range).toFixed(2), ' vImp', a.vImpact.toFixed(0), b.vImpact.toFixed(0));
  }
}
