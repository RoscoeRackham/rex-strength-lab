const ROOT='/home/user/rex-strength-lab/rex-strength-lab';
global.window={}; require(ROOT+'/src/data.js'); const D=window.DINO_DATA;
const P=require(ROOT+'/src/engine.js');
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const surf=(id)=>D.surfaces.find(s=>s.id===id);
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const OFF={airAbsorb:0,keepForm:false,unbreakable:false,ownRecoil:false};
function ctx(kgf,sid,pw,extra){return Object.assign({F:kgf*P.K.g,mode:'comic',body:rex,surface:surf(sid),anchor:'friction'},pw||ON,extra||{});}
module.exports={P,D,rex,surf,ON,OFF,ctx};
