p='/home/user/rex-strength-lab/rex-strength-lab/test/powers.js'; s=open(p,encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)==cnt, (s.count(old), old[:90])
    s=s.replace(old,new)
rep(r"""        if ((xR || on()).unbreakable && !bounce && k.footJ > 0 && !r.toGround) bad.push(tag + ': no toGround with Unbreakable footing on');""",
r"""        if ((xR || on()).unbreakable && !bounce && k.footJ > 0 && !r.toGround) bad.push(tag + ': no toGround with Unbreakable footing on');
        // (review round 2 of pull request 4) the splat frees the force of the hit over the squash, Q = F x s: the one hit's
        // motion energy in the charger's frame plus the hold's work over the squash; below 1% of light speed the source's
        // work, F v T, is then the one hit's motion energy + the hold x his travel during the squash + Q
        if (!bounce && !(near(r.Q, k.F * r.contact.s, 1e-9) && r.h.Q === r.Q && r.hitAbsorbed.E === r.Q)) bad.push(tag + ': Q ' + sig(r.Q) + ' J is not F x s ' + sig(k.F * r.contact.s) + ' J');
        if (!bounce && !r.relativistic && !near(k.F * v * k.T, P.momentumToKE(k.pGain, mB) + k.hold * r.after.splat.during + r.Q, 1e-9)) bad.push(tag + ': the source\'s work ' + sig(k.F * v * k.T) + ' J does not balance');""")
rep(r"""    const s1 = charge(dial, { source: 'set', gb: 1 / cl }), jr = charge(dial, { source: 'jump' }, on({ unbreakable: false }), on({ unbreakable: false })), la = charge(4260 * g, { source: 'sprint' });""",
r"""    const s1 = charge(dial, { source: 'set', gb: 1 / cl }), jr = charge(dial, { source: 'jump' }, on({ unbreakable: false }), on({ unbreakable: false })), la = charge(4260 * g, { source: 'sprint' });
    // (review round 2 of pull request 4) the energy the splat frees is F x s, the hold's work included: 499 kJ at the
    // default sprint (494 kJ of motion energy as Ollie sees it + 5.55 kJ), 7.05 kJ at 1 m/s (1.50 kJ + 5.55 kJ), 890 kJ for
    // the jump onto Rex on real ground, 713 kJ bolted on real rock (the rock's tear load over the squash); the source's
    // work balances there too
    const sp1 = charge(dial, { source: 'sprint' }), br = charge(dial, { source: 'sprint' }, on({ anchor: 'bolted', unbreakable: false }), on({ unbreakable: false }));
    const brOk = chk(() => br.carry.rockGives && near(br.Q, br.carry.F * br.contact.s, 1e-9) && near(br.carry.F * br.carry.v * br.carry.T, P.momentumToKE(br.carry.pGain, R3.m) + br.carry.hold * br.after.splat.during + br.Q, 1e-9) && near(br.Q, 7.130e5, 0.002));
    const qFigs = chk(() => near(sp1.Q, 4.9945e5, 0.0005) && near(sp1.Q - P.momentumToKE(sp1.carry.pGain, R3.m), sp1.carry.hold * sp1.contact.s, 1e-6) && near(s1.Q, 7051, 0.002) && near(jr.Q, 8.900e5, 0.002));""")
