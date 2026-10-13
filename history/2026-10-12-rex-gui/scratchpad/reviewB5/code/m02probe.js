global.window = {};
const path = require('path');
const { canon, hash } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const run = (file) => {
  delete require.cache[require.resolve(file)];
  const P = require(file), g = P.K.g, out = {};
  const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
  for (const sid of ['concrete']) for (const lg of [6, 8, 9, 10]) for (const [oid, D0] of [['car', 1e6], ['car', 1e7], ['baseball', 1e6], ['baseball', 2e7], ['shot', 1e7]]) for (const style of ['easy', 'hard']) {
    const R = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: D.surfaces.find((s) => s.id === sid), anchor: 'friction' }, O = Object.assign({}, R, { body: ollie });
    const L = P.catchLeg(R, O, D.objects.find((o) => o.id === oid), D0, style);
    if (L && L.flight) L.flight = Object.assign({}, L.flight, { path: L.flight.path ? L.flight.path.length : 0 });
    out[[sid, lg, oid, D0, style].join('|')] = { h: hash(canon(L)), r: L.result };
  }
  return out;
};
const a = run('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'), b = run(path.join(__dirname, 'mut/m02_flyto_orbit_gate.js'));
for (const k of Object.keys(a)) console.log(k, a[k].r, a[k].h === b[k].h ? 'same' : 'DIFF -> ' + b[k].r);
