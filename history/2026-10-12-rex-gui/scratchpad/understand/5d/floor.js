global.window = {};
const P = require('./engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const footPulse = (body) => 2 * P.WALK.STAMP.t * Math.sqrt(P.WALK.HIP * body.H / P.WALK.HS.h);
const Tf = footPulse(rex);
console.log('footPulse(rex) s', Tf);
const src = (s, J, T) => P.vibSource(s, 'hann', 2 * J / T, T);
for (const F of [90718, 1e6, 1e7, 1e9]) for (const sid of ['concrete', 'sand']) {
  const c = { F: F * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'bolted' };
  const p = P.punch(c), s = P.stomp(c);
  const ps = src(c.surface, p.push.pB, Math.max(Tf, p.push.t)), bs = src(c.surface, s.push.pB, Math.max(Tf, s.push.t));
  const st = P.RESTRAINT.MOVES.stomp.shake(s, { surface: c.surface, body: rex });
  console.log(F.toExponential(2), sid, '| punch floored ppv5 mm/s', (P.ppvAt(ps, 5) * 1e3).toPrecision(3), 'plaster reach', P.plasterReach(ps).toPrecision(3), '| stomp impact ppv5', (P.ppvAt(st, 5) * 1e3).toPrecision(3), 'bolt-pull floored ppv5', (P.ppvAt(bs, 5) * 1e3).toPrecision(3));
}
// bus 45 deg, ice/concrete/sand, 1e5 and 1e6 dials, bolted all-out
for (const [sid, F] of [['concrete', 1e5], ['sand', 1e5], ['sand', 1e6], ['concrete', 1e6]]) {
  const c = { F: F * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'bolted' };
  const r = P.throwObject(c, obj('bus'), 45);
  console.log('bus', sid, F, 'push.t', r.push.t.toPrecision(3), '(floor', Tf.toPrecision(3) + ')');
}
// All-Star baseball, floored
for (const sid of ['concrete', 'granite', 'sand']) {
  const c = { F: 1.8e23 * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'bolted' };
  const r = P.throwObject(c, obj('baseball'), 0);
  const s1 = src(c.surface, r.push.pB, Math.max(Tf, r.push.t));
  console.log('ALLSTAR floored', sid, 'J', r.push.pB.toExponential(3), 'T', Math.max(Tf, r.push.t).toPrecision(3), 'Fpk', s1.F.toExponential(3), 'ppv5 m/s', P.ppvAt(s1, 5).toExponential(3), 'ppv 100km m/s', P.ppvAt(s1, 1e5).toExponential(3), 'ppv R_E m/s', P.ppvAt(s1, 6.371e6).toExponential(3), 'feel reach', P.ppvReach(s1, P.VIB.TH.feel), 'nonlinear 5m', P.ppvNonlinear(s1, 5), 'nonlinear 1000km', P.ppvNonlinear(s1, 1e6), 'magnitude-ish (E=?)');
}
