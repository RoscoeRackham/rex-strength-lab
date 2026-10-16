const { P, D } = require('./load.js')(process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab');
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), person=D.objects.find(o=>o.id==='person');
const R=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex)), O=P.makeBody(Object.assign({build:'ollie'},P.DEFAULT_BODIES.ollie));
for (const lk of [6,7,8,9]) for (const lD of [3,3.5,4]) for (const st of ['easy','hard']) for (const air of [1,0]) {
 const base={F:Math.pow(10,lk)*g,mode:'comic',surface:surf('concrete'),anchor:'friction',airAbsorb:air,keepForm:true,unbreakable:true,ownRecoil:true,safePassenger:true};
 const cR=Object.assign({body:R},base), L=P.catchLeg(cR,Object.assign({body:O},base),person,Math.pow(10,lD),st);
 if (!L.miss || L.miss.leaves) { console.log(lk,lD,st,air,L.result,'no miss'); continue; }
 const ma=P.catchMissAngle(L,person,cR), lg=P.PASSENGER.landGround(person,L.miss.vImpact,surf('concrete'),ma.angleDeg);
 console.log(lk,lD,st,air,L.result,'v',L.miss.vImpact.toFixed(2),'rebuilt',ma.vImpact.toFixed(2),'ang',ma.angleDeg.toFixed(2),'gives',lg.gives,(lg.push/lg.bear).toFixed(3),'past',L.miss.past.toFixed(1));
}
