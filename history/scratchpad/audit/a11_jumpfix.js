const { P, g } = require('./common.js');
const b = P.makeBody({});
function trial(load, vmax, ff) {
  const mA = b.m - b.feetMass + load;
  const r = P.pushApart({ F: 511 * g * ff, d: b.strokes.leg, mA, mB: b.feetMass, RA: mA * g, RB: Infinity, mode: 'real', vmax });
  return { v: r.vA, Fm: mA * (r.vA / r.t + g), vm: b.strokes.leg / r.t };
}
function prof(vmax, ff) {
  const rows = [0, 20, 40, 60, 80].map((L) => trial(L, vmax, ff));
  let n = rows.length, sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const r of rows) { sx += r.vm; sy += r.Fm; sxx += r.vm ** 2; sxy += r.vm * r.Fm; }
  const sl = (n * sxy - sx * sy) / (n * sxx - sx * sx), ic = (sy - sl * sx) / n;
  const pTO = rows[0].v * (b.m - b.feetMass) / b.m;
  return { V0: -ic / sl, F0kg: ic / b.m, h: pTO * pTO / (2 * g) };
}
for (const [vmax, ff] of [[30, 1.0], [8, 1.3], [8, 1.6], [10, 1.4], [10, 1.6], [12, 1.4]]) {
  const p = prof(vmax, ff);
  console.log(`vmax ${vmax} forceFrac ${ff}: jump ${p.h.toFixed(2)} m, linear V0 ${p.V0.toFixed(2)} m/s, F0 ${p.F0kg.toFixed(1)} N/kg`);
}
