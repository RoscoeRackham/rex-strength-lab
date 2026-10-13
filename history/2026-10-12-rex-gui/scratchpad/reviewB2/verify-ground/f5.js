const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const obj=(id)=>D.objects.find(x=>x.id===id);
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const pw=Object.assign({},ON,{airAbsorb:0.5});
for (const [id,kgf,share,D0] of [['baseball',1e20,0.5,1000],['car',1e15,0.9,1000],['baseball',1e8,0.5,1000],['baseball',1e10,1,1000],['car',1e12,1,1e5]]) {
  const p=Object.assign({},ON,{airAbsorb:share});
  const cR=ctx(kgf,'concrete',p), cO=Object.assign(ctx(kgf,'concrete',p),{body:ollie});
  const L=P.catchLeg(cR,cO,obj(id),D0,'hard');
  const th=L.thetaDeg!=null?L.thetaDeg:0;
  const t=P.throwObject(cR,obj(id),th);
  console.log(id,kgf.toExponential(0),'share',share,'D',D0,'result',L.result,'vL',(L.vL||L.aim&&L.aim.vL||0).toExponential(3),'toGroundT',L.toGroundT?L.toGroundT.J.toExponential(3):'NONE','| Throw tab at th',th,'v',t.v.toExponential(3),'toGround J',t.toGround?t.toGround.J.toExponential(3):'-', 'plaster from Throw push', t.toGround?P.plasterReach(P.impulseSource(cR.surface,t.toGround.J,t.toGround.T)).toExponential(2):'-');
}
