global.window = {};
const P = require('./engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
console.log(D.surfaces.map(s => s.id + ' mu ' + s.mu + ' modelled ' + !!P.groundOf(s)).join('; '));
for (const sid of ['sand', 'gravel', 'softclay', 'asphalt', 'concrete']) for (const F of [1e5, 1e6]) {
  const c = { F: F * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const p = P.RESTRAINT.planNow('throw', c, { obj: obj('bus'), angle: 45, target: 30, near: 5 });
  const ce = p.ceiling();
  console.log(sid, F, 'ceiling', ce.by, ce.use === Infinity ? 'inf' : (ce.use / g).toPrecision(4), p.hazards().map(h => h.id + ':' + (h.never ? '-' : (h.use / g).toPrecision(3))).join(' '));
}
