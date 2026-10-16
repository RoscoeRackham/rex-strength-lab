p='/home/user/rex-strength-lab/rex-strength-lab/test/shots.js'; s=open(p,encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)==cnt, (s.count(old), old[:90])
    s=s.replace(old,new)
# the splat frees F x s: 499 kJ (review round 2)
rep(r"""        && /Energy freed at the hit ?494 kJ ?120 g TNT · taken back by default/.test(t)""", r"""        && /Energy freed at the hit ?499 kJ ?120 g TNT · taken back by default/.test(t)""")
# one rounding for the source's supply on a view (review round 2: three figures)
rep(r"""/Ollie’s source supplies ?110,000 kg·m\/s/.test(tb), vb);""", r"""/Ollie’s source supplies ?109,000 kg·m\/s/.test(tb), vb);""")
rep(r"""/Ollie’s source supplies ?900 million kg·m\/s/.test(t)""", r"""/Ollie’s source supplies ?899 million kg·m\/s/.test(t)""")
rep(r"""/Ollie’s source supplies ?14,000 kg·m\/s/.test(t1)""", r"""/Ollie’s source supplies ?14,100 kg·m\/s/.test(t1)""")
rep(r"""/What holds Rex: the ground/.test(bj) && /Ollie’s source supplies ?110,000 kg·m\/s/.test(tj)""", r"""/What holds Rex: the ground/.test(bj) && /Ollie’s source supplies ?107,000 kg·m\/s/.test(tj)""")
# the shoving match's ceiling counts each one's travel during the push (review round 2)
rep(r"""        && /Courtesy ceiling: 10% \(lifting 9\.06 t\)\. Past that, both are shoved apart and slide past the nearest people 5 m away/.test(b)""",
r"""        && /Courtesy ceiling: 8% \(lifting 7\.3 t\)\. Past that, both are shoved apart and end up past the nearest people 5 m away/.test(b)""")
# the walk-out: the winner holds back to the walking pace (review round 2)
rep(r"""/Rex’s own feet set the pace: they can speed his body up only so fast against Ollie’s push\./.test(vw)""",
r"""/Rex’s own feet set the pace: they can speed his body up only so fast against Ollie’s push, so he holds back, pushing Ollie only as hard as keeps him at that pace \([\d.]+ kN\)\./.test(vw)""")
rep(r"""    // arm wrestling as built (reading B, decision 10): each pad holds the other's press; a pin never breaks the table
    // with the power on; standing, his own footing doesn't cap his press and his feet hold against the other's""",
r"""    // arm wrestling as built (reading B, decision 10): each pad holds the other's press; with the winner's power on, the
    // loser's pad can still break the table in a pin (review round 1); standing, his own footing doesn't cap his press, his
    // feet hold against the other's, and in a pin the loser's feet carry the force at his elbow (review round 2)""")
# the steady push's ceiling counts the stroke (review round 2)
rep(r"""      check('review round 1: the steady push follows and judges the one driven back', /Courtesy ceiling: 6% \(lifting 5\.47 t\)\. Past that, Rex is driven back and slides 5\.\d+ m, past the nearest people 5 m away\./.test(sp0)""",
r"""      check('review round 1: the steady push follows and judges the one driven back', /Courtesy ceiling: 4\.1% \(lifting 3\.68 t\)\. Past that, Rex is driven back 2\.44 m and slides on, ending up 5\.\d+ m from where he stood, past the nearest people 5 m away\./.test(sp0)""")
# the bolted loser's rock: the force at his elbow (review round 2)
rep(r"""      // duo-arm-loser-bolts-tear: a bolted loser's rock carries the loser's press in a standing pin (no tear here)""",
r"""      // duo-arm-loser-bolts-tear: a bolted loser's rock carries what reaches him in a standing pin (no tear here); since
      // review round 2 that is the force at his elbow, not his own press""")
rep(r"""        check('review round 1: a bolted loser\'s rock carries the loser\'s press in a standing pin', ea.o === 'pin' && ea.tB < 1""",
r"""        check('review round 1: a bolted loser\'s rock carries what reaches him in a standing pin', ea.o === 'pin' && ea.tB < 1""")
open(p,'w',encoding='utf-8').write(s)
