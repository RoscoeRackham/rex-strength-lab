global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=9.80665, surf=(id)=>D.surfaces.find(s=>s.id===id);
const f=(x)=>typeof x==='number'?x.toPrecision(3):String(x); const M=P.RESTRAINT.MOVES;
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
for (const sid of ['sand','concrete']) for (const lg of [4,4.5,5,6,7,8]) for (const gh of [false,true]) {
  const c={F:1e14*g,mode:'comic',body:rex,surface:surf(sid),anchor:'friction',groundHolds:gh,use:Math.pow(10,lg)*g};
  const r=P.jump(c), o={surface:surf(sid),body:rex,m:rex.m};
  const land=M.jump.shake(r,o);
  // take-off: the body's momentum p handed to the ground over the push time (plus its weight), as a Hann pulse
  const p=r.Ebody>0? P.vToMomentum(r.v,rex.m):0;
  const tk=p>0&&r.push.t>0? P.vibSource(surf(sid),'hann',2*p/r.push.t,r.push.t):null;
  console.log(sid,'1e'+lg,'gh',gh,'v',f(r.v),'apex',f(r.flight.apex),'vLand',f(r.landing.v),'push.t',f(r.push.t),'| ppv5 landing',f(P.ppvAt(land,5)),'takeoff',f(P.ppvAt(tk,5)),'plaster land',f(land?P.plasterReach(land):0),'takeoff',f(tk?P.plasterReach(tk):0));
}
