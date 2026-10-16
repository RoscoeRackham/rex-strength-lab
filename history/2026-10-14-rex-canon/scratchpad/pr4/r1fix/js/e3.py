R = [
# verdicts: the one driven back is followed (shove-off over the stroke); bolted on real rock past its tear load
("""    const own = !!r.ownRecoil, boltY = cB.anchor === 'bolted';
    let v;""",
"""    const own = !!r.ownRecoil, boltY = cB.anchor === 'bolted';
    // (review round 1 of pull request 4: the one driven back is followed as the shoving match follows a shove-off, over the
    // shove's stroke, then his slide; bolted on real rock, past the rock's tear load he is torn loose and driven back too)
    const dv = r.drive, fastV = (x) => (x >= K.c * (1 - 1e-9) ? 'just under light speed' : x >= 0.01 * K.c ? fmtSpeed(x) : speedOnly(x));
    const driven = !dv ? '' : dv.vB >= 0.01 * K.c ? '' : ' Over the shove’s stroke (' + fmtDist(dv.d) + ') that sends ' + Y + ' off at ' + speedOnly(dv.vB) + (isFinite(dv.slideB) ? ', and he slides ' + fmtDist(dv.slideB) + ' before he stops.' : ', and he slides until something stops him.');
    let v;"""),
("""      if (!isFinite(r.DA)) v = X + ' pushes with unlimited force ' + (own ? '(he takes his own recoil, so his push back goes to his source and his footing doesn’t cap it)' : 'from bolted feet') + '. ' + Y + '’s hold is finite (' + fmtSI(r.HB, 'N') + '), so he is shoved away at just under light speed with unlimited energy.';
      else v = X + ' wins. He pushes with ' + fmtSI(r.DA, 'N') + ' and ' + Y + ' can hold only ' + fmtSI(r.HB, 'N') + ', so ' + Y + ' is driven back.' + (own ? ' ' + X + ' takes his own recoil, so his push back goes to his source and his own ' + (isFinite(r.RA) ? 'footing (' + fmtSI(r.RA, 'N') + ') doesn’t cap his push.' : 'bolts carry none of it.') : '') + (cA.anchor === 'bolted' ? ' Bolted, ' + X + ' can’t walk him out; he can only shove him away (see Wrestle).' : '');""",
"""      if (!isFinite(r.DA)) v = X + ' pushes with unlimited force ' + (own ? '(he takes his own recoil, so his push back goes to his source and his footing doesn’t cap it)' : 'from bolted feet') + '. ' + Y + '’s hold is finite (' + fmtSI(r.HB, 'N') + '), so he is shoved away at just under light speed with unlimited energy.';
      else if (r.rockGives) v = Y + ' is bolted, but on real rock: ' + X + '’s push (' + fmtSI(r.DA, 'N') + ') is more than the rock around his bolts takes (about ' + fmtSI(r.tearB, 'N') + '), so it tears out, and ' + Y + ' is driven back with a plug of rock, held only by his feet (' + fmtSI(r.HB, 'N') + '). ' + X + ' takes his own recoil, so his push back goes to his source and his own ' + (isFinite(r.RA) ? 'footing doesn’t cap his push.' : 'bolts carry none of it.') + driven;
      else v = X + ' wins. He pushes with ' + fmtSI(r.DA, 'N') + ' and ' + Y + ' can hold only ' + fmtSI(r.HB, 'N') + ', so ' + Y + ' is driven back.' + (own ? ' ' + X + ' takes his own recoil, so his push back goes to his source and his own ' + (isFinite(r.RA) ? 'footing (' + fmtSI(r.RA, 'N') + ') doesn’t cap his push.' : 'bolts carry none of it.') + driven : '') + (cA.anchor === 'bolted' ? ' Bolted, ' + X + ' can’t walk him out; he can only shove him away (see Wrestle).' : '');"""),
# chips: torn loose with a plug of rock
("""    const yChip = r.outcome === 'rockGives' ? status('bad', Y + '’s rock tears loose')""",
"""    const yChip = r.outcome === 'rockGives' || r.rockGives ? status('bad', Y + '’s rock tears loose')"""),
# tiles: his hold once torn loose, and the one driven back
("""      tile(Y + '’s hold', fmtN(r.HB), (holdWhy[r.holdWhy] || '') + (r.outcome === 'rockGives' ? '; the rock around the bolts gives first' : '')),""",
"""      tile(Y + '’s hold', fmtN(r.HB), r.rockGives ? 'his feet, once the rock around his bolts tears out at about ' + fmtSI(r.tearB, 'N') : (holdWhy[r.holdWhy] || '') + (r.outcome === 'rockGives' ? '; the rock around the bolts gives first' : '')),
      dv ? (dv.vB >= K.c * (1 - 1e-9) ? tile(Y + ' is driven off at', 'just under light speed', 'into the air as a fireball') : speedTile(Y + ' is driven off at', dv.vB, dv.vB >= 0.01 * K.c ? 'into the air as a fireball' : 'over the shove’s stroke; slides ' + (isFinite(dv.slideB) ? fmtDist(dv.slideB) : 'until something stops him'))) : null,"""),
# bars: a label that fits at 390 px
("""{ label: X + '’s footing' + (own ? ' (not needed: his push back goes to his source)' : ''), value: r.RA""",
"""{ label: X + '’s footing' + (own ? ' (not needed)' : ''), value: r.RA"""),
# footing item for the torn case
("""      own && r.outcome === 'rockGives' ? 'Footing here: ' + Y + ' is bolted, but the rock around his bolts tears out at about ' + fmtSI(r.tearB, 'N') + ' on ' + cB.surface.short + '. ' + X + '’s push back goes to his source, so nothing loads the ground under his own feet. Once ' + Y + ' is loose, the unlimited push meets nothing finite.'""",
"""      own && r.outcome === 'rockGives' ? 'Footing here: ' + Y + ' is bolted, but the rock around his bolts tears out at about ' + fmtSI(r.tearB, 'N') + ' on ' + cB.surface.short + '. ' + X + '’s push back goes to his source, so nothing loads the ground under his own feet. Once ' + Y + ' is loose, the unlimited push meets nothing finite.'
        : own && r.rockGives ? 'Footing here: ' + Y + ' is bolted, but the rock around his bolts tears out at about ' + fmtSI(r.tearB, 'N') + ' on ' + cB.surface.short + ' (an estimate), so from then on only his feet hold him: ' + fmtN(r.HB) + '. ' + X + '’s push doesn’t depend on his ' + (cA.anchor === 'bolted' ? 'bolts' : 'feet') + '.'"""),
# the rock bullet: the push that reaches the bolts (torn: the pusher's whole push), and the driven-back item
("""      rockBullet(r.rock, r.contact, cB),""",
"""      rockBullet(r.rock, r.rock ? r.rock.C : r.contact, cB),
      dv ? 'Driven back: ' + X + ' pushes from where he stands, and the lab follows ' + Y + ' as the shoving match follows a shove-off (Wrestle): ' + X + '’s push, less ' + Y + '’s hold, drives him over the shove’s stroke (' + fmtDist(dv.d) + ', an estimate) while their hands stay on each other, ' + (dv.vB >= 0.01 * K.c ? 'past 1% of light speed, so he meets the air as a fireball.' : 'then he slides on his feet against friction and air drag (' + (isFinite(dv.slideB) ? fmtDist(dv.slideB) : 'with no end') + '). A real body would tumble; the lab keeps him upright.') + ' His feet hand the ground only their hold, a friction drag: ' + (isFinite(dv.footB) ? big(dv.footB, 2) + ' kg·m/s' : 'unbounded') + ' over the push.' : null,"""),
]
