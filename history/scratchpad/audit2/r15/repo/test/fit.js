const P = require('./../src/engine.js');
const g = P.K.g, body = P.makeBody({});
function v(F0, vmax, mHand, mObj) {
  const r = P.pushApart({ F: F0, d: body.strokes.throw, mA: body.m - mHand, mB: mObj + mHand, RA: 1e9, RB: 0, mode: 'real', vmax });
  return r.vB;
}
let best = [];
for (const f of [0.1,0.12,0.14,0.16,0.18,0.2,0.22,0.25,0.3,0.35,0.4,0.5])
 for (const V of [40,45,50,55,60,65,70,80,90,100])
  for (const hf of [0.006,0.01,0.014,0.018,0.022]) {
    const F0 = 511*g*f, mh = hf*body.m;
    const vs = v(F0,V,mh,7.26), vb = v(F0,V,mh,0.145), vj = v(F0,V,mh,0.8);
    const err = ((vs-14)/14)**2 + ((vb-47)/47)**2;
    best.push([err,f,V,hf,vs.toFixed(1),vb.toFixed(1),vj.toFixed(1)]);
  }
best.sort((a,b)=>a[0]-b[0]); console.log(best.slice(0,8));
// jump
for (const V of [8,10,12,14,16,20]) { const c={F:511*g,mode:'real',body,surface:{qult:30e6,mu:.7,shear:5e6},groundHolds:false,anchor:'friction'}; P.MUSCLE.jump.vmax=V; const j=P.jump(c); console.log('jump vmax',V,'v',j.v.toFixed(2),'apex',j.flight.apex.toFixed(2)); }
for (const V of [12,15,17,20,25]) { const c={F:511*g,mode:'real',body,surface:{qult:30e6,mu:.7,shear:5e6},groundHolds:false,anchor:'friction'}; P.MUSCLE.punch.vmax=V; const p=P.punch(c); console.log('punch vmax',V,'v',p.vFist.toFixed(2),'E',p.E.toFixed(0)); }
