const fs = require('fs'), vm = require('vm');
const ROOT = '/home/user/dino-strength-sim/src/';
const P = require(ROOT + 'engine.js');
const win = {}; vm.runInNewContext(fs.readFileSync(ROOT + 'data.js', 'utf8'), { window: win });
const D = win.DINO_DATA, K = P.K, g = K.g;
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find((s) => s.id === 'concrete');
const at = (kg) => ({ F: kg * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' });
for (let lg = 1; lg <= 34; lg += 0.5) {
  const j = P.jump(at(10 ** lg));
  console.log(lg.toFixed(1), 'v', j.v.toExponential(3), 'apex', j.flight && j.flight.apex != null ? j.flight.apex.toExponential(3) : j.flight, 'esc', j.flight && j.flight.escaped, 'rel', j.flight && j.flight.relativistic);
}
