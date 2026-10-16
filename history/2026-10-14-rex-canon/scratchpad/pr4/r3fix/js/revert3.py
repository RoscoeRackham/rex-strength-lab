# Each review round 3 fix reverted on its own in a scratch tree; its covering checks run there. Also the review's surviving
# mutants of round 2's code (each must now fail a check).
# python3 revert3.py [names...]   (results in ../revert3-results.json)
import json, os, shutil, subprocess, sys, concurrent.futures as cf
SRC = '/home/user/rex-strength-lab/rex-strength-lab'
HERE = os.path.dirname(os.path.abspath(__file__)); TREES = os.path.join(HERE, '..', 'trees')
E, A, S, T = 'src/engine.js', 'src/app.html', 'src/static-data.js', 'test/shots.js'
R = {}
def rv(name, test, *edits): R[name] = (test, edits)
# ---- engine fixes ('sec': powers.js sections 6 and 8; 'r3': the page's round 3 checks)
rv('E1-arm-torn-rock-ignored', 'sec+r3', (E, "      if (!(tableBreaks && c.anchor === 'bolted' && t > 1 && !sameForce(t, 1))) return f.R;\n", "      return f.R;\n"))
rv('E2-bounce-no-contact-travel', 'sec+r3', (E, ", during: duringEl, moved: out.bound ? null : duringEl + slideB } };", " } };"))
rv('E3-walkout-no-slide', 'sec+r3', (E, ", walkPush: Hl + cl.body.m * a, slideL, endL: x + slideL },", ", walkPush: Hl + cl.body.m * a },"))
# ---- page fixes
rv('P1-arm-torn-text', 'r3', (A, "    const tornOf = (side) => !!(side === 'A' ? r.tornA : r.tornB), holdNow", "    const tornOf = (side) => false, holdNow"))
rv('P2-bounce-harm-slide-only', 'r3', (A, "af.bounce && (r.carry ? af.bounce.moved : Math.max(af.bounce.slideA || 0, af.bounce.slideB || 0))) : 0;", "af.bounce && Math.max(af.bounce.slideA || 0, af.bounce.slideB || 0)) : 0;"))
rv('P2b-bounce-item-travel', 'r3', (A, "(af.bounce && isFinite(af.bounce.during) && cr.vB < 0.01 * K.c ?", "(false ?"))
rv('P3-walkout-unjudged', 'r3', (A, "        const walked = r.outcome === 'walkOut' && r.endL != null;\n", "        const walked = false;\n"))
rv('P3b-walkout-slide-text', 'r3', (A, "+ (r.slideL != null && isFinite(r.endL) ? ' ' + W + ' only pushes,", "+ (false ? ' ' + W + ' only pushes,"), (A, "r.slideL != null ? 'then ' + L + ' slides ' + slideOf(r.slideL, r.v) : null", "null"))
rv('P4-cant-walk-text', 'r3', (A, " : P.moveCheck(cw.F, cw.body.m).walk ? ' can walk but not run (running takes strength above his weight; see Sprint). The lab caps a walk-out at his top running speed, so he can’t walk ' : ' can’t walk, so he can’t walk ')", " : ' can’t walk, so he can’t walk ')"))
rv('P5-push-less-hold-label', 'r3', (A, "'His whole push sets it: ' + fmtN(r.walkPush) + ' (' + fmtN(r.walkPush - HlW) + ' more than ' + L + '’s hold)'", "'His push, less ' + L + '’s hold, sets it: ' + fmtN(r.walkPush)"))
rv('P6-torn-feet-unlimited', 'r3', (A, "only ' + L + '’s feet hold him (' + fmtN(r.winner === 'A' ? r.holdAfterB : r.holdAfterA) + '): '", "only ' + L + '’s feet hold him (' + fmtN(Hl) + '): '"))
rv('P7-card-stale-pin-feet', 'r3', (S, "so the stronger always pins. In a stalemate each one’s feet hold against the other’s press; in a pin the loser’s arm folds, and his feet carry only the force at his elbow that turns his forearm against the winner’s hand.", "so the stronger always pins, and each one’s feet hold against the other’s press."))
rv('P8-arm-chip-bare', 'r3', (A, "chips.push(status('warn', r.oneSided && r.noAnswer ? 'No physical answer for ' + WHO[r.noAnswer] + '’s press' : 'No physical answer'));", "chips.push(status('warn', 'No physical answer'));"))
rv('P9-elbow-formula-two-figures', 'r3', (A, "    const elbowF = '|' + sig(P.AW.holdArm, 4) + ' m_loser a − (loser’s arm + ' + sig(P.AW.effMass, 3) + ' m_loser a)| = |' + sig(P.AW.holdArm - P.AW.effMass, 3) + ' m_loser a − loser’s arm|';", "    const elbowF = '|0.012 m_loser a − (loser’s arm + 0.0097 m_loser a)|';"), (A, "    const aF = 'a = (winner’s arm − loser’s arm) / (' + sig(P.AW.effMass, 3) + ' × (m_Rex + m_Ollie))';", "    const aF = 'a = (winner’s arm − loser’s arm) / (0.0097 × (m_Rex + m_Ollie))';"))
rv('P10-bounce-quake-line', 'r3', (A, "        : !splat && cB.unbreakable ? 'Ground: the perfect-bounce bound ignores what holds ' + Y + ', so nothing of the hit reaches the ground in it.'\n", ""))
rv('P11-judged-takeoff-always', 'r1+r3', (A, "out.judged = 'the charge (its speed against sound)' + (tk ? ' and the charger’s take-off' : ''); if (!tk) out.judgedOne = 'the charge'; }", "out.judged = 'the charge (its speed against sound) and the charger’s take-off'; }"))
# ---- the review's surviving mutants: round 2's page fixes in part (duo-r2-fix-parts-unchecked) and new mutants of round 2's code (duo-r2-mutants-survive)
rv('U1-pin-item-loser-arm', 'r2', (A, "' + (r.loserElbow != null ? 'what turns his forearm about his elbow' : 'his arm') + '", "his arm"))
rv('U2-arm-math-elbow', 'r3', (A, "; in a pin the loser’s feet (or bolts) carry the force at his elbow, ' + elbowF + ', ' + aF + '.'", ".'"))
rv('U3-bars-could-push', 'r2', (A, "].filter(Boolean).map((x) => (walkW && x.label === (walkW === 'A' ? 'Rex’s push' : 'Ollie’s push') ? Object.assign(x, { label: (walkW === 'A' ? 'Rex' : 'Ollie') + ' could push' }) : x)), (x) => fmtSI(x, 'N')));", "].filter(Boolean), (x) => fmtSI(x, 'N')));"))
rv('U10-both-boltShakeA-chip', 'r2', (A, "boltShakeA ? groundShakeChip(boltShakeA, cP.surface, 'The push through ' + pusher + '’s bolts') : ", ""))
rv('N3-walk-J-walkPush-t', 'sec+r3', (E, "const rw = { J: cl.body.m * v + Hl * t, T: t, thetaDeg: 0 };", "const rw = { J: (Hl + cl.body.m * a) * t, T: t, thetaDeg: 0 };"))
rv('N10-match-x-swap', 'r3', (A, "slB = moved && r.vB > 0 ? (r.xB || 0) + r.slideB", "slB = moved && r.vB > 0 ? (r.xA || 0) + r.slideB"))
rv('N12-boltShake-ignores-T', 'r3', (A, "wT = r.t > 0 ? Math.max(P.limbPulse(cwB.body), r.t) : 0", "wT = r.t"))
# the opposite over-fix of P11 (the jump's take-off dropped too): the round 3 jump check guards it
rv('M-judged-never-takeoff', 'r3', (A, "out.judged = 'the charge (its speed against sound)' + (tk ? ' and the charger’s take-off' : '');", "out.judged = 'the charge (its speed against sound)';"))
only = sys.argv[1:]
def run(name):
    test, edits = R[name]
    root = os.path.join(TREES, name); d = os.path.join(root, 'rex-strength-lab')
    shutil.rmtree(root, ignore_errors=True); os.makedirs(d)
    for x in ['src', 'test']: shutil.copytree(os.path.join(SRC, x), os.path.join(d, x))
    for x in ['build.js', 'build-data.py']: shutil.copy(os.path.join(SRC, x), d)
    for x in ['research', 'assets']: os.symlink(os.path.join(SRC, x), os.path.join(d, x))
    for f, old, new in edits:
        p = os.path.join(d, f); s = open(p, encoding='utf-8').read()
        if s.count(old) != 1: return name, {'error': 'pattern count %d: %s' % (s.count(old), old[:80])}
        open(p, 'w', encoding='utf-8').write(s.replace(old, new))
    if any(f == S for f, _, _ in edits): subprocess.run(['python3', 'build-data.py'], cwd=d, capture_output=True)
    b = subprocess.run(['node', 'build.js'], cwd=d, capture_output=True, text=True)
    res = {}
    if b.returncode: res['build'] = b.stderr[-300:]
    if 'sec' in test:
        p = subprocess.run(['node', os.path.join(HERE, 'sec.js'), os.path.join(d, E), os.path.join(d, 'test/powers.js'), '6', '8'], cwd=d, capture_output=True, text=True)
        res['powers'] = [l[:220] for l in p.stdout.splitlines() if l.startswith('FAIL')] + ([p.stderr[-300:]] if p.returncode and not any(l.startswith('FAIL') for l in p.stdout.splitlines()) else [])
    for mode in ['r1', 'r2', 'r3']:
        if mode in test:
            p = subprocess.run(['node', os.path.join(HERE, 'blk3.js'), os.path.join(d, T), d, mode], cwd=d, capture_output=True, text=True)
            res['page-' + mode] = [l[6:300] for l in p.stdout.splitlines() if l.startswith('FAILS')] + ([p.stderr[-300:]] if p.returncode else [])
    shutil.rmtree(os.path.join(d, 'dist'), ignore_errors=True)
    return name, res
names = [n for n in R if not only or n in only]
out = {}
with cf.ThreadPoolExecutor(max_workers=int(os.environ.get('W', '3'))) as ex:
    for name, res in ex.map(run, names):
        out[name] = res
        print(name, json.dumps(res)[:900], flush=True)
prev = {}
rp = os.path.join(HERE, '..', 'revert3-results.json')
if os.path.exists(rp): prev = json.load(open(rp))
prev.update(out); json.dump(prev, open(rp, 'w'), indent=1)
