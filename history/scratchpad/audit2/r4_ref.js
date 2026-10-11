// Fine reference integration of the same two-body Hill push model used by jump() in real mode.
global.window={};require('/home/user/dino-strength-sim/src/data.js');const D=window.DINO_DATA;
const P=require('/home/user/dino-strength-sim/src/engine.js');
const K=P.K;
function hill(u,k){if(u<=0)return 1;if(u>=1)return 0;return (1-u)/(1+u/k);}
function ref(F0,d,mA,mB,RA,RB,cB,vmax,dt){
  const k=P.MUSCLE.k;let xA=0,xB=0,vA=0,vB=0,t=0,Wg=0,WF_B=0,WF_A=0,vBmax=0;
  // fine semi-implicit Euler with sub-steps; static friction handled as stick when v==0 and net<=0
  const acc=(vA,vB)=>{const F=F0*hill((vA+vB)/vmax,k);
    let aA=0,aB=0;
    if(vA>0||F>RA) aA=(F-RA)/mA;
    if(vB>0||F>RB) aB=(F-RB-cB*vB*vB)/mB;
    return {F,aA,aB};};
  let n=0;
  while(xA+xB<d && n<5e8){
    // RK2 midpoint
    const a1=acc(vA,vB);
    let vAm=Math.max(0,vA+0.5*dt*a1.aA), vBm=Math.max(0,vB+0.5*dt*a1.aB);
    const a2=acc(vAm,vBm);
    let nvA=Math.max(0,vA+dt*a2.aA), nvB=Math.max(0,vB+dt*a2.aB);
    const dxA=0.5*(vA+nvA)*dt, dxB=0.5*(vB+nvB)*dt;
    let frac=1; if(xA+xB+dxA+dxB>d) frac=(d-xA-xB)/(dxA+dxB);
    const vBavg=0.5*(vB+nvB);
    Wg += (RB + cB*vBavg*vBavg)*dxB*frac;
    WF_B += a2.F*dxB*frac; WF_A += a2.F*dxA*frac;
    xA+=dxA*frac;xB+=dxB*frac;vA+=(nvA-vA)*frac;vB+=(nvB-vB)*frac;t+=dt*frac;n++;
    if(vB>vBmax)vBmax=vB;
    if(nvA===0&&nvB===0&&n>3&&a2.F<=RA&&a2.F<=RB)break;
  }
  return {t,xA,xB,vA,vB,vBmax,Wg,WF_B,WF_A,EB:0.5*mB*vB*vB, RBxB:RB*xB};
}
function setup(logKg,surf){const body=P.makeBody({H:2,m:180});const s=D.surfaces.find(x=>x.id===surf);
 const F=Math.pow(10,logKg)*K.g*P.MUSCLE.jump.forceFrac;const mA=body.m-body.feetMass,mB=body.feetMass;
 const A2=2*body.footArea;const RB=P.qultFor(s,body.footB)*A2;const cB=K.PONCELET_K*(s.rho||2000)*A2;
 return {F,d:body.strokes.leg,mA,mB,RA:mA*K.g,RB,cB,vmax:P.MUSCLE.jump.vmax*body.s,body,s};}
const cases=[[Math.log10(90718.474),'concrete',1e-7],[6,'concrete',2e-8],[Math.log10(90718.474),'gravel',1e-7],[Math.log10(90718.474),'sand',1e-7],[4.5,'concrete',1e-7]];
for(const [lk,surf,dt] of cases){const o=setup(lk,surf);
  const r=ref(o.F,o.d,o.mA,o.mB,o.RA,o.RB,o.cB,o.vmax,dt);
  const e=P.jump({F:Math.pow(10,lk)*K.g,mode:'real',body:o.body,surface:o.s,groundHolds:false,anchor:'friction'});
  const pLock=o.mA*r.vA-o.mB*r.vB; 
  console.log(surf,lk.toFixed(3),'REF xB',r.xB.toExponential(3),'vBmax',r.vBmax.toFixed(3),'vBend',r.vB.toFixed(3),'Wground',r.Wg.toFixed(1),'WF_B-EB',(r.WF_B-r.EB).toFixed(1),'RB*xB',r.RBxB.toFixed(1),'vTake',(pLock/o.body.m).toFixed(3),
   '| ENGINE xB',e.push.xB.toExponential(3),'vB',e.push.vB.toFixed(3),'Eground',e.Eground.toFixed(1),'v',e.v.toFixed(3));
}
