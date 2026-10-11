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
const sizes = [[0.4, 180*Math.pow(0.2,3)],[2,180],[50,180*Math.pow(25,3)]];
const surfaces = D.surfaces.map(s=>s.id);
let hits = [];
for (const [H,m] of sizes) for (const sf of surfaces) for (const gh of [false,true]) for (const mode of ['comic']) {
  for (let i=100;i<=3400;i++) {
    const lk = i/100;
    const r = P.jump(ctx({H,m,surface:sf,groundHolds:gh,logKg:lk,mode}));
    const f = r.flight;
    if (r.relativistic || !(r.v>0)) continue;
    if (f.timedOut || (!f.escaped && f.apex > 3.844e8)) hits.push({H,sf,gh,lk,v:r.v.toFixed(1),apexkm:(f.apex/1e3).toFixed(0),days:(f.time/86400).toFixed(1),to:f.timedOut,landed:f.landed,vImp:f.vImpact.toFixed(0)});
  }
}
console.log(hits.length); console.log(hits.slice(0,60));
