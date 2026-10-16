p='/home/user/rex-strength-lab/rex-strength-lab/test/powers.js'; s=open(p,encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)==cnt, (s.count(old), old[:90])
    s=s.replace(old,new)
# 8f: the lying pusher and real muscle
rep(r"""    const rk13 = P.standoff(c3(13500 * g, O3, on({ unbreakable: false })), c3(13500 * g, R3, on({ anchor: 'bolted', unbreakable: false })));""",
r"""    const rk13 = P.standoff(c3(13500 * g, O3, on({ unbreakable: false })), c3(13500 * g, R3, on({ anchor: 'bolted', unbreakable: false })));
    // (review round 2 of pull request 4) one rule for a pusher too weak to stand: the shoving match's (he lies flat and
    // pushes 0); Ollie at 2,000 kg-force (standing needs 2,143) pushes 0 in both contests, and Rex holds; with the power off
    // the steady push is the old stalemate at the grip. Real muscle: the static push again, flagged an upper bound
    const ly = P.standoff(c3(2000 * g, O3, on()), c3(dial, R3, on())), lyM = P.pushMatch(c3(dial, R3, on()), c3(2000 * g, O3, on())), ly0 = P.standoff(c3(2000 * g, O3, on({ ownRecoil: false })), c3(dial, R3, on({ ownRecoil: false })));
    const re = P.standoff(c3(dial, O3, on({ mode: 'real' })), c3(dial, R3, on({ mode: 'real' })));
    const lyOk = chk(() => ly.DA === 0 && ly.cantStand === true && ly.outcome === 'objectHolds' && ly.contact === 0 && !ly.drive && lyM.DB === 0 && ly0.outcome === 'stalemate' && !('cantStand' in ly0) && !('cantStand' in so)
      && re.drive.realUpper === true && near(re.drive.vB, dv.vB, 1e-12) && !('realUpper' in dv));""")
rep(r"""the one driven back is followed as in the shoving match\'s shove-off (' + sig(dv.vB) + ' m/s, sliding ' + sig(dv.slideB) + ' m; unbounded, just under light speed)',
      driveOk && dipOk""",
r"""the one driven back is followed as in the shoving match\'s shove-off (' + sig(dv.vB) + ' m/s, sliding ' + sig(dv.slideB) + ' m; unbounded, just under light speed; with real muscle the same static push, an upper bound); a pusher too weak to stand can\'t push, as in the shoving match (review round 2)',
      lyOk && driveOk && dipOk""")
# 8g: each one's travel during the push; the walk-out's push and push back
rep(r"""        && near(P.xOfT(fA, R3.m, t) + P.xOfT(fB, O3.m, t), r.d, 1e-12) && near(r.pA, fA * t, 1e-12)""",
r"""        && near(P.xOfT(fA, R3.m, t) + P.xOfT(fB, O3.m, t), r.d, 1e-12) && near(r.xA, P.xOfT(fA, R3.m, t), 1e-12) && near(r.xB, P.xOfT(fB, O3.m, t), 1e-12) && near(r.pA, fA * t, 1e-12)""")
rep(r"""    const aOk = (x, sfc) => near(x.accel, Math.min((x.DA - x.HB) / O3.m, (fw(sfc) - x.DB) / R3.m), 1e-12) && near(x.contact, x.HB + O3.m * x.accel, 1e-12);""",
r"""    const aOk = (x, sfc) => near(x.accel, Math.min((x.DA - x.HB) / O3.m, (fw(sfc) - x.DB) / R3.m), 1e-12) && near(x.contact, x.HB + O3.m * x.accel, 1e-12);
    // (review round 2 of pull request 4) the winner holds back: his push is only what keeps the loser at the walking pace,
    // walkPush = the loser's hold + his mass x a (35.3 kN against Ollie lying flat, not the 890 kN he could push), and its
    // push back goes to his source, the loser's momentum + his feet's share (m_l v + H_l t = walkPush x t below his running
    // cap); a loser who pushes has his push x t taken by his own source; the momentum adds up (the ground takes the
    // winner's feet's push forward and the loser's feet's hold back)
    const wOk = (x, sfc) => chk(() => near(x.walkPush, x.HB + O3.m * x.accel, 1e-12) && near(x.recoilAbsorbedA.J, O3.m * x.v + x.HB * x.t, 1e-12) && x.recoilAbsorbedA.T === x.t && x.recoilAbsorbedA.thetaDeg === 0
      && (x.v < x.vCap ? near(x.walkPush * x.t, x.recoilAbsorbedA.J, 1e-9) : true) && (x.DB > 0 ? near(x.recoilAbsorbedB.J, x.DB * x.t, 1e-12) : !x.recoilAbsorbedB)
      && Math.abs((R3.m + O3.m) * x.v - ((R3.m * x.accel + x.DB - x.HB) * x.t + x.recoilAbsorbedA.J - (x.recoilAbsorbedB ? x.recoilAbsorbedB.J : 0))) <= 1e-9 * x.recoilAbsorbedA.J);""")
