const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB4/verify-code/fix1/';
global.window={}; require(R+'src/data.js'); const D=window.DINO_DATA; const P=require(R+'src/engine.js');
const mk=(b)=>P.makeBody({build:b,H:3.048,m:3007});
const rex=mk('rex'), ollie=mk('ollie');
for (const sid of ['sand','gravel','softclay','concrete','granite']) for (const lg of [5,6,7]) for (const h of [3,30,1000]) {
  const sf=D.surfaces.find(s=>s.id===sid);
  const cR={F:Math.pow(10,lg)*P.K.g,mode:'comic',body:rex,surface:sf,anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
  const e=P.tossPartner(cR,ollie,'Ollie','easy',h,'friction'), hd=P.tossPartner(cR,ollie,'Ollie','hard',h,'friction');
  if (!e.toGroundT) { console.log(sid,lg,h,'easy',e.result); continue; }
  const pl=(tg)=>tg?P.plasterReach(P.impulseSource(sf,tg.J,tg.T)):NaN;
  // steady push foot load ratio, rough: F0 = m v^2/(2d)+mg, over bearing ~ catch.sinkRatioRaw scaled
  console.log(sid,'1e'+lg,'h',h,'easy v',e.v.toFixed(1),'J',e.toGroundT.J.toFixed(0),'plaster',pl(e.toGroundT).toFixed(1),'catch sinkRaw',e.catch&&e.catch.sinkRatioRaw.toFixed(1),'| hard v',hd.v&&hd.v.toFixed(0),'J',hd.toGroundT&&hd.toGroundT.J.toFixed(0),'plaster',pl(hd.toGroundT).toFixed(1));
}
