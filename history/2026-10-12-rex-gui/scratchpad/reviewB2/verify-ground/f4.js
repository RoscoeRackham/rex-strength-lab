const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const R=P.RESTRAINT,M=R.MOVES,g=P.K.g;
const obj=(id)=>D.objects.find(x=>x.id===id);
const s=surf('concrete');
for (const [id,kgf] of [['baseball',9.07e4],['car',9.07e4],['baseball',1e8]]) {
  const c=ctx(kgf,'concrete',ON); const r=P.throwObject(c,obj(id),45);
  const pObj=P.vToMomentum(r.v,obj(id).m);
  const srcJ=P.impulseSource(s,r.toGround.J,r.toGround.T), srcObj=P.impulseSource(s,pObj,r.toGround.T);
  console.log(id,kgf,'armMass',r.armMass.toFixed(1),'obj m',obj(id).m,'v',r.v.toFixed(1),'toGround J',r.toGround.J.toExponential(3),'pObj',pObj.toExponential(3),'ratio',(r.toGround.J/pObj).toFixed(1),'T ms',(r.toGround.T*1e3).toFixed(1),'push.t ms',(r.push.t*1e3).toFixed(2),'pA',r.push.pA,'recoilV',r.recoilV,'plaster J',P.plasterReach(srcJ).toFixed(1),'plaster pObj',P.plasterReach(srcObj).toFixed(1));
}
const pu=P.punch(ctx(1e8,'concrete',ON)); const sp=P.impulseSource(s,pu.toGround.J,pu.toGround.T);
console.log('punch 1e8: J',pu.toGround.J.toExponential(3),'fist eff',rex.handEff,'vFist',pu.vFist.toFixed(0),'T ms',(pu.toGround.T*1e3).toFixed(1),'push.t ms',(pu.push.t*1e3).toFixed(2),'plaster',P.plasterReach(sp).toFixed(1));
// presets at dial 1e9 kg, punch, on vs off
for (const pw of [ON,OFF]) { const p=R.planNow('punch',ctx(1e9,'concrete',pw),{target:1}); console.log(pw===ON?'ON':'OFF','punch presets',p.presets().map(x=>x.id+':'+(x.never?'never':(x.use/g).toExponential(3))).join(' ')); }
