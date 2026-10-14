const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const R=P.RESTRAINT,M=R.MOVES,g=P.K.g;
const obj=(id)=>D.objects.find(x=>x.id===id);
const s=surf('concrete');
const c=ctx(9.07e4,'concrete',ON); const r=P.throwObject(c,obj('baseball'),45);
const o=Object.assign({near:5,body:rex,surface:s,obj:obj('baseball'),angle:45,m:rex.m},ON);
console.log('reach with engine J',JSON.stringify(R.reach('throw',r,o)));
const pObj=P.vToMomentum(r.v,obj('baseball').m);
const r2=Object.assign({},r,{toGround:{J:pObj,T:r.toGround.T}});
console.log('reach with pObj',JSON.stringify(R.reach('throw',r2,o)));
// punch reach and ceiling
const pc=R.planNow('punch',ctx(1e9,'concrete',ON),{target:1}); console.log('punch ceiling ON',pc.ceiling().by,(pc.ceiling().use/g).toExponential(3), pc.hazards().map(x=>x.id+':'+(x.never?'never':(x.use/g).toExponential(2))).join(' '));
