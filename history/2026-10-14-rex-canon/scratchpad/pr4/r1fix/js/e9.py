R = [
("""    const pushes = eqN(r.DA, r.DB) ? fmtN(r.DA) + ' each' : 'Rex ' + fmtN(r.DA) + ', Ollie ' + fmtN(r.DB);
    const holds = eqN(r.HA, r.HB) ? fmtN(r.HA) + ' each' : 'Rex ' + fmtN(r.HA) + ', Ollie ' + fmtN(r.HB);""",
"""    const pushes = eqN(r.DA, r.DB) ? fmtN(r.DA) + ' each' : 'Rex ' + fmtN(r.DA) + ', Ollie ' + fmtN(r.DB);
    // (review round 1 of pull request 4: a wrestler bolted on real rock holds only until the rock around his bolts tears
    // out, about 697 kN for the 3,000 kg bodies on the slab; then only his feet hold him)
    const tornOf = (s) => (s === 'A' ? r.tornA : r.tornB), tearOf = (s) => (s === 'A' ? r.tearA : r.tearB);
    const hTxt = (s) => (tornOf(s) ? 'the rock around his bolts, about ' + fmtSI(tearOf(s), 'N') : fmtN(s === 'A' ? r.HA : r.HB));
    const holds = !r.tornA && !r.tornB && eqN(r.HA, r.HB) ? fmtN(r.HA) + ' each' : 'Rex ' + hTxt('A') + ', Ollie ' + hTxt('B');"""),
("""    else if (r.outcome === 'bothShoved') {
      const ratio = Math.min(r.DA / r.HB, r.DB / r.HA);
      const sameV = Math.abs(r.vA - r.vB) <= 0.01 * Math.max(r.vA, r.vB);
      v = 'Pushing straight across, both are shoved apart. They take their own recoil, so neither push costs the pusher his grip: each pushes with the effort he uses (' + pushes + '), ' + (isFinite(ratio) && ratio >= 2 ? 'about ' + (ratio >= 10 ? Math.round(ratio) : sig(ratio, 2)) + ' times' : 'more than') + ' what holds the other (' + holds + ').'
        + (tornName ? ' The rock around ' + tornName + '’s bolts tears out.' : '')""",
"""    else if (r.outcome === 'bothShoved') {
      const ratio = Math.min(r.DA / (r.tornB ? r.tearB : r.HB), r.DB / (r.tornA ? r.tearA : r.HA));
      const sameV = Math.abs(r.vA - r.vB) <= 0.01 * Math.max(r.vA, r.vB);
      v = 'Pushing straight across, both are shoved apart. They take their own recoil, so neither push costs the pusher his grip: each pushes with the effort he uses (' + pushes + '), ' + (isFinite(ratio) && ratio >= 2 ? 'about ' + (ratio >= 10 ? big(ratio, 2) : sig(ratio, 2)) + ' times' : 'more than') + ' what holds the other (' + holds + ').'
        + (tornName ? ' The rock around ' + tornName + '’s bolts tears out, and from then on only his feet hold him (' + fmtSI(r.tornA ? r.holdAfterA : r.holdAfterB, 'N') + ').' : '')"""),
("""    } else if (r.outcome === 'shovedOff') {
      const cw = r.winner === 'A' ? cR : cO, vl = r.winner === 'A' ? r.vB : r.vA, sl = r.winner === 'A' ? r.slideB : r.slideA, Dl = r.winner === 'A' ? r.DB : r.DA;
      v = W + (cw.anchor === 'bolted' ? ' is bolted, so he can’t walk ' : ' can’t walk, so he can’t walk ') + L + ' out, but his push is real (a contest lets force move): he shoves ' + L + ' off at ' + fast(vl) + (vl >= 0.01 * K.c ? ', into the air as a fireball.' : ', and ' + L + ' slides ' + slideOf(sl, vl) + '.') + (tornName ? ' The rock around ' + tornName + '’s bolts tears out.' : '') + ' ' + L + '’s push (' + fmtN(Dl) + ') can’t move ' + W + (cw.anchor === 'bolted' ? '’s bolts.' : '.');""",
"""    } else if (r.outcome === 'shovedOff') {
      const cw = r.winner === 'A' ? cR : cO, vl = r.winner === 'A' ? r.vB : r.vA, sl = r.winner === 'A' ? r.slideB : r.slideA, Dl = r.winner === 'A' ? r.DB : r.DA, Dw = r.winner === 'A' ? r.DA : r.DB, Hl = r.winner === 'A' ? r.HB : r.HA;
      const tornL = tornOf(r.winner === 'A' ? 'B' : 'A'), tail = (vl >= 0.01 * K.c ? ', into the air as a fireball.' : ', and ' + L + ' slides ' + slideOf(sl, vl) + '.');
      // (review round 1 of pull request 4: the loser's unlimited push into bolts their power holds has no physical answer,
      // but the bolted one's own push on him is real; a loser bolted on real rock is torn loose)
      if (r.noAnswer) v = W + ' is bolted to ground that their power holds, so ' + L + '’s unlimited push into his bolts meets a hold without limit: that push has no physical answer (the canon’s ruling), and it moves nobody. ' + W + '’s own push on ' + L + ' is real (a contest lets force move), and ' + L + ' holds only ' + fmtN(Hl) + ', so ' + W + ' shoves him off at ' + fast(vl) + tail;
      else if (tornL) v = W + '’s push (' + fmtN(Dw) + ') tears the rock out around ' + L + '’s bolts (about ' + fmtSI(tearOf(r.winner === 'A' ? 'B' : 'A'), 'N') + '), and from then on only ' + L + '’s feet hold him (' + fmtN(Hl) + '): ' + W + ' shoves him off with a plug of rock at ' + fast(vl) + tail + ' ' + L + '’s push (' + fmtN(Dl) + ') can’t move ' + W + '.';
      else v = W + (cw.anchor === 'bolted' ? ' is bolted, so he can’t walk ' : ' can’t walk, so he can’t walk ') + L + ' out, but his push is real (a contest lets force move): he shoves ' + L + ' off at ' + fast(vl) + tail + ' ' + L + '’s push (' + fmtN(Dl) + ') can’t move ' + W + (cw.anchor === 'bolted' ? '’s bolts' + (!P.holdsGround(cw) ? ': the rock around them holds up to about ' + fmtSI(groundTearOf(cw), 'N') + '.' : '.') : '.');"""),
("""      rockOut ? status('bad', 'Rex’s rock tears loose') : status('info', 'Rex holds ' + fmtN(r.HA) + ' · pushes ' + fmtN(r.DA)),
      rockOut ? status('bad', 'Ollie’s rock tears loose') : status('info', 'Ollie holds ' + fmtN(r.HB) + ' · pushes ' + fmtN(r.DB)),""",
"""      rockOut ? status('bad', 'Rex’s rock tears loose') : status('info', 'Rex holds ' + (r.tornA ? fmtN(r.holdAfterA) + ' once his rock tears' : fmtN(r.HA)) + ' · pushes ' + fmtN(r.DA)),
      rockOut ? status('bad', 'Ollie’s rock tears loose') : status('info', 'Ollie holds ' + (r.tornB ? fmtN(r.holdAfterB) + ' once his rock tears' : fmtN(r.HB)) + ' · pushes ' + fmtN(r.DB)),"""),
("""      r.outcome === 'paradox' || r.clash === 'paradox' ? status('warn', 'No physical answer') : null,
      r.grav.F > 1e-3 * Math.min(cR.body.m, cO.body.m) * g ? status('warn', 'Their own gravity: ' + fmtSI(r.grav.F, 'N')) : null));""",
"""      r.outcome === 'paradox' || r.clash === 'paradox' ? status('warn', 'No physical answer') : r.noAnswer ? status('warn', 'No physical answer for ' + WHO[r.noAnswer] + '’s push') : null,
      r.grav.F > 1e-3 * Math.min(cR.body.m, cO.body.m) * g ? status('warn', 'Their own gravity: ' + fmtSI(r.grav.F, 'N')) : null));"""),
("""    if (moved && r.recoilAbsorbedA && r.recoilAbsorbedB) {""",
"""    // (an unlimited push into bolts their power holds: canon's ruling; review round 1 of pull request 4)
    if (r.noAnswer) items.push('Canon (the rulings of 14 Oct 2026): where the one pushed is held without limit, the collision has no physical answer. ' + WHO[r.noAnswer] + '’s unlimited push meets ' + W + '’s bolts on ground their power holds: one of them would have to give, and neither can, so the lab works out nothing for that push. ' + W + '’s own push on ' + L + ' meets only ' + L + '’s feet, so it has an answer.');
    if (r.tornA || r.tornB) items.push('Bolted on real rock: the bolts never let go, but the rock around them tears out at about ' + fmtSI(r.tornA ? r.tearA : r.tearB, 'N') + ' (the ground’s shear strength × the buried area of his feet, an estimate), and from then on only his feet hold him. The lab doesn’t follow the rock’s brief share of the push as it tears.');
    if (moved && !r.noAnswer && r.recoilAbsorbedA && r.recoilAbsorbedB) {"""),
]
