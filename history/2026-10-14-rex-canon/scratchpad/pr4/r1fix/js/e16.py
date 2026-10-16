R = [
("""' + X + '’s source supplies it, plus what ' + (cr.rockGives ? 'the rock around ' + Y + '’s bolts' : horiz ? Y + '’s footing' : 'the ground under ' + Y) + ' hands the ground during the hit (its hold × the hit’s time'""",
"""' + X + '’s source supplies it, plus what ' + (cr.rockGives ? 'the rock around ' + Y + '’s bolts hands the ground' : horiz ? Y + '’s footing hands the ground' : 'the ground under ' + Y + ' takes') + ' during the hit (its hold × the hit’s time'"""),
("""      cr && cr.rockGives ? 'Rock: the rock around his bolts tears out at its shear strength × the buried area of his feet, about ' + fmtSI(cr.tear, 'N') + ' here (an estimate).' : cB.anchor === 'bolted' ? 'Rock:""",
"""      cr && cr.rockGives ? 'Rock: the rock around his bolts tears out at its shear strength × the buried area of his feet, about ' + fmtSI(cr.tear, 'N') + ' here (an estimate).' : cB.anchor === 'bolted' && !cr ? 'Rock:"""),
]
