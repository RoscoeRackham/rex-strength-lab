const {P,D,obj,rex,surf}=require('./env.js');
const K=P.K;
const o=obj('baseball');
for (const share of [0,0.5,0.9,0.99,1]) for (const keep of [false,true]) {
  const ctx={F:1.81436948e23*K.g,mode:'comic',body:rex(),surface:surf('concrete'),anchor:'friction',airAbsorb:share,keepForm:keep,unbreakable:false,ownRecoil:false};
  const r=P.throwObject(ctx,o,0);
  const fa=P.fastAir(o,r.Eobj,0,1-share);
  const b=P.RESTRAINT.MOVES?null:null;
  console.log('share',share,'keep',keep,'v/c',r.v/K.c,'gamma-1',(r.Eobj/(o.m*K.c*K.c)).toExponential(3),'E',r.Eobj.toExponential(3),'x',fa.x.toExponential(3),'E0/E',(fa.E0/r.Eobj).toFixed(4),'Ek/E',(fa.E/r.Eobj).toFixed(4),'ratio',(fa.E/fa.E0).toFixed(4),'punchesOut',fa.punchesOut,'line',JSON.stringify(r.line));
}
