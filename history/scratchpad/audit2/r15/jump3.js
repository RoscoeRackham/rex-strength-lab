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
const [gh, a, b] = process.argv.slice(2).map(Number);
for (let i=Math.round(a*100);i<=Math.round(b*100);i++) {
  const lk=i/100;
  const t0=Date.now();
  const r = P.jump(ctx({H,m,surface:'concrete',groundHolds:!!gh,logKg:lk}));
  const f=r.flight;
  console.log(!!gh, lk, r.v.toFixed(1), 'esc',f.escaped, 'to',f.timedOut, 'landed', f.landed, 'apex km',(f.apex/1e3).toFixed(0), 'days',(f.time/86400).toFixed(1), 'vImp', f.vImpact.toFixed(0), 'steps', f.steps, (Date.now()-t0)+'ms');
}
