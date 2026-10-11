global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
function ctx(st) {
  const body = P.makeBody({ H: st.H, m: st.m });
  const surface = D.surfaces.find((s) => s.id === (st.surface||'concrete'));
  return { F: Math.pow(10, st.logKg) * g, mode: st.mode||'comic', body, surface, groundHolds: !!st.groundHolds, anchor: st.anchor||'friction' };
}
const H=50, m=180*Math.pow(25,3);
for (const gh of [false,true]) {
  const surf = 'concrete';
  // coarse scan for v vs logKg
  let prev=null;
  for (let i=1000;i<=3400;i+=10) {
    const lk=i/100;
    const r = P.jump(ctx({H,m,surface:surf,groundHolds:gh,logKg:lk}));
    if (r.v>10000 && r.v<20000) console.log(gh, lk, r.v.toFixed(1), r.flight.escaped, r.flight.timedOut, (r.flight.apex/1e3).toFixed(0));
  }
}
