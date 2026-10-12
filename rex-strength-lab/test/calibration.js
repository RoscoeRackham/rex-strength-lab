// Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
global.window = {};
const P = require('../src/engine.js');
require('../src/data.js');
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
// Real muscle at unbounded strength matches the top of the dial (it converges; the hold-back still runs).
{
  const car = D.objects.find((o) => o.id === 'car'), tank = D.objects.find((o) => o.id === 'tank');
  const bad = [];
  for (const sid of ['sand', 'gravel', 'softclay', 'ice', 'concrete', 'granite']) for (const anchor of ['friction', 'braced']) {
    const s = D.surfaces.find((x) => x.id === sid); if (!s) continue;
    const base = { mode: 'real', body, surface: s, groundHolds: false, anchor };
    const top = Object.assign({}, base, { F: 1e34 * g }), inf = Object.assign({}, base, { F: Infinity });
    for (const [name, fn] of [['car 45', (c) => P.throwObject(c, car, 45).v], ['tank 30', (c) => P.throwObject(c, tank, 30).v], ['jump', (c) => P.jump(c).v]]) {
      const a = fn(top), b = fn(inf);
      if (!(Math.abs(a - b) <= 1e-6 * Math.max(a, 1e-9))) bad.push(sid + ' ' + anchor + ' ' + name + ': 10^34 kg ' + a.toPrecision(6) + ' vs inf ' + b.toPrecision(6));
    }
  }
  if (bad.length) { fails++; console.log('FAIL real muscle at infinite strength = top of dial:\n  ' + bad.slice(0, 8).join('\n  ')); }
  else console.log('ok   real muscle at infinite strength = top of dial');
}
// The comic shares quoted in the sources table match the fitted values.
{
  const quoted = { throwPush: 17, throwWhip: 7, punch: 6, clap: 7, stomp: 13, jump: 66 };
  const off = Object.entries(quoted).filter(([k, v]) => Math.round(P.MUSCLE[k].comicFrac * 100) !== v).map(([k, v]) => k + ' quoted ' + v + '%, fitted ' + (P.MUSCLE[k].comicFrac * 100).toFixed(2) + '%');
  if (off.length) { fails++; console.log('FAIL comic shares in build-data.py are stale: ' + off.join('; ')); }
  else console.log('ok   comic shares quoted in the sources table match the fit');
}
// Density, weight and the planet under him.
{
  const S2 = (id) => D.surfaces.find((x) => x.id === id);
  check('PREM gravity at the core-mantle boundary (m/s^2)', P.premG(3480e3), 10.68, 0.05);
  check('PREM gravity at the inner-core boundary (m/s^2)', P.premG(1221.5e3), 4.40, 0.05);
  check('PREM potential well, surface to centre (MJ/kg)', -P.premPhi(0) / 1e6, 49.16, 0.3);
  const ns = P.makeBody({ H: 2, m: 4.12e17 * P.bodyVolume(2) });
  const nsW = P.weight({ F: 1e6, mode: 'comic', body: ns, surface: S2('concrete'), groundHolds: false, anchor: 'friction' });
  check('neutron-star Rex: first trip through the Earth (min), Klotz 2015 ~38', nsW.fall.firstPass.t / 60, 38.2, 0.5);
  check('neutron-star Rex: drift west of the antipode at the equator (km)', nsW.fall.firstPass.westKm, 809, 15);
  check('neutron-star Rex: his pull beats Earth\'s within (m)', nsW.grav.dBeat, 710.4, 1);
  check('neutron-star Rex: Bondi radius (m)', nsW.grav.rBondi, 42.74, 0.1);
  const wd = P.makeBody({ H: 2, m: 2.77e9 * P.bodyVolume(2) });
  const wdW = P.weight({ F: 1e6, mode: 'comic', body: wd, surface: S2('concrete'), groundHolds: false, anchor: 'friction' });
  check('white-dwarf Rex sticks in the inner core (km from centre)', wdW.fall.stuck.r / 1e3, 216, 5);
  check('black-hole density at 2 m (10^27 kg/m^3)', P.blackHoleDensity(2) / 1e27, 1.310, 0.002);
  check('no-drag tunnel through the pole (min), real Earth ~38', (() => { const b = P.makeBody({ H: 2, m: 1e30 }); return P.fallThrough(b, { latDeg: 90, noDrag: true }).firstPass.t / 60; })(), 38.2, 0.3);
  const def = P.weight({ F: 511 * g, mode: 'comic', body: P.makeBody({}), surface: S2('sand'), groundHolds: false, anchor: 'friction' });
  // 180 kg on two 450 cm^2 feet: 19.6 kPa, against the sand's failure pressure under a 0.212 m foot, 350 kPa x 0.212 / 0.274
  // (the elephant-print rule, 12 Oct 2026; it was 0.79 of the old textbook limit)
  check('calibration body stands on loose sand (share of limit)', def.ground.standRatio, 0.0724, 0.01);
  for (const m of [5.201e7, 5.21e7]) {
    const w = P.weight({ F: 1e6, mode: 'comic', body: P.makeBody({ H: 2, m }), surface: S2('granite'), groundHolds: false, anchor: 'friction' });
    const ok = !w.fall.firstPass || (w.fall.firstPass.t > 1500 && Math.abs(w.fall.firstPass.dLonDeg) < 90);
    if (!ok) fails++;
    console.log((ok ? 'ok   ' : 'FAIL ') + 'no spurious far-side turnaround just above the sinking threshold (' + m + ' kg)');
  }
  check('neutron-star Rex turns back short of the far side (m), 3-9 with gravitational drag', nsW.fall.firstPass.depthShort, 5.5, 3.5);
  // settle()'s averaged energy loss per trip agrees with the 3-D run (gravitational drag is a force: m x dfCoef x v)
  check('neutron-star Rex: settle loss per trip / (m g x 3-D shortfall)', nsW.settle.firstPassLossJ / (ns.m * g * nsW.fall.firstPass.depthShort), 1, 0.15);
  { const y1 = P.settle(P.makeBody({ H: 2, m: 7.416e16 })).years, y2 = P.settle(P.makeBody({ H: 2, m: 1e18 })).years;
    const ok = Math.abs(Math.log(y1 / y2)) > 0.5; if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + 'settling time depends on mass (7.4e16 kg: ' + y1.toFixed(0) + ' yr, 1e18 kg: ' + y2.toFixed(0) + ' yr)'); }
  const wdR = wdW.stuckRange; { const ok = wdR.rMax > 500e3; if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + 'white-dwarf stop point shown as a range over rock strength (' + (wdR.rMin / 1e3).toFixed(0) + '-' + (wdR.rMax / 1e3).toFixed(0) + ' km)'); }
  // weak rock: he swings through the centre and sticks on a later pass (computed, never a 0 m fallback)
  check('white-dwarf Rex with weak rock comes to rest near the centre (km)', wdR.rMin / 1e3, 10.4, 3);
  // The ground test and the 3-D fall agree on when rock holds him (both count the crust's buoyancy):
  // just past the threshold he goes deep, never a one-step 4.9 m stop.
  {
    const H = 500, reg = (m) => P.groundUnderWeight(P.makeBody({ H, m }), S2('granite'), false).regime;
    let lo = 1, hi = 1e20; for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); if (reg(mid) === 'fallsThrough') hi = mid; else lo = mid; }
    const w = P.weight({ F: 1e6, mode: 'comic', body: P.makeBody({ H, m: hi * 1.0005 }), surface: S2('granite'), groundHolds: false, anchor: 'friction' });
    const ok = reg(hi * 0.9995) !== 'fallsThrough' && w.ground.regime === 'fallsThrough' && w.fall.stuck && w.fall.stuck.depth > 1e6;
    if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + 'just past the sinking threshold (500 m Rex) he sinks deep, not 4.9 m (' + (w.fall.stuck ? (w.fall.stuck.depth / 1e3).toFixed(0) + ' km' : 'not stuck') + ')');
  }
  // A Rex too heavy to walk can't drag a load (Pull uses the same leg check as Lift and the Weight tab).
  {
    const steel = P.makeBody({ H: 2, m: 1413 }), car = D.objects.find((o) => o.id === 'car');
    const heavy = P.pull({ F: 501 * g, mode: 'comic', body: steel, surface: S2('concrete'), groundHolds: false, anchor: 'friction' }, car);
    const fine = P.pull({ F: 511 * g, mode: 'comic', body: P.makeBody({}), surface: S2('concrete'), groundHolds: false, anchor: 'friction' }, car);
    const ok = !heavy.canMove && heavy.cantWalk && fine.canMove && !fine.cantWalk;
    if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + 'pull: a steel Rex at a 501 kg dial is too heavy to walk, so he drags nothing; the default Rex still drags a car');
  }
  { const a = P.lift({ F: 1e30, mode: 'comic', body: P.makeBody({ H: 2, m: 1.4e8 }), surface: S2('granite'), groundHolds: true, anchor: 'friction' }, D.objects.find((o) => o.id === 'car')).selfPullG,
      b = P.lift({ F: 1e30, mode: 'comic', body: P.makeBody({ H: 2, m: 1.5e8 }), surface: S2('granite'), groundHolds: true, anchor: 'friction' }, D.objects.find((o) => o.id === 'car')).selfPullG;
    const ok = a === 0 && b > 0; if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + 'self-gravity switches on between 1.4e8 and 1.5e8 kg at 2 m'); }
  let mono = true, prev = 0;
  for (let lg = 7.8; lg <= 21; lg += 0.2) {
    const b = P.makeBody({ H: 2, m: Math.pow(10, lg) });
    const w = P.weight({ F: 1e6, mode: 'comic', body: b, surface: S2('granite'), groundHolds: false, anchor: 'friction' });
    if (w.ground.regime === 'fallsThrough' && !(w.energyJ > 0 && isFinite(w.energyJ))) { mono = false; console.log('  no energy at 10^' + lg.toFixed(1)); break; }
    if (w.energyJ < prev * 0.999) { mono = false; console.log('  energy falls at 10^' + lg.toFixed(1)); break; }
    prev = w.energyJ;
  }
  if (!mono) fails++;
  console.log((mono ? 'ok   ' : 'FAIL ') + 'energy released falling into the Earth rises with mass');
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
// Game of catch: first contact with the hands, survival gate, sliding friction, drag between dense partners.
{
  const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface, groundHolds: false, anchor: 'friction' }, o || {});
  const B = { anchor: 'bolted', groundHolds: true };
  const yes = (name, cond) => { if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name); };
  const lob = P.catchLeg(mk(), mk(), obj('baseball'), 10, 'easy');
  check('catch: a lobbed baseball spends 98% of its energy on first contact with 7.9 kg of hands', lob.catch.firstShare, 0.982, 0.002);
  yes('catch: default lob is caught and the ball survives', lob.result === 'caught' && lob.catch.baseballRatioHi < 1);
  const fast = P.catchLeg(mk(), mk(), obj('baseball'), 10, 'hard');
  yes('catch: a fastball baseball is squeezed past a home-run hit and probably bursts', fast.bursts && fast.catch.baseballRatio > 5);
  const car = P.catchLeg(mk(), mk(), obj('car'), 10, 'easy');
  yes('catch: a lobbed car makes Ollie slide, with arm force above his static footing', car.catch.slips && car.catch.F > car.catch.R && car.catch.slide > 0.1 && car.catch.slide < 1);
  const bus = P.catchLeg(mk(), mk(), obj('bus'), 10, 'easy');
  yes('catch: a bus is too big for a 2 m catcher', bus.result === 'too-big');
  const pyr = P.catchLeg(mk(Object.assign({ F: 1e17 * g }, B)), mk(Object.assign({ F: 1e17 * g }, B)), obj('pyramid'), 2e7, 'easy');
  // the launch push alone (m v^2 / 2 stroke over its cross-section) is far past its strength, before the air (rho v^2 > 30 MPa) gets a turn
  yes('catch: a pyramid thrown across the planet is crushed by the launch push, and the air would tear it apart anyway', pyr.result === 'crushed-launch' && pyr.launchRatio > 1 && pyr.qDynMax > 3e7);
  const NS = P.makeBody({ H: 2, m: 4.12e17 * 0.18 }), BB = Object.assign({ F: 1e22 * g }, B);
  const t10 = P.catchLeg(mk(BB), mk(Object.assign({}, BB, { body: NS })), obj('baseball'), 10, 'easy');
  yes('catch: a neutron-star catcher needs no throw at all (Rex just lets go)', t10.letsGo && t10.vArrive > 1000);
  const t9 = P.catchLeg(mk(Object.assign({}, BB, { body: NS })), mk(BB), obj('baseball'), 10, 'easy');
  yes('catch: drag raises the launch a neutron-star thrower needs above bare escape', t9.aim && t9.aim.vL > Math.sqrt(2 * t9.wells.barrier) * 1.005);
  const rel = P.catchLeg(mk({ F: 1e30 * g, anchor: 'bolted' }), mk({ F: 1e30 * g, anchor: 'bolted' }), obj('pyramid'), 200, 'hard');
  yes('catch: a relativistic pyramid arrives as plasma with no hand catch, momentum to the Earth', rel.result === 'fireball' && rel.fireball.kind === 'arrives' && !rel.fireball.catch && rel.fireball.push.earthRecoilV > 0 && rel.fireball.vapRatio > 1);
  const toss = P.tossPartner(mk(), P.makeBody({}), 'Ollie', 'easy', 10);
  const Nmax = P.anchorCapacity({ body: P.makeBody({}), surface, theta: Math.PI / 2, anchor: 'friction', groundHolds: false }).Nmax;
  const vI = toss.flight.vImpact, mO = 180, mh = 2 * P.makeBody({}).handEff, v1 = vI * mO / (mO + mh);
  check('catch: tossing Ollie, Rex\u2019s foot load = his weight + Ollie\u2019s weight + stopping force (N)', toss.catch.sinkRatio * Nmax, 180 * g + mO * g + (mO + mh) * v1 * v1 / (2 * 0.6), 5);
  // relativistic snowplow reduces to the classical heat E x/(1+x)
  const fb = P.catchLeg(mk({ F: 1e30 * g, anchor: 'bolted' }), mk({ F: 1e30 * g, anchor: 'bolted' }), obj('shot'), 10, 'hard').fireball;
  yes('catch: snowplow heat stays below the throw energy', fb && isFinite(fb.Egap) && fb.Egap < fb.E);

  // --- regressions for the catch audit fixes (default 10 ft bodies) ---
  const R10 = { body: P.makeBody({ H: 3.048, m: 2700, build: 'rex' }) }, O10 = { body: P.makeBody({ H: 3.048, m: 2700, build: 'ollie' }) };
  // p1: a relativistic catch frees nearly all its energy at the catcher; the blast never shrinks as Ollie stands closer
  for (const [id, lk] of [['car', 22], ['pyramid', 30]]) {
    const cT = mk(Object.assign({ F: Math.pow(10, lk) * g }, B, R10)), cC = mk(Object.assign({ F: Math.pow(10, lk) * g }, B, O10));
    const Dmin = P.catchMinD(cT.body, cC.body, obj(id));
    let prev = Infinity, mono = true, kinds = new Set(), nearAll = true;
    for (const Dd of [3e4, 1e4, 3e3, 1e3, 300, 100, 30, 10, Dmin]) {
      if (Dd < Dmin) continue;
      const f = P.catchLeg(cT, cC, obj(id), Dd, 'hard').fireball;
      if (!f) { mono = false; break; }
      kinds.add(f.kind);
      if (f.Eblast < prev * (1 - 1e-9) && isFinite(prev)) mono = false;
      prev = Math.min(prev, f.Eblast);
      if (f.kind !== 'before' && !(f.Ehere > 0.999 * f.E && f.Ehere >= f.Egap)) nearAll = false;
    }
    yes('catch p1: ' + id + ' at 10^' + lk + ' kg, both bolted: blast energy never drops as Ollie stands closer (' + [...kinds].join('/') + ')', mono);
    yes('catch p1: ' + id + ' at 10^' + lk + ' kg, both bolted: stopping it frees ~all its energy where Ollie stands (not just the heat made on the way)', nearAll);
  }
  { // free catcher: what he and the lump carry on is the rest; the hit frees at least the heat already made
    const f = P.catchLeg(mk(Object.assign({ F: 1e22 * g }, B, R10)), mk(Object.assign({ F: 1e22 * g, groundHolds: true }, O10)), obj('car'), 10, 'hard').fireball;
    yes('catch p1: free Ollie: heat freed at him >= heat made on the way, and freed + carried = all of it', f && f.Ehere >= f.Egap && Math.abs(f.Ehere + f.Ecarry - f.E) <= 1e-6 * f.E);
  }
  // p3: the first hit on his palms counts in the whole-object check; a shot put crushed on contact is not 'caught'
  const shot7 = P.catchLeg(mk(Object.assign({ F: 1e7 * g }, B, R10)), mk(Object.assign({ F: 1e7 * g }, B, O10)), obj('shot'), 10, 'hard');
  yes('catch p3: a 10^7 kg fastball shot put crushed by the first hit on his palms is wreckage, not caught', shot7.result === 'wreckage' && shot7.catch.F1[0] / obj('shot').area > obj('shot').crush);
  // p3 throw side: no plate can spread a launch push that exceeds its strength over its cross-section
  const car8 = P.catchLeg(mk(Object.assign({ F: 1e8 * g }, R10)), mk(Object.assign({ F: 1e8 * g }, O10)), obj('car'), 10, 'hard');
  yes('catch p3: a 10^8 kg fastball car is crushed in Rex’s hands at launch', car8.result === 'crushed-launch' && car8.launchRatio > 1);
  // u12: the thrower's recoil matches the Throw tab for the same throw
  const thr = P.throwObject(mk(Object.assign({ F: 1e8 * g }, R10)), obj('car'), car8.aim.thetaDeg);
  check('catch u12: fastball recoil = Throw tab recoil at the same angle (ratio)', car8.recoil.v / thr.recoilV, 1, 1e-6);
  yes('catch u12: a recoil slide longer than the gap drops the round trip', car8.recoil.slide > 10 && car8.recoil.outOfRange);
  // r0/r10: the release table near vertical stays close to exact throws (was up to ~120x off)
  {
    let worst = 1;
    for (const sid of ['sand', 'concrete']) for (const lk of [10, 14, 19]) for (const id of ['car', 'pyramid']) {
      const c = mk(Object.assign({ F: Math.pow(10, lk) * g, surface: D.surfaces.find((s) => s.id === sid) }, R10));
      const tab = P.catchReleaseTable(c, obj(id)), noFl = Object.assign({}, c, { noFlight: true });
      for (const th of [3, 41, 77, 82.5, 85, 87, 88.5]) {
        const r = P.throwObject(noFl, obj(id), th), ex = r.canMove ? r.v : 0, ap = tab.vOf(th);
        if (ex > 0 || ap > 0) worst = Math.max(worst, Math.max(ex, 1e-9) / Math.max(ap, 1e-9), Math.max(ap, 1e-9) / Math.max(ex, 1e-9));
      }
    }
    yes('catch r0: release-table speeds within 20% of exact throws up to 89° (worst ' + worst.toFixed(3) + 'x)', worst < 1.2);
  }
  { // r0: a fastball 'fireball' is only reported for a throw at or past 1% of light speed, aimed at him
    let bad = [];
    for (const [id, lk] of [['eiffel', 19], ['eiffel', 20], ['pyramid', 18], ['pyramid', 20.5]]) {
      const L = P.catchLeg(mk(Object.assign({ F: Math.pow(10, lk) * g }, R10)), mk(Object.assign({ F: Math.pow(10, lk) * g }, O10)), obj(id), 1e5, 'hard');
      if (L.result === 'fireball' && !(L.vL >= P.CATCH.V_FIREBALL)) bad.push(id + ' 10^' + lk + ': fireball at ' + L.vL.toPrecision(3) + ' m/s');
    }
    yes('catch r0: no fastball fireball below 1% of light speed' + (bad.length ? ' (' + bad.join('; ') + ')' : ''), !bad.length);
  }
  // r4: a gentle lob that has a landing arc is not reported as 'no-arc' (the arc then fails for its own reason)
  const tankLob = P.catchLeg(mk(Object.assign({ F: 1e16 * g, groundHolds: true }, R10)), mk(Object.assign({ F: 1e16 * g, groundHolds: true }, O10)), obj('tank'), 1e7, 'easy');
  yes('catch r4: tank lobbed 10,000 km finds a landing arc (was no-arc); here the launch push crushes it', tankLob.result !== 'no-arc' && tankLob.aim && tankLob.aim.thetaDeg < 80);
  // u4: a ball that can't get out of a dense thrower's own pull falls back; no 0 mm 'best throw'
  const dense = { body: P.makeBody({ H: 3.048, m: 1e13, build: 'rex' }), anchor: 'bolted', groundHolds: true }, denseO = Object.assign({}, dense, { body: P.makeBody({ H: 3.048, m: 1e13, build: 'ollie' }) });
  const fb12 = P.catchLeg(mk(Object.assign({ F: 1e12 * g }, dense)), mk(Object.assign({ F: 1e12 * g }, denseO)), obj('baseball'), Math.pow(10, 1.5), 'easy');
  yes('catch u4: dense partners: the baseball falls back into Rex’s hand (not a 0 mm best throw)', fb12.result === 'falls-back' && fb12.escapeNeeded > fb12.vMax);
  // p12/u9: a dense thrower who can't hold the ball up is held down by his own arm's weight
  const d12 = { body: P.makeBody({ H: 3.048, m: 1e12, build: 'rex' }), anchor: 'bolted', groundHolds: true };
  const ch = P.catchLeg(mk(Object.assign({ F: 1e8 * g }, d12)), mk(Object.assign({ F: 1e8 * g }, d12, { body: P.makeBody({ H: 3.048, m: 1e12, build: 'ollie' }) })), obj('baseball'), 10, 'easy');
  yes('catch p12: can’t hold the ball up because of his own arm (arm share > 99%)', ch.result === 'cant-hold' && ch.armHold > 0.99 * ch.holdNeeded);
  // p5: impulse. The net force on object + hands along the stroke (arm force less Earth's pull along the line)
  // times the stroke time equals the momentum the arms take out of them: m v for a catcher who doesn't move,
  // m v - (m + m_h) u for one who slides off at u. Checked for a lob (46 degrees down) and a fastball (level),
  // and for a heavy fastball that makes him slide.
  for (const [id, style] of [['baseball', 'easy'], ['baseball', 'hard'], ['car', 'hard']]) {
    const L = P.catchLeg(mk(R10), mk(O10), obj(id), 10, style), k = L.catch;
    const removed = obj(id).m * L.vArrive - (obj(id).m + k.mh) * (k.slips ? k.uAfter : 0);
    check('catch p5: (F − m g sin angle) × stroke time = momentum removed, ' + id + ' ' + (style === 'easy' ? 'lob' : 'fastball') + ' at ' + L.angleDeg.toFixed(1) + '° (ratio)', (k.F - k.Fpull) * k.tStroke / removed, 1, 1e-6);
  }
  {
    // with strength to spare the arm stroke has no set time, so the round trip is the throws and flights only
    const G = P.catchGame(mk(R10), mk(O10), obj('baseball'), 10, 'easy');
    yes('catch p5: default lob, strength to spare: stroke not forced, round trip = throws + flights (' + G.round.toFixed(2) + ' s)', !G.a.catch.forced && Math.abs(G.round - (G.a.time + G.b.time + G.a.tPush + G.b.tPush)) < 1e-9);
    yes('catch p5: default lob, the catch itself is over at first contact in under 0.1 s', G.a.catch.tContact[1] < 0.1);
    const car = P.catchLeg(mk(R10), mk(O10), obj('car'), 10, 'hard').catch;
    yes('catch p5: a car fastball that makes him slide has a forced stroke', car.forced && car.slips);
  }
  // r6/r7: no toss when Rex can't push past holding Ollie up, or when Ollie is bolted down
  const plush = P.makeBody({ H: 2, m: 5.4, build: 'rex' });
  yes('catch r6: plush Rex who can only hold Ollie up can’t toss him', P.tossPartner(mk({ F: 10 * g, body: plush }), P.makeBody({ H: 2, m: 5.4, build: 'ollie' }), 'Ollie', 'hard', 10).result === 'cant-move');
  yes('catch r7: a bolted Ollie can’t be tossed', P.tossPartner(mk(R10), O10.body, 'Ollie', 'easy', 10, 'bolted').result === 'bolted');
  // d4: only solid objects use their listed strength as whole-object strength
  yes('catch d4: whole-object strength flag only on solid metal objects', D.objects.filter((o) => o.crushWhole).map((o) => o.id).sort().join(',') === 'bar511,ruyi,shot');
}
// Unstoppable force vs immovable object: one rule on every tab (collide-wrestle audit fixes).
{
  const yes = (name, cond) => { if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name); };
  const S2 = (id) => D.surfaces.find((x) => x.id === id);
  const mkR = (o) => Object.assign({ F: Infinity, mode: 'comic', body: P.makeBody({ H: 3.048, m: 2700, build: 'rex' }), surface: S2('concrete'), groundHolds: false, anchor: 'bolted' }, o || {});
  const mkO = (o) => mkR(Object.assign({ body: P.makeBody({ H: 3.048, m: 2700, build: 'ollie' }) }, o || {}));
  // u0: both unlimited and bolted. Arm, Shoving match, Shove and Collide > Push agree: real rock gives, comic ground holds still.
  for (const [gh, want] of [[false, 'rockGives'], [true, 'paradox']]) {
    const a = mkR({ groundHolds: gh }), b = mkO({ groundHolds: gh });
    const got = [P.armWrestle(a, b).outcome, P.pushMatch(a, b).clash, P.shove(a, b).clash, P.standoff(b, a).outcome, P.standoff(a, b).outcome];
    yes('u0: unlimited push between two bolted bodies, ' + (gh ? 'comic ground' : 'real rock') + ': every tab says ' + want + ' (' + got.join(', ') + ')', got.every((x) => x === want));
    const sh = P.shove(a, b);
    yes('u0: ' + (gh ? 'comic ground: nobody moves' : 'real rock: the shove flings both off at light speed'), gh ? sh.stalled && sh.vA === 0 && sh.vB === 0 : !sh.stalled && sh.vA === P.K.c && sh.vB === P.K.c);
  }
  { // comic ground: the unbreakable table carries unlimited arms whatever their footing (no 'bolted down' claim)
    const r = P.armWrestle(mkR({ groundHolds: true, anchor: 'friction' }), mkO({ groundHolds: true, anchor: 'friction' }));
    yes('u0: comic ground, unlimited arms, just standing: a dead heat through the table', r.outcome === 'paradox' && r.via === 'table' && r.contact === Infinity);
  }
  // r2: the force between them is never NaN, and a truly immovable holder never moves
  {
    let nan = 0;
    for (const gh of [false, true]) for (const aA of ['friction', 'braced', 'bolted']) for (const aB of ['friction', 'braced', 'bolted']) for (const imm of [false, true]) for (const FA of [Infinity, 1e6]) {
      const r = P.standoff(mkO({ groundHolds: gh, anchor: aA, F: FA }), mkR({ groundHolds: gh, anchor: aB, immovable: imm }));
      if (Number.isNaN(r.contact)) nan++;
    }
    yes('r2: Collide > Push force between them is never NaN (' + nan + ' NaN states)', nan === 0);
    const imm = (gh, aB) => P.standoff(mkO({ groundHolds: gh }), mkR({ groundHolds: gh, anchor: aB, immovable: true })).outcome;
    yes('r2: unlimited bolted push on an immovable Rex just standing, real rock: Ollie’s rock tears out and he is driven back', imm(false, 'friction') === 'pusherTorn');
    yes('r2: same on comic ground: Ollie and the planet are driven back', imm(true, 'friction') === 'pusherPlanet');
    yes('r2: immovable Rex bolted to the same unbreakable ground: nothing moves', imm(true, 'bolted') === 'paradox' && imm(false, 'bolted') === 'pusherTorn');
  }
  // p4: unlimited momentum into a bolted Rex on real rock: the rock gives, the Earth does not take it
  {
    const c = P.collide(mkO({ anchor: 'friction' }), mkR({ F: 1e6 }), { source: 'set', gb: Infinity });
    yes('p4: light-speed charge into bolted Rex on real rock: not held, no Earth share, rock gives', c.unlimitedVsBolted === 'rockGives' && c.held === false && !c.earth && c.outcome === 'unstoppable');
    const cc = P.collide(mkO({ anchor: 'friction', groundHolds: true }), mkR({ F: 1e6, groundHolds: true }), { source: 'set', gb: Infinity });
    yes('p4: same on comic ground: held, the planet moves with him', cc.unlimitedVsBolted === 'planetMoves' && cc.held === true);
  }
  // r1: shoving a bolted partner: he stays put and the shover recoils (the page names the mover from these)
  {
    const r = P.shove(mkR({ F: 1e16 * g, anchor: 'friction' }), mkO({ F: 1e16 * g, anchor: 'bolted' }));
    yes('r1: shove into a bolted Ollie: Ollie doesn’t move, Rex is thrown back past 1% of light speed', r.vB === 0 && r.vA > 0.01 * P.K.c && r.relativistic);
  }
}
// Arm wrestling: what gives on the losing side (arm-duo audit fixes p2, p9, u1).
{
  const yes = (name, cond) => { if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name); };
  const S2 = (id) => D.surfaces.find((x) => x.id === id);
  const rex = (o) => Object.assign({ F: 1e5 * g, mode: 'comic', body: P.makeBody({ H: 3.048, m: 2700, build: 'rex' }), surface: S2('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
  const oll = (o) => rex(Object.assign({ body: P.makeBody({ H: 3.048, m: 2700, build: 'ollie' }) }, o || {}));
  // p2: equal arms, Rex bolted, Ollie just standing. A push no stronger than Ollie's arm can't fold it: his feet give and he is dragged.
  const b = P.armWrestle(rex({ anchor: 'bolted' }), oll());
  yes('arm p2: bolted Rex vs standing Ollie, equal arms: Ollie is dragged, not pinned (' + b.outcome + ')', b.outcome === 'drag' && b.winner === 'A' && !b.pin);
  check('arm p2: drag speed = sqrt(2 (push - his footing) s / M) (ratio)', (b.drag ? b.drag.v / Math.sqrt(2 * (b.PA - b.RB) * b.drag.s / b.drag.M) : NaN), 1, 1e-3);
  // p2: a far stronger arm on poorer footing (finding repro): the better-footed side drags him; nobody folds a 2.45 TN arm with 1.77 kN
  const f = P.armWrestle(rex({ F: 1e12 * g, body: P.makeBody({ H: 2, m: 180, build: 'rex' }) }), oll({ F: 1e11 * g, body: P.makeBody({ H: 2, m: 300, build: 'ollie' }) }));
  yes('arm p2: 1e12 kg Rex on worse feet vs 1e11 kg Ollie: Ollie drags Rex by the footing difference (' + f.outcome + ')', f.outcome === 'drag' && f.winner === 'B' && !!f.drag && Math.abs(f.drag.dA - (f.RB - f.RA)) <= 1e-9 * f.RB);
  // p2: the loser's arm is the limit (weaker than the winner's push): a pin, resisted by his full arm force; his feet slide too
  const m = P.armWrestle(rex({ F: 1e6 * g, anchor: 'bolted' }), oll({ F: 1e5 * g }));
  yes('arm p2: bolted 1,000 t Rex vs 100 t Ollie: pin resisted by Ollie’s whole arm (' + m.outcome + ')', m.outcome === 'pin' && Math.abs(m.pin.dA - (m.PA - m.PB)) <= 1e-9 * m.PA && m.contact === m.PB && m.loserSlides);
  // p2: the table holds the static push but not the pin: forcing a 1.25 kN arm down loads the winner's pad far past the table
  const w = P.armWrestle(rex(), oll({ F: 511 * g }));
  yes('arm p2: 100 t Rex vs 511 kg Ollie: the pin tears the elbow pad out, then footing caps Rex (' + (w.padLoad / w.tableLat).toFixed(1) + 'x the table)', w.tableBreaksBy === 'pin' && w.tableBreaks && w.AA === Math.min(w.PA, w.RA) && w.outcome === 'pin');
  // a small surplus stays within the table and pins on it; pad load = loser's arm + 1.121 x surplus for equal bodies
  const sm = P.armWrestle(rex({ F: 4000 * g }), oll({ F: 3600 * g }));
  yes('arm p2: 4 t vs 3.6 t: pin on the table, pad load within its capacity', sm.outcome === 'pin' && !sm.tableBreaks && sm.padLoad > sm.PA && sm.padLoad < sm.tableLat);
  check('arm p2: elbow pad load for equal bodies (x surplus)', ((sm.padLoad || 0) - sm.PB) / (sm.PA - sm.PB), 1.1212, 0.001);
  // p9: each upper arm carries its own owner's push; a pinned arm carries only its own strength
  yes('arm p9: pinned Ollie’s upper arm carries his own 1.25 kN x lever, Rex’s carries his push', Math.abs(w.torqueB - w.PB * w.LB) <= 1e-9 * w.torqueB && Math.abs(w.torqueA - w.AA * w.LA) <= 1e-9 * w.torqueA);
  yes('arm p9: a dragged arm that holds carries the whole push', Math.abs(b.torqueB - b.AA * b.LB) <= 1e-9 * b.torqueB);
  // u1: unlimited arms, Ollie bolted, Rex just standing: Rex's arm holds, his feet don't; he is dragged off at light speed
  const u = P.armWrestle(rex({ F: Infinity }), oll({ F: Infinity, anchor: 'bolted' }));
  yes('arm u1: unlimited arms, Ollie bolted: Rex is dragged at light speed, nobody pinned (' + u.outcome + ')', u.outcome === 'drag' && u.winner === 'B' && !!u.drag && u.drag.v === P.K.c);
}
// The default 10 ft bodies, the cards that quote them, and a few Weight and partner-toss rules.
{
  const yes = (name, cond) => { if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name); };
  const S2 = (id) => D.surfaces.find((x) => x.id === id);
  const rexB = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), olB = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  // the assumption cards quote numbers worked out from the engine's default bodies
  const cards = require('../src/static-data.js').assumptions.map((a) => a.d).join(' ');
  const cm = (x) => Math.round(x * 100) + ' cm', m1 = (x) => x.toFixed(1) + ' m';
  const want = [rexB.volume.toFixed(2) + ' m³ at 10 ft', 'about ' + cm(P.eqRadius(rexB)) + ' radius at 10 ft', rexB.frontArea.toFixed(1) + ' m² for Rex', olB.frontArea.toFixed(1) + ' m² for Ollie',
    olB.footArea.toFixed(2) + ' m² for each of Ollie', 'about ' + Math.round(rexB.palmArea * 1e3) * 10 + ' cm² at 10 ft', '3,007 kg',
    [rexB.strokes.throw, rexB.strokes.whip, rexB.strokes.punch].map(m1).concat([rexB.strokes.leg, rexB.strokes.stomp, rexB.strokes.clap].map(cm)).join(', ').replace(/, ([^,]*)$/, ' and $1')];
  const missing = want.filter((x) => !cards.includes(x));
  yes('cards quote the engine’s default bodies (' + (missing.length ? 'missing: ' + missing.join(' | ') : want.length + ' numbers') + ')', !missing.length && rexB.H === 3.048 && rexB.m === 3007 && olB.m === 3007);
  yes('default build density 1,060 kg/m³ for both', Math.abs(rexB.rho - 1060) < 1 && Math.abs(olB.rho - 1060) < 1 && D.densities.some((d) => d.id === 'build' && d.rho === 1060));
  // u8/p7: a run that swings through the centre before it sticks stops on the far side: no east/west drift
  const wd = P.weight({ F: 1e6, mode: 'comic', body: P.makeBody({ H: 3.048, m: 7.06e9, build: 'rex' }), surface: S2('concrete'), groundHolds: false, anchor: 'friction' });
  yes('weight u8: White dwarf preset stops past the centre on the far side (' + (wd.fall.stuck ? wd.fall.stuck.lonDeg.toFixed(1) + '°, ' + (wd.fall.stuck.r / 1e3).toFixed(1) + ' km' : 'no stop') + '), no drift', !!wd.fall.stuck && wd.fall.stuck.farSide && wd.fall.stuck.driftKm === 0 && Math.abs(wd.fall.stuck.lonDeg) <= 180);
  const sk = P.weight({ F: 1e6, mode: 'comic', body: P.makeBody({ H: 3.048, m: 2.6e9, build: 'rex' }), surface: S2('concrete'), groundHolds: false, anchor: 'friction' });
  yes('weight u8: any drift is an arc no longer than a quarter circle at the stop radius', !sk.fall.stuck || (Math.abs(sk.fall.stuck.lonDeg) <= 180 && Math.abs(sk.fall.stuck.driftKm) * 1e3 <= Math.PI / 2 * sk.fall.stuck.r * (1 + 1e-9)));
  // d2: below neutron drip electrons hold squeezed matter up; from drip to the crust's base, nuclei in free neutrons
  const wAt = (rho) => P.weight({ F: 1e6, mode: 'comic', body: P.makeBody({ H: 3.048, m: rho * rexB.volume, build: 'rex' }), surface: S2('concrete'), groundHolds: true, anchor: 'friction' });
  const w14 = wAt(1e14), w15 = wAt(1e15), w17 = wAt(2e17);
  yes('weight d2: 10¹⁴ kg/m³ is below neutron drip, 10¹⁵ is inner-crust matter, 2 × 10¹⁷ gets the neutron-matter caveat', !w14.innerCrust && !w14.nmCaveat && w15.innerCrust && !w15.nmCaveat && !w17.innerCrust && !!w17.nmCaveat);
  // r6: a partner toss goes the set height above the point where Rex lets go of him
  const mkT = (o) => Object.assign({ F: 1e5 * g, mode: 'comic', body: rexB, surface: S2('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
  const toss = P.tossPartner(mkT(), olB, 'Ollie', 'easy', 10);
  check('catch r6: easy toss rises 10 m above his hands (m)', toss.rise, 10, 0.01);
}
console.log(fails ? fails + ' FAILED' : 'all checks passed');
process.exit(fails ? 1 : 0);
