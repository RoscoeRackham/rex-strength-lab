const {P,D,g,ctx}=require('./eng.js');
let n=0,hits=[];
for (const o of D.objects) for (const lk of [8,10,12,14,16,18,20,24]) for (const D0 of [3,10,100,1000,1e4]) for (const st of ['hard','gentle','lob']) for (const air of [0,0.5]) {
  const F=Math.pow(10,lk)*g;
  let L; try { L=P.catchLeg(ctx('rex',0,{F,keepForm:false,airAbsorb:air,noKnockback:false}),ctx('ollie',0,{F,keepForm:false,airAbsorb:air,noKnockback:false}),o,D0,st);} catch(e){continue;}
  if (L.result==='fireball'){ n++; if (L.letsGo || L.fullStrength || (L.style==='hard' && L.aim) || L.aim) hits.push([o.id,lk,D0,st,air,!!L.letsGo,!!L.fullStrength,L.style,!!L.aim]); }
}
console.log('fireballs',n,'with chip-fallthrough conditions',hits.length); console.log(hits.slice(0,10));
