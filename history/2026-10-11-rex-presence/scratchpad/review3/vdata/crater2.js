global.window = {};
const L = '/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(L + 'src/engine.js'); require(L + 'src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const c = { F: 1e6 * g, mode: 'comic', body: rex, surface: surf('sand'), groundHolds: false, anchor: 'friction' };
const p = P.RESTRAINT.planNow('jump', c, { target: 3, near: 5 });
for (const kg of [5e4, 1e5, 2.25e5, 2.3e5, 3e5, 1e6]) { const r = p.run(kg * g); console.log(kg, 'kg: apex', r.flight.apex.toFixed(2), 'sink', r.sink.toFixed(3), 'Eground', r.Eground.toPrecision(3), 'groundFails', r.groundFails, '-> verdict', r.groundFails ? (r.Eground >= 1e6 ? 'two craters' : 'two deep footprints') : 'plain'); }
