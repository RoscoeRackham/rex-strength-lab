const {P,D,body,surf,obj}=require('./env.js'); const K=P.K, g=K.g, M=P.RESTRAINT.MOVES;
const person=obj('person');
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const ang=+process.argv[2]||45; const sid=process.argv[3]||'concrete'; const air=process.argv[4]!=null?+process.argv[4]:1;
for (let lk=2; lk<=17; lk+=0.5){
  const c=Object.assign({F:Math.pow(10,lk)*g,mode:'comic',body,surface:surf(sid),anchor:'friction'},ON,{airAbsorb:air,safePassenger:true});
  const r=P.throwObject(c,person,ang);
  const o=Object.assign({obj:person,angle:ang,near:5,body,surface:surf(sid)},ON,{airAbsorb:air,safePassenger:true});
  const f=r.flight||{};
  const pl=M.throw.passengerLanding(r,o);
  const lg=f.landed?P.PASSENGER.landGround(person,f.vImpact,surf(sid)):null;
  const b=M.throw.blastParts(r,o);
  const ke=f.vImpact? P.momentumToKE? null:null:null;
  console.log(lk.toFixed(1), 'v',r.v&&r.v.toPrecision(4),'landed',!!f.landed,'rel',!!f.relativistic,'vImp',f.vImpact&&f.vImpact.toPrecision(4),'impAng',f.impactAngleDeg&&f.impactAngleDeg.toFixed(1),'Eimp',r.Eimpact&&r.Eimpact.toPrecision(4),'halfmv2',f.vImpact&&(0.5*person.m*f.vImpact**2).toPrecision(4),'pl',pl&&pl.absorbed.toPrecision(4),pl&&pl.J.toPrecision(4),'gives',lg&&lg.gives,lg&&(lg.push/lg.bear).toPrecision(3),'blast.land',b.land.toPrecision(3),'path',b.path.toPrecision(3), 'range', f.range&&f.range.toPrecision(4), 'esc',!!f.escaped);
}
