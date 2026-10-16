import subprocess, shutil, sys, os, re
LAB = os.path.abspath('mut/lab')
ENG = os.path.join(LAB, 'src', 'engine.js')
orig = open(ENG).read()
M = {
 'E1-Q-no-hold-work': [('const Qs = h2.Q + footSplat * cf.s;', 'const Qs = h2.Q;')],
 'E2-elbow-unchecked': [('if (tableBreaks && cw.ownRecoil) {\n        const aP = (Aw - Pl) / out.pin.M;', 'if (false) {\n        const aP = (Aw - Pl) / out.pin.M;')],
 'E3-loserpad-nan': [('loserPad = !isFinite(aP) ? Infinity : Math.abs(', 'loserPad = Math.abs(')],
 'E3b-elbow-nan': [('const elbow = !isFinite(aP) ? Infinity : Math.abs(', 'const elbow = Math.abs(')],
 'E5-walkout-no-holdback': [("contact: Hl + cl.body.m * a, walkPush: Hl + cl.body.m * a },\n            { ['recoilAbsorbed' + w]: rw }", "contact: Hl + cl.body.m * a },\n            {}")],
 'E6-no-xA': [('xA: sA.x(t), xB: sB.x(t) };', '};')],
 'E7-lying-pushes': [('const lying = own && !canStand(cA);', 'const lying = false;')],
 'E8-real-unflagged': [("if (cA.mode === 'real') out.drive.realUpper = true;", '')],
 'E9-air-uncounted': [('if (horiz && !relativistic && vB > K.a0) {', 'if (false) {')],
}
which = sys.argv[1:] or list(M)
for name in which:
    src = orig
    for a, b in M[name]:
        if src.count(a) != 1: print(name, 'PATTERN COUNT', src.count(a), a[:60]); break
        src = src.replace(a, b)
    else:
        open(ENG, 'w').write(src)
        r = subprocess.run(['node', 'test/p8.js'], cwd=LAB, capture_output=True, text=True, timeout=600)
        fails = [l[:110] for l in r.stdout.splitlines() if l.startswith('FAIL')]
        print(name, '->', len(fails), 'fail;', ' | '.join(fails) if fails else 'SURVIVES', (r.stderr[-300:] if r.returncode and not fails else ''))
open(ENG, 'w').write(orig)
