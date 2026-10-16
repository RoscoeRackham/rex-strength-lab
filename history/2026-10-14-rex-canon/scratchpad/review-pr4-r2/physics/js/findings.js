// Reproductions for review round 2, physics lens (PR 4). Run: node findings.js
const {P,ctx,rex,ollie,fmt}=require('./h.js');
const K=P.K, AW=P.AW, g=K.g;
console.log('--- F1: carried hit: Q (hitAbsorbed) vs the squash work F*s');
for (const [lab,a,b,o] of [['default sprint, all-out',{},{},{source:'sprint'}],['set 1 m/s',{},{},{source:'set',gb:1/K.c}],['jump onto Rex, Unbreakable off, concrete',{unbreakable:false},{unbreakable:false},{source:'jump'}],['jump onto Rex, Unbreakable off, granite',{unbreakable:false,surface:'granite'},{unbreakable:false,surface:'granite'},{source:'jump'}],['bolted Rex, real rock, sprint',{unbreakable:false},{unbreakable:false,anchor:'bolted'},{source:'sprint'}]]) {
  const r=P.collide(ctx(Object.assign({body:ollie()},a)),ctx(Object.assign({body:rex()},b)),o), k=r.carry, s=r.contact.s, v=r.vRel;
  const work=k.F*v*k.T, KE=P.momentumToKE(k.pGain,3000), fric=k.hold*r.after.splat.during;
  console.log(lab.padEnd(42),'F',fmt(k.F),'T',fmt(k.T),'s',fmt(s),'| Q=hitAbsorbed',fmt(r.hitAbsorbed.E),' F*s',fmt(k.F*s),' (x'+fmt(k.F*s/r.Q)+')',' | source work F v T',fmt(work),' = KE',fmt(KE),'+ hold*during',fmt(fric),'+ F*s',fmt(k.F*s));
}
console.log('--- F2: standing pin, winner power on: loser elbow force vs his footing');
{ const r=P.armWrestle(ctx({body:rex(),keepForm:false}),ctx({body:ollie(),kg:1000,keepForm:false}));
  const Pw=r.AA, Pl=r.AB, a=(Pw-Pl)/(AW.effMass*6000), C=Pl+AW.effMass*3000*a, el=Math.abs(AW.holdArm*3000*a-C);
  console.log('outcome',r.outcome,'tableBreaksBy',r.tableBreaksBy,'loserPadLoad',fmt(r.loserPadLoad),'| standing: a',fmt(a),'elbow force on Ollie',fmt(el),'Ollie footing RB',fmt(r.RB),'loserSlides',r.loserSlides,'(engine compares Pl',fmt(Pl),'with RB)'); }
console.log('--- F3: shoving-match walk-out: stated push vs the push that moves the loser');
{ const r=P.pushMatch(ctx({body:rex()}),ctx({body:ollie(),kg:1000}));
  console.log('outcome',r.outcome,'DA (shown as "Rex pushes")',fmt(r.DA),'contact (what moves Ollie)',fmt(r.contact),'accel',fmt(r.accel),'aLoser if DA were real',fmt(r.aLoser),'recoilAbsorbedA',r.recoilAbsorbedA);
  const s=P.standoff(ctx({body:rex()}),ctx({body:ollie(),kg:1000})); console.log('  the same bodies in Collide\'s steady push:',s.outcome,'Ollie driven off at',fmt(s.drive.vB),'m/s, slides',fmt(s.drive.slideB),'m'); }
console.log('--- F4: slide harm leaves out the distance moved during the push stroke');
{ const s=P.standoff(ctx({body:ollie(),kg:5470}),ctx({body:rex()})); console.log('steady push at its 5,470 kg-force ceiling: stroke',fmt(s.drive.d),'+ slide',fmt(s.drive.slideB),'= ',fmt(s.drive.d+s.drive.slideB),'m from where Rex stood');
  const m=P.pushMatch(ctx({body:rex(),kg:9060}),ctx({body:ollie(),kg:9060})); const xA=P.xOfT(m.DB-m.HA,3000,m.t); console.log('shoving match at its 9,060 kg-force ceiling: during',fmt(xA),'+ slide',fmt(m.slideA),'=',fmt(xA+m.slideA),'m');
  const c=P.collide(ctx({body:ollie(),kg:4260}),ctx({body:rex()}),{source:'sprint'}); console.log('Collide (counts it): during',fmt(c.after.splat.during),'+ slide',fmt(c.after.splat.slide),'= moved',fmt(c.after.splat.moved)); }
console.log('--- F5: real muscle: steady push vs shoving match');
{ const s=P.standoff(ctx({body:ollie(),mode:'real'}),ctx({body:rex(),mode:'real'})), sc=P.standoff(ctx({body:ollie()}),ctx({body:rex()})); const m=P.pushMatch(ctx({body:rex(),mode:'real'}),ctx({body:ollie(),mode:'real'}));
  console.log('steady push real',fmt(s.drive.vB),'comic',fmt(sc.drive.vB),'realUpper key:',s.realUpper,'drive.realUpper:',s.drive.realUpper,'| shoving match realUpper:',m.realUpper); }
console.log('--- F6: carried below 1% of c: the one hit\'s motion in real air is not in Elocal');
for (const gb of [0.001,0.0099,0.0101]) { const r=P.collide(ctx({body:ollie()}),ctx({body:rex()}),{source:'set',gb}); const r0=P.collide(ctx({body:ollie(),ownRecoil:false}),ctx({body:rex(),ownRecoil:false}),{source:'set',gb});
  console.log('v/c',gb,'carried KE',fmt(P.momentumToKE(r.carry.pGain,3000)),'Elocal',fmt(r.Elocal),'slide',fmt(r.after.splat.slide),'| power off Elocal',fmt(r0.Elocal)); }
console.log('--- F7: pusher too weak to stand: steady push vs shoving match');
{ const kg=2000; console.log('Ollie at',kg,'kg-force: stand',P.moveCheck(kg*g,3000).stand); const s=P.standoff(ctx({body:ollie(),kg}),ctx({body:rex()})); const m=P.pushMatch(ctx({body:rex()}),ctx({body:ollie(),kg}));
  console.log('steady push: Ollie pushes',fmt(s.DA),s.outcome,'Rex driven off at',fmt(s.drive&&s.drive.vB),'| shoving match: Ollie pushes',m.DB);
  const s0=P.standoff(ctx({body:ollie(),kg,ownRecoil:false}),ctx({body:rex(),ownRecoil:false})); console.log('  power off steady push:',s0.outcome,fmt(s0.DA)); }
