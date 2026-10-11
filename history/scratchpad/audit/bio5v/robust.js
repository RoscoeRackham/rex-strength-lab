global.window = {};
const fs = require('fs');
const P = require('/home/user/dino-strength-sim/src/engine.js');
eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'));
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const b = P.makeBody({});
// A. Relative-load protocol matching Garcia-Ramos 2019 (20-80 kg on 74.7 kg BM => 0.27-1.07 x BM)
function trial(load, vmax, ff) {
  const mA = b.m - b.feetMass + load;
  const r = P.pushApart({ F: 511 * g * ff, d: b.strokes.leg, mA, mB: b.feetMass, RA: mA * g, RB: Infinity, mode: 'real', vmax });
  if (r.stalled) return null;
  return { Fd: mA * (r.vA / r.t + g), vd: b.strokes.leg / r.t, Fbar: null };
}
function fit(rows) {
  rows = rows.filter(Boolean);
  const n = rows.length; let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const r of rows) { sx += r.vd; sy += r.Fd; sxx += r.vd ** 2; sxy += r.vd * r.Fd; }
  const sl = (n * sxy - sx * sy) / (n * sxx - sx * sx), ic = (sy - sl * sx) / n;
  // r^2
  const my = sy / n; let ssr = 0, sst = 0;
  for (const r of rows) { const p = ic + sl * r.vd; ssr += (r.Fd - p) ** 2; sst += (r.Fd - my) ** 2; }
  return { F0kg: ic / b.m, V0: -ic / sl, r2: 1 - ssr / sst, n };
}
const rel = [20, 40, 60, 80].map((L) => L / 74.7 * b.m);
for (const [vmax, ff] of [[30, 1.0], [12, 1.4], [10, 1.5]]) {
  const fa = fit([0, 20, 40, 60, 80].map((L) => trial(L, vmax, ff)));
  const fr = fit(rel.map((L) => trial(L, vmax, ff)));
  console.log(`vmax ${vmax} ff ${ff}: abs loads 0-80 kg V0 ${fa.V0.toFixed(2)} (r2 ${fa.r2.toFixed(4)}) | relative loads 0.27-1.07 BM (${rel.map(x=>x.toFixed(0)).join(',')} kg) V0 ${fr.V0.toFixed(2)} m/s F0 ${fr.F0kg.toFixed(1)} N/kg (n ${fr.n}, r2 ${fr.r2.toFixed(4)})`);
}
// B. push-off-distance normalisation: human hPO for 177 cm (trochanter-to-toe ~0.98 m minus trochanter height at 90 deg knee ~0.55 m) ~0.4 m
const hPOh = 0.40;
console.log('human FP V0 scaled to 0.5 m stroke at fixed strain rate:', (3.06 * 0.5 / hPOh).toFixed(2), 'm/s (range', ((3.06 - 0.42) * 0.5 / hPOh).toFixed(2), '-', ((3.06 + 0.42) * 0.5 / hPOh).toFixed(2), ')');
// C. throwPush real-mode ladder: shot put and car
const ctx = (kg, o) => Object.assign({ F: isFinite(kg) ? kg * g : Infinity, mode: 'real', body: b, surface: surf('concrete'), groundHolds: true, anchor: 'bolted' }, o || {});
const shot = D.objects.find((o) => o.id === 'shot') || { m: 7.26, area: Math.PI * 0.06 ** 2, Cd: 0.47, rho: 7800 };
console.log('shot obj', shot.id, shot.m);
for (const kg of [511, 2000, 1e4, 1e5, 1e6, Infinity]) {
  const t = P.throwObject(ctx(kg), shot, 37);
  console.log('real shot kg', kg, 'v', t.v.toFixed(2), 'range', t.flight.range.toFixed(1));
}
console.log('MUSCLE.throwPush', P.MUSCLE.throwPush, 'whip', P.MUSCLE.throwWhip);
