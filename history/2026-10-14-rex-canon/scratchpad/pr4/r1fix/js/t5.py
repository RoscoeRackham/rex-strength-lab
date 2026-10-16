R = [
("""  // 8i. arm wrestling, reading B (decision 10; the brief's reading A is physically incoherent, see armWrestle): each pad
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
    ok('8i: arm wrestling on the table with the winner\\'s recoil taken: his pad holds the loser\\'s press (' + sig(p1.padLoad) + ' N, against ' + sig(p0.padLoad) + ' N with the power off), so a pin never breaks the table (0 of ' + runs + ' runs; only both presses past what it carries do); the pin itself is unchanged; with Things keep their form off the pin that broke the table with the power off stays on it',
      p1.outcome === 'pin' && p1.padLoad === p1.PB && p0.padLoad > 50 * p1.padLoad && same(p1.pin, p0.pin) && p1.slamRatio === p0.slamRatio && pinBreaks === 0 && k1.outcome === 'pin' && !k1.tableBreaks && k0.tableBreaks && k0.tableBreaksBy === 'pin', 'power off with Things keep their form off: the table breaks by the ' + k0.tableBreaksBy);""",
"""  // 8i. arm wrestling, reading B (decision 10; the brief's reading A is physically incoherent, see armWrestle): each pad
  // (standing, each one's feet) holds the OTHER's press. A pin on the table: the winner's pad holds the loser's press
  // (spinning the forearms is his swing, to his source); the loser's pad carries what turns his own forearm against the
  // winner's hand, |holdArm m_l a - (P_l + effMass m_l a)| (review round 1 of pull request 4), and past what the table
  // carries it breaks the table in the pin, as the winner's pad does with the power off; the presses still break it; the
  // pin itself is unchanged. Standing (Things keep their form off, the table broken): his own footing no longer caps his
  // own press, so the stronger always pins; each one's feet hold the other's press; a bolted one's rock carries the press
  // that reaches him (the other's in a stalemate, the loser's in a pin)
  { const aw = (FR, FO, x) => P.armWrestle(c3(FR, R3, on(x)), c3(FO, O3, on(x))), aw0 = (FR, FO, x) => P.armWrestle(c3(FR, R3, on(Object.assign({ ownRecoil: false }, x))), c3(FO, O3, on(Object.assign({ ownRecoil: false }, x))));
    const p1 = aw(dial, 1000 * g), p0 = aw0(dial, 1000 * g), k1 = aw(dial, 1000 * g, { keepForm: false }), k0 = aw0(dial, 1000 * g, { keepForm: false });
    const AW = P.AW, loserPadOf = (r, ml) => { const Pw = Math.max(r.PA, r.PB), Pl = Math.min(r.PA, r.PB), a = (Pw - Pl) / (AW.effMass * (R3.m + O3.m)); return Math.abs(AW.holdArm * ml * a - (Pl + AW.effMass * ml * a)); };
    let wrong = 0, byLoser = 0, runs = 0; const firstWrong = [];
    for (const lg of [2.5, 3, 3.5, 4, 5, 6, 9, 12, 20]) for (const lo of [2, 2.5, 3, 4, 6, 9]) for (const sid of ['sand', 'concrete', 'ice', 'granite', 'softclay']) for (const anc of ['friction', 'bolted']) for (const kf of [false, true]) for (const ub of [false, true]) {
      const x = { keepForm: kf, unbreakable: ub, surface: surf(sid), anchor: anc }, r = P.armWrestle(c3(Math.pow(10, lg) * g, R3, on(x)), c3(Math.pow(10, lo) * g, O3, on(x)));
      runs++;
      // the presses alone break it ('push'); otherwise a pin on the table breaks it exactly where the larger pad passes it
      if (r.blackHole || r.tableBreaksBy === 'push' || r.PA === r.PB) continue;
      const lp = loserPadOf(r, r.PA > r.PB ? O3.m : R3.m), breaks = Math.max(r.padLoad, lp) > r.tableLat;
      if (!(near(r.loserPadLoad, lp, 1e-12) && r.padLoad === Math.min(r.PA, r.PB) && (r.tableBreaksBy === 'pin') === breaks)) { wrong++; if (firstWrong.length < 2) firstWrong.push([lg, lo, sid, anc, kf, ub, r.tableBreaksBy, sig(lp), sig(r.tableLat)].join(' ')); }
      if (r.tableBreaksBy === 'pin') byLoser++;
    }
    ok('8i: arm wrestling on the table with the winner\\'s recoil taken: his pad holds the loser\\'s press (' + sig(p1.padLoad) + ' N, against ' + sig(p0.padLoad) + ' N with the power off), and the loser\\'s pad what turns his forearm (' + sig(p1.loserPadLoad) + ' N); a pin breaks the table where the larger pad passes what it carries (' + byLoser + ' of ' + runs + ' runs, each by the loser\\'s pad); the pin itself is unchanged; with Things keep their form off, Rex at the dial against Ollie at 1 t, the loser\\'s pad (' + sig(k1.loserPadLoad) + ' N) breaks the table (' + sig(k1.tableLat) + ' N) and Rex pins standing, as with the power off (by the winner\\'s pad there)',
      chk(() => p1.outcome === 'pin' && p1.padLoad === p1.PB && near(p1.loserPadLoad, loserPadOf(p1, O3.m), 1e-12) && p0.padLoad > 50 * p1.padLoad && !('loserPadLoad' in p0) && same(p1.pin, p0.pin) && p1.slamRatio === p0.slamRatio && wrong === 0 && byLoser > 0
        && k1.outcome === 'pin' && k1.tableBreaks && k1.tableBreaksBy === 'pin' && near(k1.loserPadLoad, 24206, 0.001) && k1.loserPadLoad > k1.tableLat && k1.padLoad < k1.tableLat && k1.slamRatio === 0 && k0.tableBreaks && k0.tableBreaksBy === 'pin'), wrong ? firstWrong.join('; ') : 'power off with Things keep their form off: the table breaks by the ' + k0.tableBreaksBy);"""),
("""    const u1 = aw(Infinity, Infinity, { keepForm: false }), u2 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted' }), u3 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted', unbreakable: false });""",
"""    const u1 = aw(Infinity, Infinity, { keepForm: false }), u2 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted' }), u3 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted', unbreakable: false });
    // a bolted loser in a standing pin (Rex at 10^6 kg against Ollie at 100 short tons, bolted on real rock): his rock carries
    // the loser's press, the push his folding arm resists (222 kN, 0.32 of its tear load), not Rex's 2.45 MN; equal presses
    // load each one's bolts with the other's (review round 1 of pull request 4)
    const bl = P.armWrestle(c3(1e6 * g, R3, on({ keepForm: false, unbreakable: false })), c3(dial, O3, on({ keepForm: false, unbreakable: false, anchor: 'bolted' })));
    const be = aw(dial, dial, { keepForm: false, unbreakable: false, anchor: 'bolted' }), tear = R3.digArea * conc.shear;
    const tearOk = chk(() => bl.outcome === 'pin' && bl.winner === 'A' && near(bl.tearB, bl.PB / tear, 1e-12) && bl.tearB < 1 && be.outcome === 'stalemate' && near(be.tearA, be.PB / tear, 1e-12) && near(be.tearB, be.PA / tear, 1e-12));"""),
("""    ok('8i: standing, once the presses break the table (Things keep their form off): his own footing no longer caps his own press (both at the dial: a stalemate in the arms at ' + sig(st.AA) + ' N, each one\\'s feet sliding under the other\\'s press; with the power off a stalemate at the grip); 100 t against 200 t, Ollie pins Rex (with the power off a stalemate at the grip) and both one\\'s feet slide; both unlimited: flung apart, or the paradox bolted on Unbreakable footing, or both rocks tear out on real rock',
      st.tableBreaks""",
"""    ok('8i: standing, once the presses break the table (Things keep their form off): his own footing no longer caps his own press (both at the dial: a stalemate in the arms at ' + sig(st.AA) + ' N, each one\\'s feet sliding under the other\\'s press; with the power off a stalemate at the grip); 100 t against 200 t, Ollie pins Rex (with the power off a stalemate at the grip) and both one\\'s feet slide; a bolted loser\\'s rock carries the loser\\'s press (' + sig(bl.tearB) + ' of its tear load); both unlimited: flung apart, or the paradox bolted on Unbreakable footing, or both rocks tear out on real rock',
      tearOk && st.tableBreaks"""),
]
