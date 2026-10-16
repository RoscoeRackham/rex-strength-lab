const {P,D,rex,ollie,ctx,surf}=require('./env.js');
const rows=[]; let bad=0;
for (const mode of ['comic','real']) for (const sid of ['concrete','ice','softclay','sand']) for (const style of ['easy','hard']) for (const kg of [90718.474,1e6,1e9]) for (const h of [3, 10, 1000]) {
  const c=ctx({mode,surf:sid,kg});
  const t=P.tossPartner(c, ollie, 'Ollie', style, h, 'friction');
  const pv=(v,m)=>v>0?P.vToMomentum(v,m):0;
  const pT=t.v>0?pv(t.v,ollie.m):0;
  const rt=t.recoilAbsorbedT?t.recoilAbsorbedT.J:null, rc=t.recoilAbsorbedC?t.recoilAbsorbedC.J:null;
  const pIn=t.catch&&t.flight?pv(t.flight.vImpact,ollie.m):null;
  const issues=[];
  if (t.v>0 && !(rt!=null && Math.abs(rt-pT)<=1e-6*pT)) issues.push('T '+rt+' vs '+pT);
  if (t.catch && !(rc!=null && Math.abs(rc-pIn)<=1e-6*pIn)) issues.push('C '+rc+' vs '+pIn);
  if (t.toGroundT||t.toGroundC) issues.push('toGround');
  if (t.catch && (t.catch.uAfter>0||t.catch.slide>0||t.catch.carried)) issues.push('catcher moves');
  if (t.catch && t.catch.sinkRatioRaw!=null) { const want=(rex.m+ollie.m)*P.K.g/(P.anchorCapacity({body:rex,surface:surf(sid),theta:0,anchor:'friction'}).Nmax); if (Math.abs(t.catch.sinkRatioRaw-want)>1e-9*want) issues.push('sinkRaw '+t.catch.sinkRatioRaw+' vs '+want); }
  if (issues.length){bad++; rows.push([mode,sid,style,kg,h,t.result,t.v&&t.v.toFixed(2),issues.join('; ')].join(' '));}
}
console.log('bad',bad); console.log(rows.slice(0,20).join('\n'));
