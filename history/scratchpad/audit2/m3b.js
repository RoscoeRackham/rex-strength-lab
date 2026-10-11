const { P, D, g, S, ctx } = require('../audit/common.js');
const K = P.K;
// Replicate comic pushApart side kinematics with a configurable foot-speed cap
function xOfT(f,m,t){const u=f*t/(m*K.c);return (f*t*t/m)/(Math.sqrt(1+u*u)+1);}
function run(lg, capFrac){
  const c0=ctx(10**lg,{surface:'concrete'}); const b=c0.body;
  const F=c0.F, d=b.strokes.leg, mA=b.m-b.feetMass, mB=b.feetMass, RA=mA*g;
  const A2=2*b.footArea, RB=P.qultFor(c0.surface,b.footB)*A2, cB=K.PONCELET_K*(c0.surface.rho||2000)*A2;
  const fA=F-RA,fB=F-RB; const vt=Math.min(capFrac*K.c,Math.sqrt(fB/cB));
  const S=(t)=>xOfT(fA,mA,t)+vt*t; let hi=1e-30; while(S(hi)<d)hi*=2; let lo=hi/2;
  for(let i=0;i<200;i++){const mid=(lo+hi)/2; if(S(mid)<d)lo=mid; else hi=mid;}
  const t=hi, xB=vt*t; return {vt, Eg:F*xB, xB};
}
for (const lg of [14.5,15,16,18,20,25,30,34]) {
  const a=run(lg,0.01), b=run(lg,0.9), r=P.jump(ctx(10**lg,{surface:'concrete'}));
  console.log(lg,'engine Eground',r.Eground.toExponential(3),'| cap1% Eg',a.Eg.toExponential(3),'vt',a.vt.toExponential(3),'| cap90% Eg',b.Eg.toExponential(3),'vt',b.vt.toExponential(3),'ratio',(b.Eg/a.Eg).toFixed(1));
}
