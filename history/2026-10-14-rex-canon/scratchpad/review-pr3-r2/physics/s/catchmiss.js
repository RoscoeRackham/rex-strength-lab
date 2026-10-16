const {P,D,body,surf,obj}=require('./env.js'); const K=P.K,g=K.g;
const person=obj('person');
function run(logKg, logD, air, style){
  const base={mode:'comic',surface:surf('concrete'),anchor:'friction',airAbsorb:air,keepForm:true,unbreakable:true,ownRecoil:true,safePassenger:true,silentStrike:false,softLanding:false};
  const cR=Object.assign({F:Math.pow(10,logKg)*g,body:P.makeBody({build:'rex',...P.DEFAULT_BODIES.rex})},base);
  const cO=Object.assign({F:Math.pow(10,logKg)*g,body:P.makeBody({build:'ollie',...P.DEFAULT_BODIES.ollie})},base);
  const Dd=Math.pow(10,logD);
  const a=P.catchLeg(cR,cO,person,Dd,style);
  const m=a.miss;
  let ang=null, fm=null;
  if (m && !m.hits && !m.leaves){ fm=P.flyTo({v0:a.aim.vE,thetaDeg:a.aim.thetaDeg,h0:cR.body.releaseHeight,hStop:0,m:person.m,A:person.area,Cd:person.Cd,CdSup:person.CdSup,dragK:1-air}); ang=fm.impactAngleDeg; }
  const lg=m? P.PASSENGER.landGround(person,m.vImpact,surf('concrete')):null;
  const vn = m && ang!=null ? m.vImpact*Math.sin(ang*Math.PI/180):null;
  const L=Math.cbrt(6*person.m/(Math.PI*person.rho));
  console.log(JSON.stringify({logKg,logD,air,style,result:a.result,aimTh:a.aim&&a.aim.thetaDeg,vE:a.aim&&a.aim.vE,miss:m&&{v:m.vImpact,E:m.E,past:m.past,hits:m.hits}, check:fm&&{v:fm.vImpact,ang}, gives:lg&&lg.gives, ratio:lg&&lg.push/lg.bear, vNormal:vn, normalPushOverBear: vn!=null? (person.m*vn*m.vImpact/L)/lg.bear:null}));
}
run(8,2,0,'hard'); run(8,1,0,'hard'); run(Math.log10(100*907.18474),1,1,'hard'); run(Math.log10(100*907.18474),1,0,'hard'); run(6,2,1,'hard'); run(7,2,1,'hard'); run(7,1,1,'easy');
