const P = require('./../src/engine.js');
const g = P.K.g, body = P.makeBody({});
function v(F0, vmax, mHand, mObj, d) {
  return P.pushApart({ F: F0, d, mA: body.m - mHand, mB: mObj + mHand, RA: 1e9, RB: 0, mode: 'real', vmax }).vB;
}
let best = [];
for (const f of [0.3,0.35,0.4,0.5])
 for (const Vp of [30,35,40,45,50])
  for (const Vw of [55,60,70,80,90])
   for (const hw of [0.002,0.003,0.004,0.006])
    for (const dw of [2.2,2.6,3.0]) {
    const F0 = 511*g*f;
    const vs = v(F0,Vp,0.022*body.m,7.26,1.6), vb = v(F0,Vw,hw*body.m,0.145,dw), vj = v(F0,Vw,hw*body.m,0.8,dw);
    const err = ((vs-14)/14)**2 + ((vb-47)/47)**2 + ((vj-30)/30)**2;
    best.push([err.toFixed(4),f,Vp,Vw,hw,dw,vs.toFixed(1),vb.toFixed(1),vj.toFixed(1)]);
  }
best.sort((a,b)=>a[0]-b[0]); console.log(best.slice(0,6));
