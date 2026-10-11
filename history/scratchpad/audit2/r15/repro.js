global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K || P.CONST;
console.log(Object.keys(P).join(','));
console.log(D.objects.map(o=>o.id).join(','));
const g = 9.80665;
function ctx(st) {
  const body = P.makeBody({ H: st.H||2, m: st.m||180 });
  const surface = D.surfaces.find((s) => s.id === (st.surface||'concrete'));
  return { F: Math.pow(10, st.logKg) * g, mode: st.mode||'comic', body, surface, groundHolds: !!st.groundHolds, anchor: st.anchor||'friction' };
}
const pyr = D.objects.find(o=>/pyramid/i.test(o.id));
console.log(pyr);
for (const lk of [16.85,16.88,16.90,16.91,16.92,16.93,16.94,16.95,16.96,16.97,16.98]) {
  const r = P.throwObject(ctx({logKg: lk, anchor: 'bolted'}), pyr, 45);
  const f = r.flight;
  console.log(lk, 'v', r.v.toFixed(1), 'range km', (f.range/1e3).toFixed(0), 'apex km', (f.apex/1e3).toFixed(0), 'days', (f.time/86400).toFixed(2), 'landed', f.landed, 'esc', f.escaped, 'to', f.timedOut, 'vImp', f.vImpact.toFixed(0));
}
