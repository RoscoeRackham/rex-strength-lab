const R=process.argv[2];
global.window={}; require(R+'/src/data.js'); const D=window.DINO_DATA; const P=require(R+'/src/engine.js');
const g=P.K.g, rex=P.makeBody({build:'rex',H:3.048,m:3007}), ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const ctxOf=(F,x)=>Object.assign({F,mode:'comic',body:rex,surface:D.surfaces.find(s=>s.id==='concrete'),anchor:'friction'},x||{});
const ob=D.objects.find(o=>o.id==='baseball');
for (const sh of [0.5,0.99,0.9999]) for (const dial of [200e18*907.18474, 1e16]) {
  const cR=ctxOf(dial*g,Object.assign({},ON,{airAbsorb:sh,anchor:'bolted'})), L=P.catchLeg(cR,Object.assign({},cR,{body:ollie}),ob,1000,'hard');
  const E=P.throwObject(cR,ob,0).Eobj, Ein=L.sheath?E-L.sheath.E:E;
  console.log(R.split('/').pop(),'share',sh,'dial',dial.toExponential(2),L.result,'sheath share',L.sheath&&L.sheath.share.toExponential(3),'Ecatch/Ein-1',L.catch&&(L.catch.Ecatch/Ein-1).toExponential(3));
}