rep(r"""!bad.length && figs && r50.carry && r50.carry.pGain > 1.15 * 2 * P.vToMomentum(r50.vRel, R3.m), bad.length ? bad.join('; ') : seen.join('; '));""",
r"""!bad.length && figs && brOk && qFigs && r50.carry && r50.carry.pGain > 1.15 * 2 * P.vToMomentum(r50.vRel, R3.m), bad.length ? bad.join('; ') : seen.join('; ') + '; splat frees ' + sig(sp1.Q) + ' J; brOk ' + brOk + ', qFigs ' + qFigs);""")
rep(r"""    ok('8a: a charger with his recoil taken keeps his speed; the one hit, on his footing, leaves at his speed (splat) or 2v/(1+v^2/c^2) (bounce), and the charger\'s source supplies the one hit\'s gain plus his hold x the hit\'s time, uncapped, to 1e-9; the hit\'s force is the squash\'s own plus the hold, so force x time = what the source supplies""",
r"""    ok('8a: a charger with his recoil taken keeps his speed; the one hit, on his footing, leaves at his speed (splat) or 2v/(1+v^2/c^2) (bounce), and the charger\'s source supplies the one hit\'s gain plus his hold x the hit\'s time, uncapped, to 1e-9; the hit\'s force is the squash\'s own plus the hold, so force x time = what the source supplies, and the splat frees force x squash, the hold\'s work included, so the source\'s work balances (review round 2: ' + sig(sp1.Q) + ' J at the default sprint)""")
rep(r"""    ok('8c: the hit\'s freed energy is absorbed by default (494 kJ at the default sprint: hitAbsorbed, none of it in Elocal) and real when he means it (meanIt: hitAbsorbed 0, Elocal = Q); a bounce frees none; past 1% of light speed the one hit\'s motion and the charger\'s run-up air are real either way; with his recoil not taken meanIt changes nothing',
      chk(() => near(s.Q, 4.94e5, 0.002) && s.hitAbsorbed.E === s.Q && s.Elocal === 0""",
r"""    // (review round 2 of pull request 4) below 1% of light speed, sent off faster than sound, the one hit's body meets real
    // air as he slides off: the air takes his motion energy less his footing's share over the slide (carry.Eair), real
    // either way, so it joins the 1%-of-light-speed figure; slower than sound, none
    const keA = (r) => P.momentumToKE(r.carry.pGain, R3.m), airOf = (r, x) => keA(r) - holdR * x;
    const a1 = charge(dial, { source: 'set', gb: gb1 }), a1m = charge(dial, { source: 'set', gb: gb1, meanIt: true }), a5b = charge(dial, { source: 'set', gb: 500 / cl, bounce: true });
    const a2 = charge(dial, { source: 'set', gb: 200 / cl }), a2b = charge(dial, { source: 'set', gb: 200 / cl, bounce: true }), a99 = charge(dial, { source: 'set', gb: 0.0099 });
    const airOk = chk(() => near(a1.carry.Eair, airOf(a1, a1.after.splat.slide), 1e-9) && a1.Elocal === a1.carry.Eair && a1.hitAbsorbed.E === a1.Q && near(a1m.Elocal, a1m.Q + a1m.carry.Eair, 1e-12) && a1.carry.Eair > 0.99 * keA(a1)
      && near(a5b.carry.Eair, airOf(a5b, a5b.after.bounce.slideB), 1e-9) && a5b.Elocal === a5b.carry.Eair && !('Eair' in a2.carry) && a2.Elocal === 0 && a2b.carry.Eair > 0 && near(a99.Elocal, keA(a99), 0.001) && !('Eair' in s.carry));
    ok('8c: the hit\'s freed energy is absorbed by default (499 kJ at the default sprint: hitAbsorbed, none of it in Elocal) and real when he means it (meanIt: hitAbsorbed 0, Elocal = Q); a bounce frees none; past 1% of light speed the one hit\'s motion and the charger\'s run-up air are real either way, and below it, sent off faster than sound, the air\'s share of his motion as he slides off (review round 2: ' + sig(a1.carry && a1.carry.Eair) + ' J at 0.1% of light speed; none at 200 m/s); with his recoil not taken meanIt changes nothing',
      airOk && chk(() => near(s.Q, 4.9945e5, 0.0005) && s.hitAbsorbed.E === s.Q && s.Elocal === 0""")
rep(r"""Ollie\'s source supplies about 55,000 kg m/s (54,400 + his footing\'s 612), 494 kJ freed and absorbed, Rex slides 27.3 m;""",
r"""Ollie\'s source supplies about 55,000 kg m/s (54,400 + his footing\'s 612), 499 kJ freed and absorbed (the brief\'s 494 kJ leaves out the hold\'s work over the squash: review round 2), Rex slides 27.3 m;""")
rep(r"""    const want = [18.1, 18.1, 54400, 612, 55000, 494000, 27.3,""", r"""    const want = [18.1, 18.1, 54400, 612, 55000, 499000, 27.3,""")
open(p,'w',encoding='utf-8').write(s)
