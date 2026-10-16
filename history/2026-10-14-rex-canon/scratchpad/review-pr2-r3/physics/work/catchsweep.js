const {P,D,rex,ollie,ctx,surf}=require('./env.js');
const rows=[]; let bad=0, n=0; const res={};
const objs=['baseball','person','car','bus','semi','motorcycle'];
for (const mode of ['comic','real']) for (const sid of ['concrete','ice','softclay','sand']) for (const style of ['easy','hard']) for (const [kgR,kgO] of [[90718.474,90718.474],[90718.474,1000],[1e6,3000],[1e9,1e9],[1e5,500]]) for (const oid of objs) for (const Dd of [3,10,100]) for (const keepForm of [true,false]) {
  const cR=ctx({mode,surf:sid,kg:kgR,keepForm}), cO=Object.assign(ctx({mode,surf:sid,kg:kgO,keepForm}),{body:ollie});
  const o=D.objects.find(x=>x.id===oid);
  const L=P.catchLeg(cR,cO,o,Dd,style); n++;
  if(!L) continue;
  res[L.result]=(res[L.result]||0)+1;
  const issues=[];
  if (L.toGroundT||L.toGroundC) issues.push('toGround');
  const reach=['caught','slams','wreckage','cant-hold-it'].includes(L.result);
  if (reach && !L.recoilAbsorbedC) issues.push('no rAC');
  if (reach && L.catch && (L.catch.uAfter>0||L.catch.slide>0||L.catch.carried)) issues.push('moves');
  if (reach && L.recoilAbsorbedC && !L.catch.relativistic) { const p=P.vToMomentum(L.vArrive,o.m); if (Math.abs(L.recoilAbsorbedC.J-p)>1e-9*p) issues.push('rAC '+L.recoilAbsorbedC.J+' vs '+p); }
  if (L.recoilAbsorbedC && !(L.recoilAbsorbedC.J>=0)) issues.push('rAC NaN/neg');
  if (L.recoilAbsorbedT && !(L.recoilAbsorbedT.J>=0)) issues.push('rAT NaN/neg');
  if (reach && L.catch && L.catch.sinkRatioRaw!=null && !L.catch.relativistic) { const want=(ollie.m+o.m)*P.K.g/P.anchorCapacity({body:ollie,surface:surf(sid),theta:0,anchor:'friction'}).Nmax; if (Math.abs(L.catch.sinkRatioRaw-want)>1e-9*want) issues.push('sinkRaw'); }
  if (L.recoil && (L.recoil.v>0||L.recoil.slide>0)) issues.push('thrower moves');
  if (issues.length){bad++; if(rows.length<15) rows.push([mode,sid,style,kgR,kgO,oid,Dd,keepForm,L.result,issues.join('; ')].join(' '));}
}
console.log('n',n,'bad',bad,JSON.stringify(res)); console.log(rows.join('\n'));
