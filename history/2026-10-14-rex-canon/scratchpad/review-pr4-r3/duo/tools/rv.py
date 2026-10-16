# python3 rv.py <name...>   each revert/mutant in its own scratch tree; runs powers.js section 8 and/or the round-2-only
# PR4 block of shots.js (or the whole PR4 block with 'all'); results to ../rv-results.json
import json, os, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'repo', 'rex-strength-lab')
TREES = os.path.join(HERE, '..', 'trees')
E, A, S = 'src/engine.js', 'src/app.html', 'src/static-data.js'
R = {}
def rv(name, test, *edits): R[name] = (test, edits)
# ---- round 2's engine fixes, reverted (true reverts of f25f9b4's hunks)
rv('E1-Q-without-hold', 'p8', (E, "const Qs = h2.Q + footSplat * cf.s;", "const Qs = h2.Q;"))
rv('E2-elbow-block', 'p8', (E, "      if (tableBreaks && cw.ownRecoil) {\n        const aP = (Aw - Pl) / out.pin.M;", "      if (false) {\n        const aP = (Aw - Pl) / out.pin.M;"))
rv('E3-loserPad-nan', 'p8', (E, "loserPad = !isFinite(aP) ? Infinity : Math.abs(", "loserPad = Math.abs("))
rv('E4-arm-one-sided', 'p8', (E, "      if (heldA && heldB) Object.assign(out, { clash: 'paradox', oneSided: false });\n      else if (heldA || heldB) Object.assign(out, { clash: 'paradox', oneSided: true, noAnswer: heldA ? 'B' : 'A' }, heldA ? { draggedB: true } : { draggedA: true },\n        heldA && boltB ? { tearB: groundTear(cB) } : {}, heldB && boltA ? { tearA: groundTear(cA) } : {});", "      if (heldA || heldB) Object.assign(out, { clash: 'paradox', oneSided: !(heldA && heldB) });"))
rv('E5-walkout', 'p8', (E, ", contact: Hl + cl.body.m * a, walkPush: Hl + cl.body.m * a },\n            { ['recoilAbsorbed' + w]: rw }, Dl > 0 ? { ['recoilAbsorbed' + (w === 'A' ? 'B' : 'A')]: { J: Dl * t, T: t, thetaDeg: 0 } } : {});", ", contact: Hl + cl.body.m * a });"))
rv('E6-xA-xB', 'p8', (E, ", footB: footJ(fBn > 0, HB, DA), xA: sA.x(t), xB: sB.x(t) };", ", footB: footJ(fBn > 0, HB, DA) };"))
rv('E7-lying', 'p8', (E, "const DA = own ? (lying ? 0 : cA.F) : Math.min(cA.F, RA);", "const DA = own ? cA.F : Math.min(cA.F, RA);"))
rv('E8-realUpper', 'p8', (E, "        if (cA.mode === 'real') out.drive.realUpper = true;\n", ""))
rv('E9-Eair', 'p8', (E, "      if (horiz && !relativistic && vB > K.a0) {", "      if (false) {"))
rv('E10-both-pulse', 'p8', (E, "    if (!noP && !noT && rP.stalled && !rT.stalled && cT.anchor === 'bolted' && rT.push && isFinite(rP.Fdrive)) out.toGroundB = { J: rP.Fdrive * rT.push.t, T: Math.max(limbPulse(cT.body), rT.push.t) };\n    if (!noP && !noT && rT.stalled && !rP.stalled && cP.anchor === 'bolted' && rP.push && isFinite(rT.Fdrive)) out.toGroundA = { J: rT.Fdrive * rP.push.t, T: Math.max(limbPulse(cP.body), rP.push.t) };\n", ""))
# ---- new mutants of round 2's engine code
rv('N3-walk-J-walkPush-t', 'p8+r2', (E, "const rw = { J: cl.body.m * v + Hl * t, T: t, thetaDeg: 0 };", "const rw = { J: (Hl + cl.body.m * a) * t, T: t, thetaDeg: 0 };"))
rv('N4-both-pulse-own-force', 'p8', (E, "out.toGroundB = { J: rP.Fdrive * rT.push.t,", "out.toGroundB = { J: rT.Fdrive * rT.push.t,"), (E, "out.toGroundA = { J: rT.Fdrive * rP.push.t,", "out.toGroundA = { J: rP.Fdrive * rP.push.t,"))
rv('N5-Eair-splat-slide', 'p8', (E, "x = bounce ? out.after.bounce.slideB : out.after.splat.slide;", "x = out.after.splat.slide;"))
rv('N6-elbow-tear-own-press', 'p8', (E, "out[aWins ? 'tearB' : 'tearA'] = elbow / groundTear(cl);", "out[aWins ? 'tearB' : 'tearA'] = Pl / groundTear(cl);"))
rv('N7-Eair-no-footing', 'p8', (E, "out.carry.Eair = Math.max(0, momentumToKE(pGain, mB) - (isFinite(x) && x > 0 ? Rb * x : 0));", "out.carry.Eair = momentumToKE(pGain, mB);"))
# ---- page hunks of round 2 not reverted on their own by the author's script
rv('U1-pin-item-loser-arm', 'r2', (A, "’s feet hold less than ' + (r.loserElbow != null ? 'what turns his forearm about his elbow' : 'his arm') + ', so his body slides along too.'", "’s feet hold less than his arm, so his body slides along too.'"))
rv('U2-arm-math-elbow', 'r2', (A, "The stronger press pins the weaker arm; in a pin the loser’s feet (or bolts) carry the force at his elbow, |0.012 m_loser a − (loser’s arm + 0.0097 m_loser a)|.'", "The stronger press pins the weaker arm.'"))
rv('U3-bars-could-push', 'r2', (A, "].filter(Boolean).map((x) => (walkW && x.label === (walkW === 'A' ? 'Rex’s push' : 'Ollie’s push') ? Object.assign(x, { label: (walkW === 'A' ? 'Rex' : 'Ollie') + ' could push' }) : x)), (x) => fmtSI(x, 'N')));", "].filter(Boolean), (x) => fmtSI(x, 'N')));"))
rv('U4-both-target-bolted-item', 'r2', (A, "      boltShake && bothOwn ? 'Bolted, ' + target + ' doesn’t move: ' + pusher + '’s shove presses on his bolts for as long as ' + target + '’s own shove drives ' + pusher + ' off, so his bolts hand the planet ' + pusher + '’s shove over that push: ' + pushFig(r.toGroundB) + ' over ' + fmtTime(r.toGroundB.T) + ' (at least a limb’s contact time). ' + groundShakeText(boltShake, cT.surface)\n        : boltShake ?", "      boltShake ?"))
rv('U5-cantStand-tiles-items', 'r2', (A, "(r.cantStand ? 'too weak to stand up, so he lies flat' : own ?", "(own ?"), (A, "r.cantStand ? tile('Force between them', '0 N', X + ' can’t push lying flat') : own && r.outcome === 'forceWins'", "own && r.outcome === 'forceWins'"))
rv('U6-preset-warn-naF', 'r2', (A, "const fN = naF(fAll, eff.real ? 'real' : ''), na = noAnswerText(fN);", "const fN = fAll, na = noAnswerText(fN);"))
rv('U7-preset-ceiling-naF', 'r2', (A, "fCn = naF(fC, eff.real ? 'real' : ''), naC", "fCn = fC, naC"))
rv('U8-main-naT', 'r2', (A, "noAnswerText(naF(factsTop(), '')) : null;", "noAnswerText(factsTop()) : null;"))
rv('U9-main-fTn', 'r2', (A, "(fTn && fTn.judged ?", "(fT.judged ?"))
rv('U10-both-boltShakeA-chip', 'r2', (A, " : boltShakeA ? groundShakeChip(boltShakeA, cP.surface, 'The push through ' + pusher + '’s bolts')", ""))
rv('U11-arm-timetopin-flung', 'r2', (A, "r.clash && r.oneSided && r.noAnswer ? (r.noAnswer === 'B' ? 'Ollie' : 'Rex') + ' is flung off' : ", ""))
# ---- new page mutants of round 2's code
rv('N10-match-x-swap', 'r2', (A, "slB = moved && r.vB > 0 ? (r.xB || 0) + r.slideB : 0;", "slB = moved && r.vB > 0 ? (r.xA || 0) + r.slideB : 0;"))
rv('N11-walkW-always', 'r2', (A, "const walkW = r.outcome === 'walkOut' && r.aFeet < r.aLoser ? r.winner : null;", "const walkW = r.outcome === 'walkOut' ? r.winner : null;"))
rv('N12-boltShake-ignores-T', 'r2', (A, "const cwB = r.winner === 'A' ? cR : cO, wJ = r.winner === 'A' ? r.footA : r.footB, wT = r.t > 0 ? Math.max(P.limbPulse(cwB.body), r.t) : 0;", "const cwB = r.winner === 'A' ? cR : cO, wJ = r.winner === 'A' ? r.footA : r.footB, wT = r.t;"))
rv('N13-rideAir-any-speed', 'r2', (A, "const rideAir = !!(cr && cr.Eair > 0 && !(r.meanIt && splat));", "const rideAir = !!(cr && !(r.meanIt && splat));"))
rv('N14-steady-endB-slide', 'r2', (A, "const endB = dv ? dv.d + dv.slideB : 0;", "const endB = dv ? dv.d / 2 + dv.slideB : 0;"))

