const { P, D } = require('./load.js')(process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab');
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), person=D.objects.find(o=>o.id==='person');
const R=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex)), O=P.makeBody(Object.assign({build:'ollie'},P.DEFAULT_BODIES.ollie));
for (const [lk, air] of [[16,1],[16,0.999],[16,0.99],[16,0.9],[34,1],[32,1],[22.5,1],[Infinity,1]]) {
 const base={F:isFinite(lk)?Math.pow(10,lk)*g:Infinity,mode:'comic',surface:surf('concrete'),anchor:'friction',airAbsorb:air,keepForm:true,unbreakable:true,ownRecoil:true,safePassenger:true};
 const L=P.catchLeg(Object.assign({body:R},base),Object.assign({body:O},base),person,Math.pow(10,4.5),'hard');
 const hg=L.hitsGround; console.log(lk, air, L.result, hg && hg.E.toExponential(4), hg&&hg.airHeat, hg&&hg.own&&JSON.stringify({share:hg.own.E/hg.E, rest:hg.own.rest, crater:hg.own.crater, q:hg.own.quake}), JSON.stringify(P.catchMissAngle(L, person, Object.assign({body:R},base))));
}
