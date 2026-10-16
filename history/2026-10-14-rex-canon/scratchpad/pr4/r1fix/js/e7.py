R = [
("""    if (act === 'wrestle' && state.wrestleMove === 'push') return 'The lab counts the shaking from a push through a bolted wrestler’s bolts; here nothing goes through them (both end up on their feet), and feet hand the ground only a friction drag while they slide, which it doesn’t count as shaking.';""",
"""    if (act === 'wrestle' && state.wrestleMove === 'push') return f.noAnswer ? null : 'The lab counts a push through a bolted wrestler’s bolts as shaking where he shoves the other off over the stroke, a quick pulse; here none goes through them that way, and a steady push or feet that slide (a friction drag) it doesn’t count as shaking.';"""),
]
