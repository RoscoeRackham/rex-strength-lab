const fs = require('fs'), vm = require('vm');
const P = require('/home/user/dino-strength-sim/src/engine.js');
const win = {}; vm.runInNewContext(fs.readFileSync('/home/user/dino-strength-sim/src/data.js','utf8'), { window: win });
const D = win.DINO_DATA, K = P.K, g = K.g;
const base = { mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' };
const at = (kg) => Object.assign({}, base, { F: kg * g });
const pr = (kg) => { const j = P.jump(at(kg)); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); };
let prev = null;
for (let lg = 1; lg <= 34; lg += 0.01) { const v = pr(10 ** lg); if (v !== prev) { console.log('lg', lg.toFixed(2), 'kg', (10**lg).toExponential(3), '->', v, 'apex', P.jump(at(10**lg)).flight.apex); prev = v; } }
