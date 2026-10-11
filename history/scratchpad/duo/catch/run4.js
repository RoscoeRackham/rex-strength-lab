const X = require('./catch2.js');
const { P, K } = X;
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const g = K.g, V = P.bodyVolume(2), NS = 4.12e17;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const f = (x, n) => (x == null ? String(x) : (typeof x === 'number' ? Number(x).toPrecision(n || 4) : String(x)));
function show(tag, r) {
  const a = r.aim || {}, c = r.catch || {}, h = r.heat || {}, m = r.miss || {};
  console.log(tag, '|', r.result, '| th', f(a.thetaDeg), 'vE', f(a.vE), 'vL', f(a.vL), 'vMax', f(a.vMax),
    '| t', f(r.time), 'apex', r.flight ? f(r.flight.apex) : '-', 'vArr', f(r.vArrive), 'ang', f(r.angleDeg, 3),
    '| F', f(c.F), 'need', f(c.Fneed), 'R', f(c.R), 'slips', c.slips, 'slide', f(c.slide), 'vSlam', f(c.vSlam), 'tS', f(c.tStroke), 'g', f(c.decelG), 'grip', f(c.gripRatio), 'bb', f(c.baseballRatio), 'sink', f(c.sinkRatio),
    '| heat', h.kind, f(h.noseC), f(h.frac), f(h.heatLoad), h.extrapolated ? 'EXTRAP' : '', h.radiation ? 'RAD' : '',
    '| miss', f(m.vImpact), f(m.E), f(m.crater), f(m.quake, 3),
    r.farthest ? '| far ' + f(r.farthest.range) + '@' + f(r.farthest.thetaDeg, 3) : '', r.farthestAny ? '| farAny ' + f(r.farthestAny.range) : '', r.needFactor ? 'need x' + f(r.needFactor) : '',
    r.fireball ? '| fireball E ' + f(r.fireball.E) + ' sweep ' + f(r.fireball.sweep) + ' inside ' + r.fireball.inside + ' dp ' + f(r.fireball.overpressure) : '');
}
const T = (fn) => { const t = Date.now(); const r = fn(); return [r, Date.now() - t]; };
let [r, ms] = [];
const cases = [
  ['baseball', 10, 'easy', {}], ['baseball', 10, 'hard', {}], ['baseball', 60.5, 'easy', {}], ['baseball', 18.44, 'hard', {}],
  ['baseball', 1000, 'easy', {}], ['baseball', 1000, 'hard', {}],
  ['car', 10, 'easy', {}], ['car', 10, 'hard', {}], ['car', 30, 'easy', {}],
  ['shot', 1000, 'easy', {}], ['shot', 1000, 'hard', {}],
  ['baseball', 10, 'hard', { F: Infinity }], ['car', 100, 'hard', { F: 1e12 * g }],
  ['tank', 1e6, 'easy', { F: 1e12 * g }], ['tank', 1e6, 'hard', { F: 1e12 * g }],
  ['pyramid', 1e7, 'easy', { F: 1e15 * g }], ['pyramid', Math.PI * K.R_E * 0.999, 'easy', { F: 1e15 * g }],
];
for (const [id, D, st, o] of cases) {
  [r, ms] = T(() => X.leg(mk(o), mk(o), obj(id), D, st));
  show(id + ' D=' + f(D) + ' ' + st + ' F=' + f((o.F || mk().F) / g) + ' (' + ms + 'ms)', r);
}
// dense
const ns = () => P.makeBody({ H: 2, m: NS * V });
const B = { anchor: 'bolted', groundHolds: true, F: 1e22 * g };
for (const [tag, cT, cC, id, D, st] of [
  ['NS Rex -> Ollie', { body: ns() }, {}, 'baseball', 10, 'easy'],
  ['NS Rex -> Ollie', { body: ns() }, {}, 'baseball', 10, 'hard'],
  ['Rex -> NS Ollie', {}, { body: ns() }, 'baseball', 10, 'easy'],
  ['Rex -> NS Ollie dial100t', { F: 100 * 907.18474 * g }, { body: ns(), F: 100 * 907.18474 * g }, 'baseball', 10, 'easy'],
  ['NS both', { body: ns() }, { body: ns() }, 'baseball', 10, 'easy'],
  ['NS both', { body: ns() }, { body: ns() }, 'baseball', 10, 'hard'],
  ['NS both 10km', { body: ns() }, { body: ns() }, 'shot', 10000, 'easy'],
  ['NS both 10km', { body: ns() }, { body: ns() }, 'shot', 10000, 'hard'],
]) {
  [r, ms] = T(() => X.leg(mk(Object.assign({}, B, cT)), mk(Object.assign({}, B, cC)), obj(id), D, st));
  show(tag + ' ' + id + ' D=' + D + ' ' + st + ' (' + ms + 'ms)', r);
  const w = r.wells; if (w) console.log('    wells barrier', f(w.barrier), 'gain', f(w.gain), 'inStroke', f(w.inStroke), 'x0', f(w.x0), 'x1', f(w.x1), 'xs', f(w.xs), 'rHeld', f(w.rHeld), 'dom', w.wellDominated, r.escapeNeeded ? 'escapeNeeded ' + f(r.escapeNeeded) : '');
}
// game
let gm; [gm, ms] = T(() => X.game(mk(), mk(), obj('baseball'), 10, 'easy'));
console.log('game default baseball 10 m easy: round', f(gm.round), 'pull', f(gm.pull.F), ms + 'ms');
[gm, ms] = T(() => X.game(mk({ body: ns(), F: 1e22 * g }), mk({ F: 1e22 * g }), obj('baseball'), 10, 'easy'));
console.log('game NS Rex + Ollie friction: pull', f(gm.pull.F), 'holdR', f(gm.holdR), 'holdO', f(gm.holdO), 'together', gm.together && f(gm.together.t), gm.together && f(gm.together.vRel), ms + 'ms');
[gm, ms] = T(() => X.game(mk({ F: 1e12 * g }), mk({ F: 1e12 * g }), obj('tank'), 1e6, 'easy'));
console.log('game tank 1000 km easy round', f(gm.round), ms + 'ms');
// toss partner
const tp = X.tossPartner(mk(), P.makeBody({}), 'Ollie', 'easy', 10);
console.log('toss Ollie to 10 m:', tp.result, 'v', f(tp.v), 't', f(tp.flight && tp.flight.time), 'vImp', f(tp.flight && tp.flight.vImpact), 'F', f(tp.catch && tp.catch.F), 'sink', f(tp.catch && tp.catch.sinkRatio));
const tp2 = X.tossPartner(mk(), P.makeBody({}), 'Ollie', 'hard', 0);
console.log('toss Ollie hard:', tp2.result, 'v', f(tp2.v), 'apex', f(tp2.flight && tp2.flight.apex), 't', f(tp2.flight && tp2.flight.time), 'vImp', f(tp2.flight && tp2.flight.vImpact), 'F', f(tp2.catch && tp2.catch.F), 'clean', tp2.catch && tp2.catch.clean, 'sink', f(tp2.catch && tp2.catch.sinkRatio));
