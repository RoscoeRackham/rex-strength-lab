R = [
("""    let v;
    if (r.stalled && r.gravityLock) v = target + ' is held to ' + pusher + ' by gravity (' + fmtSI(r.Fg, 'N') + '); ' + pusher + '’s shove (' + fmtSI(r.Fdrive, 'N') + ') can’t break it.';""",
"""    let v;
    // (Both at once with the power on, review round 1 of pull request 4: one unlimited shove meets bolts their power holds,
    // so it has no physical answer and moves nobody; the bolted one's own shove is real. noAnswer 'shove': the shover's
    // shove into his bolted partner; 'back': the partner's shove into the bolted shover)
    const naInto = r.noAnswer === 'shove' ? target : pusher, naFrom = r.noAnswer === 'shove' ? pusher : target;
    const fastN = (x) => (x >= K.c * (1 - 1e-9) ? 'just under light speed' : fmtSpeed(x));
    if (bothOwn && r.noAnswer) { const vN = r.noAnswer === 'shove' ? r.vA : r.vB, sN = r.noAnswer === 'shove' ? r.slideA : r.slideB, relN = r.noAnswer === 'shove' ? relA : relB;
      v = naInto + ' is bolted to ground that their power holds, so ' + naFrom + '’s unlimited shove into his bolts meets a hold without limit: that shove has no physical answer (the canon’s ruling), and it moves nobody. ' + naInto + '’s own shove on ' + naFrom + ' is real (a contest lets force move): ' + naFrom + (relN ? ' leaves at ' + fastN(vN) : ' flies back ' + slideText(vN, sN)) + '.' + fire; }
    else if (r.stalled && r.gravityLock) v = target + ' is held to ' + pusher + ' by gravity (' + fmtSI(r.Fg, 'N') + '); ' + pusher + '’s shove (' + fmtSI(r.Fdrive, 'N') + ') can’t break it.';"""),
# the force tile: the shove that moves someone (copy-bothatonce-shove-tile)
("""    out.push(el('div', { class: 'status-row' }, basisChip(r), r.heldBack ? status('warn', pusher + ' holds back so his feet don’t slide') : null,""",
"""    // (Both at once with the power on: where only the other's shove moves anyone, show that shove, and its muscle basis;
    // review round 1 of pull request 4)
    const shown = bothOwn && !movB && movA && r.back ? r.back : r;
    out.push(el('div', { class: 'status-row' }, basisChip(shown), r.heldBack ? status('warn', pusher + ' holds back so his feet don’t slide') : null,
      bothOwn && r.noAnswer ? status('warn', 'No physical answer for ' + naFrom + '’s shove') : null,"""),
("""    out.push(tiles(
      tile('Shove force', fmtN(r.Fdrive), 'two hands, over ' + fmtDist(r.d)),
      movB || r.stalled ? speedTile(target + ' leaves at', r.vB, fmtMach(r.vB)) : tile(target + ' moves', 'not at all', cT.anchor === 'bolted' ? 'bolted' : 'his footing holds'),""",
"""    out.push(tiles(
      tile(shown === r ? 'Shove force' : target + '’s shove', fmtN(shown.Fdrive), 'two hands, over ' + fmtDist(shown.d)),
      movB || r.stalled ? (relB && r.vB >= K.c * (1 - 1e-9) ? tile(target + ' leaves at', 'just under light speed', 'into the air as a fireball') : speedTile(target + ' leaves at', r.vB, fmtMach(r.vB))) : tile(target + ' moves', 'not at all', cT.anchor === 'bolted' ? 'bolted' : 'his footing holds'),"""),
]
