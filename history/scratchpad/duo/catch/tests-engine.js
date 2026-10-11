// Expected values for the design's test list. Run: node tests.js
global.window={}; const P0 = require('/home/user/dino-strength-sim/src/engine.js'); const R0 = require('./catch2.js'); const X = Object.assign({}, R0, { leg: P0.catchLeg, game: P0.catchGame, tossPartner: P0.tossPartner, catchIt: P0.catchIt, flyTo: P0.flyTo, P: P0 });
const { P, K, flyTo } = X;
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const g = K.g, V = P.bodyVolume(2), NS = 4.12e17;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
let fails = 0;
const check = (name, got, want, tol) => { const ok = Math.abs(got - want) <= tol; if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + name + ': ' + (+Number(got).toPrecision(6)) + ' (want ' + want + ' ± ' + tol + ')'); };
const flag = (name, cond) => { if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name); };
const bb = obj('baseball');
// T1 flyTo with hStop 0 = fly
{ const a = P.fly({ v0: 200, thetaDeg: 30, h0: 1.8, m: bb.m, A: bb.area, Cd: bb.Cd, CdSup: bb.CdSup }); const b = flyTo({ v0: 200, thetaDeg: 30, h0: 1.8, m: bb.m, A: bb.area, Cd: bb.Cd, CdSup: bb.CdSup }); check('T1 flyTo(hStop 0) range = fly range', b.range, a.range, 1e-9); }
// T2 Sutton-Graves flux at sea level, 3 km/s, baseball nose radius
{ const f = flyTo({ v0: 3000, thetaDeg: 45, h0: 1.8, hStop: 1.8, m: bb.m, A: bb.area, Cd: bb.Cd, CdSup: bb.CdSup, Rn: Math.sqrt(bb.area / Math.PI) }); check('T2 SG peak flux (W/m2)', f.qMax, 2.710e7, 0.01e7); }
// T3 easy toss baseball 10 m
const e10 = X.leg(mk(), mk(), bb, 10, 'easy');
check('T3 easy 10 m launch speed', e10.aim.vL, 10.16, 0.05); check('T3 angle', e10.aim.thetaDeg, 45.1, 1.5); check('T3 flight time', e10.time, 1.446, 0.01); check('T3 arrival', e10.vArrive, 9.674, 0.03);
check('T3 catch force N', e10.catch.F, 11.33, 0.1); check('T3 stroke time', e10.catch.tStroke, 0.124, 0.002); flag('T3 footing holds', !e10.catch.slips);
// T4 hard baseball 10 m
const h10 = X.leg(mk(), mk(), bb, 10, 'hard');
check('T4 hard release', h10.aim.vL, 629.1, 1); check('T4 arrival = v exp(-10/60.39)', h10.vArrive, 533.1, 1); check('T4 catch force', h10.catch.F, 34385, 100);
check('T4 slide m', h10.catch.slide, 0.0152, 0.001); check('T4 vs home-run squeeze', h10.catch.baseballRatio, 0.860, 0.01); flag('T4 heat warm (nose 212 C < 300 C)', h10.heat.kind === 'warm' && Math.abs(h10.heat.noseC - 212) < 1);
// T5 car easy 10 m: Ollie slides
const c10 = X.leg(mk(), mk(), obj('car'), 10, 'easy');
check('T5 car catch force', c10.catch.F, 50734, 200); check('T5 footing limit R', c10.catch.R, 43330, 200); check('T5 slide', c10.catch.slide, 1.27, 0.05);
// T6 limits: baseball farthest at default strength; too weak for 1 km
const b1k = X.leg(mk(), mk(), bb, 1000, 'easy');
flag('T6 1 km: too weak', b1k.result === 'too-weak'); check('T6 farthest at full strength (m)', b1k.farthest.range, 470.6, 3); flag('T6 needed speed burns it up', b1k.heat.kind === 'destroyed');
// T7 terminal speed
check('T7 baseball terminal speed (Adair ~42)', Math.sqrt(2 * bb.m * g / (K.rho0 * bb.Cd * bb.area)), 39.45, 0.05);
// T8 round trip default
const gm = X.game(mk(), mk(), bb, 10, 'easy'); check('T8 round trip s', gm.round, 3.14, 0.02);
// T9 NS thrower barrier
const ns = () => P.makeBody({ H: 2, m: NS * V });
const B = { anchor: 'bolted', groundHolds: true, F: 1e22 * g };
const n1 = X.leg(mk(Object.assign({}, B, { body: ns() })), mk(B), bb, 10, 'easy');
check('T9 barrier J/kg', n1.wells.barrier, 9.308e6, 0.002e6); check('T9 launch speed', n1.aim.vL, 4315, 2); check('T9 arrival', n1.vArrive, 9.903, 0.01);
const n0 = X.leg(mk({ body: ns() }), mk(), bb, 10, 'easy'); flag('T9b default dial: cannot even hold his arm up', n0.result === 'cant-hold'); check('T9b hold needed N', n0.holdNeeded, 2.182e15, 0.002e15);
// T10 NS catcher
const n2 = X.leg(mk(B), mk(Object.assign({}, B, { body: ns() })), bb, 10, 'easy');
check('T10 arrival into NS hands', n2.vArrive, 2243.2, 1); check('T10 catch force', n2.catch.F, 1.0377e6, 0.001e6);
const n3 = X.leg(mk({ anchor: 'bolted', groundHolds: true }), mk({ body: ns(), anchor: 'bolted', groundHolds: true }), bb, 10, 'easy');
flag('T10b default dial: slams', n3.result === 'slams'); check('T10b slam speed', n3.catch.vSlam, 1105.8, 1);
// T11 they fall together
const g2 = X.game(mk({ body: ns(), F: 1e22 * g }), mk({ F: 1e22 * g }), bb, 10, 'easy');
check('T11 pull N', g2.pull.F, 8.909e6, 0.002e6); check('T11 fall-together time s', g2.together.t, 0.01566, 0.0002);
// T12 NS both
const n4 = X.leg(mk(Object.assign({}, B, { body: ns() })), mk(Object.assign({}, B, { body: ns() })), bb, 10, 'easy');
check('T12 barrier', n4.wells.barrier, 8.440e6, 0.002e6); check('T12 launch', n4.aim.vL, 4109, 2); check('T12 arrival', n4.vArrive, 1816, 2);
// T13 fireball
const f1 = X.leg(mk({ F: Infinity }), mk({ F: Infinity }), bb, 10, 'hard');
flag('T13 infinite strength: fireball, plasma reaches Ollie', f1.result === 'fireball' && f1.fireball.kind === 'plasma'); check('T13 sweep m', f1.fireball.sweep, 27.78, 0.01);
const f2 = X.leg(mk({ F: 1e30 * g, anchor: 'bolted' }), mk({ F: 1e30 * g, anchor: 'bolted' }), obj('pyramid'), 10, 'hard');
flag('T13b pyramid arrives', f2.fireball.kind === 'arrives'); check('T13b sweep km', f2.fireball.sweep / 1000, 141.15, 0.1);
// T14 toss Ollie
const tp = X.tossPartner(mk(), P.makeBody({}), 'Ollie', 'easy', 10);
check('T14 toss speed', tp.v, 12.83, 0.05); check('T14 time', tp.flight.time, 2.585, 0.02); check('T14 catch force', tp.catch.F, 23630, 150);
const tp2 = X.tossPartner(mk(), P.makeBody({}), 'Ollie', 'hard', 0);
check('T14b hard toss apex', tp2.flight.apex, 163.3, 1); check('T14b sink ratio', tp2.catch.sinkRatio, 1.418, 0.01);
// T15 long range: pyramid across the planet
const py = X.game(mk({ F: 1e17 * g, anchor: 'bolted', groundHolds: true }), mk({ F: 1e17 * g, anchor: 'bolted', groundHolds: true }), obj('pyramid'), 2e7, 'easy');
check('T15 pyramid 20,000 km speed', py.a.aim.vL, 9798, 30); check('T15 one way min', py.a.time / 60, 78.6, 0.5); check('T15 round trip h', py.round / 3600, 2.62, 0.02); flag('T15 heat: skin only', py.a.heat.kind === 'skin');
// T16 unequal: Ollie can't hold the car
const ue = X.game(mk(), mk({ F: 1000 * g }), obj('car'), 10, 'easy');
flag('T16 Ollie 1 t: cant hold the car', ue.a.result === 'cant-hold-it' && ue.b.result === 'cant-hold');
console.log(fails ? fails + ' FAILED' : 'all ok');
// T17 car at 30 m: gentlest arc too fast for him, but a full-strength steeper throw works
const c30 = X.leg(mk(), mk(), obj('car'), 30, 'easy');
console.log('T17 car 30 m:', c30.result, 'fullStrength', c30.fullStrength, 'th', c30.aim && c30.aim.thetaDeg, 'v', c30.aim && c30.aim.vL, 'arr', c30.vArrive, 'F', c30.catch && c30.catch.F, 'slide', c30.catch && c30.catch.slide);
flag('T17 caught at full strength', c30.result === 'caught' && c30.fullStrength);
