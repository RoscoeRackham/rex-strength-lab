const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const obj=(id)=>D.objects.find(x=>x.id===id);
const s=surf('concrete');
const strain=(src,d)=>{const r=Math.max(d,P.VIB.RMIN); return Math.max(P.ppvAt(src,d)/src.ground.cs, 0.75*src.F/(2*Math.PI*src.ground.rho*src.ground.cs*src.ground.cs*r*r));};
for (const kgf of [1e5,1e6,1e8]) {
  const r=P.throwObject(ctx(kgf,'concrete',ON),obj('car'),45);
  const src=P.impulseSource(s,r.toGround.J,Math.max(1e-9,r.toGround.T));
  console.log('car 45 deg',kgf.toExponential(0),'J',r.toGround.J.toExponential(2),'strain@5m',strain(src,5).toExponential(2),'nonlinear',P.ppvNonlinear(src,5),'plaster',P.plasterReach(src).toFixed(1),'VIB.STRAIN',P.VIB.STRAIN);
}
const allstarDial=1.8e23; const r=P.throwObject(ctx(allstarDial,'concrete',ON),obj('baseball'),0);
const src=P.impulseSource(s,r.toGround.J,Math.max(1e-9,r.toGround.T));
console.log('allstar level: J',r.toGround.J.toExponential(2),'strain@5m',strain(src,5).toExponential(2),'plaster',P.plasterReach(src),'nonlinear',P.ppvNonlinear(src,5));
