const R='/home/user/rex-strength-lab/rex-strength-lab/';
global.window={}; require(R+'src/data.js'); const D=window.DINO_DATA; const P=require(R+'src/engine.js');
const sand=D.surfaces.find(s=>s.id==='sand');
const mk=(b)=>P.makeBody({build:b,H:3.048,m:3007});
const rex=mk('rex'), ollie=mk('ollie');
const ctx=(body,kg,extra)=>Object.assign({F:kg*P.K.g,mode:'comic',body,surface:sand,anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true},extra||{});
for (const kg of [1e7]) for (const h of [1000]) for (const style of ['easy','hard']) {
  const cR=ctx(rex,kg), t=P.tossPartner(cR, ollie, 'Ollie', style, h, 'friction');
  const src=(tg)=>tg?P.impulseSource(sand,tg.J,tg.T):null;
  console.log(style,'result',t.result,'v',t.v&&t.v.toFixed(1),'rise',t.rise&&t.rise.toFixed(0),'vImpact',t.flight&&t.flight.vImpact.toFixed(1));
  console.log('  toGroundT',JSON.stringify(t.toGroundT),'plaster m',src(t.toGroundT)&&P.plasterReach(src(t.toGroundT)).toFixed(1));
  console.log('  toGroundC',JSON.stringify(t.toGroundC),'plaster m',src(t.toGroundC)&&P.plasterReach(src(t.toGroundC)).toFixed(1));
  if (t.toGroundT) { const F=t.toGroundT.J/t.toGroundT.T; const bear=sand.qult*2*rex.footArea; console.log('  mean push N',F.toExponential(3),'sand bears (2 feet) N',bear.toExponential(3),'weight N',(rex.m+ollie.m)*P.K.g, 'ratio',(F/bear).toFixed(1)); }
  if (style==='hard') { const th=P.throwObject(cR, t.obj, 90); console.log('  throwObject toGround',JSON.stringify(th.toGround),'sinkRatioRaw',th.sinkRatioRaw); }
  console.log('  momentum m*v', (ollie.m*(t.v||0)).toFixed(0));
}
