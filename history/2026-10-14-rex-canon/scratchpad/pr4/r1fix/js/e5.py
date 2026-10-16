R = [
# the shoving match: a bolted winner's bolts take the loser's push over the push (a pulse: it shakes the ground, as the
# Shove tab counts a bolted partner's bolts); a single bolted wrestler's rock is checked at any strength; no answer
("""        const torn = !!(r.tornA || r.tornB);
        out.models = { shake: false, air: false, ground: r.outcome === 'bothBolted' || !!(r.ownRecoil && (cR.anchor === 'bolted' || cO.anchor === 'bolted') && (!isFinite(cR.F) || !isFinite(cO.F))) };
        out.ground = (r.outcome === 'bothBolted' && (r.clash === 'rockGives' || r.tear > 1)) || torn;
        const near2 = (d) => isFinite(d) ? fmtDist(d) : 'until something stops him';
        const slA = moved && r.vA > 0 ? r.slideA : 0, slB = moved && r.vB > 0 ? r.slideB : 0;
        out.harm = out.ground ? (torn ? 'the rock tears out around ' + (r.tornA ? 'Rex' : 'Ollie') + '’s bolts' : 'the ground tears out around their bolts')
          : moved && Math.max(r.vA, r.vB) >= K.a0 ? (r.outcome === 'bothShoved' ? 'they fly apart faster than sound' : (r.winner === 'A' ? 'Ollie' : 'Rex') + ' is shoved off faster than sound')""",
"""        const torn = !!(r.tornA || r.tornB);
        // (review round 1 of pull request 4: with the power on a single bolted wrestler's rock is checked at any strength,
        // and a bolted winner's bolts hand the ground the loser's push over the push, a pulse that shakes it, as the Shove
        // tab counts a bolted partner's bolts)
        const oneBolted = (cR.anchor === 'bolted') !== (cO.anchor === 'bolted');
        out.models = { shake: shakeOn && !!r.ownRecoil && oneBolted, air: false, ground: r.outcome === 'bothBolted' || !!(r.ownRecoil && (cR.anchor === 'bolted' || cO.anchor === 'bolted')) };
        out.ground = (r.outcome === 'bothBolted' && (r.clash === 'rockGives' || r.tear > 1)) || torn;
        const wC = r.winner === 'A' ? cR : cO, wJ = r.winner === 'A' ? r.footA : r.footB, wN = r.winner === 'A' ? 'Rex' : 'Ollie';
        const boltSrc = r.ownRecoil && r.outcome === 'shovedOff' && !r.noAnswer && wC.anchor === 'bolted' && isFinite(wJ) && wJ > 0 ? srcOf(wC, { J: wJ, T: Math.max(P.limbPulse(wC.body), r.t) }) : null;
        if (boltSrc) { out.shake = [boltSrc]; out.sig += fp(wJ); }
        // an unlimited push into bolts their power holds has no physical answer (the one-sided or both-held case)
        if (r.ownRecoil && (r.noAnswer || r.outcome === 'paradox' || r.clash === 'paradox')) out.noAnswer = r.noAnswer ? 'the unlimited push into ' + wN + '’s bolts' : 'the unlimited push into the bolts';
        const near2 = (d) => isFinite(d) ? fmtDist(d) : 'until something stops him';
        const slA = moved && r.vA > 0 ? r.slideA : 0, slB = moved && r.vB > 0 ? r.slideB : 0;
        out.harm = out.ground ? (torn ? 'the rock tears out around ' + (r.tornA ? 'Rex' : 'Ollie') + '’s bolts' : 'the ground tears out around their bolts')
          : moved && Math.max(r.vA, r.vB) >= K.a0 ? (r.outcome === 'bothShoved' ? 'they fly apart faster than sound' : (r.winner === 'A' ? 'Ollie' : 'Rex') + ' is shoved off faster than sound')
            : boltSrc && quakes(wC, { J: wJ, T: Math.max(P.limbPulse(wC.body), r.t) }) ? 'the push through ' + wN + '’s bolts shakes the ground enough that plaster may crack ' + fmtDist(near) + ' away'"""),
# Both at once and the shove: an unlimited shove into bolts their power holds has no physical answer
("""        out.ground = r.clash === 'rockGives' || r.clash === 'partnerTorn';
        out.stalled = !!r.stalled;""",
"""        out.ground = r.clash === 'rockGives' || r.clash === 'partnerTorn';
        out.stalled = !!r.stalled;
        // (review round 1 of pull request 4: an unlimited shove into bolts their power holds has no physical answer)
        if (sA.ownRecoil && (r.clash === 'paradox' || r.noAnswer)) out.noAnswer = 'the unlimited shove into the bolts';"""),
# arm wrestling standing, both unlimited, held without limit
("""      out.ground = r.crater > 0;
      // their own forearms past the speed of sound""",
"""      out.ground = r.crater > 0;
      // (review round 1 of pull request 4: standing, an unlimited press on a body their power holds without limit has no
      // physical answer)
      if (r.ownRecoil && r.clash === 'paradox') out.noAnswer = 'the unlimited press on the bolted one';
      // their own forearms past the speed of sound"""),
]
