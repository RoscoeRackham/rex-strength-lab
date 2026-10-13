global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), obj=(id)=>D.objects.find(o=>o.id===id);
const rex=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex));
const ctx=(F,x)=>Object.assign({F,mode:'comic',body:rex,surface:surf('concrete'),groundHolds:false,anchor:'friction'},x||{});
for (const [id,lg] of [['car',7],['car',8],['car',9],['baseball',9],['baseball',12],['car',20]]) {
  const r=P.throwObject(ctx(Math.pow(10,lg)*g),obj(id),45), f=r.flight;
  const o=obj(id);
  console.log(id,lg,'v',r.v.toPrecision(4),'maxStagT',f.maxStagT&&f.maxStagT.toPrecision(4),'rel',f.relativistic,'escaped',f.escaped,'landed',f.landed,'rho0v2/crush',o.crush?(P.K.rho0*r.v*r.v/o.crush).toPrecision(3):'-','gripRatio',r.gripRatio&&r.gripRatio.toPrecision(3),'dragLoss',r.dragLoss&&r.dragLoss.toPrecision(3));
}
// keys in throwOnce output
const r=P.throwObject(ctx(90718*g),obj('car'),45); console.log(Object.keys(r).join(','));
