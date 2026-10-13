global.window = {};
const P = require('./engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const src = (s, J, T) => P.vibSource(s, 'hann', 2 * J / T, T);
for (const F of [90718, 1e6, 1e7, 1e9]) for (const sid of ['concrete', 'sand']) {
  const c = { F: F * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'bolted' };
  const p = P.punch(c), s = P.stomp(c), sf = P.stomp(Object.assign({}, c, { anchor: 'friction' }));
  const ps = src(c.surface, p.push.pB, p.push.t), bs = src(c.surface, s.push.pB, s.push.t);
  const st = P.RESTRAINT.MOVES.stomp.shake(s, { surface: c.surface, body: rex }), stf = P.RESTRAINT.MOVES.stomp.shake(sf, { surface: c.surface, body: rex });
  console.log(F.toExponential(2), sid, '| punch J', p.push.pB.toPrecision(4), 'T', p.push.t.toPrecision(3), 'ppv5 mm/s', (P.ppvAt(ps, 5) * 1e3).toPrecision(3), 'plaster reach', P.plasterReach(ps).toPrecision(3),
    '| stomp bolted: foot-impact ppv5', (P.ppvAt(st, 5) * 1e3).toPrecision(3), 'bolt-pull J', s.push.pB.toPrecision(4), 'T', s.push.t.toPrecision(3), 'ppv5', (P.ppvAt(bs, 5) * 1e3).toPrecision(3), '| stomp friction impact ppv5', (P.ppvAt(stf, 5) * 1e3).toPrecision(3), 'vBody', sf.vBody.toPrecision(3), 'E', sf.E.toPrecision(3), 'vs bolted E', s.E.toPrecision(3));
}
