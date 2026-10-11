const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'concrete');
const at = (kg) => ({ F: kg * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' });
const pred = (kg) => { const j = P.jump(at(kg)); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); };
let prev = null; const flips = [];
for (let lg = 1; lg <= 34; lg += 0.01) { const p = pred(10 ** lg); if (prev !== null && p !== prev) flips.push((p ? '+' : '-') + lg.toFixed(2)); prev = p; }
console.log('concrete comic flips at log10 kg:', flips.join(' '));
const thF = P.threshold((F) => pred(F / g), 10, 1e34);
console.log('ladder threshold kg', (thF / g).toExponential(3));
for (const lg of [4.7, 4.8, 5.0, 5.2, 5.5, 6.0, 6.3, 7.0]) { const j = P.jump(at(10 ** lg)); console.log(lg, 'fails', j.groundFails, 'v', j.v.toFixed(2), 'apex', j.flight.apex.toFixed(1)); }
