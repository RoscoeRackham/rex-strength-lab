const {P,D,surf,rex,ollie,ctx}=require('./h.js');
const RR=P.RESTRAINT.R;
const blastAt=(kg,a)=>{const cR=ctx(kg,{airAbsorb:a}); const t=P.tossPartner(cR, ollie(), 'Ollie', 'hard', 100, 'friction'); const tw=P.throwObject(cR,t.obj,90);
 const mo={obj:t.obj,surface:cR.surface,body:cR.body,anchor:cR.anchor,angle:90,near:5,airAbsorb:a,keepForm:true,unbreakable:true,ownRecoil:true};
 return {v:t.v, rule:P.RESTRAINT.MOVES.throw.blast(tw,mo), duo:Math.max(t.hand?t.hand.E:0, t.result==='fireball'?P.keFromV(t.v,t.obj.m):0)};};
for (const a of [0,0.5]) { let lo=1e4,hi=1e8; for(let i=0;i<100;i++){const m=Math.sqrt(lo*hi); const b=blastAt(m,a).rule; if(P.blastRadius(b,RR.DP_WINDOWS)>=RR.STREET) hi=m; else lo=m;}
 const x=blastAt(hi,a); console.log('share',a,'windows (Throw-tab rule) at dial t',(hi/1000).toFixed(0),'v',x.v.toFixed(0),'blast',x.rule.toExponential(2),'duoFacts blast there',x.duo.toExponential(2)); }
