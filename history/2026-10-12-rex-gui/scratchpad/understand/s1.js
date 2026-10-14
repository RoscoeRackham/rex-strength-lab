global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=9.80665, surf=(id)=>D.surfaces.find(s=>s.id===id);
console.log('surfaces', D.surfaces.map(s=>s.id+(s.granular?'(gr)':'')+' q='+s.qult.toExponential(2)+' rho='+s.rho).join(', '));
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const M=P.RESTRAINT.MOVES;
for (const sid of ['sand','gravel','softclay','stiffclay','asphalt','concrete','granite','ice']) {
  for (const lgU of [3,4,5,6,8,10]) {
    const base={F:1e12*g,mode:'comic',body:rex,surface:surf(sid),anchor:'friction',use:Math.pow(10,lgU)*g};
    const r0=P.stomp(Object.assign({},base,{groundHolds:false})), r1=P.stomp(Object.assign({},base,{groundHolds:true}));
    const o={surface:surf(sid),body:rex};
    const s0=M.stomp.shake(r0,o), s1=M.stomp.shake(r1,o);
    const f=(x)=>x.toPrecision(3);
    console.log(sid, 'use 1e'+lgU+'kg', 'vFoot', f(r0.vFoot), f(r1.vFoot), 'hole', f(r0.holeDepth), 'crater', f(r0.crater), '| ppv5 off', f(P.ppvAt(s0,5)), 'on', f(P.ppvAt(s1,5)), '| plaster off', f(P.plasterReach(s0)), 'on', f(P.plasterReach(s1)), 'T', s0? f(s0.T):'-', s1?f(s1.T):'-', 'ground haz off', M.stomp.ground(r0,{surface:surf(sid)}));
  }
}
