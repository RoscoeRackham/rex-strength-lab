p='/home/user/rex-strength-lab/rex-strength-lab/test/powers.js'; s=open(p,encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)==cnt, (s.count(old), old[:90])
    s=s.replace(old,new)
rep(r"""    let wrong = 0, byLoser = 0, runs = 0; const firstWrong = [];""",
r"""    let wrong = 0, byLoser = 0, runs = 0; const firstWrong = [];
    // (review round 2 of pull request 4) standing, in a pin with the winner's power on, the loser's feet (or his bolts and
    // the rock around them) carry the force at his elbow, the loser pad's load: they slide exactly where it beats his
    // footing, and a bolted loser's rock carries it (tear = elbow / the rock's tear load) instead of his own press
    let stWrong = 0, stPins = 0, stSlide = 0, stBolt = 0; const stFirst = [];""")
rep(r"""      if (r.tableBreaksBy === 'pin') byLoser++;
    }""",
r"""      if (r.tableBreaksBy === 'pin') byLoser++;
    }
    for (const lg of [2.5, 3, 3.5, 4, 5, 6, 9, 12, 20]) for (const lo of [2, 2.5, 3, 4, 6, 9]) for (const sid of ['sand', 'concrete', 'ice', 'granite', 'softclay']) for (const anc of ['friction', 'bolted']) for (const ub of [false, true]) for (const flip of [false, true]) {
      // Things keep their form off, so the table can break; the loser alone bolted (anc), Rex or Ollie the stronger (flip)
      const x = { keepForm: false, unbreakable: ub, surface: surf(sid) }, FR = Math.pow(10, flip ? lo : lg) * g, FO = Math.pow(10, flip ? lg : lo) * g;
      const r = P.armWrestle(c3(FR, R3, on(Object.assign({}, x, flip ? { anchor: anc } : {}))), c3(FO, O3, on(Object.assign({}, x, flip ? {} : { anchor: anc }))));
      if (r.blackHole || !r.tableBreaks || r.outcome !== 'pin' || r.PA === r.PB) continue;
      stPins++;
      const aW = r.winner === 'A', ml = aW ? O3.m : R3.m, Rl = aW ? r.RB : r.RA, elbow = loserPadOf(r, ml), cl = { anchor: anc, unbreakable: ub, surface: surf(sid), body: aW ? O3 : R3 };
      const tearWant = anc === 'bolted' && !ub ? elbow / (cl.body.digArea * cl.surface.shear) : null, tearGot = aW ? r.tearB : r.tearA;
      const okSt = near(r.loserElbow, elbow, 1e-12) && r.loserSlides === (Rl < elbow) && (tearWant == null || near(tearGot, tearWant, 1e-12));
      if (r.loserSlides) stSlide++;
      if (tearWant != null) stBolt++;
      if (!okSt) { stWrong++; if (stFirst.length < 2) stFirst.push([lg, lo, sid, anc, ub, flip, sig(r.loserElbow), sig(elbow), r.loserSlides, sig(Rl), sig(tearGot), tearWant == null ? '-' : sig(tearWant)].join(' ')); }
    }""")
# the bolted loser's rock: the elbow force (review round 2), not the loser's press
rep(r"""    // a bolted loser in a standing pin (Rex at 10^6 kg against Ollie at 100 short tons, bolted on real rock): his rock carries
    // the loser's press, the push his folding arm resists (222 kN, 0.32 of its tear load), not Rex's 2.45 MN; equal presses
    // load each one's bolts with the other's (review round 1 of pull request 4)""",
r"""    // a bolted loser in a standing pin (Rex at 10^6 kg against Ollie at 100 short tons, bolted on real rock): his rock carries
    // the force at his elbow, the loser pad's load (47.8 kN, 0.069 of its tear load; review round 2 of pull request 4: round 1
    // had his own press, 222 kN, which only turns his forearm), not Rex's 2.45 MN; equal presses load each one's bolts with
    // the other's (review round 1 of pull request 4). Rex at 10^7 kg against a bolted Ollie at 1 t: the elbow force (2.97 MN)
    // tears his rock (4.3 times its tear load), though his own press is 2.45 kN""")
rep(r"""    const tearOk = chk(() => bl.outcome === 'pin' && bl.winner === 'A' && near(bl.tearB, bl.PB / tear, 1e-12) && bl.tearB < 1""",
r"""    const b7 = P.armWrestle(c3(1e7 * g, R3, on({ keepForm: false, unbreakable: false })), c3(1000 * g, O3, on({ keepForm: false, unbreakable: false, anchor: 'bolted' })));
    const tearOk = chk(() => bl.outcome === 'pin' && bl.winner === 'A' && near(bl.tearB, bl.loserElbow / tear, 1e-12) && near(bl.loserElbow, 47760, 0.002) && bl.tearB < 1 && b7.outcome === 'pin' && near(b7.tearB, 4.26, 0.005) && b7.loserSlides === false""")
