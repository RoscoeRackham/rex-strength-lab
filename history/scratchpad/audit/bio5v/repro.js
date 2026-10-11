// Independent reproduction of BIO-5 against the ORIGINAL engine (no patches).
global.window = {};
const fs = require('fs');
const P = require('/home/user/dino-strength-sim/src/engine.js');
eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'));
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const b = P.makeBody({});
console.log('MUSCLE.jump', P.MUSCLE.jump, 'comicFrac', P.MUSCLE.jump.comicFrac.toFixed(4));
console.log('body m', b.m, 'feetMass', b.feetMass, 'leg stroke', b.strokes.leg);
const ctx = (kg, o) => Object.assign({ F: isFinite(kg) ? kg * g : Infinity, mode: 'real', body: b, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});

// 1. engine jump() at 511 kg
for (const mode of ['real', 'comic']) {
  const j = P.jump(ctx(511, { mode }));
  console.log(mode, '511 kg: takeoff v', j.v.toFixed(3), 'apex (drag)', j.flight.apex.toFixed(3), 'vac', j.vacuumApex.toFixed(3), 'push t', j.push.t.toFixed(4));
}

// 2. Samozino-style loaded squat jump on the engine's real leg (ground rigid, as in a lab)
function trial(load, vmax, ff) {
  const mA = b.m - b.feetMass + load;
  const r = P.pushApart({ F: 511 * g * ff, d: b.strokes.leg, mA, mB: b.feetMass, RA: mA * g, RB: Infinity, mode: 'real', vmax });
  // system takeoff velocity: whole body incl. feet + load (momentum conserving, feet join at takeoff)
  const M = b.m + load;
  const vTO = r.vA * mA / M;
  const h = vTO * vTO / (2 * g);
  const hPO = b.strokes.leg;
  // Samozino simple method (mean values over push-off): F = M g (h/hPO + 1), v = sqrt(g h / 2)
  const Fs = M * g * (h / hPO + 1), vs = Math.sqrt(g * h / 2);
  // direct (impulse/time) mean values from the integration
  const Fd = mA * (r.vA / r.t + g), vd = b.strokes.leg / r.t;
  return { load, vTO, h, Fs, vs, Fd, vd, peakVrel: r.vA };
}
function fit(rows, fk, vk) {
  const n = rows.length; let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const r of rows) { sx += r[vk]; sy += r[fk]; sxx += r[vk] ** 2; sxy += r[vk] * r[fk]; }
  const sl = (n * sxy - sx * sy) / (n * sxx - sx * sx), ic = (sy - sl * sx) / n;
  return { F0kg: ic / b.m, V0: -ic / sl };
}
for (const [vmax, ff] of [[30, 1.0], [12, 1.4], [10, 1.5], [8, 1.7]]) {
  const rows = [0, 20, 40, 60, 80].map((L) => trial(L, vmax, ff));
  const fs_ = fit(rows, 'Fs', 'vs'), fd = fit(rows, 'Fd', 'vd');
  console.log(`vmax ${vmax} ff ${ff}: unloaded jump ${rows[0].h.toFixed(3)} m (vTO ${rows[0].vTO.toFixed(2)})` +
    ` | Samozino-method F0 ${fs_.F0kg.toFixed(1)} N/kg V0 ${fs_.V0.toFixed(2)} m/s | direct F0 ${fd.F0kg.toFixed(1)} N/kg V0 ${fd.V0.toFixed(2)} m/s`);
}

// 3. real-mode strength ladder, rigid ground and concrete
for (const gh of [true, false]) {
  for (const kg of [511, 1000, 2000, 5000, 1e4, 1e5, 1e6, 1e9, Infinity]) {
    const j = P.jump(ctx(kg, { groundHolds: gh }));
    console.log('real groundHolds', gh, 'kg', kg, 'v', j.v.toFixed(2), 'apex', j.flight.apex.toFixed(2), 'groundFails', j.groundFails, 'sat', !!j.push.saturated);
  }
}
