const R='/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R+'src/engine.js'); global.window = {}; require(R+'src/data.js'); const D = window.DINO_DATA;
const surf=(id)=>D.surfaces.find(s=>s.id===id);
const rex=()=>P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie=()=>P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const ctx=(kg, o={})=>Object.assign({F: kg*P.K.g, mode:'comic', body: rex(), surface: surf('concrete'), anchor:'friction', airAbsorb:1, keepForm:true, unbreakable:true, ownRecoil:true}, o);
module.exports={P,D,surf,rex,ollie,ctx};
