global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find((s) => s.id === 'concrete');
let last = null;
for (let lg = 3; lg <= 34; lg += 0.01) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body, surface, groundHolds: true, anchor: 'friction' };
  const r = P.jump(c); const f = r.flight;
  const s = f.escaped ? 'ESC' + (f.leavesHill ? 'H' : '') : f.timedOut ? 'TO' : 'L';
  if (f.apex > 1e8 || (last && last.s !== s)) console.log(lg.toFixed(2), s, (f.apex/1e3).toFixed(0), r.v.toFixed(1));
  last = { s };
  if (f.escaped && f.apex > 2e9) break;
}
