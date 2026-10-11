const X = require('./catch2.js');
const { P, K } = X;
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const g = K.g;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const f = (x, n) => (x == null ? String(x) : (typeof x === 'number' ? Number(x).toPrecision(n || 4) : String(x)));
function show(tag, r) {
  const a = r.aim || {}, c = r.catch || {}, h = r.heat || {}, m = r.miss || {};
  console.log(tag, '|', r.result, '| th', f(a.thetaDeg), 'vE', f(a.vE), 'vL', f(a.vL), 'vMax', f(a.vMax),
    '| t', f(r.time), 'apex', r.flight ? f(r.flight.apex) : '-', 'vArr', f(r.vArrive), 'ang', f(r.angleDeg, 3),
    '| F', f(c.F), 'need', f(c.Fneed), 'R', f(c.R), 'slips', c.slips, 'slide', f(c.slide), 'u', f(c.uAfter), 'vSlam', f(c.vSlam), 'tS', f(c.tStroke), 'g', f(c.decelG), 'grip', f(c.gripRatio), 'sink', f(c.sinkRatio),
    '| heat', h.kind, f(h.noseC), f(h.frac), f(h.heatLoad), h.extrapolated ? 'EXTRAP' : '', h.radiation ? 'RAD' : '',
    '| miss', f(m.vImpact), f(m.E), f(m.crater), f(m.quake, 3),
    r.farthest ? '| far ' + f(r.farthest.range) + '@' + f(r.farthest.thetaDeg, 3) : '', r.needFactor ? 'need x' + f(r.needFactor) : '',
    r.fireball ? '| fireball E ' + f(r.fireball.E) + ' sweep ' + f(r.fireball.sweep) + ' inside ' + r.fireball.inside + ' dp ' + f(r.fireball.overpressure) : '');
}
const T = (fn) => { const t = Date.now(); const r = fn(); return [r, Date.now() - t]; };
const B = { anchor: 'bolted' };
const cases = [
  ['baseball', 10, 'hard', { F: Infinity }], ['baseball', 100, 'hard', { F: 1e9 * g }], ['baseball', 100, 'hard', { F: 1e12 * g }],
  ['car', 100, 'hard', { F: 1e12 * g }], ['car', 100, 'hard', { F: 1e12 * g, anchor: 'bolted' }],
  ['tank', 1e6, 'easy', { F: 1e12 * g, anchor: 'bolted' }], ['tank', 1e6, 'hard', { F: 1e12 * g, anchor: 'bolted' }],
  ['pyramid', 1e6, 'easy', { F: 1e15 * g, anchor: 'bolted', groundHolds: true }],
  ['pyramid', 1e7, 'easy', { F: 1e15 * g, anchor: 'bolted', groundHolds: true }],
  ['pyramid', Math.PI * K.R_E * 0.999, 'easy', { F: 1e15 * g, anchor: 'bolted', groundHolds: true }],
  ['ruyi', 1e6, 'easy', { F: 1e9 * g, anchor: 'bolted' }],
];
for (const [id, D, st, o] of cases) {
  const [r, ms] = T(() => X.leg(mk(o), mk(o), obj(id), D, st));
  show(id + ' D=' + f(D) + ' ' + st + ' F=' + f((o.F || mk().F) / g) + ' ' + (o.anchor || 'friction') + ' (' + ms + 'ms)', r);
}
for (const [id, D, o] of [['pyramid', 1e7, { F: 1e15 * g, anchor: 'bolted', groundHolds: true }], ['tank', 1e6, { F: 1e15 * g, anchor: 'bolted' }]]) {
  const [gm, ms] = T(() => X.game(mk(o), mk(o), obj(id), D, 'easy'));
  console.log('game', id, D, 'round', f(gm.round), 'a', gm.a.result, f(gm.a.time), 'b', gm.b.result, f(gm.b.time), ms + 'ms');
}
