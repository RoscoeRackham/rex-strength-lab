const { P, D } = require('./load.js')(process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab');
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), person=D.objects.find(o=>o.id==='person');
const R0=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex));
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
for (const sid of D.surfaces.map(s=>s.id)) { const a=P.PASSENGER.landGround(person,1,surf(sid)), b=P.PASSENGER.landGround(person,1,surf(sid),45); console.log(sid, 'straight', a.vBear.toFixed(1), '45deg', b.vBear.toFixed(1)); }
const run=(kg,sid)=>P.throwObject(Object.assign({F:kg*g,mode:'comic',body:R0,surface:surf(sid||'concrete'),anchor:'friction',safePassenger:true},ON),person,45);
// dial where all-out 45 deg first gives way on the slab (with angle)
let lo=1e4, hi=1e7; for (let i=0;i<60;i++){ const mid=Math.sqrt(lo*hi), r=run(mid); const lg=P.PASSENGER.landGround(person,r.flight.vImpact,surf('concrete'),r.flight.impactAngleDeg); if (lg.gives) hi=mid; else lo=mid; }
const rr=run(hi); console.log('dial', hi.toFixed(0), 'v', rr.flight.vImpact.toFixed(2), 'ang', rr.flight.impactAngleDeg.toFixed(2));
const d=run(100*907.18474); console.log('default all-out', d.flight.vImpact.toFixed(2), d.flight.impactAngleDeg.toFixed(2));
for (const lk of [9, 9.15]) { const r=run(Math.pow(10,lk)); for (const sid of ['concrete','granite','steel','ice']) { const lg=P.PASSENGER.landGround(person,r.flight.vImpact,surf(sid),r.flight.impactAngleDeg), l0=P.PASSENGER.landGround(person,r.flight.vImpact,surf(sid)); console.log(lk, sid, 'v', r.flight.vImpact.toFixed(1), 'ang', r.flight.impactAngleDeg.toFixed(2), 'ratio', (lg.push/lg.bear).toFixed(2), 'straight', (l0.push/l0.bear).toFixed(2)); } }
// the ice ceiling at 10^9: courtesy ceiling landing
const plan=P.RESTRAINT.planNow('throw', Object.assign({F:1e9*g,mode:'comic',body:R0,surface:surf('ice'),anchor:'friction',safePassenger:true},ON), {near:5,target:30,obj:person,angle:45,safePassenger:true,silentStrike:false,softLanding:false});
const ce=plan.ceiling(); const rc=plan.run(ce.use); console.log('ice 1e9 ceiling', ce.by, (Math.sqrt(ce.below*ce.use)/g).toFixed(0), 'lands', rc.flight.vImpact.toFixed(1), rc.flight.impactAngleDeg.toFixed(2), P.PASSENGER.landGround(person, rc.flight.vImpact, surf('ice'), rc.flight.impactAngleDeg).vBear.toFixed(1));
const plan2=P.RESTRAINT.planNow('throw', Object.assign({F:100*907.18474*g,mode:'comic',body:R0,surface:surf('sand'),anchor:'friction',safePassenger:true},ON), {near:5,target:30,obj:person,angle:45,safePassenger:true,silentStrike:false,softLanding:false});
const ce2=plan2.ceiling(); const rc2=plan2.run(ce2.use); console.log('sand default ceiling', ce2.by, (Math.sqrt(ce2.below*ce2.use)/g).toFixed(0), 'lands', rc2.flight.vImpact.toFixed(1), rc2.flight.impactAngleDeg.toFixed(2), P.PASSENGER.landGround(person, rc2.flight.vImpact, surf('sand'), rc2.flight.impactAngleDeg).vBear.toFixed(1));
const plan3=P.RESTRAINT.planNow('throw', Object.assign({F:100*907.18474*g,mode:'comic',body:R0,surface:surf('concrete'),anchor:'friction',safePassenger:true},ON), {near:5,target:30,obj:person,angle:45,safePassenger:true,silentStrike:false,softLanding:false});
const ce3=plan3.ceiling(); const rc3=plan3.run(ce3.use); console.log('slab default ceiling', ce3.by, (Math.sqrt(ce3.below*ce3.use)/g).toFixed(0), 'lands', rc3.flight.vImpact.toFixed(1), rc3.flight.impactAngleDeg.toFixed(2));
