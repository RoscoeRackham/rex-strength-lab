const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
function ctx(s) {
  const body = P.makeBody({ H: s.H, m: 180 * Math.pow(s.H / 2, 3) });
  const surface = D.surfaces.find((x) => x.id === (s.surface||'concrete'));
  return { F: s.inf ? Infinity : Math.pow(10, s.logKg) * g, mode: s.mode||'comic', body, surface, groundHolds: !!s.groundHolds, anchor: s.anchor||'friction' };
}
const which = process.argv[2];
if (which === 'stomp') {
  for (const H of [2, 50, 500]) for (const lk of [10, 20, 25, 30, 34, 'inf']) {
    const c = ctx({ H, logKg: lk === 'inf' ? 0 : lk, inf: lk === 'inf' });
    const r = P.stomp(c);
    console.log('stomp H', H, 'lk', lk, 'vFoot', r.vFoot.toExponential(3), 'crater', r.crater.toFixed(0), 'Dtc', (r.crater/1.25).toFixed(0));
  }
} else {
  const moon = D.objects.find(o => o.id === 'moon');
  for (const anchor of ['friction', 'bolted']) for (const gh of [false, true]) for (const lk of [30, 31, 32, 33, 33.5, 34]) {
    const t0 = Date.now();
    const c = ctx({ H: 2, logKg: lk, anchor, groundHolds: gh });
    const r = P.throwObject(c, moon, 45);
    const f = r.flight;
    console.log(anchor, gh, lk, 'v0', r.v.toFixed(0), 'vImp', (f.vImpact||0).toFixed(0), 'esc', !!f.escaped, 'rel', !!f.relativistic, 'crater', (r.crater/1e3).toFixed(0), 'km  Dtc', (r.crater/1.25/1e3).toFixed(0), 'km', (Date.now()-t0)+'ms');
  }
}
