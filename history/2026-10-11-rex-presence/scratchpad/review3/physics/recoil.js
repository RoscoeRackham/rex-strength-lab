const {P,g,surf,obj,rex}=require('./ph.js');
const out=[];
for (const mode of ['comic','real']) for (const sid of ['concrete','sand','ice']) for (const F of [1e5,1e7,1e9]) for (const oid of ['car','bus','semi','tank','loco','piano','eiffel']) {
  const c={F:F*g,mode,body:rex,surface:surf(sid),groundHolds:false,anchor:'friction'};
  const p=P.RESTRAINT.planNow('throw',c,{obj:obj(oid),angle:45,target:30});
  const ce=p.ceiling(); const top = ce.by ? ce.below : p.hi;
  let worst=0, at=0;
  for (let k=0;k<=60;k++){ const u=p.lo*Math.pow(top/p.lo,k/60); const r=p.run(u); if(!r.canMove) continue; const s=r.recoilV*r.recoilV/(2*c.surface.mu*g)+(r.push&&r.push.xA||0); if(s>worst){worst=s;at=u;} }
  if (worst>5) out.push([mode,sid,F,oid,'ceiling',ce.by,(top/g).toExponential(2),'max recoil slide below ceiling',worst.toFixed(1)+' m at '+(at/g).toExponential(2)+' kg'].join(' '));
}
console.log(out.join('\n')||'none');
