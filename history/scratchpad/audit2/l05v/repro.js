global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
function ctx(st) {
  const body = P.makeBody({ H: st.H || 2, m: st.m || 180 });
  const surface = D.surfaces.find((s) => s.id === (st.surface || 'concrete'));
  return { F: st.inf ? Infinity : Math.pow(10, st.logKg) * g, mode: st.mode || 'comic', body, surface, groundHolds: !!st.groundHolds, anchor: st.anchor || 'friction', record: true };
}
function run(obj, logKg, angle, extra) {
  const o = D.objects.find((x) => x.id === obj);
  const r = P.throwObject(Object.assign(ctx(Object.assign({ logKg }, extra || {}))), o, angle);
  const f = r.flight;
  if (!f) return console.log(obj, logKg, angle, 'no flight');
  let pmax = 0; for (const p of f.path || []) pmax = Math.max(pmax, p[1]);
  console.log(obj, logKg, angle, JSON.stringify(extra||{}), 'v', r.v.toFixed(0), 'apex km', (f.apex/1e3).toFixed(1), 'chartApex km', (pmax/1e3).toFixed(1), 'ratio', (pmax/f.apex).toFixed(4), 'range km', (f.range/1e3).toFixed(0), 'pathlen', f.path && f.path.length, 'landed', f.landed, 'esc', f.escaped, 'orb', f.orbit);
  return f;
}
const f = run('loco', 18.7, 80);
run('titanic', 20, 45);
// count points with h > 150 km in path
const hi = f.path.filter((p) => p[1] > 150e3);
console.log('loco points above 150 km:', hi.length, hi.map((p) => [(p[0]/1e3).toFixed(0), (p[1]/1e3).toFixed(0)]));
module.exports = { run };