def run(name):
    test, edits = R[name]
    if os.environ.get('ALL'): test = test.replace('r2', 'all').replace('p8+', '')
    root = os.path.join(TREES, name + ('-all' if os.environ.get('ALL') else '')); d = os.path.join(root, 'rex-strength-lab')
    shutil.rmtree(root, ignore_errors=True); os.makedirs(d)
    for x in ['src', 'test']: shutil.copytree(os.path.join(SRC, x), os.path.join(d, x))
    for x in ['build.js', 'build-data.py']: shutil.copy(os.path.join(SRC, x), d)
    for x in ['research', 'assets']: os.symlink(os.path.abspath(os.path.join(SRC, x)), os.path.join(d, x))
    shutil.copy(os.path.join(HERE, 'p8.js'), os.path.join(d, 'test', 'p8.js'))
    shutil.copy(os.path.join(HERE, 'shots-r2.js'), os.path.join(d, 'test', 'shots-r2.js'))
    for f, old, new in edits:
        p = os.path.join(d, f); s = open(p, encoding='utf-8').read()
        if s.count(old) != 1: return {'error': 'pattern count %d: %s' % (s.count(old), old[:90])}
        open(p, 'w', encoding='utf-8').write(s.replace(old, new))
    if any(f == S for f, _, _ in edits): subprocess.run(['python3', 'build-data.py'], cwd=d, capture_output=True)
    b = subprocess.run(['node', 'build.js'], cwd=d, capture_output=True, text=True)
    res = {}
    if b.returncode: res['build'] = b.stderr[-300:]
    if 'p8' in test:
        p = subprocess.run(['node', 'test/p8.js'], cwd=d, capture_output=True, text=True)
        res['p8'] = [l[:160] for l in p.stdout.splitlines() if l.startswith('FAIL')] + ([p.stderr[-300:]] if p.returncode and not any(l.startswith('FAIL') for l in p.stdout.splitlines()) else [])
    if 'r2' in test or 'all' in test:
        env = dict(os.environ)
        if 'all' not in test: env['R2ONLY'] = '1'
        p = subprocess.run(['node', 'test/shots-r2.js', '--pr4'], cwd=d, capture_output=True, text=True, env=env)
        out = p.stdout
        res['page'] = [m.strip()[:160] for m in out.split(';;')] if 'PROBLEM' in out else ['pass' if p.returncode == 0 else 'rc %d %s' % (p.returncode, p.stderr[-300:])]
    return res
names = sys.argv[1:] or list(R)
rp = os.path.join(HERE, '..', os.environ.get('RES', 'rv-results.json'))
allr = json.load(open(rp)) if os.path.exists(rp) else {}
for n in names:
    r = run(n); allr[n] = r
    print(n, json.dumps(r)[:900], flush=True)
    json.dump(allr, open(rp, 'w'), indent=1)
