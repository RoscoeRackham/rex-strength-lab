global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const surface = D.surfaces.find((s) => s.id === 'concrete');
for (const [H, m] of [[3.048, 7055467972], [3.048, 1764847463.85], [2, 1993292000], [2, 4.986e8], [3.048, 3e9], [3.048, 1.5e10], [3.048, 4e10]]) {
  const body = P.makeBody({ H, m, build: 'rex' });
  const w = P.weight({ F: 1e5, body, surface, groundHolds: false, mode: 'comic', anchor: 'friction' });
  const f = w.fall; if (!f) { console.log(H, m, 'no fall', w.ground.regime); continue; }
  const s = f.stuck;
  console.log(H, m.toExponential(3), 'stuck', !!s, s && ('r ' + (s.r / 1000).toFixed(1) + ' km drift ' + s.driftKm.toFixed(1) + ' km  angle(deg) ' + (s.driftKm / (s.r / 1000) * 180 / Math.PI).toFixed(1)), 'firstPass', !!f.firstPass, 'minR km', (f.minR / 1000).toFixed(1), 'range', w.stuckRange && [(w.stuckRange.rMin / 1000).toFixed(2), (w.stuckRange.rMax / 1000).toFixed(1), w.stuckRange.swings]);
}
