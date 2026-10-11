global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
let nbad=0, n=0, maxBad=0;
for (let m=5.2007e7; m<5.6e7; m*=1.002) { n++; const b=P.makeBody({H:2,m}); const f=P.fallThrough(b,{}); const fp=f.firstPass;
  if (fp && (fp.t<1500||Math.abs(fp.dLonDeg)>90)) { nbad++; maxBad=m; } }
console.log('scanned',n,'bad',nbad,'largest bad m',maxBad.toExponential(4));
for (const H of [0.5, 10, 50]) { const s=H/2; const thr=1.7e9*0.3*s*s/9.80665; let nb=0, mb=0; for (let m=thr*1.00001; m<thr*1.1; m*=1.002){ const f=P.fallThrough(P.makeBody({H,m}),{}); const fp=f.firstPass; if (fp && (fp.t<1500||Math.abs(fp.dLonDeg)>90)) {nb++; mb=m;} } console.log('H',H,'threshold',thr.toExponential(4),'bad',nb,'largest bad ratio', (mb/thr).toFixed(4)); }
