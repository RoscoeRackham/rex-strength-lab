const {P,D,g,ctx}=require('./eng.js');
const DIAL=90718.474;
const cO=ctx('ollie',DIAL), cR=ctx('rex',DIAL);
for (const bounce of [false,true]) {
  const r=P.collide(cO,cR,{source:'sprint',gb:1e9,bounce});
  console.log('bounce',bounce,r.outcome,'v0',r.v0,'vRel',r.vRel, JSON.stringify(r.carry), 'Q',r.Q, 'after',JSON.stringify(r.after), 'hitAbs',JSON.stringify(r.hitAbsorbed),'Elocal',r.Elocal,'toGround',JSON.stringify(r.toGround));
}
// set speed 300 km/s
for (const bounce of [false,true]) {
  const r=P.collide(cO,cR,{source:'set',gb:3e5,bounce});
  console.log('set300 bounce',bounce,r.outcome,'v',r.vRel, JSON.stringify(r.carry),'Q',r.Q,'Elocal',r.Elocal);
}
// default set speed 100
const r1=P.collide(cO,cR,{source:'set',gb:100,bounce:false});
console.log('set100', r1.outcome, JSON.stringify(r1.after));
