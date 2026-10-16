const {P,D,g,ctx}=require('./eng.js');
const o=D.objects.find(x=>x.id==='baseball'), F=1e14*g;
for (const Dd of [10,1000]) {
const L=P.catchLeg(ctx('rex',0,{F,keepForm:false,airAbsorb:0.5}),ctx('ollie',0,{F,keepForm:false,airAbsorb:0.5}),o,Dd,'hard');
const f=L.fireball; console.log(Dd, L.result, f.kind, 'E',f.E,'Ehere',f.Ehere,'Egap',f.Egap,'Earr',f.Earr,'Eblast',f.Eblast,'kn',JSON.stringify(f.knockAbsorbed));
}
