R = [
("""    const st1 = P.shoveBoth(c3(Infinity, R3, on({ unbreakable: false })), c3(Infinity, O3, real));""",
"""    const st1 = P.shoveBoth(c3(Infinity, R3, on({ unbreakable: false })), c3(Infinity, O3, real));
    // (review round 1 of pull request 4) only the shove into bolts held without limit has no answer: the other shove is real
    // (Rex bolted: Ollie's shove into his bolts has none, Rex's shoves Ollie off at just under light speed; Ollie bolted:
    // the other way round); nothing moves only where both are bolted on Unbreakable footing
    const po = P.shoveBoth(c3(Infinity, R3, on()), c3(Infinity, O3, on({ anchor: 'bolted' }))), pb = P.shoveBoth(c3(Infinity, R3, on({ anchor: 'bolted' })), c3(Infinity, O3, on({ anchor: 'bolted' })));"""),
("""unlimited, both bolted on real rock, both rocks tear out (rockGives); Rex standing, Ollie bolted on real rock, Ollie\\'s rock tears out and both fly off at just under light speed; into a partner bolted on Unbreakable footing, the one-sided paradox',""",
"""unlimited, both bolted on real rock, both rocks tear out (rockGives); Rex standing, Ollie bolted on real rock, Ollie\\'s rock tears out and both fly off at just under light speed; one bolted on Unbreakable footing, the shove into his bolts has no physical answer but his own shove sends the other off at just under light speed; both bolted on it, the paradox (nothing moves)',"""),
("""        && rg.clash === 'rockGives' && rg.oneSided === false && rg.vA === cl && rg.vB === cl && rg.tearA > 0 && rg.tearB > 0 && pd.clash === 'paradox' && pd.oneSided === true && pd.stalled""",
"""        && rg.clash === 'rockGives' && rg.oneSided === false && rg.vA === cl && rg.vB === cl && rg.tearA > 0 && rg.tearB > 0
        && !pd.clash && pd.noAnswer === 'back' && pd.shover === 'A' && pd.vA === 0 && pd.vB === cl && !pd.stalled && !po.clash && po.noAnswer === 'shove' && po.vA === cl && po.vB === 0 && !po.stalled && pb.clash === 'paradox' && pb.stalled && pb.vA === 0 && pb.vB === 0"""),
]
