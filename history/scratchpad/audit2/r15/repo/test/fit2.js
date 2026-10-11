const P = require('./../src/engine.js');
const g = P.K.g, body = P.makeBody({});
function v(F0, vmax, mHand, mObj, d) {
  return P.pushApart({ F: F0, d, mA: body.m - mHand, mB: mObj + mHand, RA: 1e9, RB: 0, mode: 'real', vmax }).vB;
}
let best = [];
for (const f of [0.1,0.15,0.2,0.25,0.3])
 for (const Vp of [15,18,20,22,25,30,35])
  for (const Vw of [50,55,60,65,70,80]) {
    const F0 = 511*g*f;
    const vs = v(F0,Vp,0.022*body.m,7.26,1.6), vb = v(F0,Vw,0.006*body.m,0.145,2.2), vj = v(F0,Vw,0.006*body.m,0.8,2.2);
    const err = ((vs-14)/14)**2 + ((vb-47)/47)**2 + ((vj-30)/30)**2;
    best.push([err.toFixed(4),f,Vp,Vw,vs.toFixed(1),vb.toFixed(1),vj.toFixed(1)]);
  }
best.sort((a,b)=>a[0]-b[0]); console.log(best.slice(0,6));
for (const V of [25,30,40]) { const c={F:511*g,mode:'real',body,surface:{qult:30e6,mu:.7,shear:5e6},groundHolds:false,anchor:'friction'}; P.MUSCLE.jump.vmax=V; const j=P.jump(c); console.log('jump vmax',V,'v',j.v.toFixed(2),'apex',j.flight.apex.toFixed(2)); }
