const {P,g,surf,obj,rex}=require('./ph.js');
const R=P.RESTRAINT;
for (const mode of ['comic','real']) for (const sid of ['concrete','sand','granite']) for (const F of [9.07e4,1e7,1e9]) {
  const c={F:F*g,mode,body:rex,surface:surf(sid),groundHolds:false,anchor:'friction'};
  const p=R.planNow('stomp',c,{}); const ce=p.ceiling(); const u=ce.by?ce.below:undefined; const r=p.run(u);
  // landing of the launched body, judged like the jump's landing
  const vB=r.vBody, apex=r.bodyFlight.apex||0, vL=r.bodyFlight.vImpact||0;
  const jr = vL>0 ? P.jump(Object.assign({},c,{use:undefined})) : null;
  // build the jump landing shake for landing speed vL
  const d=rex.strokes.leg, T=2*d/Math.max(vL,1e-9);
  const src = vL>0 ? [P.vibSource(c.surface,'hann',2*rex.m*vL/T,T)] : null;
  const ppv5 = src ? P.ppvAt(src,5) : 0;
  const landF = rex.m*vL*vL/(2*d)+rex.m*g, ratio = landF/(P.qultFor(c.surface,rex.footB)*2*rex.footArea);
  console.log(mode,sid,F.toExponential(1),'ceiling',ce.by,u?(u/g).toExponential(2):'all-out','vBody',vB.toFixed(2),'apex',apex.toFixed(2),'lands at',vL.toFixed(2),'landing ppv5 mm/s',(ppv5*1e3).toFixed(1),'landing ratio',ratio.toFixed(2));
}
