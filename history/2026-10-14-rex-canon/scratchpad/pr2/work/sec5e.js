// 5e. They take their own recoil, the rest of BRIEF-canon.md item 2 (pull request 2's decisions): the power wins over
// Bolted for his own moves; his feet carry only the weights; the catcher is never carried off; the throw's shaking is
// its landing's alone; the arm-wrestle pin's slam reaches the ground whole at any swing time
{
  const conc = surf('concrete'), Nmax = (sf, B) => P.qultFor(sf, (B || rex).footB) * 2 * (B || rex).footArea;
  // own recoil wins over Bolted for his own moves: with both on the push back goes to his source, not through the bolts
  { const cB = ctxOf(1e6 * g, Object.assign({}, ON, { anchor: 'bolted' })), r = P.throwObject(cB, obj('car'), 45), sh = P.shove(cB, Object.assign(ctxOf(1e6 * g, ON), { body: ollie }));
    const cB0 = ctxOf(1e6 * g, { anchor: 'bolted' }), r0 = P.throwObject(cB0, obj('car'), 45);
    ok('5d: bolted with They take their own recoil on, a throw\'s and a shove\'s push back go to his source, not through his bolts (bolted alone, nothing is reported, as before)', !r.toGround && r.recoilAbsorbed && near(r.recoilAbsorbed.J, r.push.pB * obj('car').m / r.mB, 1e-12) && !sh.toGround && sh.recoilAbsorbed && sh.recoilAbsorbed.J > 0 && !r0.toGround && !r0.recoilAbsorbed); }
  // his feet carry only the weights (his own and the load's he holds): the push back isn't on them
  { const sets = [['own recoil only', { ownRecoil: true }], ['all four on', ON]], bad = [];
    for (const [lab, x] of sets) for (const [oid, th] of [['car', 45], ['bus', 30], ['piano', 60], ['car', 90]]) {
      const c = ctxOf(1e9 * g, x), r = P.throwObject(c, obj(oid), th), bear = Nmax(conc), want = (rex.m + obj(oid).m) * g / bear;
      const got = x.unbreakable ? r.sinkRatioRaw : r.sinkRatio;
      if (!(r.canMove && near(got, want, 1e-12) && (x.unbreakable ? r.sinkRatio === 0 : true))) bad.push(lab + ' ' + oid + ' ' + th + ': ' + sig(got) + ' vs ' + sig(want));
    }
    const r0 = P.throwObject(ctxOf(1e9 * g), obj('car'), 45), rU = P.throwObject(ctxOf(1e9 * g, { unbreakable: true }), obj('car'), 45);
    ok('5d: with They take their own recoil on, his feet carry only his weight and the load\'s (a car at 45 degrees and more at a 10^9 kg dial): the push back isn\'t on them; with it off (Unbreakable footing alone too) the push drives them down past what concrete bears', !bad.length && r0.sinkRatio > 1 && rU.sinkRatioRaw > 1, bad.join('; ') || 'car 45: off ' + sig(r0.sinkRatio) + 'x the bearing, on ' + sig((rex.m + obj('car').m) * g / Nmax(conc)) + 'x');
    // so his throw can't break the ground under him with it on: the ground hazard (own recoil alone) and the break-the-ground
    // preset (all four on: it sets Unbreakable footing aside, not his recoil) are never; with it off both are found
    const o = { obj: obj('car'), angle: 45, target: 30 }, pOR = P.RESTRAINT.planNow('throw', ctxOf(1e9 * g, { ownRecoil: true }), o), pON = P.RESTRAINT.planNow('throw', ctxOf(1e9 * g, ON), o), p0 = P.RESTRAINT.planNow('throw', ctxOf(1e9 * g), o), pU = P.RESTRAINT.planNow('throw', ctxOf(1e9 * g, { unbreakable: true }), o);
    ok('5d: ... so with it on his throw never breaks the ground under him (a car at 45 degrees, 10^9 kg dial): the ground hazard and the "break the ground" preset are never; with it off both are found', pOR.result('hazard:ground').never && pON.result('preset:ground').never && !p0.result('hazard:ground').never && !pU.result('preset:ground').never, 'off: ' + sig(p0.result('hazard:ground').use / g) + ' kg-force'); }
  // the catch's stop and the partner toss: the catcher's feet carry only his weight and its, with the power on
  { const cO = Object.assign(ctxOf(1e6 * g, { ownRecoil: true }), { body: ollie }), k = P.catchIt(cO, obj('car'), 60, 30, null), k0 = P.catchIt(Object.assign({}, cO, { ownRecoil: false }), obj('car'), 60, 30, null);
    const t = P.tossPartner(ctxOf(1e9 * g, { ownRecoil: true }), ollie, 'Ollie', 'hard', 10, 'friction'), t0 = P.tossPartner(ctxOf(1e9 * g), ollie, 'Ollie', 'hard', 10, 'friction');
    ok('5d: the catcher\'s feet carry only his weight and the object\'s with his recoil taken (a car at 60 m/s coming down at 30 degrees; Rex catching a tossed Ollie at 10^9 kg); with it off the stop presses them too', near(k.sinkRatio, (ollie.m + obj('car').m) * g / Nmax(conc, ollie), 1e-12) && k0.sinkRatio > k.sinkRatio && t.catch && near(t.catch.sinkRatio, (rex.m + ollie.m) * g / Nmax(conc), 1e-12) && t0.catch.sinkRatio > 1, sig(t0.catch.sinkRatio) + 'x the bearing with it off, ' + sig(t.catch.sinkRatio) + 'x on'); }
  // the catcher is never carried off with it on: the All-Star fastball at a 10^20 kg dial; with it off he is (as before)
  { const cR = ctxOf(1e20 * g, ON), L = P.catchLeg(cR, Object.assign({}, cR, { body: ollie }), obj('baseball'), 10, 'hard');
    const c0 = ctxOf(1e20 * g, Object.assign({}, ON, { ownRecoil: false })), L0 = P.catchLeg(c0, Object.assign({}, c0, { body: ollie }), obj('baseball'), 10, 'hard');
    ok('5d: a catch past 1% of light speed (a fastball at a 10^20 kg dial): with his recoil taken he is planted and its whole momentum goes to his source, all its motion energy freed at the catch; with it off it carries him off', L.result === 'caught' && L.catch.relativistic && !L.catch.carried && L.catch.uAfter === 0 && L.catch.slide === 0 && L.recoilAbsorbedC && L.recoilAbsorbedC.J === L.catch.pIn && !L.toGroundC && near(L.catch.Ediss, P.momentumToKE(L.catch.pIn, L.catch.E1 * 0 + Math.sqrt(obj('baseball').m ** 2 + L.catch.mh ** 2 + 2 * (1 + P.momentumToKE(L.catch.pIn, obj('baseball').m) / (obj('baseball').m * P.K.c * P.K.c)) * obj('baseball').m * L.catch.mh)), 1e-9) && L0.catch && L0.catch.carried && L0.catch.uAfter > 0.01 * P.K.c, 'off: carried off at ' + sig(L0.catch && L0.catch.uAfter / 1000) + ' km/s');
    // the round trip: planted, the stroke isn't forced, so it is the throws and flights alone (at 10^9: a fastball)
    const c9 = ctxOf(1e9 * g, ON), G = P.catchGame(c9, Object.assign({}, c9, { body: ollie }), obj('baseball'), 10, 'hard');
    ok('5d: in the game of catch with their recoil taken neither catcher slips, so the round trip is the throws and the flights (a fastball 10 m apart at 10^9 kg)', G.a.result === 'caught' && G.b.result === 'caught' && !G.a.catch.slips && !G.b.catch.slips && G.round > 0 && isFinite(G.round), sig(G.round) + ' s'); }
  // planting the catcher: his arms stop the full arrival speed, so a hard catch can turn into a slam (a bus thrown hard
  // 10 m apart at the default dial): a consequence, reported
  { const cR = ctxOf(100 * 907.18474 * g, ON), cO = Object.assign({}, cR, { body: ollie }), L = P.catchLeg(cR, cO, obj('bus'), 10, 'hard');
    const c0 = ctxOf(100 * 907.18474 * g, Object.assign({}, ON, { ownRecoil: false })), L0 = P.catchLeg(c0, Object.assign({}, c0, { body: ollie }), obj('bus'), 10, 'hard');
    ok('5d: planted, the catcher\'s arms stop all of it: a bus thrown hard 10 m apart at the default dial slams into him (with his feet free to slide, his arms could stop it); his source still takes the whole stop', L.result === 'slams' && L.catch.vSlam > 0 && L.catch.uAfter === 0 && L.recoilAbsorbedC && near(L.recoilAbsorbedC.J, P.vToMomentum(L.vArrive, obj('bus').m), 1e-12) && L0.result === 'caught', L.result + ' at ' + sig(L.catch.vSlam) + ' m/s; off: ' + L0.result); }
  // the throw's shaking: with the power on only the landing, never 'him'; with Unbreakable footing alone, heavy flat
  // throws are shaken hardest by his push (so the test can tell them apart)
  { const bad = []; let him = 0;
    for (const sid of ['concrete', 'gravel', 'granite']) for (const oid of ['bus', 'semi', 'loco', 'car']) for (const th of [0, 45]) for (const lg of [5, 9]) {
      const sfc = surf(sid), c = ctxOf(Math.pow(10, lg) * g, Object.assign({}, ON, { surface: sfc })), r = P.throwObject(c, obj(oid), th), o = Object.assign({ obj: obj(oid), angle: th, surface: sfc, body: rex, near: 5 }, ON);
      if (!r.canMove) continue;
      const s = M.throw.shake(r, o), land = M.throw.landShake(r, o);
      if (r.toGround || Array.isArray(s) || M.throw.shakeFrom(r, o) !== 'landing' || P.ppvAt(s, 5) !== P.ppvAt(land, 5)) bad.push(oid + ' ' + th + ' ' + sid + ' 1e' + lg);
      const cU = ctxOf(Math.pow(10, lg) * g, { unbreakable: true, surface: sfc }), rU = P.throwObject(cU, obj(oid), th), oU = { obj: obj(oid), angle: th, surface: sfc, body: rex, near: 5, unbreakable: true };
      if (rU.canMove && M.throw.shakeFrom(rU, oU) === 'him') him++;
    }
    const esc = P.throwObject(ctxOf(1e12 * g, ON), obj('car'), 45);
    ok('5d: with their powers on a throw\'s shaking is its landing\'s alone, never his push\'s (heavy and light throws, flat and at 45 degrees, on concrete, gravel and granite); a throw that never comes down shakes nothing; with Unbreakable footing alone his push is the larger in ' + him + ' of them', !bad.length && him > 0 && esc.flight.escaped && M.throw.shake(esc, Object.assign({ obj: obj('car'), angle: 45, surface: conc, body: rex }, ON)) === null, bad.slice(0, 4).join('; ')); }
  // the arm-wrestle pin with the winner's recoil taken: the slam reaches the ground whole at any swing time
  { const pinAt = (FA, FB, x) => P.armWrestle(ctxOf(FA, Object.assign({ keepForm: true }, x)), Object.assign(ctxOf(FB, Object.assign({ keepForm: true }, x)), { body: ollie }));
    const fromE = (E, Mf) => Math.sqrt(E * E + 2 * E * Mf * P.K.c * P.K.c) / P.K.c;
    const dial = 100 * 907.18474 * g, a = pinAt(dial, dial / 2, ON), aU = pinAt(dial, dial / 2, { unbreakable: true }), aR = pinAt(dial, dial / 2, { ownRecoil: true });
    ok('5d: a quick arm-wrestling pin (its swing shorter than a limb\'s contact time), the winner taking his own recoil: the swing\'s push back goes to his source (up), so the slam\'s blow reaches the ground whole with Unbreakable footing; without the power the two cancel there (no net push)', a.outcome === 'pin' && a.pin.t < P.limbPulse(rex) && a.toGround && a.recoilAbsorbed && near(a.toGround.J, fromE(a.pin.E, a.pin.M), 1e-12) && a.recoilAbsorbed.J === a.toGround.J && a.recoilAbsorbed.thetaDeg === -90 && a.recoilAbsorbed.T === a.pin.t && !aU.toGround && !aU.recoilAbsorbed && aR.recoilAbsorbed && !aR.toGround, a.toGround ? sig(a.toGround.J) + ' kg m/s over ' + sig(a.toGround.T) + ' s' : a.outcome);
    // near light speed the slam's momentum follows its energy (the rounded speed would freeze it): Rex at 10^26 and
    // 10^30 kg against Ollie at 10^4 kg
    const bad = [];
    for (const lg of [26, 30]) { const r = pinAt(Math.pow(10, lg) * g, 1e4 * g, ON), want = fromE(r.pin.E, r.pin.M);
      if (!(r.outcome === 'pin' && r.toGround && near(r.toGround.J, want, 1e-9) && r.recoilAbsorbed.J === r.toGround.J && (lg < 30 || r.toGround.J > 100 * P.vToMomentum(r.pin.v, r.pin.M)))) bad.push('1e' + lg + ': ' + sig(r.toGround && r.toGround.J) + ' vs ' + sig(want)); }
    ok('5d: past 1% of light speed the pin\'s momentum follows its energy (Rex at 10^26 and 10^30 kg against Ollie at 10^4 kg; at 10^30 the rounded speed gives a hundredth of it)', !bad.length, bad.join('; ')); }
  // a shove into a bolted partner with Unbreakable footing alone: his bolts still hand the planet the whole push; with
  // the shover's recoil taken he is planted too, so the shove stalls and nothing goes anywhere
  { const cR = ctxOf(1e6 * g, { unbreakable: true }), sh = P.shove(cR, Object.assign({}, cR, { body: ollie, anchor: 'bolted' })), cRo = ctxOf(1e6 * g, ON), sho = P.shove(cRo, Object.assign({}, cRo, { body: ollie, anchor: 'bolted' }));
    ok('5c/5d: a shove into a bolted partner: with Unbreakable footing alone his bolts hand the planet the whole push (and the shover\'s feet their share); with the shover\'s recoil taken both are planted and the shove stalls', sh.toGroundB && sh.toGroundB.J > 0 && sh.toGround && !sh.recoilAbsorbed && sho.stalled && !sho.toGroundB && !sho.toGround && !sho.recoilAbsorbed); }
}

