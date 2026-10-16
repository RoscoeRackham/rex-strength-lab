// 8. Contests and Never knocked back (BRIEF-canon.md item 4, pull request 4; canon, the rulings of 14 Oct 2026). Every
// Rex + Ollie test is a contest: force moves, Never knocked back is set aside, the other's push is real, and only the
// push each puts on himself is absorbed (They take their own recoil). A charger doesn't slow (a body of unbounded mass at
// his speed); where the one he hits is held without limit by their powers the collision has no physical answer. The
// steady push isn't capped by the pusher's own footing; in the shoving match each pushes with the effort he uses; Both
// at once shoves each with the other's shove; arm wrestling is built on reading B (each pad or each one's feet hold the
// OTHER's press: the brief's reading A leaves the other's real press with nothing on his side carrying it). Never knocked
// back (noKnockback, a key of each one's own context) acts only on a game-of-catch throw that reaches the catcher as a
// fireball or plasma. The bodies are the 3,000 kg defaults; the dial is the page's 100 short tons unless stated.
{
  const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const cl = P.K.c, dial = 100 * 907.18474 * g, conc = surf('concrete');
  const c3 = (F, body, x) => Object.assign({ F, mode: 'comic', body, surface: conc, anchor: 'friction' }, x || {});
  const on = (x) => Object.assign({}, ON, x || {}), off = (x) => Object.assign({}, x || {});
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // Ollie charges Rex (the page's Collide: Ollie is the charger)
  const charge = (F, o, xR, xO, FR) => P.collide(c3(F, O3, xO || on()), c3(FR == null ? F : FR, R3, xR || on()), o);
  const gb1 = 0.001 / Math.sqrt(1 - 1e-6), gb50 = 0.5 / Math.sqrt(0.75);
  const holdR = P.anchorCapacity({ body: R3, surface: conc, theta: 0, anchor: 'friction', groundHolds: true, mA: R3.m }).R;

  // 8a. the charger keeps his speed; the one hit leaves at his speed (splat) or 2v/(1+v^2/c^2) (bounce); his source
  // supplies the one hit's gain plus what the one hit's footing hands the ground (to 1e-9); the bounce bound ignores the
  // footing (footJ 0), as the bounce's after-speeds do
  { const bad = [], seen = [];
    for (const [lab, F, o, xR, xO] of [['sprint', dial, { source: 'sprint' }], ['sprint at 10^9 kg', 1e9 * g, { source: 'sprint' }], ['0.1% of c', dial, { source: 'set', gb: gb1 }], ['50% of c', dial, { source: 'set', gb: gb50 }],
      ['jump at 10^6.25 kg on real ground (own recoil only)', Math.pow(10, 6.25) * g, { source: 'jump' }, { ownRecoil: true }, { ownRecoil: true }], ['sprint, own recoil only', dial, { source: 'sprint' }, { ownRecoil: true }, { ownRecoil: true }]]) {
      for (const bounce of [false, true]) {
        const r = charge(F, Object.assign({ bounce }, o), xR, xO), k = r.carry, v = r.vRel, tag = lab + (bounce ? ' bounce' : ' splat');
        if (r.outcome !== 'carried' || !k || r.unbounded !== true || r.held !== false) { bad.push(tag + ': ' + r.outcome); continue; }
        const gam = 1 / Math.sqrt(1 - (v / cl) * (v / cl)), mB = R3.m;
        const vWant = bounce ? 2 * v / (1 + (v / cl) * (v / cl)) : v, pWant = bounce ? 2 * gam * gam * mB * v : P.vToMomentum(v, mB);
        const Fc = bounce ? r.contact.softEl : r.contact.soft, footWant = bounce ? 0 : Math.min(r.hold.H, Fc.F) * Fc.t;
        if (!(k.v === v && r.h.el.vA === v && r.h.inel.V === v && k.stop.J === r.pA)) bad.push(tag + ': the charger slows (' + sig(r.h.el.vA) + ' of ' + sig(v) + ')');
        if (!near(k.vB, vWant, 1e-12) || !near(k.pGain, pWant, 1e-9)) bad.push(tag + ': leaves at ' + sig(k.vB) + ' (want ' + sig(vWant) + ') with ' + sig(k.pGain) + ' kg m/s (want ' + sig(pWant) + ')');
        if (!(near(k.supplied, k.pGain + k.footJ, 1e-9) && (k.footJ === 0 ? footWant === 0 : near(k.footJ, footWant, 1e-12)))) bad.push(tag + ': source ' + sig(k.supplied) + ' vs gain ' + sig(k.pGain) + ' + footing ' + sig(k.footJ) + ' (want ' + sig(footWant) + ')');
        if (r.toGround && !(r.toGround.J === k.footJ && r.toGround.how === 'carried')) bad.push(tag + ': toGround ' + sig(r.toGround.J) + ' is not the footing\'s share');
        if ((xR || on()).unbreakable && !bounce && k.footJ > 0 && !r.toGround) bad.push(tag + ': no toGround with Unbreakable footing on');
        seen.push(tag + ' ' + sig(k.vB) + ' m/s, ' + sig(k.supplied) + ' kg m/s');
      }
    }
    // at 50% of c the bounce's ground-frame momentum is 2 gamma^2 m v, not the immovable sums' 2 p (the brief's first runs)
    const r50 = charge(dial, { source: 'set', gb: gb50, bounce: true });
    ok('8a: a charger with his recoil taken keeps his speed; the one hit, on his footing, leaves at his speed (splat) or 2v/(1+v^2/c^2) (bounce), and the charger\'s source supplies the one hit\'s gain plus his footing\'s share, to 1e-9 (sprint, 10^9 kg, 0.1% and 50% of c, a jump onto Rex on real ground; the bounce bound ignores the footing, as its speeds do)', !bad.length && r50.carry && r50.carry.pGain > 1.15 * 2 * P.vToMomentum(r50.vRel, R3.m), bad.length ? bad.join('; ') : seen.join('; '));
  }
  // 8b. the paradox: held without limit by their powers (bolted on Unbreakable footing, any charge; landed on from above
  // with Unbreakable footing or Comic ground holding him up): no h, contact, toGround or after; the charge itself kept.
  // Not held without limit: standing (carried), from above on real ground (carried, driven into it), bolted on real rock
  // (carried, the rock tears out around his bolts and he slides on his own friction)
  { const bad = [];
    const para = [['bolted on Unbreakable footing, sprint', { source: 'sprint' }, on({ anchor: 'bolted' }), 'bolted'], ['bolted, 0.1% of c', { source: 'set', gb: gb1 }, on({ anchor: 'bolted' }), 'bolted'], ['bolted, light speed', { source: 'set', gb: Infinity }, on({ anchor: 'bolted' }), 'bolted'],
      ['jump onto him at 10^9 kg', { source: 'jump' }, on(), 'unbreakable', 1e9 * g], ['stomp-launch onto him at 10^9 kg', { source: 'stomp' }, on(), 'unbreakable', 1e9 * g], ['jump onto him, Comic ground', { source: 'jump' }, { ownRecoil: true, groundHolds: true }, 'comicGround', 1e9 * g]];
    for (const [lab, o, xR, why, F] of para) for (const bounce of [false, true]) {
      const r = charge(F || dial, Object.assign({ bounce }, o), xR, Object.assign({}, xR, { anchor: 'friction' }));
      if (!(r.outcome === 'paradox' && r.unbounded === true && r.heldBy === why && !r.h && !r.contact && !r.toGround && !r.after && !r.earth && !r.rock && r.speed && r.v0 > 0)) bad.push(lab + (bounce ? ' bounce' : '') + ': ' + r.outcome + ' ' + r.heldBy);
    }
    const j9 = charge(1e9 * g, { source: 'jump' }), s9 = charge(1e9 * g, { source: 'stomp' });
    const notPara = [['standing', charge(dial, { source: 'sprint' }), 'carried'], ['from above on real ground (own recoil only)', charge(Math.pow(10, 6.25) * g, { source: 'jump' }, { ownRecoil: true }, { ownRecoil: true }), 'carried'],
      ['bolted on real rock', charge(dial, { source: 'sprint' }, on({ anchor: 'bolted', unbreakable: false }), on({ unbreakable: false })), 'carried'], ['standing at light speed', charge(dial, { source: 'set', gb: Infinity }), 'unstoppable']];
    for (const [lab, r, want] of notPara) if (r.outcome !== want) bad.push(lab + ': ' + r.outcome);
    const rr = notPara[2][1], k = rr.carry, tear = R3.digArea * conc.shear;
    if (!(k && k.rockGives === true && near(k.tear, tear, 1e-12) && near(k.footJ, Math.min(tear, rr.contact.soft.F) * rr.contact.soft.t, 1e-12))) bad.push('real rock: ' + JSON.stringify(k));
    // he slides on his own friction once torn loose, as a standing Rex does
    if (!(near(rr.after.splat.slide, notPara[0][1].after.splat.slide, 1e-12))) bad.push('real rock slide ' + sig(rr.after.splat.slide) + ' vs standing ' + sig(notPara[0][1].after.splat.slide));
    const above = notPara[1][1];
    if (!(above.after.splat.depth > 0.01 && above.dir === 'v')) bad.push('from above on real ground: not driven in (' + JSON.stringify(above.after.splat) + ')');
    ok('8b: the paradox where the one hit is held without limit by their powers (bolted on Unbreakable footing at a sprint, 0.1% of c and light speed; landed on from above where Unbreakable footing or Comic ground holds him up: the jump at ' + sig(j9.v0) + ' m/s and the stomp-launch at ' + sig(s9.v0) + ' m/s at 10^9 kg), with no h, contact, ground push or after, the charge kept; not where he isn\'t: standing he is carried, from above on real ground he is driven in (' + sig(above.after.splat.depth * 100) + ' cm), bolted on real rock the rock tears out (' + sig(tear) + ' N) and he slides on his own friction; at light speed today\'s unstoppable', !bad.length, bad.join('; '));
  }
  // 8c. the hit's energy: absorbed by default (hitAbsorbed, the shimmer's figure), real only when he means it (meanIt:
  // the page's blast presets); a bounce frees none; past 1% of light speed the one hit, carried off, meets real air, and
  // so does the charger's run-up: real either way
  { const s = charge(dial, { source: 'sprint' }), sm = charge(dial, { source: 'sprint', meanIt: true }), sb = charge(dial, { source: 'sprint', bounce: true });
    const g1 = charge(dial, { source: 'set', gb: 0.02 }), g1m = charge(dial, { source: 'set', gb: 0.02, meanIt: true });
    const keOf = (r) => P.momentumToKE(r.carry.pGain, R3.m);
    const s0 = P.collide(c3(dial, O3, on({ ownRecoil: false })), c3(dial, R3, on({ ownRecoil: false })), { source: 'sprint' }), s0m = P.collide(c3(dial, O3, on({ ownRecoil: false })), c3(dial, R3, on({ ownRecoil: false })), { source: 'sprint', meanIt: true });
    ok('8c: the hit\'s freed energy is absorbed by default (494 kJ at the default sprint: hitAbsorbed, none of it in Elocal) and real when he means it (meanIt: hitAbsorbed 0, Elocal = Q); a bounce frees none; past 1% of light speed the one hit\'s motion and the charger\'s run-up air are real either way; with his recoil not taken meanIt changes nothing',
      near(s.Q, 4.94e5, 0.002) && s.hitAbsorbed.E === s.Q && s.Elocal === 0 && !s.meanIt && sm.hitAbsorbed.E === 0 && sm.Elocal === sm.Q && sm.meanIt === true && sb.hitAbsorbed.E === 0 && sb.Elocal === 0
        && g1.relativistic && near(g1.Elocal, keOf(g1) + g1.airRunUp, 1e-12) && g1.hitAbsorbed.E === g1.Q && near(g1m.Elocal, g1m.Q + keOf(g1m) + g1m.airRunUp, 1e-12) && same(s0, s0m) && !('hitAbsorbed' in s0),
      'Q ' + sig(s.Q) + ' J; at 2% of c Elocal ' + sig(g1.Elocal) + ' J (meant: ' + sig(g1m.Elocal) + ')');
  }
  // 8d. the 'Truly immovable' thought experiment sets the mover's own recoil aside (decision 4): its results are today's,
  // in the charge and the steady push; with They take their own recoil off, Collide and the steady push are as before
  // (no new key), except the bounce's footing share (8e)
  { const bad = [];
    for (const src of ['sprint', 'jump', 'stomp']) for (const bounce of [false, true]) for (const F of [dial, 1e9 * g, Infinity]) {
      const imm = (x) => P.collide(c3(F, O3, x), c3(F, R3, Object.assign({ immovable: true }, x)), { source: src, bounce });
      if (!same(imm(on()), imm(on({ ownRecoil: false })))) bad.push('immovable ' + src + (bounce ? ' bounce' : '') + ' ' + sig(F / g));
      const r0 = P.collide(c3(F, O3, on({ ownRecoil: false })), c3(F, R3, on({ ownRecoil: false })), { source: src, bounce });
      if ('carry' in r0 || 'unbounded' in r0 || 'hitAbsorbed' in r0 || r0.outcome === 'carried') bad.push('own recoil off ' + src + ': new keys');
    }
    for (const F of [dial, Infinity]) { const so = (x) => P.standoff(c3(F, O3, x), c3(F, R3, Object.assign({ immovable: true }, x))); if (!same(so(on()), so(on({ ownRecoil: false })))) bad.push('standoff immovable ' + sig(F / g)); }
    ok('8d: the Truly immovable thought experiment is unchanged with They take their own recoil on (the charge from a sprint, a jump and a stomp-launch, splat and bounce, at the default dial, 10^9 kg and unlimited strength; the steady push); with the power off Collide reports no new key', !bad.length, bad.join('; '));
  }
  // 8e. pull request 2's Known limit, fixed: knocked back in a bounce (Unbreakable footing alone), the bounce bound ignores
  // his footing (elasticUpper), so it hands the ground nothing; the splat books its footing's share as before
  { const x = { unbreakable: true }, sp = P.collide(c3(dial, O3, x), c3(dial, R3, x), { source: 'sprint' }), bo = P.collide(c3(dial, O3, x), c3(dial, R3, x), { source: 'sprint', bounce: true });
    ok('8e: knocked back in a bounce (Unbreakable footing alone), nothing goes into the ground through his footing (the bounce bound ignores it, as its speeds do); the splat still books the footing\'s share (pull request 2\'s over-count of about 1.1% is gone)', sp.outcome === 'moved' && sp.toGround && sp.toGround.J === sp.partial.Jearth && sp.toGround.how === 'footing' && bo.outcome === 'moved' && !bo.toGround && near(bo.h.el.pA + bo.h.el.pT, bo.pA, 1e-9), 'splat ' + sig(sp.toGround && sp.toGround.J) + ' kg m/s; bounce ' + (bo.toGround ? sig(bo.toGround.J) : 'none'));
  }
  // 8f. the steady push: with the pusher's recoil taken his push isn't capped by his own footing and he never slips; the
  // one pushed holds with his footing, or his bolts and the rock around them; an unlimited push against a hold without
  // limit is the one-sided paradox; on real rock only the held side's rock tears; the rock carries no dipole
  { const so = P.standoff(c3(dial, O3, on()), c3(dial, R3, on())), so0 = P.standoff(c3(dial, O3, on({ ownRecoil: false })), c3(dial, R3, on({ ownRecoil: false })));
    const pP = P.standoff(c3(Infinity, O3, on()), c3(dial, R3, on({ anchor: 'bolted' }))), pR = P.standoff(c3(Infinity, O3, on({ unbreakable: false })), c3(dial, R3, on({ anchor: 'bolted', unbreakable: false })));
    const bb = P.standoff(c3(1e8 * g, O3, on({ unbreakable: false, anchor: 'bolted' })), c3(1e8 * g, R3, on({ unbreakable: false, anchor: 'bolted' }))), bb0 = P.standoff(c3(1e8 * g, O3, { anchor: 'bolted' }), c3(1e8 * g, R3, { anchor: 'bolted' }));
    const rk = P.standoff(c3(dial, O3, on({ unbreakable: false })), c3(dial, R3, on({ anchor: 'bolted', unbreakable: false })));
    ok('8f: the steady push with the pusher\'s recoil taken: his push is his strength (' + sig(so.DA) + ' N, not capped by his ' + sig(so.RA) + ' N footing), he never slips, and it beats Rex\'s hold (' + sig(so.HB) + ' N); with the power off, a dead heat at the footing; unlimited against Rex bolted on Unbreakable footing, the one-sided paradox; on real rock only the rock around Rex\'s bolts tears out (no tearA); bolted on real rock his push loads only Rex\'s rock (no dipole: out to ' + sig(rk.rock && rk.rock.rT) + ' m)',
      so.ownRecoil === true && so.DA === dial && so.pusherSlips === false && so.outcome === 'forceWins' && so.contact === holdR && so0.outcome === 'stalemate' && so0.DA === so0.RA && so0.pusherSlips && !('ownRecoil' in so0)
        && pP.outcome === 'paradox' && pP.oneSided === true && pR.outcome === 'rockGives' && pR.oneSided === true && near(pR.tearB, R3.digArea * conc.shear, 1e-12) && !('tearA' in pR)
        && rk.rock && rk.rock.dipole === false && near(rk.rock.rT, Math.sqrt(dial / (2 * Math.PI * P.COL.ROCK_T)), 1e-12) && bb.rock && !bb.rock.dipole && bb0.rock && bb0.rock.dipole && bb.rock.rT > bb0.rock.rT,
      so.outcome + ' / ' + so0.outcome + '; ' + pP.outcome + ', ' + pR.outcome + '; both bolted at 10^8 kg: ' + sig(bb.rock && bb.rock.rT) + ' m (power off, a dipole: ' + sig(bb0.rock && bb0.rock.rT) + ' m)');
  }
  // 8g. the shoving match: with their recoil taken each pushes with the effort he uses and is held only by his footing
  // against the other's push. At the default dial each push (889,644 N) is about 50 times either grip on concrete
  // (17,652 N): both shoved apart, about 26.6 m/s each over the shove's stroke, sliding about 57 m. The search's floor
  // (the strength to stand and walk) is above the grip on every ground, so equal bodies are shoved apart at any effort
  { const pm = (FR, FO, xR, xO) => P.pushMatch(c3(FR, R3, on(xR)), c3(FO, O3, on(xO)));
    const r = pm(dial, dial), r0 = P.pushMatch(c3(dial, R3, on({ ownRecoil: false })), c3(dial, O3, on({ ownRecoil: false })));
    const t = r.t, fA = r.DB - r.HA, fB = r.DA - r.HB, ledger = r.pB - r.pA + r.footB - r.footA - r.recoilAbsorbedA.J + r.recoilAbsorbedB.J;
    ok('8g: the shoving match at the default dial, their recoil taken: each pushes with ' + sig(r.DA) + ' N against each grip of ' + sig(r.HA) + ' N (' + sig(r.DA / r.HA) + 'x), so both are shoved apart over the shove\'s stroke at ' + sig(r.vA) + ' m/s each and slide ' + sig(r.slideA) + ' m; the motion is the two constant pushes (each less his hold) over the stroke, and its momentum adds up (each one\'s gain, his feet\'s share and his push back); with the power off, a dead heat at the grip',
      r.outcome === 'bothShoved' && r.DA === dial && r.DB === dial && r.HA === holdR && near(r.vA, 26.6, 0.002) && near(r.vB, 26.6, 0.002) && near(r.slideA, 57.2, 0.003) && near(r.slideB, 57.1, 0.003) && near(r.d, Math.min(R3.strokes.throw, O3.strokes.throw), 0)
        && near(P.xOfT(fA, R3.m, t) + P.xOfT(fB, O3.m, t), r.d, 1e-12) && near(r.pA, fA * t, 1e-12) && near(r.pB, fB * t, 1e-12) && near(r.footA, r.HA * t, 1e-12) && near(r.recoilAbsorbedA.J, r.DA * t, 1e-12) && Math.abs(ledger) <= 1e-9 * r.recoilAbsorbedA.J
        && r0.outcome === 'deadlock' && r0.contact === holdR && !('ownRecoil' in r0), r.outcome + ' / ' + r0.outcome);
    const need = P.W8.WALK_LOAD * P.DEFAULT_BODIES.rex.m * g / P.MUSCLE.jump.forceFrac, bad = [], seen = [];
    for (const sf of D.surfaces) { const x = pm(need * (1 + 1e-9), need * (1 + 1e-9), { surface: sf }, { surface: sf }); seen.push(sf.id + ' ' + sig(need / x.HA) + 'x'); if (x.outcome !== 'bothShoved') bad.push(sf.id + ': ' + x.outcome + ' (grip ' + sig(x.HA) + ' N)'); }
    const lo = pm(need, need);
    ok('8g: at the least effort two-player searches use (the strength to stand and walk, ' + sig(need / g) + ' kg-force), equal bodies are still shoved apart, on every ground (' + sig(lo.vA) + ' m/s, sliding ' + sig(lo.slideA) + ' m on concrete): with their recoil taken a deadlock needs a grip above the push', !bad.length && near(lo.vA, 2.48, 0.003), bad.length ? bad.join('; ') : seen.join(', '));
    // the walk-out: only one push beats the other's grip; paced by the Pull tab's rule for the winner's own body
    const gr = surf('gravel'), w1 = pm(dial, 2200 * g, { surface: gr }, { surface: gr }), w2 = pm(dial, 1000 * g), w2o = P.pushMatch(c3(dial, R3, on({ ownRecoil: false })), c3(1000 * g, O3, on({ ownRecoil: false })));
    const fw = (x) => P.anchorCapacity({ body: R3, surface: x, theta: 0, anchor: 'friction', groundHolds: true, mA: R3.m }).R;
    const aOk = (x, sfc) => near(x.accel, Math.min((x.DA - x.HB) / O3.m, (fw(sfc) - x.DB) / R3.m), 1e-12) && near(x.contact, x.HB + O3.m * x.accel, 1e-12);
    ok('8g: the walk-out where only one push beats the other\'s grip, at the Pull tab\'s pace for the winner\'s own body, a = min((his push - the loser\'s hold) / the loser\'s mass, (his footing - the loser\'s push) / his own mass): Rex at the dial against Ollie at 2,200 kg-force on gravel (a ' + sig(w1.accel) + ' m/s2) and against Ollie lying flat at 1,000 kg-force on concrete (a ' + sig(w2.accel) + ' m/s2; with the power off a dead heat)',
      w1.outcome === 'walkOut' && w1.winner === 'A' && aOk(w1, gr) && near(w1.accel, 1.046, 0.002) && w2.outcome === 'walkOut' && aOk(w2, conc) && near(w2.accel, 5.88, 0.002) && w2o.outcome === 'deadlock', w1.outcome + ' / ' + w2.outcome + ' / off ' + w2o.outcome);
    // a bolted wrestler with the power on: his push is real (pull request 2's decision 2), so he shoves the other off over
    // the stroke ('shovedOff'); unlimited against a partner bolted on ground that holds, the one-sided paradox; on real
    // rock his rock tears out and he leaves at just under light speed
    const sb = pm(dial, dial, { anchor: 'bolted' }), sbo = P.pushMatch(c3(dial, R3, { anchor: 'bolted', ownRecoil: false }), c3(dial, O3, { ownRecoil: false }));
    const up = pm(Infinity, dial, {}, { anchor: 'bolted' }), ur = pm(Infinity, dial, { unbreakable: false }, { anchor: 'bolted', unbreakable: false }), ui = pm(Infinity, Infinity);
    ok('8g: a bolted Rex with the power on shoves Ollie off over the stroke (' + sig(sb.vB) + ' m/s, sliding ' + sig(sb.slideB) + ' m) and doesn\'t move; with it off he only holds (a dead heat); an unlimited push against Ollie bolted on Unbreakable footing is the one-sided paradox, on real rock his rock tears out and he leaves at just under light speed; both unlimited, they fly apart at just under light speed',
      sb.outcome === 'shovedOff' && sb.winner === 'A' && sb.vA === 0 && sb.vB > 30 && near(sb.pB, (sb.DA - sb.HB) * sb.t, 1e-12) && sbo.outcome === 'deadlock' && up.outcome === 'paradox' && up.oneSided === true && ur.outcome === 'bothShoved' && ur.tornB === true && ur.vB === cl && ui.outcome === 'bothShoved' && ui.vA === cl && ui.vB === cl && ui.slideA === Infinity,
      [sb.outcome, sbo.outcome, up.outcome, ur.outcome, ui.outcome].join(' / '));
  }
  // 8h. Both at once, their recoil taken: each is shoved by the other's shove, so equal bodies both fly apart (each at
  // what the Shove tab gives a planted shover's partner); with the power off, the stronger shove sets the push as before
  { const sb = P.shoveBoth(c3(dial, R3, on()), c3(dial, O3, on())), one = P.shove(c3(dial, R3, on()), c3(dial, O3, on())), back = P.shove(c3(dial, O3, on()), c3(dial, R3, on()));
    const sb0 = P.shoveBoth(c3(dial, R3, on({ ownRecoil: false })), c3(dial, O3, on({ ownRecoil: false }))), old0 = Object.assign(P.shove(c3(dial, R3, on({ ownRecoil: false })), c3(dial, O3, on({ ownRecoil: false }))), { shover: 'A' });
    const real = on({ unbreakable: false, anchor: 'bolted' }), rg = P.shoveBoth(c3(Infinity, R3, real), c3(Infinity, O3, real)), pd = P.shoveBoth(c3(Infinity, R3, on({ anchor: 'bolted' })), c3(Infinity, O3, on()));
    ok('8h: Both at once with their recoil taken: each is shoved by the other\'s shove (Rex at ' + sig(sb.vA) + ' m/s, Ollie at ' + sig(sb.vB) + ' m/s, each sliding about ' + sig(sb.slideA) + ' m), each one\'s push back to his own source; with the power off the stronger shove sets the push, as before; unlimited, both bolted on real rock, both rocks tear out (rockGives), and into a partner bolted on Unbreakable footing, the one-sided paradox',
      sb.both === true && sb.shover === 'A' && sb.vB === one.vB && sb.vA === back.vB && sb.slideA === back.slideB && sb.recoilAbsorbed && near(sb.recoilAbsorbed.J, one.recoilAbsorbed.J, 0) && sb.back.recoilAbsorbed && sb.vA > 20 && !sb.stalled && same(sb0, old0)
        && rg.clash === 'rockGives' && rg.oneSided === false && rg.vA === cl && rg.vB === cl && rg.tearA > 0 && rg.tearB > 0 && pd.clash === 'paradox' && pd.oneSided === true && pd.stalled, sig(sb.vA) + ' / ' + sig(sb.vB) + '; off: ' + sig(sb0.vA) + ' / ' + sig(sb0.vB));
  }
  // 8i. arm wrestling, reading B (decision 10; the brief's reading A is physically incoherent, see armWrestle): each pad
  // (standing, each one's feet) holds the OTHER's press. A pin on the table: the winner's pad holds the loser's press
  // (spinning the forearms is his swing, to his source), so a pin never breaks the table with the power on; the presses
  // still do; the pin itself is unchanged. Standing (Things keep their form off, the table broken by the presses): his
  // own footing no longer caps his own press, so the stronger always pins; each one's feet hold the other's press
  { const aw = (FR, FO, x) => P.armWrestle(c3(FR, R3, on(x)), c3(FO, O3, on(x))), aw0 = (FR, FO, x) => P.armWrestle(c3(FR, R3, on(Object.assign({ ownRecoil: false }, x))), c3(FO, O3, on(Object.assign({ ownRecoil: false }, x))));
    const p1 = aw(dial, 1000 * g), p0 = aw0(dial, 1000 * g), k1 = aw(dial, 1000 * g, { keepForm: false }), k0 = aw0(dial, 1000 * g, { keepForm: false });
    let pinBreaks = 0, runs = 0;
    for (const lg of [2.5, 3, 3.5, 4, 5, 6, 9, 12, 20]) for (const lo of [2, 2.5, 3, 4, 6, 9]) for (const sid of ['sand', 'concrete', 'ice', 'granite', 'softclay']) for (const anc of ['friction', 'bolted']) for (const kf of [false, true]) for (const ub of [false, true]) {
      const x = { keepForm: kf, unbreakable: ub, surface: surf(sid), anchor: anc }, r = P.armWrestle(c3(Math.pow(10, lg) * g, R3, on(x)), c3(Math.pow(10, lo) * g, O3, on(x)));
      runs++; if (r.tableBreaksBy === 'pin' || (r.tableBreaks && !(Math.min(r.PA, r.PB) > r.tableLat))) pinBreaks++;
    }
    ok('8i: arm wrestling on the table with the winner\'s recoil taken: his pad holds the loser\'s press (' + sig(p1.padLoad) + ' N, against ' + sig(p0.padLoad) + ' N with the power off), so a pin never breaks the table (0 of ' + runs + ' runs; only both presses past what it carries do); the pin itself is unchanged; with Things keep their form off the pin that broke the table with the power off stays on it',
      p1.outcome === 'pin' && p1.padLoad === p1.PB && p0.padLoad > 50 * p1.padLoad && same(p1.pin, p0.pin) && p1.slamRatio === p0.slamRatio && pinBreaks === 0 && k1.outcome === 'pin' && !k1.tableBreaks && k0.tableBreaks && k0.tableBreaksBy === 'pin', 'power off with Things keep their form off: the table breaks by the ' + k0.tableBreaksBy);
    const st = aw(dial, dial, { keepForm: false }), st0 = aw0(dial, dial, { keepForm: false }), sp = aw(1e5 * g, 2e5 * g, { keepForm: false }), sp0 = aw0(1e5 * g, 2e5 * g, { keepForm: false });
    const u1 = aw(Infinity, Infinity, { keepForm: false }), u2 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted' }), u3 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted', unbreakable: false });
    ok('8i: standing, once the presses break the table (Things keep their form off): his own footing no longer caps his own press (both at the dial: a stalemate in the arms at ' + sig(st.AA) + ' N, each one\'s feet sliding under the other\'s press; with the power off a stalemate at the grip); 100 t against 200 t, Ollie pins Rex (with the power off a stalemate at the grip) and both one\'s feet slide; both unlimited: flung apart, or the paradox bolted on Unbreakable footing, or both rocks tear out on real rock',
      st.tableBreaks && st.tableBreaksBy === 'push' && st.outcome === 'stalemate' && st.AA === st.PA && !st.footLimitedA && st.draggedA === true && st.draggedB === true && st0.outcome === 'stalemate' && st0.AA === st0.RA && !('draggedA' in st0)
        && sp.outcome === 'pin' && sp.winner === 'B' && sp.AB === sp.PB && sp.winnerSlides === true && sp.loserSlides === true && sp0.outcome === 'stalemate' && !('winnerSlides' in sp0)
        && u1.outcome === 'flungApart' && u1.ownRecoil && u2.outcome === 'paradox' && u2.oneSided === false && u3.outcome === 'rockGives' && u3.tearA > 0 && u3.tearB > 0, [st.outcome, st0.outcome, sp.outcome, sp0.outcome, u1.outcome, u2.outcome, u3.outcome].join(' / '));
  }
  // 8j. lifting a partner is unchanged (holding him up is weight, not recoil; decision 11)
  { const bad = [];
    for (const F of [dial, 1e9 * g]) for (const sid of ['concrete', 'sand']) { const x = { surface: surf(sid) }, a = P.liftPartner(c3(F, R3, on(x)), c3(F, O3, on(x))), b = P.liftPartner(c3(F, R3, on(Object.assign({ ownRecoil: false }, x))), c3(F, O3, on(Object.assign({ ownRecoil: false }, x))));
      if (!same(a, b)) bad.push(sig(F / g) + ' ' + sid); }
    ok('8j: lifting a partner is the same with They take their own recoil on and off (holding him up is weight, not recoil)', !bad.length, bad.join('; '));
  }
  // 8k. Never knocked back: the fireball's push in the game of catch (Things keep their form off, some of the air's drag
  // left: a fastball 10 m apart at a 10^14 kg dial arrives as plasma). With the catcher's switch on he isn't moved, its
  // momentum goes to the endless ocean (bolted too: the power wins over Bolted), and of the energy freed where he stands
  // the air's heat is real and the motion is taken back (real when he means it); with it off, today's physics
  { const leg = (kg, x, xC, oid, Dd) => { const cT = c3(kg * g, R3, Object.assign({ keepForm: false, airAbsorb: 0 }, x)); return P.catchLeg(cT, Object.assign({}, cT, { body: O3 }, xC || {}), obj(oid || 'baseball'), Dd || 10, 'hard'); };
    const L1 = leg(1e14, {}, { noKnockback: true }), L0 = leg(1e14, {}, { noKnockback: false }), Lx = leg(1e14, {}), LB = leg(1e14, {}, { noKnockback: true, anchor: 'bolted' }), LB0 = leg(1e14, {}, { anchor: 'bolted' }), Lm = leg(1e14, {}, { noKnockback: true, meanIt: true });
    const f1 = L1.fireball, f0 = L0.fireball;
    ok('8k: Never knocked back on: the fireball (a fastball 10 m apart at 10^14 kg, Things keep their form off, all the drag acting) doesn\'t move Ollie; its momentum (' + sig(f1 && f1.p) + ' kg m/s) goes to the endless ocean; everything is freed where he stands, the air\'s heat (' + sig(f1 && f1.Egap) + ' J) real and the motion (' + sig(f1 && f1.Earr) + ' J) taken back unless he means it; bolted, the same (the power wins over Bolted); off, today\'s physics (carried off at ' + sig(f0 && f0.push.recoilV) + ' m/s; bolted, the Earth takes it)',
      L1.result === 'fireball' && f1.kind !== 'before' && f1.push.recoilV === 0 && f1.push.earthRecoilV === 0 && f1.knockAbsorbed && f1.knockAbsorbed.J === f1.p && near(f1.knockAbsorbed.E, f1.E - f1.Egap, 1e-12) && f1.Ehere === f1.E && f1.Eafter === 0 && f1.Ecarry === 0 && f1.Enear === 0 && f1.Eblast === f1.Egap
        && same(L0, Lx) && !('knockAbsorbed' in f0) && near(f0.push.recoilV, 342.5, 0.002) && f0.Ecarry > 0 && LB.fireball.knockAbsorbed && LB.fireball.knockAbsorbed.J === LB.fireball.p && LB.fireball.push.earthRecoilV === 0 && LB0.fireball.push.earthRecoilV > 0
        && Lm.fireball.knockAbsorbed.E === 0 && Lm.fireball.Eblast === Lm.fireball.E, L1.result + ' ' + (f1 && f1.kind));
    // the switch changes nothing else: every two-player call with Never knocked back on gives exactly what it gives off,
    // except a catch that ends in a fireball (and anyPower ignores it)
    const bad = [];
    for (const [lab, x] of [['all on', ON], ['all off', {}], ['Things keep their form off, all the drag', { airAbsorb: 0, keepForm: false, unbreakable: true, ownRecoil: true }]]) for (const F of [dial, 1e9 * g, 1e14 * g]) {
      const A = (k) => c3(F, R3, Object.assign({}, x, { noKnockback: k })), B = (k) => c3(F, O3, Object.assign({}, x, { noKnockback: k }));
      const calls = [['arm', (k) => P.armWrestle(A(k), B(k))], ['push', (k) => P.pushMatch(A(k), B(k))], ['shove', (k) => P.shove(A(k), B(k))], ['both', (k) => P.shoveBoth(A(k), B(k))], ['lift', (k) => P.liftPartner(A(k), B(k))], ['throwP', (k) => P.throwPartner(A(k), B(k), 45)],
        ['standoff', (k) => P.standoff(B(k), A(k))], ['sprint', (k) => P.collide(B(k), A(k), { source: 'sprint' })], ['jump', (k) => P.collide(B(k), A(k), { source: 'jump', bounce: true })], ['set', (k) => P.collide(B(k), A(k), { source: 'set', gb: 0.02 })],
        ['toss', (k) => P.tossPartner(A(k), O3, 'Ollie', 'easy', 10, 'friction')], ['catch car', (k) => P.catchLeg(A(k), B(k), obj('car'), 30, 'hard')], ['catch ball', (k) => P.catchLeg(A(k), B(k), obj('baseball'), 1000, 'hard')]];
      for (const [nm, f] of calls) { const a = f(true), b = f(false); if (!same(a, b) && !(a && a.result === 'fireball')) bad.push(lab + ' ' + sig(F / g) + ' ' + nm); }
    }
    ok('8k: Never knocked back changes nothing else: arm wrestling, every Wrestle move, Collide\'s charge and steady push, the partner toss and the game of catch give exactly the same results with it on and off, except a catch that ends in a fireball; anyPower leaves it out (it defaults to on)', !bad.length && P.anyPower({ noKnockback: true }) === false, bad.join('; '));
  }
  // 8l. the brief's figures at the 3,000 kg bodies (the brief's are at 3,007 kg): Ollie charges Rex, the defaults on
  { const sp = charge(dial, { source: 'sprint' }), bo = charge(dial, { source: 'sprint', bounce: true }), j9 = charge(1e9 * g, { source: 'jump' }), s9 = charge(1e9 * g, { source: 'stomp' });
    const t1 = charge(dial, { source: 'set', gb: gb1 }), t1b = charge(dial, { source: 'set', gb: gb1, bounce: true });
    const sp0 = P.collide(c3(dial, O3, on({ ownRecoil: false })), c3(dial, R3, on({ ownRecoil: false })), { source: 'sprint' });
    const r2 = (x, n) => Number(x.toPrecision(n || 3));
    const got = [r2(sp.v0), r2(sp.carry.vB), r2(sp.carry.pGain), r2(sp.carry.footJ), r2(sp.carry.supplied, 2), r2(sp.Q), r2(sp.after.splat.slide), r2(bo.carry.vB), r2(bo.carry.supplied), j9.outcome, r2(j9.v0), s9.outcome, r2(t1.carry.vB / 1000), r2(t1.carry.supplied), r2(t1.Q / 1e12), r2(t1b.carry.vB / 1000), r2(t1b.carry.supplied), sp0.outcome, r2(sp0.h.inel.V), r2(sp0.Q / 1000)];
    const want = [18.1, 18.1, 54400, 612, 55000, 494000, 27.3, 36.3, 109000, 'paradox', 286, 'paradox', 300, 8.99e8, 135, 600, 1.8e9, 'moved', 8.97, 250];
    ok('8l: the brief\'s Collide figures at 3,000 kg: the sprint carries Rex at 18.1 m/s, Ollie\'s source supplies about 55,000 kg m/s (54,400 + his footing\'s 612), 494 kJ freed and absorbed, Rex slides 27.3 m; the bounce sends him off at 36.3 m/s (109,000 kg m/s: the bounce bound ignores his footing); the jump (286 m/s) and the stomp-launch at 10^9 kg are the paradox; at 0.1% of c he is carried at 300 km/s (8.99 x 10^8 kg m/s, 135 TJ) or sent off at 600 km/s (1.8 x 10^9); with They take their own recoil off, today\'s (knocked back, 8.97 m/s, 250 kJ)', same(got, want), JSON.stringify(got));
    const pm = P.pushMatch(c3(dial, R3, on()), c3(dial, O3, on()));
    ok('8l: the brief\'s shoving match at the default dial: each push 889,644 N against each grip 17,652 N on concrete (about 50x), both shoved apart at about 26.6 m/s each, sliding about 57 m', r2(pm.DA, 6) === 889644 && r2(pm.HA, 5) === 17652 && Math.round(pm.DA / pm.HA) === 50 && r2(pm.vA) === 26.6 && Math.round(pm.slideA) === 57 && Math.round(pm.slideB) === 57, sig(pm.DA) + ' / ' + sig(pm.HA) + ' N; ' + sig(pm.vA) + ' m/s; ' + sig(pm.slideA) + ' m');
  }
}
