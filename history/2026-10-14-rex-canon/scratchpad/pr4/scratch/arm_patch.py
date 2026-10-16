p='src/engine.js'
s=open(p,encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1, old[:80]
    s=s.replace(old,new)
rep("""  // slide, so his whole body is dragged sideways.
  function armWrestle(cA, cB) {""","""  // slide, so his whole body is dragged sideways.
  // Taking their own recoil (BRIEF-canon.md item 4, decision 10 of pull request 4; canon Q12: in arm wrestling the other's
  // push on him is real and the only absorption is the push each puts on himself). The brief's reading (A: each one's
  // push back goes to his source, so the presses no longer load the table at all; the table carries only the slam) is
  // physically incoherent: the other's press is real on him, and his forearm, pivoted on his elbow pad, can only hold
  // against it by pushing back on the pad (or by moving). With nothing on his side carrying it, as A has it, a real force
  // would act on each hand in a stalemate and nothing would move: momentum would vanish outside canon's list (Never
  // knocked back is set aside in contests). So the lab builds reading B, the shoving match's rule at the table: each pad
  // (or, standing, each one's feet) holds the OTHER's press; only what is truly his own push back goes to his source.
  //   - On the table, a stalemate loads each pad with the other's press, as before: the table carries the smaller press
  //     between them, and both presses past what it carries break it ('push'), unchanged.
  //   - A pin (the winner's power on): the winner's pad holds the loser's press (real). Spinning both forearms is the
  //     winner's swing, whose push back goes to his source (pull request 2), so it no longer loads his pad: padLoad = the
  //     loser's press, which never exceeds what the table carries unless the presses broke it already. So with the power
  //     on a pin never breaks the table (tableBreaksBy is never 'pin'). The pin itself is unchanged (the brief: the
  //     stronger tips the other), and so is its slam (pull request 2: whole in the ground with Unbreakable footing).
  //   - Standing, once the table is gone (only with Things keep their form off): each one's own footing no longer caps
  //     his own press (AA = PA with his power on; footLimitedA false), so the stronger press always pins the weaker arm
  //     (no 'drag'). Each one's feet hold the other's press, which can now pass his grip: loserSlides as before (the
  //     press his folding arm resists, against his footing); winnerSlides (new, the winner's power on): the loser's press
  //     past the winner's footing, so his feet slide too. A standing stalemate with presses past their grips: draggedA /
  //     draggedB (new): the other's press beats his footing, so his feet slide; the lab doesn't follow that motion (the two
  //     are pushed opposite ways and would turn about their clasped hands: a known limit). tearA / tearB (bolted): the
  //     other's press on his bolts' rock. Both presses unlimited, standing: each body takes the other's unlimited press:
  //     'paradox' if either is held without limit (bolted on ground that holds; oneSided unless both are), 'rockGives' if
  //     both are bolted on real rock (tearA, tearB), else 'flungApart' (their feet, or the rock around one's bolts, give:
  //     flung apart at just under light speed; tearA / tearB where bolted). Each with ownRecoil: true.
  // With the power off every result is as before.
  function armWrestle(cA, cB) {""")
rep("""    let padLoad = 0, padBy = null;
    if (!tableBreaks && !sameForce(PA, PB)) {
      const aStr = PA > PB, Pw = aStr ? PA : PB, Pl = aStr ? PB : PA, mw = aStr ? A.m : B.m, ml = aStr ? B.m : A.m;
      padLoad = Pl + (Pw - Pl) * (AW.effMass * ml + AW.holdArm * mw) / (AW.effMass * (A.m + B.m));
      padBy = aStr ? 'A' : 'B';
      if (padLoad > tableLat) { tableBreaks = true; tableBreaksBy = 'pin'; }
    }
    const AA = tableBreaks ? Math.min(PA, fA.R) : PA, AB = tableBreaks ? Math.min(PB, fB.R) : PB;
    const out = { PA, PB, RA: fA.R, RB: fB.R, AA, AB, tableLat, tableBreaks, tableBreaksBy, padLoad, padBy, footLimitedA: tableBreaks && fA.R < PA, footLimitedB: tableBreaks && fB.R < PB, LA: AW.lever * A.H, LB: AW.lever * B.H };""",
"""    // (the winner taking his own recoil: his pad holds only the loser's press; the forearms' spin-up is his swing's push
    // back, to his source: reading B, above)
    let padLoad = 0, padBy = null;
    if (!tableBreaks && !sameForce(PA, PB)) {
      const aStr = PA > PB, Pw = aStr ? PA : PB, Pl = aStr ? PB : PA, mw = aStr ? A.m : B.m, ml = aStr ? B.m : A.m;
      padLoad = (aStr ? cA : cB).ownRecoil ? Pl : Pl + (Pw - Pl) * (AW.effMass * ml + AW.holdArm * mw) / (AW.effMass * (A.m + B.m));
      padBy = aStr ? 'A' : 'B';
      if (padLoad > tableLat) { tableBreaks = true; tableBreaksBy = 'pin'; }
    }
    // standing, his own press is capped by his footing only with his recoil not taken
    const capA = tableBreaks && !cA.ownRecoil, capB = tableBreaks && !cB.ownRecoil;
    const AA = capA ? Math.min(PA, fA.R) : PA, AB = capB ? Math.min(PB, fB.R) : PB;
    const out = { PA, PB, RA: fA.R, RB: fB.R, AA, AB, tableLat, tableBreaks, tableBreaksBy, padLoad, padBy, footLimitedA: capA && fA.R < PA, footLimitedB: capB && fB.R < PB, LA: AW.lever * A.H, LB: AW.lever * B.H };""")
rep("""    out.tearA = cA.anchor === 'bolted' ? AA / groundTear(cA) : 0;
    out.tearB = cB.anchor === 'bolted' ? AB / groundTear(cB) : 0;
    if (!isFinite(AA) && !isFinite(AB)) {""","""    // (each one's bolts: his own press with his recoil not taken, the other's press with it taken)
    out.tearA = cA.anchor === 'bolted' ? (cA.ownRecoil ? AB : AA) / groundTear(cA) : 0;
    out.tearB = cB.anchor === 'bolted' ? (cB.ownRecoil ? AA : AB) / groundTear(cB) : 0;
    if (!isFinite(AA) && !isFinite(AB) && tableBreaks && (cA.ownRecoil || cB.ownRecoil)) {
      // standing, both presses unlimited, their own recoil taken: each body takes the other's unlimited press
      const heldA = cA.anchor === 'bolted' && holdsGround(cA), heldB = cB.anchor === 'bolted' && holdsGround(cB);
      const boltA = cA.anchor === 'bolted', boltB = cB.anchor === 'bolted';
      if (heldA || heldB) Object.assign(out, { clash: 'paradox', oneSided: !(heldA && heldB) });
      else Object.assign(out, { clash: boltA && boltB ? 'rockGives' : 'flungApart' }, boltA ? { tearA: groundTear(cA) } : {}, boltB ? { tearB: groundTear(cB) } : {});
      out.outcome = out.clash; out.contact = Infinity; out.ownRecoil = true;
      return out;
    }
    if (!isFinite(AA) && !isFinite(AB)) {""")
rep("""    const Pw = aWins ? PA : PB, Rw = tableBreaks ? (aWins ? fA.R : fB.R) : Infinity;
    const Pl = aWins ? PB : PA, Rl = tableBreaks ? (aWins ? fB.R : fA.R) : Infinity;""","""    const Pw = aWins ? PA : PB, Rw = tableBreaks ? (aWins ? fA.R : fB.R) : Infinity;
    const Pl = aWins ? PB : PA, Rl = tableBreaks ? (aWins ? fB.R : fA.R) : Infinity;
    // real muscle standing: his footing caps his press only with his recoil not taken
    const capW = cw.ownRecoil ? Infinity : Rw;""")
rep("""      ? pushApart({ F: Pw, Fcap: Rw < Pw ? Rw : undefined, d: s, mA: M, mB: M, RA: Infinity, RB: R, mode: 'real', vmax: MUSCLE.punch.vmax * bw.s })""",
"""      ? pushApart({ F: Pw, Fcap: capW < Pw ? capW : undefined, d: s, mA: M, mB: M, RA: Infinity, RB: R, mode: 'real', vmax: MUSCLE.punch.vmax * bw.s })""")
rep("""    if (sameForce(AA, AB)) { out.outcome = 'stalemate'; out.contact = AA; return out; }""","""    if (sameForce(AA, AB)) {
      out.outcome = 'stalemate'; out.contact = AA;
      // standing with his recoil taken: the other's press, no longer capped by the other's grip, can beat his footing
      if (tableBreaks && cA.ownRecoil) out.draggedA = AB > fA.R;
      if (tableBreaks && cB.ownRecoil) out.draggedB = AA > fB.R;
      return out;
    }""")
rep("""      // standing up, a loser whose feet hold less than his arm is also pulled along by it
      out.loserSlides = tableBreaks && Rl < Pl;""","""      // standing up, a loser whose feet hold less than his arm is also pulled along by it; with the winner's recoil taken
      // the loser's press is real on him and no longer capped by his own grip, so his feet can slide too
      out.loserSlides = tableBreaks && Rl < Pl;
      if (tableBreaks && cw.ownRecoil) out.winnerSlides = Rw < Pl;""")
rep("""    // energy (p = sqrt(E^2 + 2 E M c^2) / c): near light speed the rounded speed would freeze it. (Per-person switches
    // and the presses, pull request 4, would report the two push backs separately.)
    // (The presses through the elbow pads and pegs, the drag once the table is gone and the standing footing are item 4
    // of BRIEF-canon.md, a later pull request: unchanged here.)""","""    // energy (p = sqrt(E^2 + 2 E M c^2) / c): near light speed the rounded speed would freeze it. (The presses, the
    // table and standing up: reading B, above.)""")
open(p,'w',encoding='utf-8').write(s)
print('ok')
