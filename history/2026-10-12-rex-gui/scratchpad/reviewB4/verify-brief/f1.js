const {P,D,surf,rex,ollie,ctx}=require('./h.js');
const K=P.K;
for (const kg of [1e9,1e16,1e22]) for (const a of [0,0.5,0.9]) {
  const cR=ctx(kg,{airAbsorb:a});
  const t=P.tossPartner(cR, ollie(), 'Ollie', 'hard', 100, 'friction');
  const blastDuo=Math.max(t.hand?t.hand.E:0, t.result==='fireball'?(isFinite(t.v)?P.keFromV(Math.min(t.v,K.c*(1-1e-12)),t.obj.m):Infinity):0);
  // wrestle throw at 90
  const cO=Object.assign(ctx(kg,{airAbsorb:a}),{body:ollie()});
  const tp=P.throwPartner(cR,cO,90);
  const M=P.RESTRAINT.MOVES.throw, mo={obj:tp.obj,surface:cR.surface,body:cR.body,anchor:cR.anchor,angle:90,near:30,airAbsorb:a,keepForm:true,unbreakable:true,ownRecoil:true};
  const wb=tp.r&&tp.r.canMove?M.blast(tp.r,mo):0;
  console.log('kg',kg,'share',a,'toss',t.result,'v',t.v&&t.v.toPrecision(4),'hand',t.hand&&t.hand.E.toExponential(3),'vImpact',t.flight&&t.flight.vImpact&&t.flight.vImpact.toFixed(1),'duoBlast',blastDuo.toExponential(3),'| wrestle v',tp.r.v.toPrecision(4),'blast',wb.toExponential(3), 'Eobj', tp.r.Eobj&&tp.r.Eobj.toExponential(3));
}
