// Independent repro of F10: jump ground chip uses c.F instead of r.F
global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const g = P.K.g;
console.log('comicFrac jump', P.MUSCLE.jump.comicFrac, 'real forceFrac', P.MUSCLE.jump.forceFrac);
const body = P.makeBody({ H: 2, m: 180 });
// chip logic transcribed from app.html:639-643, 764
function chip(c, r) {
  const ratio = r.groundFails ? (c.F / r.groundLimitForce) : (c.F / Math.max(r.groundLimitForce, 1));
  if (c.groundHolds) return 'Ground: comic, never breaks';
  if (ratio <= 1) return 'Ground holds (' + (ratio * 100).toPrecision(2) + '% of limit)';
  return 'Ground fails: ' + ratio.toPrecision(2) + 'x its limit';
}
function heldText(c, r) { return (!c.groundHolds && !r.groundFails && c.mode === 'comic') ? 'The ground held this time...' : ''; }
const cases = [['concrete', 100e3], ['asphalt', 20e3], ['sand', 1.5e3], ['clay', 1e3], ['granite', 4e6]];
for (const mode of ['comic', 'real']) {
  for (const [sid, kg] of cases) {
    const surface = D.surfaces.find((s) => s.id === sid);
    const c = { F: kg * g, mode, body, surface, groundHolds: false, anchor: 'friction' };
    const r = P.jump(c);
    console.log(mode.padEnd(5), sid.padEnd(8), (kg + ' kg').padEnd(10), 'RB', r.groundLimitForce.toExponential(3), 'r.F/RB', (r.F / r.groundLimitForce).toFixed(3), 'c.F/RB', (c.F / r.groundLimitForce).toFixed(3),
      '| groundFails', r.groundFails, 'sink', r.sink.toExponential(2), 'apex', r.flight.apex.toFixed(2), '| CHIP:', chip(c, r), '| sink tile:', r.groundFails ? 'yes' : 'no', '|', heldText(c, r));
  }
}
// window bounds in comic mode
const f = P.MUSCLE.jump.comicFrac;
console.log('wrong-chip window: c.F/RB in (1, ', (1 / f).toFixed(4), ']');
// also check: is sink exactly 0 when not failing? and does apex change across the threshold
const surface = D.surfaces.find((s) => s.id === 'concrete');
const RB = surface.qult * 2 * body.footArea;
for (const k of [0.99, 1.0, 1.2, 1.4, 1.406, 1.41, 1.5]) {
  const c = { F: k * RB, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' };
  const r = P.jump(c);
  console.log('c.F/RB', k, 'groundFails', r.groundFails, 'sink', r.sink, 'chip', chip(c, r));
}
