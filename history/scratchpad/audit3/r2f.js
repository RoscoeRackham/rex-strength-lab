global.window = {};
const P = require('./engine-fixed.js');
require('/home/user/dino-strength-sim/src/data.js');
const E = window.DINO_PHYSICS || P;
const D = window.DINO_DATA;
const Pk = (E && E.jump) ? E : (window.DINO_PHYSICS || window.PHYS || Object.values(window).find(o=>o&&o.jump));
const g = 9.80665;
const body = Pk.makeBody({H:2,m:180});
for (const mode of ['real','comic']) for (const s of D.surfaces) {
  const row = [];
  for (const F of [1e16*g, 1e20*g, 1e34*g, Infinity]) {
    const r = Pk.jump({F, mode, body, surface: s, groundHolds:false, anchor:'friction'});
    row.push(`${F===Infinity?'inf':Math.log10(F/g).toFixed(0)}: apex=${r.flight.apex.toPrecision(4)} v=${r.v.toPrecision(4)} held=${r.heldBack} fails=${r.groundFails} sink=${r.sink.toPrecision(3)}`);
  }
  console.log(mode, s.id, '\n  '+row.join('\n  '));
}
