global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=9.80665, surf=(id)=>D.surfaces.find(s=>s.id===id);
const M=P.RESTRAINT.MOVES; const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const f=(x)=>typeof x==='number'?x.toPrecision(3):String(x);
for (const sid of ['sand','softclay','concrete','granite']) for (const lg of [4,5,6,7,8,10]) {
  const base={F:1e14*g,mode:'comic',body:rex,surface:surf(sid),anchor:'friction',use:Math.pow(10,lg)*g};
  const r0=P.jump(Object.assign({groundHolds:false},base)), r1=P.jump(Object.assign({groundHolds:true},base));
  const o={surface:surf(sid),body:rex,m:rex.m};
  const s0=M.jump.shake(r0,o), s1=M.jump.shake(r1,o);
  console.log(sid,'1e'+lg,'v',f(r0.v),f(r1.v),'held',r0.heldBack,'fails',r0.groundFails,'Eg',f(r0.Eground),f(r1.Eground),'quake',f(r0.groundQuake),f(r1.groundQuake),'landRatio',f(r0.landing.ratio),f(r1.landing.ratio),'landEg',f(r0.landing.Eground),'| ppv5',f(P.ppvAt(s0,5)),f(P.ppvAt(s1,5)),'plaster',f(s0?P.plasterReach(s0):0),f(s1?P.plasterReach(s1):0),'gHaz',M.jump.ground(r0,o),'blast',f(M.jump.blast(r0)),f(M.jump.blast(r1)));
}
