const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, body = P.makeBody({});
const S = (id) => D.surfaces.find(s => s.id === id);
for (const surf of ['sand','concrete','granite']) for (const mode of ['comic','real']) {
  const base = { F: 511*g, mode, body, surface: S(surf), groundHolds: false, anchor: 'friction' };
  const at = (kg) => Object.assign({}, base, { F: kg * g });
  const pred = (kg) => { const j = P.jump(at(kg)); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); };
  const th = P.threshold((F) => pred(F / g), 10, 1e34);
  // scan
  let segs = [], prev = null, start = null;
  for (let e = 1; e <= 34.0001; e += 0.01) { const kg = 10 ** e; const p = pred(kg); if (p !== prev) { if (prev === true) segs.push([start, e]); if (p) start = e; prev = p; } }
  if (prev) segs.push([start, 34]);
  console.log(surf, mode, 'UI threshold kg =', th/1 === Infinity ? 'Infinity' : (th / g).toExponential(4), ' true-segments (log10 kg):', segs.map(s => s.map(x => x.toFixed(2)).join('..')).join(', '));
}
// apex vs kg on concrete comic around bearing failure
const base = { F: 511*g, mode: 'comic', body, surface: S('concrete'), groundHolds: false, anchor: 'friction' };
for (const kg of [1e5, 1.29e5, 1.3e5, 1.5e5, 2e5, 5e5, 1e6, 3e6]) { const j = P.jump(Object.assign({}, base, { F: kg * g })); console.log('concrete comic', kg.toExponential(2), 'Fjump', j.F.toExponential(3), 'fails', j.groundFails, 'v', j.v.toPrecision(4), 'apex', j.flight.apex.toPrecision(4)); }