rep(r"""      w1.outcome === 'walkOut' && w1.winner === 'A' && aOk(w1, gr) && near(w1.accel, 1.046, 0.002) && w2.outcome === 'walkOut' && aOk(w2, conc) && near(w2.accel, 5.88, 0.002) && w2o.outcome === 'deadlock', w1.outcome + ' / ' + w2.outcome + ' / off ' + w2o.outcome);""",
r"""      w1.outcome === 'walkOut' && w1.winner === 'A' && aOk(w1, gr) && near(w1.accel, 1.046, 0.002) && w2.outcome === 'walkOut' && aOk(w2, conc) && near(w2.accel, 5.88, 0.002) && w2o.outcome === 'deadlock'
        && wOk(w1, gr) && wOk(w2, conc) && near(w2.walkPush, 35304, 0.001) && w2.walkPush < 0.05 * w2.DA, w1.outcome + ' / ' + w2.outcome + ' / off ' + w2o.outcome + '; walking push ' + sig(w2.walkPush) + ' N (could push ' + sig(w2.DA) + ' N), push back ' + sig(w2.recoilAbsorbedA && w2.recoilAbsorbedA.J) + ' kg m/s');""")
rep(r"""    ok('8g: the walk-out where only one push beats the other\'s grip, at the Pull tab\'s pace for the winner\'s own body, a = min((his push - the loser\'s hold) / the loser\'s mass, (his footing - the loser\'s push) / his own mass): Rex at the dial against Ollie at 2,200 kg-force on gravel (a ' + sig(w1.accel) + ' m/s2) and against Ollie lying flat at 1,000 kg-force on concrete (a ' + sig(w2.accel) + ' m/s2; with the power off a dead heat)',""",
r"""    ok('8g: the walk-out where only one push beats the other\'s grip, at the Pull tab\'s pace for the winner\'s own body, a = min((his push - the loser\'s hold) / the loser\'s mass, (his footing - the loser\'s push) / his own mass): Rex at the dial against Ollie at 2,200 kg-force on gravel (a ' + sig(w1.accel) + ' m/s2) and against Ollie lying flat at 1,000 kg-force on concrete (a ' + sig(w2.accel) + ' m/s2; with the power off a dead heat); the winner holds back to that pace (his push the loser\'s hold + his mass x a) and his push back goes to his source (review round 2)',""")
# 8h: Both at once with one bolted
rep(r"""    const po = P.shoveBoth(c3(Infinity, R3, on()), c3(Infinity, O3, on({ anchor: 'bolted' }))), pb = P.shoveBoth(c3(Infinity, R3, on({ anchor: 'bolted' })), c3(Infinity, O3, on({ anchor: 'bolted' })));""",
r"""    const po = P.shoveBoth(c3(Infinity, R3, on()), c3(Infinity, O3, on({ anchor: 'bolted' }))), pb = P.shoveBoth(c3(Infinity, R3, on({ anchor: 'bolted' })), c3(Infinity, O3, on({ anchor: 'bolted' })));
    // (review round 2 of pull request 4) one bolted at a finite strength: the other's shove stalls against his bolts but
    // presses on them for the stroke of his own real shove, so his bolts hand the ground that shove over that push (at least
    // a limb's contact time), as the shoving match counts a bolted winner's bolts: Ollie bolted at 90.7 t, Rex's shove
    // 299 kN x 0.187 s = 55,800 kg m/s (toGroundB); Rex bolted, the mirror (toGroundA); neither bolted, none
    const t90 = 90718.474 * g, bO = P.shoveBoth(c3(t90, R3, on()), c3(t90, O3, on({ anchor: 'bolted' }))), bR = P.shoveBoth(c3(t90, R3, on({ anchor: 'bolted' })), c3(t90, O3, on()));
    const rPo = P.shove(c3(t90, R3, on()), c3(t90, O3, on({ anchor: 'bolted' }))), rTo = P.shove(c3(t90, O3, on({ anchor: 'bolted' })), c3(t90, R3, on()));
    const pulseOk = chk(() => rPo.stalled && !rTo.stalled && near(bO.toGroundB.J, rPo.Fdrive * rTo.push.t, 1e-12) && bO.toGroundB.T === Math.max(P.limbPulse(O3), rTo.push.t) && near(bO.toGroundB.J, 55838, 0.002) && !bO.toGroundA
      && near(bR.toGroundA.J, bO.toGroundB.J, 1e-9) && !bR.toGroundB && !sb.toGroundA && !sb.toGroundB && !po.toGroundA && !po.toGroundB);""")
rep(r"""both bolted on it, the paradox (nothing moves)',
      chk(() => sb.both === true""",
r"""both bolted on it, the paradox (nothing moves); one bolted at a finite strength, the other\'s stalled shove presses on his bolts over the stroke of his own real shove, a pulse into the ground (' + sig(bO.toGroundB && bO.toGroundB.J) + ' kg m/s at 90.7 t; review round 2)',
      pulseOk && chk(() => sb.both === true""")
open(p,'w',encoding='utf-8').write(s)
