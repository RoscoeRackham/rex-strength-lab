import sys
p, which = sys.argv[1], sys.argv[2]
s = open(p).read()
M = {
 'quake': ("'blast where they land (the ground still gives way under its push: above)' : 'crater or blast where they land'", "'crater, quake or blast where they land (the ground still gives way under its push: above)' : 'crater, quake or blast where they land'"),
 'hits': ("const spHitsGround = (L, o, sp) => !!(", "const spHitsGround = (L, o, sp) => false && !!("),
 'hot': ("const hotC = !!(", "const hotC = false && !!("),
 'gives': ("return lg.gives ? ' But past", "return false ? ' But past"),
}
a, b = M[which]
assert s.count(a) == 1, (which, s.count(a))
open(p, 'w').write(s.replace(a, b))
