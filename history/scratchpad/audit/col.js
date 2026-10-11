global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg,anchor,gh)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:180}),surface:S,groundHolds:!!gh,anchor:anchor||'friction'});
const c=299792458;
for (const [b,anc] of [[0.9/Math.sqrt(1-0.81),'friction'],[0.9/Math.sqrt(1-0.81),'bolted'],[100,'friction'],[1e4,'friction']]) {
  const r=P.collide(mk(90718.474),mk(90718.474,anc),{source:'set',gb:b});
  const KA=r.KA, mc2=180*c*c;
  console.log('gb',b.toPrecision(3),anc,'outcome',r.outcome,'KA',KA.toExponential(3),'Q',r.Q.toExponential(3),'Elocal',r.Elocal.toExponential(3),'airRunUp',r.airRunUp.toExponential(3),'airStopsHim',r.airStopsHim,'V',r.h.inel&&r.h.inel.V/c);
  // momentum/energy check for splat (free): invariant mass
  if (r.outcome==='moved') { const p=r.pA, EA=Math.sqrt(mc2*mc2+(p*c)**2); const Etot=EA+mc2; const Ms=Math.sqrt(Etot**2-(p*c)**2)/c**2; console.log('  check Q=(Ms-2m)c2',((Ms-360)*c*c).toExponential(4),'engine',r.Q.toExponential(4),'V=pc2/Etot',(p*c*c/Etot/c).toFixed(6)); }
}
