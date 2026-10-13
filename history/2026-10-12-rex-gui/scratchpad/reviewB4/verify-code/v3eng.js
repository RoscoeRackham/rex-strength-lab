const R='/home/user/rex-strength-lab/rex-strength-lab';
global.window={}; require(R+'/src/data.js'); const D=window.DINO_DATA; const P=require(R+'/src/engine.js');
const g=P.K.g, rex=P.makeBody({build:'rex',H:3.048,m:3007}), ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const sf=D.surfaces.find(s=>s.id==='concrete');
const cA={F:Math.pow(10,6.25)*0.036*g,mode:'comic',body:ollie,surface:sf,anchor:'friction',airAbsorb:1,keepForm:true,ownRecoil:true,unbreakable:false};
const cB=Object.assign({},cA,{body:rex});
const r1=P.collide(cA,cB,{source:'jump',toGround:true}), r0=P.collide(cA,cB,{source:'jump'});
console.log('with toGround:true ->',JSON.stringify(r1.toGround),' without ->',JSON.stringify(r0.toGround), 'held',r1.held);
