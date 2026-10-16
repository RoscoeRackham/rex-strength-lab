const {P,D,rex,ollie,ctx,show,fmt,DIAL}=require('./h.js');
const K=P.K;
const COL=P.COL;
const cases=[['default sprint all-out',{},{},{source:'sprint'}],['least 4.26t',{kg:4260},{},{source:'sprint'}],['1 m/s',{},{},{source:'set',gb:1/K.c}],
 ['jump onto Rex, real ground',{unbreakable:false},{unbreakable:false},{source:'jump'}],['bolted Rex real rock sprint',{unbreakable:false},{unbreakable:false,anchor:'bolted'},{source:'sprint'}],
 ['bolted Rex real rock, 1 m/s',{unbreakable:false},{unbreakable:false,anchor:'bolted'},{source:'set',gb:1/K.c}],
 ['jump 10^6.25 real ground',{kg:Math.pow(10,6.25),unbreakable:false},{unbreakable:false},{source:'jump'}],
 ['sprint, ice',{surface:'ice'},{surface:'ice'},{source:'sprint'}],['sprint, gravel',{surface:'gravel'},{surface:'gravel'},{source:'sprint'}]];
for (const [lab,a,b,o] of cases){
  const r=P.collide(ctx(Object.assign({body:ollie()},a)),ctx(Object.assign({body:rex()},b)),o);
  if(r.outcome!=='carried'){console.log(lab,r.outcome);continue;}
  const k=r.carry, s=r.contact.s;
  // engine's own splatWithFooting with charger mass -> 1e30
  // not exported? use formula
  const mB=3000, v=r.vRel, H=k.hold, mu=1e30*mB/(1e30+mB), arel=v*v/(2*s), F=mu*(arel+H/mB), tau=v/arel;
  const Qlimit=F*s;
  // energy books: source work F v T; Rex KE; friction/ground work H*during; squash F*s
  const W=k.F*v*k.T, KE=P.momentumToKE(k.pGain,mB), during=r.after.splat.during;
  console.log(lab.padEnd(30), 'Q engine', fmt(r.Q), ' hitAbsorbed', fmt(r.hitAbsorbed.E), ' F*s', fmt(k.F*s), ' limit F*s', fmt(Qlimit), ' ratio', fmt(k.F*s/r.Q),
   ' | source work', fmt(W), ' = KE', fmt(KE), '+ H*during', fmt(H*during), '+ F*s', fmt(k.F*s), ' sum', fmt(KE+H*during+k.F*s), r.after.splat.Eground!=null?' Eground '+fmt(r.after.splat.Eground):'');
}
