const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const g=P.K.g;
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
for (const kgf of [9.07e4,1e5]) {
  const cA=Object.assign(ctx(kgf,'concrete',ON),{body:ollie}), cB=ctx(kgf,'concrete',ON,{anchor:'bolted'});
  const r=P.collide(cA,cB,{source:'sprint'});
  const s=cB.surface, lp=P.limbPulse(rex);
  const src=P.impulseSource(s,r.toGround.J,r.toGround.T), srcF=P.impulseSource(s,r.toGround.J,Math.max(lp,r.toGround.T));
  console.log('dial',kgf,'held',r.held,'how',r.toGround.how,'J',r.toGround.J.toExponential(3),'T ms',(r.toGround.T*1e3).toFixed(1),'limbPulse ms',(lp*1e3).toFixed(1),'plaster unfloored',P.plasterReach(src).toFixed(2),'floored',P.plasterReach(srcF).toFixed(2),'ppv5 mm/s',(P.ppvAt(src,5)*1e3).toFixed(1),(P.ppvAt(srcF,5)*1e3).toFixed(1));
}
// jump push-off T at 1e8 concrete
const j=P.jump(ctx(1e8,'concrete',ON)); const s=surf('concrete');
const a=P.impulseSource(s,j.pushOff.J,j.pushOff.T), b=P.impulseSource(s,j.pushOff.J,Math.max(P.limbPulse(rex),j.pushOff.T));
console.log('jump 1e8 concrete pushOff T ms',(j.pushOff.T*1e3).toFixed(2),'plaster',P.plasterReach(a).toFixed(1),'floored',P.plasterReach(b).toFixed(1));
// throw/punch T rule check
const t=P.throwObject(ctx(1e8,'concrete',ON),{id:'x',m:0.145,L:0.074,rho:700,Cd:0.35,A:0.0043},45);
const pu=P.punch(ctx(1e8,'concrete',ON));
console.log('throw toGround T ms',(t.toGround.T*1e3).toFixed(1),'push.t ms',(t.push.t*1e3).toFixed(3),'punch toGround T ms',(pu.toGround.T*1e3).toFixed(1),'push.t',(pu.push.t*1e3).toFixed(3));
