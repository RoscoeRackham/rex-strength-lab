const {P,ctx,rex,ollie,fmt}=require('./h.js');
const AW=P.AW;
let n=0, miss=0, extra=0, ex1=[], ex2=[];
for (const lg of [2.5,3,3.5,4,5,6,9,12,20]) for (const lo of [2,2.5,3,4,6,9]) for (const sid of ['sand','concrete','ice','granite','softclay']) for (const ub of [false,true]) {
  const x={keepForm:false, unbreakable:ub, surface:sid, anchor:'friction'};
  for (const [kA,kB] of [[lg,lo],[lo,lg]]) {
  const r=P.armWrestle(ctx(Object.assign({body:rex(),kg:Math.pow(10,kA)},x)),ctx(Object.assign({body:ollie(),kg:Math.pow(10,kB)},x)));
  if (r.outcome!=='pin'||!r.tableBreaks||!isFinite(r.AA)||!isFinite(r.AB)) continue;
  n++;
  const aW=r.winner==='A', Aw=aW?r.AA:r.AB, Pl=aW?r.AB:r.AA, ml=3000, a=(Aw-Pl)/(AW.effMass*6000), C=Pl+AW.effMass*ml*a, el=Math.abs(AW.holdArm*ml*a-C), Rl=aW?r.RB:r.RA;
  const want=el>Rl;
  if (want && !r.loserSlides) { miss++; if(ex1.length<3) ex1.push([kA,kB,sid,ub,'elbow',fmt(el),'Rl',fmt(Rl),'Pl',fmt(Pl)].join(' ')); }
  if (!want && r.loserSlides) { extra++; if(ex2.length<3) ex2.push([kA,kB,sid,ub,'elbow',fmt(el),'Rl',fmt(Rl),'Pl',fmt(Pl)].join(' ')); }
}}
console.log('standing pins (power on, friction)',n,'; elbow force beats his footing but loserSlides false:',miss,ex1,'; loserSlides true though elbow force within footing:',extra,ex2);
