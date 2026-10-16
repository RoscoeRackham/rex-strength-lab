const { P, D } = require('./load.js')(process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab');
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id);
const R=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex)), O=P.makeBody(Object.assign({build:'ollie'},P.DEFAULT_BODIES.ollie));
for (const oid of ['person','car','baseball']) for (const lk of [9]) { const o=D.objects.find(x=>x.id===oid);
 const base={F:Math.pow(10,lk)*g,mode:'comic',surface:surf('concrete'),anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true,safePassenger:true};
 const cR=Object.assign({body:R},base), L=P.catchLeg(cR,Object.assign({body:O},base),o,1e4,'hard');
 const fm=P.flyTo({v0:L.aim.vE,thetaDeg:L.aim.thetaDeg,h0:L.h0,hStop:0,m:o.m,A:o.area,Cd:o.Cd,CdSup:o.CdSup,Rn:Math.sqrt(o.area/Math.PI)});
 console.log(oid, L.result, JSON.stringify(L.aim), JSON.stringify(L.miss), 'flight', JSON.stringify({landed:fm.landed, orbit:fm.orbit, escaped:fm.escaped, timedOut:fm.timedOut, vImpact:fm.vImpact, range:fm.range}));
}
