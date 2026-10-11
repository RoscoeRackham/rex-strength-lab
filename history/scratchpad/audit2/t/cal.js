// Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
global.window = {};
const P = require('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/engine_r14.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
let fails = 0;
const check = (name, got, want, tol) => {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) fails++;
  console.log((ok ? 'ok   ' : 'FAIL ') + name + ': ' + (+got.toPrecision(5)) + ' (want ' + want + ' ± ' + tol + ')');
};
const body = P.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'concrete');
const obj = (id) => D.objects.find((o) => o.id === id);
for (const mode of ['real', 'comic']) {
  const c = { F: 511 * g, mode, body, surface, groundHolds: false, anchor: 'friction' };
  check(mode + ' shot put range (m)', P.throwObject(c, obj('shot'), 37).flight.range, 23.56, 0.5);
  check(mode + ' pitch speed (m/s)', P.throwObject(c, obj('baseball'), 0).v, 47.3, 0.6);
  check(mode + ' punch fist speed (m/s), elite 6.6-12.5', P.punch(c).vFist, 10, 2.5);
  check(mode + ' jump height (m)', P.jump(c).flight.apex, 0.45, 0.1);
  check(mode + ' sprint top speed (m/s)', P.sprint(c).vTop, 12.42, 0.05);
}
// Real-mode speeds never fall as strength rises (stiff-integrator regression).
const c0 = { mode: 'real', body, surface, groundHolds: true, anchor: 'bolted' };
for (const fn of ['punch', 'clap', 'stomp', 'jump']) {
  let prev = 0, mono = true;
  for (let lg = 2.5; lg <= 34; lg += 0.25) {
    const r = P[fn](Object.assign({}, c0, { F: Math.pow(10, lg) * g }));
    const v = r.vFist || r.vHand || r.vFoot || r.v || 0;
    if (v < prev * 0.999) { mono = false; console.log('  ' + fn + ' drops at 10^' + lg + ': ' + v + ' < ' + prev); break; }
    prev = v;
  }
  if (!mono) fails++;
  console.log((mono ? 'ok   ' : 'FAIL ') + 'real ' + fn + ' speed monotone in strength (top ' + prev.toFixed(2) + ' m/s)');
}
// Comic jump on yielding ground is monotone in strength.
for (const sid of ['sand', 'concrete', 'granite']) {
  let prev = 0, mono = true;
  const s = D.surfaces.find((x) => x.id === sid);
  for (let lg = 2.5; lg <= 30; lg += 0.25) {
    const v = P.jump({ F: Math.pow(10, lg) * g, mode: 'comic', body, surface: s, groundHolds: false, anchor: 'friction' }).v;
    if (v < prev * 0.999) { mono = false; console.log('  jump drops on ' + sid + ' at 10^' + lg); break; }
    prev = v;
  }
  if (!mono) fails++;
  console.log((mono ? 'ok   ' : 'FAIL ') + 'comic jump monotone on ' + sid);
}
// Work-energy and momentum in the closed-form push.
const r = P.pushApart({ F: 1e4, d: 1, mA: 100, mB: 10, RA: 0, RB: 0, mode: 'comic' });
check('push energy = F d', r.EA + r.EB, 1e4, 1e-6);
check('push momenta equal', r.pA / r.pB, 1, 1e-12);
const rr = P.pushApart({ F: 1e40, d: 0.7, mA: 176, mB: 4, RA: 0, RB: 0, mode: 'comic' });
check('ultra-relativistic sides split the stroke', rr.xA, 0.35, 1e-6);
// Flight
check('vacuum range 100 m/s 45 deg (m)', P.fly({ v0: 100, thetaDeg: 45, m: 1, A: 1, Cd: 0 }).range, 100 * 100 / (P.K.GM / P.K.R_E ** 2), 0.5);
check('vacuum apex 11 km/s vertical (km)', P.fly({ v0: 11000, thetaDeg: 90, m: 1, A: 1, Cd: 0 }).apex / 1000, 186673, 300);
check('escape at 11.3 km/s', P.fly({ v0: 11300, thetaDeg: 90, m: 1, A: 1, Cd: 0 }).escaped ? 1 : 0, 1, 0);
check('vacuumApex formula = fly (km)', P.vacuumApex(11000) / 1000, 186673, 300);
const tank = P.fly({ v0: 112473, thetaDeg: 30, h0: 1.8, m: 66769, A: 28.7, Cd: 1.15, CdSup: 1.75 });
console.log('     tank at 112 km/s: landed', tank.landed, 'escaped', tank.escaped, 'orbit', tank.orbit, 'timedOut', tank.timedOut, 'range km', (tank.range / 1000).toFixed(0));
// Blast & quake transcription
check('Kinney-Graham 1 kg TNT at 10 m (Pa)', P.overpressureAt(4.184e6, 10), 9985, 30);
check('quake magnitude for 4.184e15 J', P.seismicMagnitude(4.184e15), 4.55, 0.01);
check('stagnation T at 11 km/s (K, equilibrium)', P.stagnationT(11000), 16602, 1500);
console.log(fails ? fails + ' FAILED' : 'all checks passed');
process.exit(fails ? 1 : 0);
