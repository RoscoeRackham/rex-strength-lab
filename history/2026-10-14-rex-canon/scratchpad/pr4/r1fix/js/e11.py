R = [
("""      movB || r.stalled ? (relB && r.vB >= K.c * (1 - 1e-9) ? tile(target + ' leaves at', 'just under light speed', 'into the air as a fireball') : speedTile(target + ' leaves at', r.vB, fmtMach(r.vB))) : tile(target + ' moves', 'not at all', cT.anchor === 'bolted' ? 'bolted' : 'his footing holds'),""",
"""      movB || r.stalled ? speedTile(target + ' leaves at', r.vB, fmtMach(r.vB)) : tile(target + ' moves', 'not at all', cT.anchor === 'bolted' ? 'bolted' : 'his footing holds'),"""),
]
