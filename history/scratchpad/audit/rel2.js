global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=(id)=>D.surfaces.find(s=>s.id==='concrete');
const mk=(kg)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:180}),surface:S(),groundHolds:false,anchor:'bolted'});
const obj=(id)=>D.objects.find(x=>x.id===id);
for (const [id,lk] of [['pyramid',30],['car',22]]) {
 const L=P.catchLeg(mk(10**lk),mk(10**lk),obj(id),10,'hard');
 const fb=L.fireball, c2=299792458**2;
 console.log(id,'Dfl',L.Dfl,'size',L.size,'E',fb.E.toExponential(3),'Egap',fb.Egap.toExponential(3),'Earr',fb.Earr.toExponential(3),'E/Egap',(fb.E/fb.Egap).toFixed(1),'E/EarthBind',(fb.E/2.49e32).toExponential(2));
 const g=P.catchGame(mk(10**lk),mk(10**lk),obj(id),10,'hard');
 console.log(' game a: Dfl',g.a.Dfl,'Egap',g.a.fireball&&g.a.fireball.Egap.toExponential(3));
}
