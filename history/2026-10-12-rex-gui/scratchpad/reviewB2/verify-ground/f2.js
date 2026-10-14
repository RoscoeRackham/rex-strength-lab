const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const R=P.RESTRAINT, M=R.MOVES;
const g=P.K.g;
for (const sid of ['granite','concrete']) {
  const s=surf(sid); const RB=P.qultFor(s,rex.footB)*2*rex.footArea; const thr=RB/g; // F threshold in kgf? depends on actionForce
  // find threshold by bisection on use where overLimitReal flips
  let lo=1e3, hi=1e12;
  for (let i=0;i<200;i++){ const mid=Math.sqrt(lo*hi); const r=P.jumpOnce(ctx(mid,sid,ON)); if (r.overLimitReal) hi=mid; else lo=mid; }
  for (const [lab,kgf] of [['below',lo],['above',hi]]) {
    for (const pw of [ON,OFF]) {
      const c=ctx(kgf,sid,pw); const r=P.jump(c); const o={surface:s,body:rex,m:rex.m,unbreakable:pw.unbreakable,ownRecoil:pw.ownRecoil};
      const src=M.jump.shake(r,o);
      console.log(sid,lab,kgf.toPrecision(7),pw===ON?'ON ':'OFF','v',r.v.toFixed(2),'vLand',r.landing.v.toFixed(1),'pushOff',r.pushOff?JSON.stringify({J:+r.pushOff.J.toPrecision(3),T:+r.pushOff.T.toPrecision(3)}):'-','ppv5 mm/s',(P.ppvAt(src,5)*1000).toFixed(0),'plaster',P.plasterReach(src).toFixed(1));
    }
  }
}
// at 1e8 kgf on granite: compare landing-only vs push-off alone
const c=ctx(1e8,'granite',ON), r=P.jump(c), s=surf('granite');
const o={surface:s,body:rex,m:rex.m,unbreakable:true};
const po=P.impulseSource(s,r.v*rex.m* (1), 1); 
const J=P.vToMomentum(r.v,rex.m);
const srcPO=P.impulseSource(s,J,r.push.t);
const srcL=M.jump.shake(r,o);
console.log('1e8 granite: v',r.v.toFixed(0),'push.t',r.push.t, 'overLimitReal',r.overLimitReal,'J',J.toExponential(3),'pushoff-alone plaster',P.plasterReach(srcPO).toFixed(1),'ppv5',P.ppvAt(srcPO,5).toFixed(3),'counted plaster',P.plasterReach(srcL).toFixed(1),'ppv5',P.ppvAt(srcL,5).toFixed(3),'vLand',r.landing.v.toFixed(0));
