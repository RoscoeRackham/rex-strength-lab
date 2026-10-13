const {P,D,surf,rex,ollie,ctx}=require('./h.js');
const RR=P.RESTRAINT.R;
// find the E needed for windows at STREET
let lo=1,hi=1e20; for(let i=0;i<200;i++){const m=Math.sqrt(lo*hi); if(P.blastRadius(m,RR.DP_WINDOWS)>=RR.STREET) hi=m; else lo=m;}
console.log('E needed windows street', hi.toExponential(3), 'STREET', RR.STREET);
let lo2=1,hi2=1e20; for(let i=0;i<200;i++){const m=Math.sqrt(lo2*hi2); if(P.blastRadius(m,RR.DP_HOUSES)>=5) hi2=m; else lo2=m;}
console.log('E needed houses 5 m', hi2.toExponential(3));
// toss at various dials, share 0 and 0.5: what the Throw-tab rule gives (MOVES.throw.blast on a Wrestle-like throwObject at 90 deg)
for (const t_ of [1e3,1e4,1e5,1e6,5.49e9]) for (const a of [0,0.5]) {
  const cR=ctx(t_*1000/1000*1000/1000,{airAbsorb:a}); // dial in kg
  cR.F=t_*1000*P.K.g;
  const t=P.tossPartner(cR, ollie(), 'Ollie', 'hard', 100, 'friction');
  const tw=P.throwObject(cR, t.obj, 90);
  const mo={obj:t.obj,surface:cR.surface,body:cR.body,anchor:cR.anchor,angle:90,near:5,airAbsorb:a,keepForm:true,unbreakable:true,ownRecoil:true};
  const b=P.RESTRAINT.MOVES.throw.blast(tw,mo);
  console.log('dial t',t_,'share',a,'v',t.v&&t.v.toFixed(0),'toss hand',t.hand?t.hand.E.toExponential(2):0,'Throw-rule blast',b.toExponential(2),'windows?',P.blastRadius(b,RR.DP_WINDOWS)>=RR.STREET);
}
