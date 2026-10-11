global.window={};
const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const Q=require('./engine-patched.js');
const g=9.80665;
for (const m of [7.416e16, 1e18, 1e15]) {
  const b=P.makeBody({H:2,m});
  const s=P.settle(b), sq=Q.settle(Q.makeBody({H:2,m}));
  const f=P.fallThrough(b);
  console.log('m',m,'orig settle yr',s.years.toFixed(1),'loss',s.firstPassLossJ.toExponential(3),'| patched yr',sq.years.toFixed(1),'loss',sq.firstPassLossJ.toExponential(3),'| fall depthShort',f.firstPass&&f.firstPass.depthShort.toFixed(2),'m*g*ds',f.firstPass&&(m*g*f.firstPass.depthShort).toExponential(3), 'halfT', s.firstHalfPeriod.toFixed(0), 'fallT', f.firstPass&&f.firstPass.t.toFixed(0));
  const sh=P.settle(b,undefined,{sigma:4.1e9,k:2}), sl=P.settle(b,undefined,{sigma:0.1e9,k:0.5,noDF:true});
  const qh=Q.settle(Q.makeBody({H:2,m}),undefined,{sigma:4.1e9,k:2});
  console.log('  orig fast',sh.years.toFixed(1),'slow',sl.years.toFixed(0),' patched fast',qh.years.toFixed(0));
  // no DF comparisons
  const n=P.settle(b,undefined,{noDF:true}); console.log('  orig noDF yrs', n.years.toFixed(0), 'loss', n.firstPassLossJ.toExponential(3));
  const fn=P.fallThrough(b,{noDF:true}); console.log('  fall noDF depthShort', fn.firstPass&&fn.firstPass.depthShort.toFixed(2), 'mgds', fn.firstPass&&(m*g*fn.firstPass.depthShort).toExponential(3));
}
