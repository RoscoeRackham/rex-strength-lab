global.window = {};
const P = require('./head/engine.js');
require('./head/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id);
const base = { F: 100 * 907.18474 * g, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' };
const pl = P.RESTRAINT.planNow('jump', base, { near: 5, target: 3 });
const use = pl.goal().use;
console.log('least use kg', use / g);
for (const soft of [false, true]) {
  const r = P.jump(Object.assign({}, base, { use, softLanding: soft }));
  const L = r.landing;
  console.log('soft', soft, 'Eland', L.E.toFixed(0), 'Eimpact', L.Eimpact.toFixed(0), 'F', L.F.toFixed(0), 'absorbed', L.absorbed.toFixed(0), 'ratio', L.ratio.toFixed(3));
}
