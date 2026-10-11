global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA, K = P.K, g = K.g;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
// T16
{ const a = P.catchLeg(mk(), mk({ F: 1000 * g }), obj('car'), 10, 'easy'); const b = P.catchLeg(mk({ F: 1000 * g }), mk(), obj('car'), 10, 'easy');
  console.log('T16 a', a.result, 'hold', a.catch && a.catch.holdLoad.toFixed(0), 'slide', a.catch && a.catch.slide.toFixed(2), 'vArr', a.vArrive && a.vArrive.toFixed(2), '| b', b.result, b.holdNeeded && b.holdNeeded.toFixed(0)); }
// T17
{ const L = P.catchLeg(mk(), mk(), obj('car'), 30, 'easy'); const e = L.aim;
  console.log('T17', L.result, 'full', L.fullStrength, 'th', e.thetaDeg.toFixed(2), 'vL', e.vL.toFixed(3), 'vArr', L.vArrive.toFixed(2), 'F', L.catch.F.toFixed(0), 'slide', L.catch.slide.toFixed(2));
  const tab = []; for (const th of [0, 15, 30, 44, 45, 47.9, 52.5, 60, 75, 90]) { const r = P.throwObject(Object.assign(mk(), { noFlight: true }), obj('car'), th); tab.push(th + ':' + (r.canMove ? r.v.toFixed(2) : 0)); } console.log('   car full-strength speed vs angle', tab.join(' ')); }
// T18
{ const big = mk({ body: P.makeBody({ H: 50 }), F: 1e9 * g }); const L = P.catchLeg(big, mk(), obj('baseball'), 100, 'hard');
  console.log('T18', L.result, 'th', L.aim.thetaDeg.toFixed(2), 'vL', L.aim.vL.toFixed(1), 'vArr', L.vArrive.toFixed(1), 'F', L.catch.F.toFixed(0), 'clean', L.catch.clean, 'h0', L.h0, 'path len', Math.hypot(100, 45 - 1.8).toFixed(1), 'baseballRatio', L.catch.baseballRatio.toFixed(2)); }
// T13 infinite
{ const L = P.catchLeg(mk({ F: Infinity }), mk({ F: Infinity }), obj('baseball'), 10, 'hard'); console.log('T13', L.result, L.fireball.kind, L.fireball.sweep.toFixed(3), L.fireball.E); 
  const e = P.catchLeg(mk({ F: Infinity }), mk({ F: Infinity }), obj('baseball'), 10, 'easy'); console.log('T13 infinite easy', e.result, e.aim.vL.toFixed(2)); }
// wells: only catcher dense, gentle "lob" is arbitrary sqrt(gD)
{ const NS = P.makeBody({ H: 2, m: 4.12e17 * 0.18 }); const B = { anchor: 'bolted', groundHolds: true, F: 1e22 * g };
  const L = P.catchLeg(mk(B), mk(Object.assign({}, B, { body: NS })), obj('baseball'), 10, 'easy');
  console.log('NS catcher lob: vL', L.aim.vL.toFixed(2), '(= sqrt(gD)', Math.sqrt(g * 10).toFixed(2), ') barrier', L.wells.barrier, 'arrive', L.vArrive.toFixed(1), 'time ms', (L.time * 1e3).toFixed(2));
  // with zero launch speed it still arrives
  const GM = K.G * NS.m, w = L.wells; console.log('   released at rest it arrives at', Math.sqrt(2 * w.gain).toFixed(1), 'm/s; Earth g ignored over path? dBeatC', w.dBeatC.toFixed(0), 'm'); }
// hand inertia: ball vs both hands' effective mass
{ const b = P.makeBody({}); const mh = 2 * b.handEff, mw = 2 * b.whipEff, m = 0.1453;
  for (const v of [9.674, 533.14]) { const mu = m * mh / (m + mh), muw = m * mw / (m + mw);
    console.log('v', v, 'ball KE', (0.5 * m * v * v).toFixed(1), 'J; lost in first-contact collision with 2 hand+forearm (', mh.toFixed(2), 'kg):', (0.5 * mu * v * v).toFixed(1), 'J =', (100 * mh / (m + mh)).toFixed(1), '%; with whip-effective hands (', mw.toFixed(2), 'kg):', (100 * mw / (m + mw)).toFixed(1), '%');
    for (const dl of [0.01, 0.02, 0.05]) console.log('    mean impact force over', dl, 'm contact give:', (0.5 * mu * v * v / dl).toFixed(0), 'N vs stroke model', (m * v * v / 1.2).toFixed(1), 'N'); }
  const Fcap = 100 * 907.18474 * g; console.log('time/distance for full strength to get 2 hands (', mh.toFixed(2), 'kg) to 533 m/s:', (533 * mh / Fcap * 1e3).toFixed(2), 'ms,', (533 * 533 * mh / (2 * Fcap)).toFixed(2), 'm');
  // bat-collision anchored scaling (Adair: ~40 kN at home-run collision). CM-frame energy ~ 1/2 mu vrel^2 with vrel ~ 40+49 m/s, bat effective mass ~1 kg
  const Ebat = 0.5 * (0.1453 * 1 / 1.1453) * (40 + 49) ** 2, Ecatch = 0.5 * (m * mh / (m + mh)) * 533.14 ** 2;
  console.log('   bat CM energy ~', Ebat.toFixed(0), 'J; fastball first-contact energy', Ecatch.toFixed(0), 'J; linear-spring scaling of 40 kN:', (40000 * Math.sqrt(Ecatch / Ebat)).toFixed(0), 'N'); }
