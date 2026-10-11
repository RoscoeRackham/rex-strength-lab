global.window={};require('/home/user/dino-strength-sim/src/data.js');const D=window.DINO_DATA;
const P=require('/home/user/dino-strength-sim/src/engine.js');
const g=P.K.g;
function ctx(logKg, surf, mode='real', gh=false){const body=P.makeBody({H:2,m:180});return {F:Math.pow(10,logKg)*g,mode,body,surface:D.surfaces.find(s=>s.id===surf),groundHolds:gh,anchor:'friction'};}
const cases=[[Math.log10(90718.474),'concrete'],[6,'concrete'],[30,'granite'],[Math.log10(90718.474),'gravel'],[Math.log10(90718.474),'sand'],[5,'gravel'],[4,'gravel'],[4.5,'concrete']];
for(const [lk,s] of cases){const c=ctx(lk,s);const r=P.jump(c);
 const fl=r.flight;
 console.log(s, lk.toFixed(3), 'F',r.F.toExponential(3),'RB',r.groundLimitForce.toExponential(3),'groundFails',r.groundFails,'heldBack',r.heldBack,'apex',fl.apex.toFixed(3),'v',r.v.toFixed(3),
  'xB',r.push.xB.toExponential(3),'vB',r.push.vB,'EB',r.push.EB,'lossB',r.push.lossB,'Eground',r.Eground,'work',r.push.work, 'xA',r.push.xA, 't',r.push.t);
}
