// Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
global.window = {};
const P = require('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/engine-fixed.js');
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

// Real-muscle speeds never exceed the stated caps, for any surface, footing, size or strength.
{
  let worst = 0, where = '';
  const objs = { ball: D.objects.find((o) => o.id === 'baseball'), shot: D.objects.find((o) => o.id === 'shot') };
  for (const sid of ['sand', 'concrete', 'granite', 'steel']) for (const anchor of ['friction', 'braced', 'bolted']) for (const holds of [false, true]) for (const H of [0.4, 2, 50]) {
    const b = P.makeBody({ H }); const s = D.surfaces.find((x) => x.id === sid);
    for (const lg of [6, 12, 20, 34, Infinity]) {
      const c = { F: isFinite(lg) ? Math.pow(10, lg) * g : Infinity, mode: 'real', body: b, surface: s, groundHolds: holds, anchor };
      const chk = (name, v, cap) => { const r = v / cap; if (r > worst) { worst = r; where = name + ' ' + sid + ' ' + anchor + ' holds=' + holds + ' H=' + H + ' lg=' + lg; } };
      chk('punch', P.punch(c).vFist, P.MUSCLE.punch.vmax * b.s);
      chk('clap', P.clap(c).vHand, P.MUSCLE.clap.vmax * b.s);
      chk('jump', P.jump(c).v, P.MUSCLE.jump.vmax * b.s);
      const tb = P.throwObject(c, objs.ball, 45); if (tb.canMove) chk('whip', tb.v, P.MUSCLE.throwWhip.vmax * b.s);
      const ts = P.throwObject(c, objs.shot, 45); if (ts.canMove) chk('shove', ts.v, P.MUSCLE.throwPush.vmax * b.s);
    }
  }
  const ok = worst <= 1 + 1e-6; if (!ok) fails++;
  console.log((ok ? 'ok   ' : 'FAIL ') + 'real-muscle speeds within caps (worst ratio ' + worst.toFixed(6) + (ok ? '' : ' at ' + where) + ')');
}
// Throws and jumps never get worse with more strength (he can always push less hard).
{
  const car = D.objects.find((o) => o.id === 'car'), tank = D.objects.find((o) => o.id === 'tank');
  let bad = [];
  for (const mode of ['comic', 'real']) for (const sid of ['sand', 'gravel', 'concrete', 'granite']) for (const anchor of ['friction', 'braced']) {
    const s = D.surfaces.find((x) => x.id === sid);
    const base = { mode, body, surface: s, groundHolds: false, anchor };
    for (const [name, fn] of [['car 45', (c) => { const r = P.throwObject(c, car, 45); return r.canMove ? r.v : 0; }], ['tank 30', (c) => { const r = P.throwObject(c, tank, 30); return r.canMove ? r.v : 0; }], ['jump', (c) => P.jump(c).v]]) {
      let prev = 0;
      for (let lg = 2.5; lg <= 16; lg += 0.1) {
        const v = fn(Object.assign({}, base, { F: Math.pow(10, lg) * g }));
        if (v < prev * 0.97) { bad.push(mode + ' ' + sid + ' ' + anchor + ' ' + name + ' drops at 10^' + lg.toFixed(1) + ' (' + prev.toPrecision(3) + ' -> ' + v.toPrecision(3) + ')'); break; }
        prev = Math.max(prev, v);
      }
    }
  }
  if (bad.length) { fails++; console.log('FAIL throw/jump monotone in strength (3% tolerance):\n  ' + bad.slice(0, 8).join('\n  ')); }
  else console.log('ok   throw/jump monotone in strength (3% tolerance)');
}
// Comic mode is never weaker than real muscle.
{
  let bad = 0;
  const car = D.objects.find((o) => o.id === 'car');
  for (const lg of [1.5, 2, 2.708, 3, 4, 5, 6, 8]) {
    const c = { F: Math.pow(10, lg) * g, body, surface, groundHolds: false, anchor: 'friction' };
    for (const [fn, m] of [[(x) => P.punch(x).vFist], [(x) => P.jump(x).v], [(x) => { const r = P.throwObject(x, car, 30); return r.canMove ? r.v : 0; }]]) {
      if (fn(Object.assign({}, c, { mode: 'comic' })) < fn(Object.assign({}, c, { mode: 'real' })) * 0.999) bad++;
    }
  }
  if (bad) fails++;
  console.log((bad ? 'FAIL ' : 'ok   ') + 'comic mode never weaker than real muscle' + (bad ? ' (' + bad + ' cases)' : ''));
}
// Relativistic pull never beats light.
{
  const r = P.pull({ F: 1e30 * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'bolted' }, D.objects.find((o) => o.id === 'car'));
  check('pull 10 m at extreme strength takes at least 10 m / c (ns)', r.t10m * 1e9, 33.36, 0.05);
}
console.log(fails ? fails + ' FAILED' : 'all checks passed');
process.exit(fails ? 1 : 0);
