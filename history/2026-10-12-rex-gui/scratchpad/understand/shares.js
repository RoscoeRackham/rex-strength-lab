global.window={};
const P=require('./engine-trial.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D=window.DINO_DATA, K=P.K, g=K.g;
const surface=D.surfaces.find(s=>s.id==='concrete');
const body=P.makeBody({build:'rex',H:3.048,m:3007});
const sig=(x)=>typeof x==='number'?Number(x.toPrecision(4)):x;
function row(lgKg,id,ang){
  const o=D.objects.find(x=>x.id===id);
  const c={F:Math.pow(10,lgKg)*g,mode:'comic',body,surface,groundHolds:false,anchor:'friction'};
  console.log(`\n== ${id} dial 10^${lgKg} kg angle ${ang}`);
  let r0;
  for (const s of [0,0.3,0.5,0.7,0.9,1]) {
    const t0=Date.now();
    const r=P.throwObject(Object.assign({},c,{airAbsorb:s}),o,ang); const ms=Date.now()-t0;
    if(s===0) r0=r;
    const f=r.flight;
    const vac=P.fly({v0:r.vOut,thetaDeg:ang,h0:body.releaseHeight,m:o.m,A:o.area,Cd:0});
    console.log(JSON.stringify({s,v:sig(r.v),mach:sig(r.v/K.a0),range:sig(f.range),apex:sig(f.apex),landed:f.landed,esc:f.escaped,orbit:f.orbit,vImp:sig(f.vImpact),Eobj:sig(r.Eobj),dragLoss:sig(r.dragLoss),dragLossRatio:r0.dragLoss?sig(r.dragLoss/r0.dragLoss):null,oceanE:sig(f.oceanE),oceanP:sig(f.oceanP),pObj:sig(o.m*r.v),vacRange:sig(vac.range),vacApex:sig(vac.apex),numRange:sig(f._numRange),steps:f.steps,numSteps:f._numSteps,ms}));
  }
}
row(Math.log10(90718.474),'car',45);
row(Math.log10(90718.474),'baseball',45);
row(5,'baseball',30);
row(7,'car',45);
row(9,'car',45);
row(15,'car',45);
row(12,'baseball',45);
row(Math.log10(90718.474),'person',45);
