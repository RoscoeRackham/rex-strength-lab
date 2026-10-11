global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:180}),surface:S,groundHolds:false,anchor:'bolted'});
const o=D.objects.find(x=>x.id==='car');
for (const Dd of [10,100,1000,13000,14500,20000,100000]) {
  const L=P.catchLeg(mk(1e22),mk(1e22),o,Dd,'hard'); const fb=L.fireball;
  const blastE = fb.kind==='before'? fb.E : fb.Egap;   // what app.html line 1998 feeds blastBlock
  console.log(String(Dd).padEnd(7), fb.kind.padEnd(8), 'E',fb.E.toExponential(2),'Egap',fb.Egap.toExponential(2),'Earr',fb.Earr.toExponential(2),'blast energy shown',blastE.toExponential(2), 'Windows-shatter radius km', (P.blastRadius(blastE, 6900)/1000).toFixed(0));
}
