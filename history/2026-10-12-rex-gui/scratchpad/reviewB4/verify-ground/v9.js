const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const conc = D.surfaces.find(s => s.id === 'concrete'), g = P.K.g;
const bus = D.objects.find(o => o.id === 'bus');
const OFF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: false };
const ON = Object.assign({}, OFF, { ownRecoil: true });
for (const [lab, pw] of [['recoil off', OFF], ['recoil on', ON]]) {
  for (const kg of [100 * 907.18474, 1e30]) {
    const c = Object.assign({ F: kg * g, mode: 'comic', body, surface: conc, anchor: 'friction' }, pw);
    const r = P.pull(c, bus);
    const J = P.vToMomentum(r.vEnd, bus.m) + r.resist * r.t10m;
    const src = P.impulseSource(conc, J, r.t10m);
    console.log(lab, 'kg', kg.toExponential(2), 'canMove', r.canMove, 't10m', r.t10m && r.t10m.toFixed(2), 'J', J.toFixed(0), 'mean F kN', (J / r.t10m / 1000).toFixed(1), 'ppv5 mm/s', (P.ppvAt(src, 5) * 1000).toFixed(3), 'engine shake', P.RESTRAINT.MOVES.pull.shake(r, Object.assign({ surface: conc, obj: bus, body }, pw)) ? 'counted' : 'none');
  }
}
