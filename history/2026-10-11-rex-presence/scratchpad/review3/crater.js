global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id);
for (const sid of ['sand', 'softclay']) for (const kg of [1e4, 1e5, 2e5, 3e5, 5e5, 1e6, 1e7]) {
  const c = { F: kg * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const r = P.jump(c);
  const hz = P.RESTRAINT.MOVES.jump.ground(r, { surface: surf(sid) });
  console.log(sid, kg.toExponential(0), 'apex', r.flight.apex.toFixed(2), 'Eground', (r.Eground/1e3).toFixed(0)+' kJ', 'sink', (r.sink*100).toFixed(0)+' cm', 'land Eground', r.landing ? (r.landing.Eground/1e3).toFixed(0)+' kJ':'-', 'land sink', r.landing? ((r.landing.sink||0)*100).toFixed(0)+' cm':'-', 'groundHazard', hz);
}
