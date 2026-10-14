const {P,D,obj,rex,surf}=require('./env.js');
const K=P.K, M=P.RESTRAINT.MOVES.throw;
for (const [id,kg,ang] of [['car',22.1e3,45],['baseball',1.81436948e23,0],['bus',1e6,30],['car',1e6,45]]) {
  const o=obj(id);
  const c={F:kg*K.g,mode:'comic',body:rex(),surface:surf('concrete'),anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
  const r=P.throwObject(c,o,ang);
  const opt={obj:o,surface:c.surface,body:c.body,anchor:'friction',angle:ang,near:5,airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
  const land=M.landShake(r,opt), own=r.toGround?P.impulseSource(c.surface,r.toGround.J,Math.max(1e-9,r.toGround.T)):null;
  console.log(id,kg.toExponential(2),'landed',r.flight.landed,'shakeFrom',M.shakeFrom(r,opt),'ppv5 land',land?P.ppvAt(land,5).toExponential(2):'-','ppv5 him',own?P.ppvAt(own,5).toExponential(2):'-','plaster?',P.plasterOver(M.shake(r,opt),5));
}
