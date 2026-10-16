const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/copy/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const g=P.K.g;
const body=(b)=>P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] });
const surf=(id)=>D.surfaces.find(s=>s.id===id);
const ctx=(b,kg,o)=>Object.assign({F:kg*g,mode:'comic',body:body(b),surface:surf('concrete'),anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true,safePassenger:true,noKnockback:true},o||{});
module.exports={P,D,g,body,surf,ctx};
