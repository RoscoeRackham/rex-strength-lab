R = [
# 8a: the hold uncapped (footJ = hold x T), the hit's force = squash + hold (F x T = supplied); a slow charge and a jump
("""  // 8a. the charger keeps his speed; the one hit leaves at his speed (splat) or 2v/(1+v^2/c^2) (bounce); his source
  // supplies the one hit's gain plus what the one hit's footing hands the ground (to 1e-9); the bounce bound ignores the
  // footing (footJ 0), as the bounce's after-speeds do
  { const bad = [], seen = [];
    for (const [lab, F, o, xR, xO] of [['sprint', dial, { source: 'sprint' }], ['sprint at 10^9 kg', 1e9 * g, { source: 'sprint' }], ['0.1% of c', dial, { source: 'set', gb: gb1 }], ['50% of c', dial, { source: 'set', gb: gb50 }],
      ['jump at 10^6.25 kg on real ground (own recoil only)', Math.pow(10, 6.25) * g, { source: 'jump' }, { ownRecoil: true }, { ownRecoil: true }], ['sprint, own recoil only', dial, { source: 'sprint' }, { ownRecoil: true }, { ownRecoil: true }]]) {""",
"""  // 8a. the charger keeps his speed; the one hit leaves at his speed (splat) or 2v/(1+v^2/c^2) (bounce); his source
  // supplies the one hit's gain plus what the one hit's hold hands the ground (to 1e-9): the hold for the whole squash,
  // uncapped (splatWithFooting as the charger's mass goes to infinity; review round 1 of pull request 4), so the hit's
  // force is the squash's own plus the hold and force x time = what the source supplies; the bounce bound ignores the
  // footing (footJ 0), as the bounce's after-speeds do. A charge at 1 m/s (the squash's own push below his footing) and a
  // jump onto Rex on real ground (below the ground's bearing) book the whole hold too
  { const bad = [], seen = [];
    for (const [lab, F, o, xR, xO] of [['sprint', dial, { source: 'sprint' }], ['sprint at 10^9 kg', 1e9 * g, { source: 'sprint' }], ['0.1% of c', dial, { source: 'set', gb: gb1 }], ['50% of c', dial, { source: 'set', gb: gb50 }],
      ['jump at 10^6.25 kg on real ground (own recoil only)', Math.pow(10, 6.25) * g, { source: 'jump' }, { ownRecoil: true }, { ownRecoil: true }], ['sprint, own recoil only', dial, { source: 'sprint' }, { ownRecoil: true }, { ownRecoil: true }],
      ['1 m/s', dial, { source: 'set', gb: 1 / cl }], ['jump onto Rex on real ground', dial, { source: 'jump' }, on({ unbreakable: false }), on({ unbreakable: false })]]) {"""),
("""        const Fc = bounce ? r.contact.softEl : r.contact.soft, footWant = bounce ? 0 : Math.min(r.hold.H, Fc.F) * Fc.t;""",
"""        const Fc = bounce ? r.contact.softEl : r.contact.soft, footWant = bounce ? 0 : r.hold.H * Fc.t;
        if (!(k.hold === r.hold.H && k.T === Fc.t && (bounce ? k.F === Fc.F : near(k.F, Fc.F + r.hold.H, 1e-12) && near(k.F * k.T, k.supplied, 1e-9)))) bad.push(tag + ': the hit\\'s force ' + sig(k.F) + ' N over ' + sig(k.T) + ' s is not the squash\\'s ' + sig(Fc.F) + ' N plus the hold ' + sig(r.hold.H) + ' N (F x T ' + sig(k.F * k.T) + ' vs supplied ' + sig(k.supplied) + ')');"""),
("""    // at 50% of c the bounce's ground-frame momentum is 2 gamma^2 m v, not the immovable sums' 2 p (the brief's first runs)
    const r50 = charge(dial, { source: 'set', gb: gb50, bounce: true });
    ok('8a: a charger with his recoil taken keeps his speed; the one hit, on his footing, leaves at his speed (splat) or 2v/(1+v^2/c^2) (bounce), and the charger\\'s source supplies the one hit\\'s gain plus his footing\\'s share, to 1e-9 (sprint, 10^9 kg, 0.1% and 50% of c, a jump onto Rex on real ground; the bounce bound ignores the footing, as its speeds do)', !bad.length && r50.carry && r50.carry.pGain > 1.15 * 2 * P.vToMomentum(r50.vRel, R3.m), bad.length ? bad.join('; ') : seen.join('; '));""",
"""    // at 50% of c the bounce's ground-frame momentum is 2 gamma^2 m v, not the immovable sums' 2 p (the brief's first runs)
    const r50 = charge(dial, { source: 'set', gb: gb50, bounce: true });
    // the figures review round 1 found: at 1 m/s the footing's share is 17,652 N x 0.629 s = 11,100 kg m/s (14,100 in all,
    // not 6,000), and a jump onto Rex on real ground books the ground's bearing, 57,700 (107,000 in all, not 99,400)
    const s1 = charge(dial, { source: 'set', gb: 1 / cl }), jr = charge(dial, { source: 'jump' }, on({ unbreakable: false }), on({ unbreakable: false })), la = charge(4260 * g, { source: 'sprint' });
    const figs = chk(() => near(s1.carry.footJ, 11100, 0.005) && near(s1.carry.supplied, 14100, 0.005) && near(s1.carry.F, 22420, 0.002) && near(jr.carry.footJ, 57700, 0.002) && near(jr.carry.supplied, 107400, 0.002) && near(jr.carry.F, 2.830e6, 0.002) && near(la.carry.F, 273800, 0.002));
    ok('8a: a charger with his recoil taken keeps his speed; the one hit, on his footing, leaves at his speed (splat) or 2v/(1+v^2/c^2) (bounce), and the charger\\'s source supplies the one hit\\'s gain plus his hold x the hit\\'s time, uncapped, to 1e-9; the hit\\'s force is the squash\\'s own plus the hold, so force x time = what the source supplies (sprint, 10^9 kg, 0.1% and 50% of c, 1 m/s, jumps onto Rex on real ground; the bounce bound ignores the footing, as its speeds do): at 1 m/s ' + sig(s1.carry && s1.carry.supplied) + ' kg m/s, a jump onto Rex on real ground ' + sig(jr.carry && jr.carry.supplied) + ' kg m/s, the least disruptive sprint pushes with ' + sig(la.carry && la.carry.F) + ' N', !bad.length && figs && r50.carry && r50.carry.pGain > 1.15 * 2 * P.vToMomentum(r50.vRel, R3.m), bad.length ? bad.join('; ') : seen.join('; '));"""),
# 8b: the rock books its tear load for the whole squash; from above, bolted on real ground, the ground's bearing, not the rock
("""    const rr = notPara[2][1], k = rr.carry, tear = R3.digArea * conc.shear;
    if (!(k && k.rockGives === true && near(k.tear, tear, 1e-12) && near(k.footJ, Math.min(tear, rr.contact.soft.F) * rr.contact.soft.t, 1e-12))) bad.push('real rock: ' + JSON.stringify(k));""",
"""    const rr = notPara[2][1], k = rr.carry, tear = R3.digArea * conc.shear;
    if (!(k && k.rockGives === true && near(k.tear, tear, 1e-12) && k.hold === k.tear && near(k.footJ, tear * rr.contact.soft.t, 1e-12))) bad.push('real rock: ' + JSON.stringify(k));
    // landed on from above, bolted on real ground: he and his bolts are driven into the ground his feet bear on, so his hold
    // is the ground's bearing, as standing, not the rock's tear-out load (review round 1 of pull request 4)
    const jb = charge(dial, { source: 'jump' }, on({ anchor: 'bolted', unbreakable: false }), on({ unbreakable: false })), js = charge(dial, { source: 'jump' }, on({ unbreakable: false }), on({ unbreakable: false }));
    if (!chk(() => jb.outcome === 'carried' && jb.carry.rockGives === false && !('tear' in jb.carry) && jb.carry.hold === js.carry.hold && jb.carry.footJ === js.carry.footJ && jb.after.splat.depth === js.after.splat.depth && jb.carry.hold > 1.5e6)) bad.push('from above, bolted on real ground: ' + JSON.stringify(jb.carry));"""),
]
