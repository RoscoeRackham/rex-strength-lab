global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=9.80665, surf=(id)=>D.surfaces.find(s=>s.id===id);
const M=P.RESTRAINT.MOVES;
for (const bk of [['rex',{build:'rex',H:3.048,m:3007}],['cal',{}],['kaiju',{build:'rex',H:50,m:1060*P.bodyVolume(50,'rex')}]]) {
  const body=P.makeBody(bk[1]); const fp=2*P.WALK.STAMP.t*Math.sqrt(P.WALK.HIP*body.H/P.WALK.HS.h);
  let worst=0, at=null, ppvGap=1;
  for (const s of D.surfaces) for (let lg=0; lg<=12; lg+=0.05) for (const mode of ['comic','real']) {
    const base={F:1e14*g,mode,body,surface:s,anchor:'friction',use:Math.pow(10,lg)*g};
    const r=P.stomp(Object.assign({groundHolds:false},base)), r1=P.stomp(Object.assign({groundHolds:true},base));
    if (r.vFoot>0 && r.holeDepth>0) { const q=2*r.holeDepth/r.vFoot/fp; if (q>worst){worst=q; const o={surface:s,body}; at={s:s.id,lg:+lg.toFixed(2),mode,ppv5off:P.ppvAt(M.stomp.shake(r,o),5),ppv5on:P.ppvAt(M.stomp.shake(r1,o),5),plOff:P.plasterReach(M.stomp.shake(r,o)),plOn:P.plasterReach(M.stomp.shake(r1,o))};} }
  }
  console.log(bk[0],'footPulse',fp.toPrecision(3),'max ratio',worst.toPrecision(3),JSON.stringify(at));
}
