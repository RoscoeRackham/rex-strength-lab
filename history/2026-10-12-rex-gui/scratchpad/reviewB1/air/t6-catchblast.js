const {P,D,obj,rex,surf}=require('./env.js');
const K=P.K;
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
for (const [id,kg,Dd] of [['car',1e7,2000],['car',1e8,1000],['baseball',1e5,1000],['shot',1e6,500]]) for (const share of [0,0.5,0.9]) {
  const o=obj(id);
  const mk=(b)=>({F:kg*K.g,mode:'comic',body:b,surface:surf('concrete'),anchor:'friction',airAbsorb:share,keepForm:true,unbreakable:true,ownRecoil:true});
  const L=P.catchLeg(mk(rex()),mk(ollie),o,Dd,'hard');
  if(!L.aim){console.log(id,kg,Dd,share,L.result);continue;}
  const E0=0.5*o.m*L.aim.vL**2;
  const r=P.throwObject(mk(rex()),o,L.aim.thetaDeg);
  const M=P.RESTRAINT.MOVES.throw; const opt={obj:o,surface:surf('concrete'),body:rex(),anchor:'friction',angle:L.aim.thetaDeg,near:5,airAbsorb:share,keepForm:true,unbreakable:true,ownRecoil:true};
  console.log(id,kg,Dd,'share',share,L.result,'vL',L.aim.vL.toFixed(0),'th',L.aim.thetaDeg.toFixed(2),'E0',E0.toExponential(2),'catch drag.E',L.drag.E.toExponential(2),'(/E0 '+(L.drag.E/E0).toFixed(2)+')','nearT',L.drag.nearT.toExponential(2),'| solo blast',M.blast(r,opt).toExponential(2),'(/Eobj '+(M.blast(r,opt)/r.Eobj).toFixed(2)+')');
}
