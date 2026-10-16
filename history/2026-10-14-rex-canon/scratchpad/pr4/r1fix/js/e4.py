R = [
# the steady push: the one driven back slides (or flies off faster than sound); bolted on real rock, his rock tears
("""        const r = P.standoff(cA, cB);
        out.sig = fp(r.outcome, r.contact, r.rock && r.rock.rT);
        // (a pusher who takes his own recoil loads only the rock around the one pushed: his push back goes to his source)
        out.models = { shake: false, air: false, ground: cB.anchor === 'bolted' || (cA.anchor === 'bolted' && !r.ownRecoil) };
        if (r.blackHole) return out;
        out.ground = r.outcome === 'rockGives' || r.outcome === 'pusherTorn' || rockBroke(r.rock);
        out.harm = out.ground ? (r.ownRecoil ? 'the rock gives way around ' + (ollieX ? 'Rex' : 'Ollie') + '’s bolts' : 'the rock gives way around the bolts') : null;
        return out;""",
"""        const r = P.standoff(cA, cB);
        out.sig = fp(r.outcome, r.contact, r.rock && r.rock.rT) + (r.drive ? fp(r.drive.vB, r.drive.slideB) : '');
        // (a pusher who takes his own recoil loads only the rock around the one pushed: his push back goes to his source)
        out.models = { shake: false, air: false, ground: cB.anchor === 'bolted' || (cA.anchor === 'bolted' && !r.ownRecoil) };
        if (r.blackHole) return out;
        out.ground = r.outcome === 'rockGives' || r.outcome === 'pusherTorn' || !!r.rockGives || rockBroke(r.rock);
        // an unlimited push into a partner bolted on ground their power holds has no physical answer (review round 1 of
        // pull request 4): the lab can't judge what it does
        if (r.ownRecoil && r.outcome === 'paradox') out.noAnswer = 'the unlimited push into ' + (ollieX ? 'Rex' : 'Ollie') + '’s bolts';
        // the one driven back, the pusher taking his own recoil (review round 1 of pull request 4): shoved off over the
        // stroke as in the shoving match, then sliding on his feet
        const dv = r.drive, nY = ollieX ? 'Rex' : 'Ollie';
        out.harm = out.ground ? (r.ownRecoil ? 'the rock gives way around ' + nY + '’s bolts' : 'the rock gives way around the bolts')
          : dv && dv.vB >= K.a0 ? nY + ' is driven back faster than sound'
            : dv && dv.slideB > near ? nY + ' is driven back and slides ' + (isFinite(dv.slideB) ? fmtDist(dv.slideB) : 'until something stops him') + ', past the nearest people ' + fmtDist(near) + ' away' : null;
        return out;"""),
# the charge: the paradox (no physical answer), so the lab can't judge the hit's harm
("""      out.models = { shake: (!!cR.unbreakable || realRun) && waves && (!state.colImm || !!tk), air: true, ground: !state.colImm };
      if (!r || r.blackHole || r.planetScale || r.noCharge) return out;""",
"""      out.models = { shake: (!!cR.unbreakable || realRun) && waves && (!state.colImm || !!tk), air: true, ground: !state.colImm };
      if (!r || r.blackHole || r.planetScale || r.noCharge) return out;
      // the charger who takes his own recoil against one held without limit: the hit has no physical answer, so the lab
      // can't judge its harm; it judges only the charge (its speed against sound) and his take-off (review round 1 of pull
      // request 4)
      if (r.unbounded && r.outcome === 'paradox') { out.noAnswer = 'the hit'; out.judged = 'the charge (its speed against sound) and the charger’s take-off'; }"""),
]
