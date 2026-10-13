const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const M=P.RESTRAINT.MOVES;
for (const sid of ['concrete','granite','sand']) for (const kgf of [1e4,1e5,2e5,1e6,1e7,1e8]) {
  const c=ctx(kgf,sid,ON), r=P.jump(c), s=c.surface; const o={surface:s,body:rex,m:rex.m,unbreakable:true};
  if(!(r.v>0)) continue;
  const J=P.vToMomentum(r.v,rex.m); const po=P.impulseSource(s,J,r.push.t);
  const counted=M.jump.shake(r,o);
  console.log(sid,kgf.toExponential(0),'overLimitReal',r.overLimitReal,'v',r.v.toFixed(1),'vLand',r.landing.v.toFixed(1),'push.t ms',(r.push.t*1e3).toFixed(1),'pushoff ppv5',P.ppvAt(po,5).toExponential(2),'counted ppv5',P.ppvAt(counted,5).toExponential(2),'pushoff plaster',P.plasterReach(po).toFixed(1),'counted plaster',P.plasterReach(counted).toFixed(1));
}
