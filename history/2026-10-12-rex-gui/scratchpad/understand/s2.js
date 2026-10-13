global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=9.80665, surf=(id)=>D.surfaces.find(s=>s.id===id);
const M=P.RESTRAINT.MOVES;
// stomp: does 2*hole/vFoot ever beat footPulse?
let worst=0, at=null;
for (const bk of [{build:'rex',H:3.048,m:3007},{build:'rex',H:50,m:1060*P.bodyVolume(50,'rex')},{},{build:'rex',H:0.4,m:1060*P.bodyVolume(0.4,'rex')}]) {
  const body=P.makeBody(bk);
  const fp=2*P.WALK.STAMP.t*Math.sqrt(P.WALK.HIP*body.H/P.WALK.HS.h);
  for (const s of D.surfaces) for (let lg=0; lg<=12; lg+=0.05) for (const mode of ['comic','real']) {
    const r=P.stomp({F:1e14*g,mode,body,surface:s,anchor:'friction',groundHolds:false,use:Math.pow(10,lg)*g});
    if (r.vFoot>0 && r.holeDepth>0) { const q=2*r.holeDepth/r.vFoot/fp; if (q>worst){worst=q; at={H:body.H,s:s.id,lg,mode,hole:r.holeDepth,v:r.vFoot,fp};} }
  }
}
console.log('stomp max (2 hole / vFoot) / footPulse =', worst.toPrecision(3), JSON.stringify(at));
