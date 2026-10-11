global.window = {};
const fs = require('fs');
const P = require('/home/user/dino-strength-sim/src/engine.js');
eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'));
const D = window.DINO_DATA;
const g = P.K.g, b = P.makeBody({});
function trial(load, vmax, ff) {
  const mA = b.m - b.feetMass + load;
  const r = P.pushApart({ F: 511 * g * ff, d: b.strokes.leg, mA, mB: b.feetMass, RA: mA * g, RB: Infinity, mode: 'real', vmax });
  return { vA: r.vA, Fd: mA * (r.vA / r.t + g), vd: b.strokes.leg / r.t, M: b.m + load, mA };
}
function prof(vmax, ff) {
  const rows = [20, 40, 60, 80].map((L) => trial(L / 74.7 * b.m, vmax, ff));
  let n = 4, sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const r of rows) { sx += r.vd; sy += r.Fd; sxx += r.vd ** 2; sxy += r.vd * r.Fd; }
  const sl = (n * sxy - sx * sy) / (n * sxx - sx * sx), ic = (sy - sl * sx) / n;
  const u = trial(0, vmax, ff); const vTO = u.vA * u.mA / u.M;
  return { V0: -ic / sl, F0kg: ic / b.m, h: vTO * vTO / (2 * g) };
}
// grid fit: target unloaded jump 0.50 m and protocol-matched V0 3.8 m/s (3.06 m/s scaled by 0.5/0.40)
let best = null;
for (let vmax = 5; vmax <= 16; vmax += 0.5) for (let ff = 1.0; ff <= 2.2; ff += 0.05) {
  const p = prof(vmax, ff);
  const err = ((p.h - 0.5) / 0.05) ** 2 + ((p.V0 - 3.8) / 0.5) ** 2;
  if (!best || err < best.err) best = { vmax, ff: +ff.toFixed(2), err, ...p };
}
console.log('best fit', best);
// cap check by patching MUSCLE in memory (real mode reads MUSCLE.jump.vmax/forceFrac at call time)
const surf = D.surfaces.find((s) => s.id === 'concrete');
for (const [vmax, ff] of [[30, 1.0], [12, 1.4], [best.vmax, best.ff]]) {
  P.MUSCLE.jump.vmax = vmax; P.MUSCLE.jump.forceFrac = ff;
  const out = [511, 1e4, 1e6, Infinity].map((kg) => {
    const j = P.jump({ F: isFinite(kg) ? kg * g : Infinity, mode: 'real', body: b, surface: surf, groundHolds: true, anchor: 'friction' });
    return `${kg}: ${j.v.toFixed(2)} m/s apex ${j.flight.apex.toFixed(2)} m`;
  });
  console.log(`vmax ${vmax} ff ${ff} ->`, out.join(' | '));
}