# unlimited against finite (NaN before) and the one-sided unlimited press
rep(r"""    const u1 = aw(Infinity, Infinity, { keepForm: false }), u2 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted' }), u3 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted', unbreakable: false });""",
r"""    const u1 = aw(Infinity, Infinity, { keepForm: false }), u2 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted' }), u3 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted', unbreakable: false });
    // (review round 2 of pull request 4) one held without limit (Rex bolted on Unbreakable footing, Ollie standing, both
    // unlimited): the press into Rex has no physical answer, but Rex's own press flings Ollie off (as in the shoving match);
    // the mirror; and an unlimited press against a finite one: the loser's pad and elbow are unbounded (not NaN), so the pin
    // breaks the table and his feet slide
    const h1 = P.armWrestle(c3(Infinity, R3, on({ keepForm: false, anchor: 'bolted' })), c3(Infinity, O3, on({ keepForm: false }))), h2 = P.armWrestle(c3(Infinity, R3, on({ keepForm: false })), c3(Infinity, O3, on({ keepForm: false, anchor: 'bolted' })));
    const uf = aw(Infinity, 1000 * g, { keepForm: false }), uk = aw(Infinity, 1000 * g);
    const oneOk = chk(() => h1.outcome === 'paradox' && h1.oneSided === true && h1.noAnswer === 'B' && h1.draggedB === true && !h1.draggedA && h2.noAnswer === 'A' && h2.draggedA === true && !h2.draggedB && !('noAnswer' in u2)
      && uf.loserPadLoad === Infinity && uf.tableBreaks && uf.tableBreaksBy === 'pin' && uf.loserElbow === Infinity && uf.loserSlides === true && uk.loserPadLoad === Infinity && !uk.tableBreaks);""")
rep(r"""    ok('8i: standing, once the presses break the table (Things keep their form off): his own footing no longer caps his own press (both at the dial: a stalemate in the arms at ' + sig(st.AA) + ' N, each one\'s feet sliding under the other\'s press; with the power off a stalemate at the grip); 100 t against 200 t, Ollie pins Rex (with the power off a stalemate at the grip) and both one\'s feet slide; a bolted loser\'s rock carries the loser\'s press (' + sig(bl.tearB) + ' of its tear load); both unlimited: flung apart, or the paradox bolted on Unbreakable footing, or both rocks tear out on real rock',
      tearOk && st.tableBreaks""",
r"""    ok('8i: standing, once the presses break the table (Things keep their form off): his own footing no longer caps his own press (both at the dial: a stalemate in the arms at ' + sig(st.AA) + ' N, each one\'s feet sliding under the other\'s press; with the power off a stalemate at the grip); 100 t against 200 t, Ollie pins Rex (with the power off a stalemate at the grip) and both one\'s feet slide; in a pin the loser\'s feet, or his bolts\' rock, carry the force at his elbow (review round 2: ' + stPins + ' standing pins, ' + stSlide + ' with his feet sliding, ' + stBolt + ' bolted on real rock; a bolted loser\'s rock at ' + sig(bl.tearB) + ' of its tear load, and ' + sig(b7.tearB) + ' times it at 10^7 kg against 1 t); both unlimited: flung apart, or the paradox bolted on Unbreakable footing (with only one so bolted, the press into him has no answer and his own flings the other off), or both rocks tear out on real rock; unlimited against 1 t, the loser\'s pad is unbounded and breaks the table',
      tearOk && oneOk && stWrong === 0 && stPins > 100 && stSlide > 0 && stBolt > 0 && st.tableBreaks""")
rep(r"""        && u1.outcome === 'flungApart' && u1.ownRecoil && u2.outcome === 'paradox' && u2.oneSided === false && u3.outcome === 'rockGives' && u3.tearA > 0 && u3.tearB > 0, [st.outcome, st0.outcome, sp.outcome, sp0.outcome, u1.outcome, u2.outcome, u3.outcome].join(' / '));""",
r"""        && u1.outcome === 'flungApart' && u1.ownRecoil && u2.outcome === 'paradox' && u2.oneSided === false && u3.outcome === 'rockGives' && u3.tearA > 0 && u3.tearB > 0, (stWrong ? stFirst.join('; ') + ' | ' : '') + [st.outcome, st0.outcome, sp.outcome, sp0.outcome, u1.outcome, u2.outcome, u3.outcome].join(' / '));""")
open(p,'w',encoding='utf-8').write(s)
