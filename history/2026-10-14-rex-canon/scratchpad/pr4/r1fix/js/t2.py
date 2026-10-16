R = [
("""bolted on real rock the rock tears out (' + sig(tear) + ' N) and he slides on his own friction; at light speed today\\'s unstoppable', !bad.length, bad.join('; '));""",
"""bolted on real rock the rock tears out (' + sig(tear) + ' N, booked for the whole squash) and he slides on his own friction; from above, bolted on real ground, the ground\\'s bearing holds him, as standing (not the rock\\'s tear-out load); at light speed today\\'s unstoppable', !bad.length, bad.join('; '));"""),
# 8f: the steady push follows the one driven back; bolted on real rock past its tear load he is torn loose
("""    const rk = P.standoff(c3(dial, O3, on({ unbreakable: false })), c3(dial, R3, on({ anchor: 'bolted', unbreakable: false })));""",
"""    const rk = P.standoff(c3(dial, O3, on({ unbreakable: false })), c3(dial, R3, on({ anchor: 'bolted', unbreakable: false })));
    // (review round 1 of pull request 4) the one driven back is followed as the shoving match follows a shove-off: the same
    // net push over the same stroke, so the same speed and slide as Ollie bolted shoving Rex off (37.6 m/s, 109 m); his
    // feet hand the ground his hold x t and the pusher's source takes his push x t (the ledger closes); unbounded: just
    // under light speed. Bolted on real rock, past the rock's tear load (about 697 kN) he is torn loose and driven back on
    // his feet; below it (13.5 t) his bolts hold
    const so1 = P.pushMatch(c3(dial, R3, on()), c3(dial, O3, on({ anchor: 'bolted' }))), dv = so.drive || {}, dvi = (P.standoff(c3(Infinity, O3, on()), c3(dial, R3, on())).drive) || {};
    const rk13 = P.standoff(c3(13500 * g, O3, on({ unbreakable: false })), c3(13500 * g, R3, on({ anchor: 'bolted', unbreakable: false })));
    const driveOk = chk(() => near(dv.vB, so1.vA, 1e-12) && near(dv.slideB, so1.slideA, 1e-12) && near(dv.t, so1.t, 1e-12) && near(dv.vB, 37.65, 0.001) && near(dv.slideB, 109.0, 0.001) && near(dv.pB, (so.DA - so.HB) * dv.t, 1e-12) && near(dv.footB, so.HB * dv.t, 1e-12)
      && near(so.recoilAbsorbed.J, dv.pB + dv.footB, 1e-12) && dvi.vB === cl && dvi.slideB === Infinity && !('drive' in so0)
      && rk.outcome === 'forceWins' && rk.rockGives === true && near(rk.tearB, R3.digArea * conc.shear, 1e-12) && rk.HB === holdR && near(rk.drive.vB, dv.vB, 1e-12) && rk.rock.tear > 1 && rk13.outcome === 'objectHolds' && !rk13.rockGives && !rk13.drive);"""),
("""      so.ownRecoil === true && so.DA === dial && so.pusherSlips === false && so.outcome === 'forceWins' && so.contact === holdR && so0.outcome === 'stalemate' && so0.DA === so0.RA && so0.pusherSlips && !('ownRecoil' in so0)""",
"""      driveOk && so.ownRecoil === true && so.DA === dial && so.pusherSlips === false && so.outcome === 'forceWins' && so.contact === holdR && so0.outcome === 'stalemate' && so0.DA === so0.RA && so0.pusherSlips && !('ownRecoil' in so0)"""),
("""bolted on real rock his push loads only Rex\\'s rock (no dipole: out to ' + sig(rk.rock && rk.rock.rT) + ' m)',""",
"""bolted on real rock his push loads only Rex\\'s rock (no dipole: out to ' + sig(rk.rock && rk.rock.rT) + ' m), and past its tear load the rock tears out and Rex is driven back on his feet (below it, at 13.5 t, his bolts hold); the one driven back is followed as in the shoving match\\'s shove-off (' + sig(dv.vB) + ' m/s, sliding ' + sig(dv.slideB) + ' m; unbounded, just under light speed)',"""),
]
