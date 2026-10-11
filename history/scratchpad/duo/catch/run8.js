const X = require('./catch2.js');
const { P, K } = X;
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const g = K.g;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const f = (x, n) => (x == null ? String(x) : (typeof x === 'number' ? Number(x).toPrecision(n || 5) : String(x)));
// unequal strengths
const gm = X.game(mk(), mk({ F: 1000 * g }), obj('car'), 10, 'easy');
const a = gm.a, b = gm.b;
console.log('Rex->Ollie(1 t) car 10 m:', a.result, 'v', f(a.aim.vL), 'arr', f(a.vArrive), 'need', f(a.catch.Fneed), 'cap', f(a.catch.Fcap), 'vSlam', f(a.catch.vSlam), 'slide', f(a.catch.slide), 'u', f(a.catch.uAfter), 'hold', f(a.catch.holdLoad), 'canHold', a.catch.canHold);
console.log('Ollie(1 t)->Rex car:', b.result, 'holdNeeded', f(b.holdNeeded), 'round', gm.round);
// baseball unequal: Ollie 10 kg dial
const gm2 = X.game(mk(), mk({ F: 10 * g }), obj('baseball'), 10, 'hard');
console.log('Rex hard -> Ollie(10 kg):', gm2.a.result, 'arr', f(gm2.a.vArrive), 'need', f(gm2.a.catch.Fneed), 'cap', f(gm2.a.catch.Fcap), 'vSlam', f(gm2.a.catch.vSlam), 'slide', f(gm2.a.catch.slide));
console.log('Ollie(10 kg) hard -> Rex:', gm2.b.result, 'v', f(gm2.b.aim && gm2.b.aim.vL), 'arr', f(gm2.b.vArrive), 'th', f(gm2.b.aim && gm2.b.aim.thetaDeg));
// real mode default
const r = X.leg(mk({ mode: 'real' }), mk({ mode: 'real' }), obj('baseball'), 10, 'hard');
console.log('real mode hard baseball 10 m: v', f(r.aim.vL), 'arr', f(r.vArrive), 'F', f(r.catch.F));
// comic ground + braced
const r3 = X.leg(mk({ anchor: 'braced' }), mk({ anchor: 'braced' }), obj('car'), 10, 'easy');
console.log('braced car easy: R', f(r3.catch.R), 'slips', r3.catch.slips, 'slide', f(r3.catch.slide), 'F', f(r3.catch.F));
const r4 = X.leg(mk({ anchor: 'bolted' }), mk({ anchor: 'bolted' }), obj('car'), 10, 'easy');
console.log('bolted car easy: F', f(r4.catch.F), 'slide', f(r4.catch.slide), 'sink', f(r4.catch.sinkRatio));
// sand: sinking
const r5 = X.leg(mk({ surface: surf('sand') }), mk({ surface: surf('sand') }), obj('car'), 10, 'easy');
console.log('sand car easy: F', f(r5.catch.F), 'R', f(r5.catch.R), 'sink', f(r5.catch.sinkRatio), 'slide', f(r5.catch.slide));
// 50 m kaiju throws to 2 m Ollie
const big = P.makeBody({ H: 50 });
const r6 = X.leg(mk({ body: big, F: 1e9 * g }), mk(), obj('car'), 100, 'easy'); console.log('r6', r6.result);
console.log('kaiju(50 m) -> Ollie(2 m) car 100 m easy:', r6.result, 'h0', f(r6.h0), 'hStop', f(r6.hStop), 'th', f(r6.aim.thetaDeg), 'v', f(r6.aim.vL), 'arr', f(r6.vArrive), 'ang', f(r6.angleDeg), 't', f(r6.time), 'F', f(r6.catch && r6.catch.F), r6.catch && r6.catch.clean);
// toss partner NS ollie by strong Rex
const ns = P.makeBody({ H: 2, m: 4.12e17 * P.bodyVolume(2) });
const tp = X.tossPartner(mk({ F: 1e18 * g, groundHolds: true, anchor: 'bolted' }), ns, 'Ollie', 'easy', 10);
console.log('toss NS Ollie to 10 m:', tp.result, 'v', f(tp.v), 't', f(tp.flight && tp.flight.time), 'F', f(tp.catch && tp.catch.F), 'cap', f(tp.catch && tp.catch.Fcap), 'hold', f(tp.holdNeeded));
// miss for baseball hard at 10 m and easy
const rr = X.leg(mk(), mk(), obj('shot'), 100, 'hard');
console.log('shot hard 100 m miss:', JSON.stringify(rr.miss));
// heat verdict example: baseball hard at 3 km/s release (dial for 3 km/s?)
for (const kg of [1e6, 1e7, 1e8]) {
  const r7 = X.leg(mk({ F: kg * g, anchor: 'bolted' }), mk({ F: kg * g, anchor: 'bolted' }), obj('baseball'), 30, 'hard');
  console.log('baseball hard 30 m dial', kg, 'v', f(r7.aim && r7.aim.vL), 'arr', f(r7.vArrive), 'heat', JSON.stringify(r7.heat && { kind: r7.heat.kind, noseC: r7.heat.noseC, frac: r7.heat.frac, Q: r7.heat.heatLoad, ex: r7.heat.extrapolated, rad: r7.heat.radiation }), 'bb', f(r7.catch && r7.catch.baseballRatio));
}
