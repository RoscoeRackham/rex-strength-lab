global.window={};
const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D=window.DINO_DATA; const g=9.80665;
const surf=D.surfaces.find(s=>s.id==='concrete');
const ob=(id)=>D.objects.find(o=>o.id===id);
const mk=(kg,anchor)=>({F:kg*g,mode:'comic',body:P.makeBody({H:3.05,m:637}),surface:surf,groundHolds:false,anchor:anchor||'bolted'});
for (const [id,kg] of [['car',1e22],['pyramid',1e30]]) for (const Dd of [10,100,1000,5000,14500,30000]) {
  const L=P.catchLeg(mk(kg),mk(kg),ob(id),Dd,'hard');
  const fb=L.fireball; if(!fb){console.log(id,Dd,L.result);continue;}
  console.log(id,Dd,L.result,fb.kind,'E',fb.E.toExponential(3),'Egap',fb.Egap.toExponential(3),'Earr',fb.Earr.toExponential(3),'sweep',fb.sweep.toFixed(0),'blastE', (fb.kind==='before'?fb.E:fb.Egap).toExponential(3), 'r_windows', P.blastRadius(fb.kind==='before'?fb.E:fb.Egap, D.overpressure[0].Pa).toExponential(3), D.overpressure[0].label, 'p',fb.p.toExponential(3),'earthKE',(fb.p*fb.p/2/5.972e24).toExponential(3));
}
