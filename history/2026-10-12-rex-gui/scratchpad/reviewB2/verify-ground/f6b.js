const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const obj=(id)=>D.objects.find(x=>x.id===id);
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const strain=(src,d)=>{const r=Math.max(d,P.VIB.RMIN); return Math.max(P.ppvAt(src,d)/src.ground.cs, 0.75*src.F/(2*Math.PI*src.ground.rho*src.ground.cs*src.ground.cs*r*r));};
for (const kgf of [1e8,1e10]) {
  const cR=ctx(kgf,'concrete',ON), cO=Object.assign(ctx(kgf,'concrete',ON),{body:ollie});
  const L=P.catchLeg(cR,cO,obj('baseball'),10,'hard');
  if(!L.toGroundT){console.log(kgf,L.result,'none');continue;}
  const src=P.impulseSource(cR.surface,L.toGroundT.J,L.toGroundT.T);
  console.log('catch baseball 10 m hard',kgf.toExponential(0),L.result,'J',L.toGroundT.J.toExponential(2),'strain@5',strain(src,5).toExponential(2),'nonlinear',P.ppvNonlinear(src,5),'plaster',P.plasterReach(src).toFixed(1));
}
