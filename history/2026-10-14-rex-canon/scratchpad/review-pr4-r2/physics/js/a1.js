const {P,D,rex,ollie,ctx,show,fmt,DIAL,surf}=require('./h.js');
const K=P.K, AW=P.AW, g=K.g;
const keys=['outcome','winner','PA','PB','AA','AB','RA','RB','tableLat','tableBreaks','tableBreaksBy','padLoad','loserPadLoad','pin.v','pin.E','pin.M','loserSlides','winnerSlides','draggedA','draggedB','tearA','tearB','slamRatio'];
const aw=(label,a,b)=>{const r=P.armWrestle(ctx(Object.assign({body:rex()},a)),ctx(Object.assign({body:ollie()},b)));
 console.log(label+':', show(r,keys.filter(k=>k.split('.').reduce((x,y)=>x==null?x:x[y],r)!==undefined)));return r;};
const r1=aw('rex dial vs ollie 1t, keepForm off',{keepForm:false},{kg:1000,keepForm:false});
// loser elbow force standing with Rex's uncapped press
{ const Pw=r1.AA, Pl=r1.AB, ml=3000, a=(Pw-Pl)/(AW.effMass*6000); const C=Pl+AW.effMass*ml*a; console.log('standing: a',fmt(a),'C',fmt(C),'loser elbow',fmt(Math.abs(AW.holdArm*ml*a-C)),'loser footing',fmt(r1.RB)); }
aw('power off same',{keepForm:false,ownRecoil:false},{kg:1000,keepForm:false,ownRecoil:false});
aw('both dial keepForm off',{keepForm:false},{keepForm:false});
aw('default',{},{kg:1000});
// grid: standing pins (table broken), winner power on; loser elbow > loser footing but loserSlides false
let n=0, bad=0, ex=[];
for (const lg of [2.5,3,3.5,4,5,6,9,12,20]) for (const lo of [2,2.5,3,4,6,9]) for (const sid of ['sand','concrete','ice','granite','softclay']) for (const anc of ['friction','bolted']) for (const ub of [false,true]) {
  const x={keepForm:false, unbreakable:ub, surface:sid, anchor:anc};
  const r=P.armWrestle(ctx(Object.assign({body:rex(),kg:Math.pow(10,lg)},x)),ctx(Object.assign({body:ollie(),kg:Math.pow(10,lo)},x)));
  if (r.outcome!=='pin'||!r.tableBreaks||!isFinite(r.AA)||!isFinite(r.AB)) continue;
  n++;
  const aW=r.winner==='A', Aw=aW?r.AA:r.AB, Pl=aW?r.AB:r.AA, ml=3000, a=(Aw-Pl)/(AW.effMass*6000), C=Pl+AW.effMass*ml*a, el=Math.abs(AW.holdArm*ml*a-C), Rl=aW?r.RB:r.RA;
  if (anc==='friction' && el>Rl && !r.loserSlides) { bad++; if(ex.length<4) ex.push([lg,lo,sid,anc,ub,fmt(el),fmt(Rl),fmt(r.pin.v)].join(' ')); }
}
console.log('standing pins',n,' loser elbow > his footing but loserSlides false:',bad, ex);
