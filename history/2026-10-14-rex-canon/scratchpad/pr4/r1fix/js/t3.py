R = [
("""    const up = pm(Infinity, dial, {}, { anchor: 'bolted' }), ur = pm(Infinity, dial, { unbreakable: false }, { anchor: 'bolted', unbreakable: false }), ui = pm(Infinity, Infinity);
    ok('8g: a bolted Rex with the power on shoves Ollie off over the stroke (' + sig(sb.vB) + ' m/s, sliding ' + sig(sb.slideB) + ' m) and doesn\\'t move; with it off he only holds (a dead heat); an unlimited push against Ollie bolted on Unbreakable footing is the one-sided paradox, on real rock his rock tears out and he leaves at just under light speed; both unlimited, they fly apart at just under light speed',
      sb.outcome === 'shovedOff' && sb.winner === 'A' && sb.vA === 0 && sb.vB > 30 && near(sb.pB, (sb.DA - sb.HB) * sb.t, 1e-12) && sbo.outcome === 'deadlock' && up.outcome === 'paradox' && up.oneSided === true && ur.outcome === 'bothShoved' && ur.tornB === true && ur.vB === cl && ui.outcome === 'bothShoved' && ui.vA === cl && ui.vB === cl && ui.slideA === Infinity,
      [sb.outcome, sbo.outcome, up.outcome, ur.outcome, ui.outcome].join(' / '));""",
"""    const up = pm(Infinity, dial, {}, { anchor: 'bolted' }), ur = pm(Infinity, dial, { unbreakable: false }, { anchor: 'bolted', unbreakable: false }), ui = pm(Infinity, Infinity);
    // (review round 1 of pull request 4) only the push into bolts held without limit has no answer: Ollie bolted on
    // Unbreakable footing still shoves Rex off with his own push (at the dial as a bolted Rex shoves Ollie; unlimited, at
    // just under light speed); nothing moves only where Ollie's push can't beat Rex's hold (Ollie lying flat at 1 t)
    const up2 = pm(Infinity, Infinity, {}, { anchor: 'bolted' }), upP = pm(Infinity, 1000 * g, {}, { anchor: 'bolted' });
    const tear = R3.digArea * conc.shear;
    ok('8g: a bolted Rex with the power on shoves Ollie off over the stroke (' + sig(sb.vB) + ' m/s, sliding ' + sig(sb.slideB) + ' m) and doesn\\'t move; with it off he only holds (a dead heat); an unlimited push into Ollie bolted on Unbreakable footing has no physical answer, but Ollie\\'s own push shoves Rex off (at the dial ' + sig(up.vA) + ' m/s; unlimited, just under light speed), and nothing moves only where Ollie\\'s push can\\'t beat Rex\\'s hold; on real rock Ollie\\'s rock tears out, he leaves at just under light speed and his feet hand the ground only their hold (' + sig(ur.footB) + ' kg m/s); both unlimited, they fly apart at just under light speed',
      chk(() => sb.outcome === 'shovedOff' && sb.winner === 'A' && sb.vA === 0 && sb.vB > 30 && near(sb.pB, (sb.DA - sb.HB) * sb.t, 1e-12) && sbo.outcome === 'deadlock'
        && up.outcome === 'shovedOff' && up.winner === 'B' && up.noAnswer === 'A' && up.vB === 0 && near(up.vA, sb.vB, 1e-9) && up.contact === Infinity && up2.outcome === 'shovedOff' && up2.noAnswer === 'A' && up2.vA === cl && up2.slideA === Infinity && upP.outcome === 'paradox' && upP.oneSided === true && !upP.noAnswer
        && ur.outcome === 'bothShoved' && ur.tornB === true && ur.vB === cl && near(ur.tearB, tear, 1e-12) && ur.holdAfterB === holdR && near(ur.footB, holdR * ur.t, 1e-12) && ur.footB < 1e-3 && ui.outcome === 'bothShoved' && ui.vA === cl && ui.vB === cl && ui.slideA === Infinity),
      [sb.outcome, sbo.outcome, up.outcome, up2.outcome, upP.outcome, ur.outcome, ui.outcome].join(' / '));
    // (review round 1 of pull request 4) a single bolted wrestler on real rock: the rock around his bolts tears out once
    // the other's push passes its tear load (about 697 kN), at any strength, and then only his feet hold him (both shoved
    // apart at the dial, as two standing wrestlers are); below it (5.47 t) his bolts hold and he shoves the other off.
    // Unequal pushes: each one's push back is his own push x t, and the ledger closes. One power on and one off: the
    // old rule (a test-only case)
    const real = { unbreakable: false }, ft = pm(dial, dial, Object.assign({ anchor: 'bolted' }, real), real), ft5 = pm(5470 * g, 5470 * g, Object.assign({ anchor: 'bolted' }, real), real);
    const un = pm(dial, 2 * dial), unL = un.pB - un.pA + un.footB - un.footA - (un.recoilAbsorbedA || { J: NaN }).J + (un.recoilAbsorbedB || { J: NaN }).J;
    const mix = P.pushMatch(c3(dial, R3, on()), c3(dial, O3, on({ ownRecoil: false })));
    ok('8g: a single bolted wrestler on real rock: past the rock\\'s tear load (' + sig(tear) + ' N) the rock around his bolts tears out and only his feet hold him (at the dial both are shoved apart at ' + sig(ft.vA) + ' m/s, as standing); below it (5.47 t) his bolts hold and he shoves Ollie off; unequal pushes (Ollie at twice the dial): each one\\'s push back is his own push x t and the momentum adds up; one power on, one off: the old rule',
      chk(() => ft.outcome === 'bothShoved' && ft.tornA === true && near(ft.tearA, tear, 1e-12) && ft.holdAfterA === holdR && near(ft.vA, r.vA, 1e-12) && near(ft.footA, holdR * ft.t, 1e-12) && ft5.outcome === 'shovedOff' && ft5.winner === 'A' && !ft5.tornA
        && un.outcome === 'bothShoved' && near(un.recoilAbsorbedA.J, un.DA * un.t, 1e-12) && near(un.recoilAbsorbedB.J, un.DB * un.t, 1e-12) && un.recoilAbsorbedB.J > 1.9 * un.recoilAbsorbedA.J && Math.abs(unL) <= 1e-9 * un.recoilAbsorbedB.J
        && mix.outcome === 'deadlock' && same(mix, r0)), [ft.outcome, ft5.outcome, un.outcome, mix.outcome].join(' / '));"""),
]
