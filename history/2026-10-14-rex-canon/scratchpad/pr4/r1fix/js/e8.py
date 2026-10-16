R = [
("""  function duoEffortBox(act, eff) {
    const FR = fullF('R');""",
"""  // a push or hit with no physical answer (the canon's ruling; review round 1 of pull request 4): the lab can't judge its
  // harm, so the page never calls the test harmless there (f.noAnswer names it; f.judged, what the lab still judges)
  const noAnswerText = (f) => (f && f.noAnswer ? capital(f.noAnswer) + ' has no physical answer here (the canon’s ruling), so the lab can’t judge its harm' + (f.judged ? '; it judges only ' + f.judged : '') + '.' : null);
  function duoEffortBox(act, eff) {
    const FR = fullF('R');"""),
("""        const t = (nm && nm.all ? nm.gap : 'Even all-out, this test doesn’t ' + what.replace(/^could /, '').replace(/^(\\w+?)(e?s) /, (m, a, b) => a + (b === 'es' && !/(sh|ch|ss|x)$/.test(a) ? 'e' : '') + ' ').replace(/, through the ground or the air$/, '') + (nm ? ' ' + nm.via.trim() : '') + '.' + (nm ? ' ' + nm.gap : '')) + (rw ? ' ' + rw : '') + (gw ? ' ' + gw : '');""",
"""        const verb = what.replace(/^could /, '').replace(/^(\\w+?)(e?s) /, (m, a, b) => a + (b === 'es' && !/(sh|ch|ss|x)$/.test(a) ? 'e' : '') + ' ').replace(/, through the ground or the air$/, '') + (nm && nm.via ? ' ' + nm.via.trim() : '');
        // (no physical answer: the lab can't say the test doesn't do it; it says what it judges)
        const na = noAnswerText(fAll);
        const t = (na ? na + (nm && nm.all ? ' ' + nm.gap : fAll.judged ? ' Even all-out, those don’t ' + verb + '.' + (nm ? ' ' + nm.gap : '') : '')
          : (nm && nm.all ? nm.gap : 'Even all-out, this test doesn’t ' + verb + '.' + (nm ? ' ' + nm.gap : '')) + (rw ? ' ' + rw : '')) + (gw ? ' ' + gw : '');"""),
("""        read.append(el('p', { text: (eff.real ? 'On real ground, courtesy ceiling: ' : 'Courtesy ceiling: ') + (s0.never ? 'none. Nothing in this test does harm' + (isFinite(fullF('R')) ? ', even all-out,' : '') + ' with the nearest people and buildings ' + fmtDist(state.near) + ' away.' + duoShakeCaveat(eff.real ? factsTop('real') : factsTop(), act)
          : !(s0.below > 0) ? 'none. Even at the least they need to stand and walk, ' + eff.harmAtV(s0.use) + '.'
            : atText(s0.below, FR) + '. Past that, ' + eff.harmAtV(s0.use) + '.') }));""",
"""        const fC = eff.real ? factsTop('real') : factsTop(), naC = noAnswerText(fC);
        read.append(el('p', { text: (eff.real ? 'On real ground, courtesy ceiling: ' : 'Courtesy ceiling: ') + (s0.never ? (naC ? 'none that the lab can judge. ' + naC + (fC.judged ? ' Even all-out, those do no harm with the nearest people and buildings ' + fmtDist(state.near) + ' away.' : '') : 'none. Nothing in this test does harm' + (isFinite(fullF('R')) ? ', even all-out,' : '') + ' with the nearest people and buildings ' + fmtDist(state.near) + ' away.') + duoShakeCaveat(fC, act)
          : !(s0.below > 0) ? 'none. Even at the least they need to stand and walk, ' + eff.harmAtV(s0.use) + '.' + (naC ? ' ' + naC : '')
            : atText(s0.below, FR) + '. Past that, ' + eff.harmAtV(s0.use) + '.' + (naC ? ' ' + naC : '')) }));"""),
("""    const head = el('p', {}, el('b', { text: noCap ? 'All-out: no cap needed.' : capped ? 'Effort: ' + (!tinyShare(eff.use, FR) ? pctOf(eff.use, FR) + ' of their strength' : 'as hard as lifting ' + fmtMass(eff.use / g)) + (withEach ? '' : '.') : 'All-out.' }),
      withEach ? each + '.' : '');
    head.append(' ' + (noCap ? 'Nothing the lab checks in this test can do harm here (nearest people and buildings ' + fmtDist(state.near) + ' away), so they go all-out.' : eff.note ? 'The least they need to stand and walk; nothing gentler exists.' : { least: 'The hardest both can go while nothing around them breaks.', allout: 'Everything they have.', custom: 'Set by hand.' }[state.duoEffort]));
    read.append(head);
    if (eff.note) read.append(el('p', { class: 'warn-ink', text: eff.note }));
    if (eff.p.s && eff.p.done) {
      const s0 = eff.p.s;
      read.append(el('p', { text: s0.never ? 'Courtesy ceiling: none. Nothing in this test does harm' + (isFinite(fullF('R')) ? ', even all-out,' : '') + ' with the nearest people and buildings ' + fmtDist(state.near) + ' away.' + duoShakeCaveat(factsTop(), act)
        : !(s0.below > 0) ? 'Courtesy ceiling: none. ' + (state.oEffortOwn ? 'With Ollie’s own effort, ' : 'Even at the least they need to stand and walk, ') + eff.p.harmAt(s0.use) + '.'
          : 'Courtesy ceiling: ' + atText(s0.below, FR) + '. Past that, ' + eff.p.harmAt(s0.use) + '.' }));
    }""",
"""    // (no physical answer: 'nothing the lab can judge', never 'nothing can do harm')
    const naT = noCap || (eff.p.s && eff.p.done) ? noAnswerText(factsTop()) : null;
    const head = el('p', {}, el('b', { text: noCap ? (naT ? 'All-out.' : 'All-out: no cap needed.') : capped ? 'Effort: ' + (!tinyShare(eff.use, FR) ? pctOf(eff.use, FR) + ' of their strength' : 'as hard as lifting ' + fmtMass(eff.use / g)) + (withEach ? '' : '.') : 'All-out.' }),
      withEach ? each + '.' : '');
    head.append(' ' + (noCap ? (naT ? 'Nothing the lab can judge in this test does harm here (nearest people and buildings ' + fmtDist(state.near) + ' away), so they go all-out.' : 'Nothing the lab checks in this test can do harm here (nearest people and buildings ' + fmtDist(state.near) + ' away), so they go all-out.') : eff.note ? 'The least they need to stand and walk; nothing gentler exists.' : { least: 'The hardest both can go while nothing around them breaks.', allout: 'Everything they have.', custom: 'Set by hand.' }[state.duoEffort]));
    read.append(head);
    if (eff.note) read.append(el('p', { class: 'warn-ink', text: eff.note }));
    if (eff.p.s && eff.p.done) {
      const s0 = eff.p.s, fT = factsTop();
      read.append(el('p', { text: s0.never ? (naT ? 'Courtesy ceiling: none that the lab can judge. ' + naT + (fT.judged ? ' Even all-out, those do no harm with the nearest people and buildings ' + fmtDist(state.near) + ' away.' : '') : 'Courtesy ceiling: none. Nothing in this test does harm' + (isFinite(fullF('R')) ? ', even all-out,' : '') + ' with the nearest people and buildings ' + fmtDist(state.near) + ' away.') + duoShakeCaveat(fT, act)
        : !(s0.below > 0) ? 'Courtesy ceiling: none. ' + (state.oEffortOwn ? 'With Ollie’s own effort, ' : 'Even at the least they need to stand and walk, ') + eff.p.harmAt(s0.use) + '.' + (naT ? ' ' + naT : '')
          : 'Courtesy ceiling: ' + atText(s0.below, FR) + '. Past that, ' + eff.p.harmAt(s0.use) + '.' + (naT ? ' ' + naT : '') }));
    }"""),
]
