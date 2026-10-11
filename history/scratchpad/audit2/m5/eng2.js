global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
const o = D.objects.find(x=>x.id==='b777');
const body = P.makeBody({H:2,m:180});
const surface = D.surfaces.find(s=>s.id==='concrete');
for (const kg of [90718.474, 247200, 3e5, 297550, 907184.74]) {
  const c = {F: kg*g, mode:'comic', body, surface, groundHolds:false, anchor:'friction'};
  const r = P.lift(c, o);
  console.log(kg, 'canLift', r.canLift, 'margin', r.strengthMargin.toFixed(3), 'ground', r.groundRatio.toFixed(2), 'grip', r.gripRatio.toFixed(2), 'gripP', r.gripPressure.toExponential(3));
}
// jump60 threshold in real vs comic
for (const mode of ['real','comic']) for (const H of [0.4,2,50]) {
  const b = P.makeBody({H, m: 180*Math.pow(H/2,3)});
  const base = {mode, body:b, surface, groundHolds:false, anchor:'friction'};
  const kg = P.threshold((F)=>{const j=P.jump(Object.assign({},base,{F})); return j.v>0 && (j.flight.apex>=60||j.flight.escaped||j.flight.relativistic);}, 10*g, 1e45)/g;
  const jinf = P.jump(Object.assign({},base,{F:Infinity}));
  console.log(mode, H, 'threshold kg', kg, 'apex at inf', jinf.flight && jinf.flight.apex, 'v', jinf.v);
}
