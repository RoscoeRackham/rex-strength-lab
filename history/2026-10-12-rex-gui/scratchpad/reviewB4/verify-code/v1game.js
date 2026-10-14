const R='/home/user/rex-strength-lab/rex-strength-lab/';
global.window={}; require(R+'src/data.js'); const D=window.DINO_DATA; const P=require(R+'src/engine.js');
const sand=D.surfaces.find(s=>s.id==='sand');
const mk=(b)=>P.makeBody({build:b,H:3.048,m:3007});
const rex=mk('rex'), ollie=mk('ollie');
const ctx=(body,kg,extra)=>Object.assign({F:kg*P.K.g,mode:'comic',body,surface:sand,anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true},extra||{});
const o=D.objects.find(x=>x.id==='piano');
for (const style of ['easy','hard']) {
  const cR=ctx(rex,1e7), cO=ctx(ollie,1e7);
  const L=P.catchLeg(cR,cO,o,100,style);
  const src=(tg)=>tg?P.impulseSource(sand,tg.J,tg.T):null;
  console.log(style,L.result,'vL',L.aim&&L.aim.vL.toFixed(2),'th',L.aim&&L.aim.thetaDeg.toFixed(1),'p',(o.m*L.aim.vL).toFixed(0));
  console.log('  toGroundT',JSON.stringify(L.toGroundT),'plaster',src(L.toGroundT)&&P.plasterReach(src(L.toGroundT)).toFixed(1));
  console.log('  toGroundC',JSON.stringify(L.toGroundC),'plaster',src(L.toGroundC)&&P.plasterReach(src(L.toGroundC)).toFixed(1));
  const t=P.throwObject(Object.assign({},cR,{noFlight:true}),o,L.aim.thetaDeg); console.log('  throwObject at that angle full-strength: toGround',JSON.stringify(t.toGround),'sinkRatioRaw',t.sinkRatioRaw&&t.sinkRatioRaw.toFixed(1));
}
