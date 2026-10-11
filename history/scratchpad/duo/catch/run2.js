const X = require('./catch.js');
const { P, K } = X;
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const g = K.g;
const V = P.bodyVolume(2);
const NS = 4.12e17;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const f = (x, n) => (x == null ? String(x) : (typeof x === 'number' ? Number(x).toPrecision(n || 4) : String(x)));
function show(tag, r) {
  const a = r.aim || {};
  const c = r.catch || {};
  const w = r.wells || {};
  console.log(tag, '| barrier', f(w.barrier), 'gain', f(w.gain), 'inStroke', f(w.inStroke), 'wellDom', w.wellDominated, 'dBeat', f(w.dBeatT), f(w.dBeatC),
    '| th', f(a.thetaDeg), 'vE', f(a.vE), 'vL', f(a.vL), 'vMax', f(a.vMax), 'ok', a.ok,
    '| t', f(r.time), 'vArr', f(r.vArrive), '| catch F', f(c.F), 'need', f(c.Fneed), 'cap', f(c.Fcap), 'hold', f(c.holdLoad), 'clean', c.clean, 'slips', c.slips, 'slide', f(c.slide), 'vSlam', f(c.vSlam),
    '| flags', ['unreachableAnySpeed', 'tooWeak', 'fireball', 'hardFails', 'cantHold', 'blackHoleThrower', 'blackHoleCatcher'].filter((k) => r[k]).join(','), 'hold', f(r.holdNeeded), r.farthest ? 'far ' + f(r.farthest.range) : '');
}
const ns = () => P.makeBody({ H: 2, m: NS * V });
console.log('NS body m', ns().m, 'R_eq', P.eqRadius(ns()), 'GM', K.G * ns().m);
// 1. NS Rex throws to default Ollie, default dial: can he?
show('NS Rex -> Ollie, dial 100t, D=10 easy', X.leg(mk({ body: ns(), anchor: 'bolted', groundHolds: true }), mk({ anchor: 'bolted', groundHolds: true }), obj('baseball'), 10, 'easy'));
show('NS Rex -> Ollie, dial 1e7 kg, D=10 easy', X.leg(mk({ body: ns(), F: 1e7 * g, anchor: 'bolted', groundHolds: true }), mk({ F: 1e7 * g, anchor: 'bolted', groundHolds: true }), obj('baseball'), 10, 'easy'));
show('NS Rex -> Ollie, dial 1e7 kg, D=10 hard', X.leg(mk({ body: ns(), F: 1e7 * g, anchor: 'bolted', groundHolds: true }), mk({ F: 1e7 * g, anchor: 'bolted', groundHolds: true }), obj('baseball'), 10, 'hard'));
show('Rex -> NS Ollie, dial 100t, D=10 easy', X.leg(mk({ anchor: 'bolted', groundHolds: true }), mk({ body: ns(), anchor: 'bolted', groundHolds: true }), obj('baseball'), 10, 'easy'));
show('Rex -> NS Ollie, dial 1e7, D=10 easy', X.leg(mk({ F: 1e7 * g, anchor: 'bolted', groundHolds: true }), mk({ body: ns(), F: 1e7 * g, anchor: 'bolted', groundHolds: true }), obj('baseball'), 10, 'easy'));
show('NS both, dial 1e7, D=10 easy', X.leg(mk({ body: ns(), F: 1e7 * g, anchor: 'bolted', groundHolds: true }), mk({ body: ns(), F: 1e7 * g, anchor: 'bolted', groundHolds: true }), obj('baseball'), 10, 'easy'));
show('NS both, dial 1e7, D=10 km easy', X.leg(mk({ body: ns(), F: 1e7 * g, anchor: 'bolted', groundHolds: true }), mk({ body: ns(), F: 1e7 * g, anchor: 'bolted', groundHolds: true }), obj('shot'), 10000, 'easy'));
// game: can they stay apart?
const gm = X.game(mk({ body: ns(), anchor: 'friction' }), mk({ anchor: 'friction' }), obj('baseball'), 10, 'easy');
console.log('game NS Rex vs Ollie friction: pull', gm.pull.F, 'holdR', gm.holdR, 'holdO', gm.holdO, 'together', JSON.stringify(gm.together));
const gm2 = X.game(mk(), mk(), obj('baseball'), 10, 'easy');
console.log('game default: pull', gm2.pull.F, 'round', gm2.round);
// wells numbers
const w = X.wells(ns(), P.makeBody({}), obj('baseball'), 10);
console.log('wells NS->default', JSON.stringify({ x0: w.x0, x1: w.x1, xs: w.xs, rHeld: w.rHeld, rMeet: w.rMeet, barrier: w.barrier, gain: w.gain }));
const w2 = X.wells(ns(), ns(), obj('baseball'), 10);
console.log('wells NS->NS', JSON.stringify({ x0: w2.x0, x1: w2.x1, xs: w2.xs, rHeld: w2.rHeld, rMeet: w2.rMeet, barrier: w2.barrier, gain: w2.gain, inStroke: w2.inStroke }));
console.log('wellTime NS-NS vE=10', X.wellTime(w2, 10));
