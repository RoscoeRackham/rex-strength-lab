const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
for (const kgf of [1e5,1e6,1e7]) {
  const cA=Object.assign(ctx(kgf,'concrete',ON),{body:ollie}), cB=ctx(kgf,'concrete',ON,{anchor:'bolted'});
  const r=P.collide(cA,cB,{source:'sprint'}); if(!r.toGround){console.log(kgf,'no toGround',r.outcome);continue;}
  const s=cB.surface, lp=P.limbPulse(rex);
  const a=P.impulseSource(s,r.toGround.J,r.toGround.T), b=P.impulseSource(s,r.toGround.J,Math.max(lp,r.toGround.T));
  console.log(kgf.toExponential(0),r.outcome,r.toGround.how,'T ms',(r.toGround.T*1e3).toFixed(1),'plaster',P.plasterReach(a).toFixed(1),'floored',P.plasterReach(b).toFixed(1));
}
