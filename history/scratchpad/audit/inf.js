global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg,anchor,gh)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:180}),surface:S,groundHolds:!!gh,anchor:anchor||'friction'});
for (const gh of [false,true]) {
 const r=P.collide(mk(90718.474),mk(90718.474,'bolted',gh),{source:'set',gb:Infinity});
 console.log('groundHolds',gh,'outcome',r.outcome,'held',r.held,'unlimitedVsBolted',r.unlimitedVsBolted,'earth',JSON.stringify(r.earth),'rock',JSON.stringify(r.rock));
}
