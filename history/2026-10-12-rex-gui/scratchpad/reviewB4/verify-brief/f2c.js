const {P,D,surf,rex,ollie,ctx}=require('./h.js');
const K=P.K;
const car=D.objects.find(o=>o.id==='car');
const sand=surf('sand');
for (const Dm of [1e4, 3e4, 1e5]) {
  const cR=ctx(1e9,{surface:sand}), cO=Object.assign(ctx(1e9,{surface:sand}),{body:ollie()});
  const L=P.catchLeg(cR,cO,car,Dm,'easy');
  if(!L){console.log('no leg');continue;}
  const vL=L.aim&&L.aim.vL, th=L.aim&&(L.aim.thetaDeg||L.aim.th||L.angleDeg);
  console.log('D',Dm,'result',L.result,'vL',vL&&vL.toFixed(1),'aim',JSON.stringify(Object.keys(L.aim||{})),'th',th,'toGroundT',JSON.stringify(L.toGroundT),'p',(car.m*vL).toExponential(3));
  // the Throw tab: find dial so that throwObject at th gives v = vL on sand
  const thD = L.aim.thetaDeg!=null?L.aim.thetaDeg:45;
  let lo=1, hi=1e12;
  for(let i=0;i<200;i++){const m=Math.sqrt(lo*hi); const r=P.throwObject(ctx(m,{surface:sand}),car,thD); if(r.canMove&&r.v>=vL) hi=m; else lo=m;}
  const r=P.throwObject(ctx(hi,{surface:sand}),car,thD);
  console.log('   Throw tab at dial',hi.toExponential(3),'v',r.v.toFixed(1),'th',thD,'toGround',JSON.stringify(r.toGround),'sinkRatioRaw',r.sinkRatioRaw);
}
