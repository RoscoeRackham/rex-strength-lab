global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const f=(x)=>typeof x==='number'?x.toPrecision(3):String(x);
for (const m of [3007, 3e4, 1e6, 1e9]) for (const s of D.surfaces) {
  const b=P.makeBody({build:'rex',H:3.048,m});
  const u=P.groundUnderWeight(b,s,false), c=P.groundUnderWeight(b,s,true);
  const sd=P.standDepth(s,u.footPressure,b.footB,b.H);
  console.log(m,s.id,u.regime,'standRatio',f(u.standRatio),'print',f(u.print),'sink',f(u.sink),'| sd.print',sd?f(sd.print):'-','plunge',sd?f(sd.plunge):'-','| comic:',c.regime,f(c.standRatio),f(c.print));
}
