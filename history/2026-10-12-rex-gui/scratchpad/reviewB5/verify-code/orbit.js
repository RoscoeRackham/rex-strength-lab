const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const RS = P.RESTRAINT;
const obj = D.objects.find(o => o.id === 'baseball');
const surface = D.surfaces.find(s => s.id === 'concrete');
const F = Math.pow(10, 8.2) * P.K.g;
const ctx = { F, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const opt = { near: 5, m: body.m, body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, obj, angle: 0 };
const r = RS.MOVES.throw.run(Object.assign({}, ctx, { use: F }), opt);
const f = r.flight;
console.log('v', r.v, 'vOut', r.vOut, 'release h', body.releaseHeight, 'orbit', f.orbit, 'apex(m)', f.apex, 'landed', f.landed);
const R = P.K.R_E, GM = P.K.GM, rr = R + body.releaseHeight, v = r.vOut || r.v;
console.log('circular speed at surface', Math.sqrt(GM / R), 'escape', Math.sqrt(2 * GM / rr));
// level release: perigee is release point when v > circular
const eps = v * v / 2 - GM / rr, a = -GM / (2 * eps), h = rr * v, e = Math.sqrt(1 + 2 * eps * h * h / (GM * GM));
console.log('a', a, 'e', e, 'rp-R', a * (1 - e) - R, 'ra-R', a * (1 + e) - R);
// air density at perigee
console.log('density at 2.7m approx 1.225 kg/m3');
// real air (0%) for comparison
const ctx0 = Object.assign({}, ctx, { airAbsorb: 0 }), opt0 = Object.assign({}, opt, { airAbsorb: 0 });
const r0 = RS.MOVES.throw.run(Object.assign({}, ctx0, { use: F }), opt0);
console.log('0% air: landed', r0.flight.landed, 'range', r0.flight.range, 'orbit', r0.flight.orbit);
