const R=process.argv[2];
global.window={}; require(R+'/src/data.js'); const D=window.DINO_DATA; const P=require(R+'/src/engine.js');
const g=P.K.g, rex=P.makeBody({build:'rex',H:3.048,m:3007}), ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const ctxOf=(F,x)=>Object.assign({F,mode:'comic',body:rex,surface:D.surfaces.find(s=>s.id==='concrete'),anchor:'friction'},x||{});
const ob=D.objects.find(o=>o.id==='baseball');
for (const sh of [0.5,0.99,1]) {
  const cR=ctxOf(200e18*907.18474*g,Object.assign({},ON,{airAbsorb:sh,anchor:'bolted'})), L=P.catchLeg(cR,Object.assign({},cR,{body:ollie}),ob,1000,'hard');
  const E=P.throwObject(cR,ob,0).Eobj, Ein=L.sheath?E-L.sheath.E:E, pw=Math.sqrt(E*E+2*E*ob.m*P.K.c*P.K.c)/P.K.c;
  console.log(R.split('/').pop(),sh,'E rel err',(L.catch.Ecatch/Ein-1).toExponential(2),'J rel err',(L.toGroundC.J/pw-1).toExponential(2));
}
