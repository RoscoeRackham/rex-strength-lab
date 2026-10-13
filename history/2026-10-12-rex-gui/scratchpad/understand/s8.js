global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=9.80665, surf=(id)=>D.surfaces.find(s=>s.id===id), obj=(id)=>D.objects.find(o=>o.id===id);
const f=(x)=>typeof x==='number'?x.toPrecision(3):String(x); const M=P.RESTRAINT.MOVES;
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
for (const [oid,ang] of [['car',45],['bus',45],['bus',0],['bus',90],['baseball',30]]) for (const sid of ['sand','concrete']) for (const lg of [4,6,9]) {
  const base={F:Math.pow(10,lg)*g,mode:'comic',body:rex,surface:surf(sid),anchor:'friction'};
  const a=P.throwObject(Object.assign({groundHolds:false},base),obj(oid),ang), b=P.throwObject(Object.assign({groundHolds:true},base),obj(oid),ang);
  const o={obj:obj(oid),surface:surf(sid),body:rex,angle:ang};
  const sa=M.throw.shake(a,o), sb=M.throw.shake(b,o);
  console.log(oid,ang,sid,'1e'+lg,'v',f(a.v),f(b.v),'sinkRatio',f(a.sinkRatio),f(b.sinkRatio),'R',f(a.anchor.R),f(b.anchor.R),'recoilV',f(a.recoilV),f(b.recoilV),'| land ppv5',f(P.ppvAt(sa,5)),f(P.ppvAt(sb,5)),'gHaz',M.throw.ground(a,o));
}
