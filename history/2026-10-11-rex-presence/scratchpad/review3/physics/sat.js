const {P,D,g,surf,obj,rex,ctxOf}=require('./ph.js');
const R=P.RESTRAINT;
for (const [oid, F, sid] of [['piano',1e8,'concrete'],['shot',1e8,'concrete'],['car',1e10,'concrete'],['piano',1e10,'granite'],['shot',1e10,'granite'],['bar511',1e10,'granite']]) {
  const c={F:F*g, mode:'real', body:rex, surface:surf(sid), groundHolds:false, anchor:'friction'};
  const M=R.MOVES.throw; const opt={obj:obj(oid),angle:45,target:30, near:5, surface:c.surface, body:rex, m:rex.m, groundHolds:false};
  console.log('==',oid,F,sid);
  for (let e=1; e<=Math.log10(F)+1e-9; e+=0.5){ const u=Math.pow(10,e)*g; const r=M.run(Object.assign({},c,{use:u}),opt);
    console.log(e.toFixed(1),'v',r.v.toPrecision(10),'grip',(r.gripRatio||0).toPrecision(4),'sink',(r.sinkRatio||0).toPrecision(4),'haz',R.HAZARDS.filter(h=>h.test(M,r,opt)).map(h=>h.id).join(','), r.basis||''); }
  const p=R.planNow('throw',c,opt);
  console.log('search:', R.HAZARDS.map(h=>{const x=p.result('hazard:'+h.id); return h.id+'='+(x.never?'never':(x.use/g).toExponential(2))}).join(' '), 'ceiling', JSON.stringify(p.ceiling()));
}
