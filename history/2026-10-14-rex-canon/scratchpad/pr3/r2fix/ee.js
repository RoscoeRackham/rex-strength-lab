const { P, D } = require('./load.js')(process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab');
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), person=D.objects.find(o=>o.id==='person');
const R=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex)), O=P.makeBody(Object.assign({build:'ollie'},P.DEFAULT_BODIES.ollie));
const Ee=(lk)=>{ const base={F:Math.pow(10,lk)*g,mode:'comic',surface:surf('concrete'),anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true,safePassenger:true};
 const L=P.catchLeg(Object.assign({body:R},base),Object.assign({body:O},base),person,Math.pow(10,4.5),'hard'); const E=L.hitsGround.E, m=person.m, c=P.K.c, p=Math.sqrt(E*E+2*E*m*c*c)/c; return {p, Ee:p*p/(2*P.K.M_E), v:p/P.K.M_E, res:L.result}; };
let lo=16, hi=34; for (let i=0;i<60;i++){ const mid=(lo+hi)/2; if (Ee(mid).Ee>4.184e6) hi=mid; else lo=mid; }
console.log('threshold logKg', hi.toFixed(3), (Math.pow(10,hi)).toExponential(2), JSON.stringify(Ee(hi)));
for (const lk of [16,24,30,32,34]) console.log(lk, JSON.stringify(Ee(lk)));
