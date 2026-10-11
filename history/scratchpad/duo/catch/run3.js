const X = require('./catch.js');
const { P, K } = X;
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const g = K.g, V = P.bodyVolume(2), NS = 4.12e17;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: true, anchor: 'bolted' }, o || {});
const f = (x, n) => (x == null ? String(x) : (typeof x === 'number' ? Number(x).toPrecision(n || 4) : String(x)));
const ns = () => P.makeBody({ H: 2, m: NS * V });
function show(tag, r) {
  const a = r.aim || {}, c = r.catch || {}, w = r.wells || {};
  console.log(tag, '| barrier', f(w.barrier), 'gain', f(w.gain), 'inStroke', f(w.inStroke), 'wellDom', w.wellDominated,
    '| th', f(a.thetaDeg), 'vE', f(a.vE), 'vL', f(a.vL), 'vMax', f(a.vMax), 'ok', a.ok,
    '| t', f(r.time), 'vArr', f(r.vArrive), '| catch F', f(c.F), 'need', f(c.Fneed), 'cap', f(c.Fcap), 'hold', f(c.holdLoad), 'clean', c.clean, 'vSlam', f(c.vSlam), 'decelG', f(c.decelG),
    '| flags', ['unreachableAnySpeed', 'tooWeak', 'fireball', 'hardFails', 'cantHold'].filter((k) => r[k]).join(','), 'holdNeeded', f(r.holdNeeded), r.farthest ? 'far ' + f(r.farthest.range) : '');
}
for (const kg of [1e18, 1e21, 1e22]) {
  const F = kg * g;
  const r0 = P.throwObject(mk({ body: ns(), F }), obj('baseball'), 45);
  console.log('NS Rex dial', kg, 'baseball release v', f(r0.v), 'needed', f(r0.needed), 'canHold', r0.canHold, 'style', r0.style, 'vOut(engine)', f(r0.vOut), 'fallsBack', r0.fallsBack);
}
const F22 = 1e22 * g;
show('NS Rex -> Ollie(def) 1e22, D=10 easy', X.leg(mk({ body: ns(), F: F22 }), mk({ F: F22 }), obj('baseball'), 10, 'easy'));
show('NS Rex -> Ollie(def) 1e22, D=10 hard', X.leg(mk({ body: ns(), F: F22 }), mk({ F: F22 }), obj('baseball'), 10, 'hard'));
show('NS both 1e22, D=10 easy', X.leg(mk({ body: ns(), F: F22 }), mk({ body: ns(), F: F22 }), obj('baseball'), 10, 'easy'));
show('NS both 1e22, D=10 hard', X.leg(mk({ body: ns(), F: F22 }), mk({ body: ns(), F: F22 }), obj('baseball'), 10, 'hard'));
show('NS both 1e22, D=10 km shot easy', X.leg(mk({ body: ns(), F: F22 }), mk({ body: ns(), F: F22 }), obj('shot'), 10000, 'easy'));
show('NS both 1e22, D=10 km shot hard', X.leg(mk({ body: ns(), F: F22 }), mk({ body: ns(), F: F22 }), obj('shot'), 10000, 'hard'));
