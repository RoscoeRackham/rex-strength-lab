import sys
root = sys.argv[1]; which = sys.argv[2]
p = root + '/rex-strength-lab/src/app.html'
s = open(p, encoding='utf-8').read()
if which == 'mmath':
    old = "      : ownPull ? 'They take their own recoil: acceleration = the smaller of (the strength he uses − resistance) ÷ load mass and his feet’s push ÷ his mass; his feet push with the smaller of his footing, μ × his weight = ' + fmtSI(a.R, 'N') + ', and his legs’ push, ' + sig(LEG, 2) + ' × the strength he uses = ' + fmtSI(legsR, 'N') + '; the rope pulls as hard as keeps the load at that pace; his steps push the ground with his own body’s momentum, m v, over the pull'"
    new = "      : ownPull ? 'They take their own recoil: pull = the strength he uses; acceleration = min((pull − resistance) ÷ load mass, footing ÷ his mass), footing = μ × his weight = ' + fmtSI(a.R, 'N') + '; his steps push the ground with his own body’s momentum, m v, over the pull'"
elif which == 'mwalk':
    old = "      + ' He still walks with it: his feet move his own body with at most the smaller of his footing (' + fmtSI(r.anchor.R, 'N') + '; walking runs on friction) and his legs’ push (' + fmtSI(legsR, 'N') + ', at most ' + legX + ' the strength he uses), so they can speed it up by at most ' + sig(Math.min(r.anchor.R, legsR) / c.body.m, 2) + ' m/s².');"
    new = "      + ' He still walks with it, and walking runs on friction: his footing (' + fmtSI(r.anchor.R, 'N') + ') can speed his own body up by at most ' + sig(r.anchor.R / c.body.m, 2) + ' m/s².');"
else:
    sys.exit(0)
assert s.count(old) == 1, (which, s.count(old))
open(p, 'w', encoding='utf-8').write(s.replace(old, new))
print('mutated', which)
