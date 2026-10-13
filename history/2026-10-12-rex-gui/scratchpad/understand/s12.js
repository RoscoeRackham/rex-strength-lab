global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=9.80665;
const body=P.makeBody({build:'rex',H:3.048,m:3007}); const fp=2*P.WALK.STAMP.t*Math.sqrt(P.WALK.HIP*body.H/P.WALK.HS.h);
let worst=0,at=null;
for (const s of D.surfaces) for (let lg=0; lg<=12; lg+=0.1) for (const anchor of ['friction','bolted']) {
  const r=P.stompOnce({F:1e14*g,mode:'comic',body,surface:s,anchor,groundHolds:false,use:Math.pow(10,lg)*g});
  if (r.vFoot>0&&r.holeDepth>0){const q=2*r.holeDepth/r.vFoot/fp; if(q>worst){worst=q;at=[s.id,lg.toFixed(1),anchor];}}
}
console.log('Rex comic stompOnce max ratio',worst.toPrecision(3),at);
// smallest body height at which the hole sets the pulse on soft clay
for (const H of [3.048,5,8,10,15,20,30]) { const b=P.makeBody({build:'rex',H,m:1060*P.bodyVolume(H,'rex')}); const f2=2*P.WALK.STAMP.t*Math.sqrt(P.WALK.HIP*b.H/P.WALK.HS.h); let w=0; for (const s of D.surfaces) for (let lg=0; lg<=14; lg+=0.1){const r=P.stompOnce({F:1e16*g,mode:'comic',body:b,surface:s,anchor:'friction',groundHolds:false,use:Math.pow(10,lg)*g}); if(r.vFoot>0&&r.holeDepth>0) w=Math.max(w,2*r.holeDepth/r.vFoot/f2);} console.log('H',H,'max ratio',w.toPrecision(3)); }
