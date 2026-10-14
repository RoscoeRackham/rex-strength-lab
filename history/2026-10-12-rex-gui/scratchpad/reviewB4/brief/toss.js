const {P,D,rex,surf,obj,ctx}=require('./h.js');
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const R=P.RESTRAINT.R, M=P.RESTRAINT.MOVES.throw;
const share = Number(process.argv[2]||0);
function tossBlast(kg){ const c=ctx(kg,{airAbsorb:share}); const t=P.tossPartner(c,ollie,'Ollie','hard',10,'friction'); const E=t.result==='fireball'?(isFinite(t.v)?P.keFromV(Math.min(t.v,P.K.c*(1-1e-12)),t.obj.m):Infinity):0; return {b:Math.max(t.hand?t.hand.E:0,E), v:t.v, res:t.result}; }
function wrBlast(kg){ const c=ctx(kg,{airAbsorb:share}); const cO=Object.assign({},c,{body:ollie}); const w=P.throwPartner(c,cO,90); if(!w.r||!w.r.canMove) return {b:0,v:0}; const mo={obj:w.obj,surface:c.surface,body:c.body,anchor:c.anchor,angle:90,near:5,airAbsorb:share,keepForm:true,unbreakable:true,ownRecoil:true}; return {b:M.blast(w.r,mo), v:w.r.v, parts:M.blastParts(w.r,mo)}; }
for (const lg of [5,6,7,8,9,10,11,12,13,14,15,16]) { const kg=Math.pow(10,lg); const a=tossBlast(kg), b=wrBlast(kg);
  console.log('1e'+lg, 'toss v',a.v&&a.v.toPrecision(3),a.res,'blast',a.b.toExponential(2),'win?',P.blastRadius(a.b,R.DP_WINDOWS)>=R.STREET, '| wrestle v',b.v&&b.v.toPrecision(3),'blast',b.b.toExponential(2),'win?',P.blastRadius(b.b,R.DP_WINDOWS)>=R.STREET); }
