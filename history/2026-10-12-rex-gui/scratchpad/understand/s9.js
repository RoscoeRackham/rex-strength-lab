global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=9.80665, surf=(id)=>D.surfaces.find(s=>s.id===id);
const f=(x)=>typeof x==='number'?x.toPrecision(3):String(x);
const R=(o)=>Object.assign({F:1e6*g,mode:'comic',body:P.makeBody({build:'rex',H:3.048,m:3007}),surface:surf('sand'),anchor:'friction'},o), O=(o)=>Object.assign({F:1e6*g,mode:'comic',body:P.makeBody({build:'ollie',H:3.048,m:3007}),surface:surf('sand'),anchor:'friction'},o);
for (const gh of [false,true]) for (const src of ['jump','sprint']) {
  const r=P.collide(R({groundHolds:gh}),O({groundHolds:gh}),{source:src});
  console.log('gh',gh,src,'outcome',r.outcome,'held',r.held,'v0',f(r.v0),'Q',f(r.Q),'quakeHeld',f(r.quakeHeld),'hold.H',f(r.hold&&r.hold.H),'why',r.hold&&r.hold.why,'after',JSON.stringify(r.after&&r.after.splat));
}
