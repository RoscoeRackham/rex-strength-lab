const X = require('./catch.js');
const { P, K } = X;
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const g = K.g;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const f = (x, n) => (x == null ? String(x) : (typeof x === 'number' ? Number(x).toPrecision(n || 4) : String(x)));
function show(tag, r) {
  const a = r.aim || {};
  const c = r.catch || {};
  console.log(tag, '| th', f(a.thetaDeg), 'vE', f(a.vE), 'vL', f(a.vL), 'vMax', f(a.vMax), 'ok', a.ok,
    '| t', f(r.time), 'apex', r.flight && f(r.flight.apex), 'range', r.flight && f(r.flight.range), 'vArr', f(r.vArrive), 'ang', r.flight && f(r.flight.impactAngleDeg, 3),
    '| catch F', f(c.F), 'need', f(c.Fneed), 'cap', f(c.Fcap), 'clean', c.clean, 'slips', c.slips, 'R', f(c.R), 'slide', f(c.slide), 'vSlam', f(c.vSlam), 'tStroke', f(c.tStroke), 'decelG', f(c.decelG), 'grip', f(c.gripRatio), 'sink', f(c.sinkRatio),
    '| heat', r.heat && f(r.heat.heatLoad), r.heat && f(r.heat.meltFrac), r.heat && f(r.heat.stagT),
    '| flags', ['unreachableAnySpeed', 'tooWeak', 'fireball', 'hardFails', 'cantHold', 'blackHoleThrower', 'blackHoleCatcher'].filter((k) => r[k]).join(','),
    r.farthest ? 'far ' + f(r.farthest.range) + '@' + f(r.farthest.thetaDeg, 3) : '', r.farthestAnySpeed ? 'farAny ' + f(r.farthestAnySpeed.range) : '', r.miss ? 'miss v ' + f(r.miss.vImpact) + ' E ' + f(r.miss.E) + ' crater ' + f(r.miss.crater) : '');
}
const t0 = Date.now();
for (const id of ['baseball', 'shot', 'bowling', 'piano', 'car', 'tank']) {
  for (const D of [10, 100, 1000]) {
    for (const st of ['easy', 'hard']) {
      const ts = Date.now();
      const r = X.leg(mk(), mk(), obj(id), D, st);
      show(id + ' D=' + D + ' ' + st + ' (' + (Date.now() - ts) + 'ms)', r);
    }
  }
}
console.log('total ms', Date.now() - t0);
