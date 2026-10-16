const {P,D,g,ctx}=require('./eng.js');
const c=299792458, DIAL=90718.474;
const cO=ctx('ollie',DIAL), cR=ctx('rex',DIAL);
const gbOf=(v)=>{const b=v/c;return b/Math.sqrt(1-b*b);};
for (const bounce of [false,true]) {
  const r=P.collide(cO,cR,{source:'set',gb:gbOf(3e5),bounce});
  console.log('set300 bounce',bounce,r.outcome,'v',r.vRel, JSON.stringify(r.carry),'Q',r.Q,'Elocal',r.Elocal);
}
const r1=P.collide(cO,cR,{source:'set',gb:gbOf(100),bounce:false});
console.log('set100', r1.outcome, JSON.stringify(r1.after), 'Q', r1.Q);
// jump at 1e9 kg dial
for (const src of ['jump','stomp']) {
 const a=ctx('ollie',1e9), b=ctx('rex',1e9);
 const r=P.collide(a,b,{source:src,gb:1,bounce:false});
 console.log(src, r.outcome, r.heldBy, 'v0', r.v0, r.vRel);
}
// bolted Rex
const rb=P.collide(cO,ctx('rex',DIAL,{anchor:'bolted'}),{source:'sprint',gb:1,bounce:false});
console.log('bolted', rb.outcome, rb.heldBy);
// bolted on real rock
const rr=P.collide(Object.assign({},cO,{unbreakable:false}),ctx('rex',DIAL,{anchor:'bolted',unbreakable:false}),{source:'sprint',gb:1,bounce:false});
console.log('bolted real', rr.outcome, JSON.stringify(rr.carry));
