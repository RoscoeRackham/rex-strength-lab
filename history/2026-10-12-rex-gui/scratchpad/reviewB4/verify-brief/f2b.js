const {P,D,surf,rex,ollie,ctx}=require('./h.js');
const K=P.K;
const car=D.objects.find(o=>o.id==='car');
const c=ctx(1e11); const r=P.throwObject(c,car,90);
console.log('qultFor exported?', typeof P.qultFor);
const body=c.body; const W=body.m*K.g;
// bearing per engine
let bear;
if (typeof P.qultFor==='function') bear=P.qultFor(c.surface, body.footB)*2*body.footArea;
console.log('bear',bear&&bear.toExponential(4),'W',W.toFixed(0), 'footB',body.footB,'footArea',body.footArea);
const T=r.toGround.T;
const Jalt=(bear-W)*T; const src=P.impulseSource(c.surface,Jalt,T);
console.log('(RB-W)T',Jalt.toFixed(0),'ppv5',(P.ppvAt(src,5)*1000).toFixed(2),'mm/s plaster@5',P.plasterOver(src,5));
// plaster reach
for (const d of [5,6,7,8,9]) console.log(' d',d,'plaster',P.plasterOver(src,d));
// pairing with push.t
const Jp=bear*r.push.t; const s2=P.impulseSource(c.surface,Jp,r.push.t);
console.log('bear*push.t',Jp.toFixed(0),'ppv5',(P.ppvAt(s2,5)*1000).toFixed(1),'plaster@5',P.plasterOver(s2,5));
// what force does the ground get in the hybrid
console.log('hybrid ground force J/T N', (r.toGround.J/T).toFixed(0), 'vs bear', bear);
// effort hazards: is there plaster in all-out hazards? Check RESTRAINT plan for throw
