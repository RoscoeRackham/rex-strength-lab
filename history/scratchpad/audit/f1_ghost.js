const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = global.window.DINO_DATA;
const body = P.makeBody({ H: 2, m: 180 });
const ctx = (lk) => ({ F: 10 ** lk * P.K.g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' });
for (const [id, lk] of [['tank', 14.67], ['shot', 8.34], ['tank', 14.5], ['tank', 15.0]]) {
  const o = D.objects.find(x => x.id === id);
  const r = P.throwObject(ctx(lk), o, 0);
  const f = r.flight;
  const t0 = Date.now();
  const gh = (!f.escaped && f.range < 5e6) ? P.fly({ v0: r.v, thetaDeg: 0, h0: body.releaseHeight, m: o.m, A: o.area, Cd: 0, record: true, tMax: 4 * 86400 }) : null;
  const ms = Date.now() - t0;
  console.log(id, lk, 'v', r.v.toFixed(0), 'f.range km', (f.range/1e3).toFixed(1), 'ghost?', !!gh, gh ? ('steps ' + gh.steps + ' range km ' + (gh.range/1e3).toFixed(0) + ' timedOut ' + gh.timedOut + ' shown? ' + (gh.range < 40 * Math.max(f.range, 1))) : '', 'ms', ms);
}
