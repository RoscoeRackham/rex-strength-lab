// Emulate a Samozino loaded-squat-jump force-velocity test on the engine's real-muscle leg at 511 kg strength.
// For each added load: run the engine's jump push (pushApart real, same params as jump()), take push-off time t and
// takeoff speed v; mean force over push-off F = M*(v/t + g); mean velocity = d/t. Linear fit F = F0L*(1 - v/V0L).
const { P, g } = require('./common.js');
const b = P.makeBody({});
function trial(load, vmax) {
  const mA = b.m - b.feetMass + load;
  const r = P.pushApart({ F: 511 * g, d: b.strokes.leg, mA, mB: b.feetMass, RA: mA * g, RB: Infinity, mode: 'real', vmax: vmax || 30 });
  const Fm = mA * (r.vA / r.t + g), vm = b.strokes.leg / r.t;
  return { load, v: r.vA, t: r.t, Fm, vm };
}
function fit(rows) {
  const n = rows.length; let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const r of rows) { sx += r.vm; sy += r.Fm; sxx += r.vm * r.vm; sxy += r.vm * r.Fm; }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx), icpt = (sy - slope * sx) / n;
  return { F0L: icpt, V0L: -icpt / slope, F0L_perkg: icpt / b.m };
}
for (const vmax of [30, 10, 7]) {
  const rows = [0, 20, 40, 60, 80].map((L) => trial(L, vmax));
  const f = fit(rows);
  console.log('vmax', vmax, rows.map((r) => `load ${r.load}: vTO ${r.v.toFixed(2)} meanV ${r.vm.toFixed(2)} meanF ${r.Fm.toFixed(0)}`).join(' | '));
  console.log('   linear F-v profile: F0 =', f.F0L.toFixed(0), 'N (', f.F0L_perkg.toFixed(1), 'N/kg ), V0 =', f.V0L.toFixed(2), 'm/s; unloaded jump height', (rows[0].v ** 2 / 2 / g * (b.m - b.feetMass) ** 2 / b.m ** 2).toFixed(3), 'm');
}
