const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const strain=(src,d)=>{const r=Math.max(d,P.VIB.RMIN); return Math.max(P.ppvAt(src,d)/src.ground.cs, 0.75*src.F/(2*Math.PI*src.ground.rho*src.ground.cs*src.ground.cs*r*r));};
for (const kgf of [9.07e4,1e10]) {
const cA=Object.assign(ctx(kgf,'concrete',ON),{body:ollie}), cB=ctx(kgf,'concrete',ON,{anchor:'bolted'});
for (const src of ['sprint','jump','stomp']) { const r=P.collide(cA,cB,{source:src}); if(!r.toGround){console.log(kgf,src,'none',r.outcome);continue;} const s=P.impulseSource(cB.surface,r.toGround.J,r.toGround.T); console.log(kgf,src,r.outcome,'strain@5',strain(s,5).toExponential(2),'plaster',P.plasterReach(s).toFixed(1)); }
}
