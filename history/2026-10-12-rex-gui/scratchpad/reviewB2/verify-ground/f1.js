const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const R=P.RESTRAINT;
for (const sid of ['sand','gravel','softclay','concrete']) for (const kgf of [3000,1e5,1e6,1e7,1e8,1e9]) {
  const c=ctx(kgf,sid,ON); const r=P.stomp(c);
  const o={near:5,body:rex,surface:c.surface,unbreakable:true,ownRecoil:true,m:rex.m};
  const bl=R.MOVES.stomp.blast(r,o);
  console.log(sid,kgf.toExponential(0),'vFoot',r.vFoot.toFixed(1),'E',r.E.toExponential(2),'hole',r.holeDepth.toFixed(3),'realHole',(r.realHole||0).toFixed(3),'crater',r.crater,'realBreaks',r.realBreaks,'absorbed',(r.absorbed||0).toExponential(2),'blast',bl.toExponential(2),'blastR6900',P.blastRadius(bl,6900).toFixed(1));
}
