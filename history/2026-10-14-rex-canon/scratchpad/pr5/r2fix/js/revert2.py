# Review round 2 of pull request 5: each of this round's fixes reverted on its own in a scratch tree, and every earlier
# mutant re-run on the fixed tree against the checks that guard it: the round 2 reviewers' and skeptics'
# (scratchpad review-pr5-r2/code, copy, verify-code), round 1's (pr5/r1fix/js/revert1.py: its fix reverts, the review's
# page and engine mutants, and the engine stage's 53), and the page stage's 29 (pr5/page-mutants).
# python3 revert2.py [--dry] [name-prefix ...]   (W=workers; results in ../revert2-results.json)
import json, os, re, shutil, subprocess, sys, concurrent.futures as cf
SP = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad'
SRC = '/home/user/rex-strength-lab/rex-strength-lab'
HERE = os.path.dirname(os.path.abspath(__file__)); TREES = os.path.join(HERE, '..', 'trees')
E, A, S, L, T = 'src/engine.js', 'src/app.html', 'src/static-data.js', 'src/ladder.js', 'test/shots.js'
TALLY, PAGE, PART1, LADDER = 'tally', 'page', 'part1', 'ladder'
R = {}
def rv(name, kind, test, *edits): R[name] = (kind, test, edits)
# ---------------------------------------------------------------- this round's fixes, each reverted on its own
OLD_TIPS = "[[0.319, 0.029], [0.354, 0.007], [0.396, 0.002], [0.435, 0.018], [0.470, 0.029], [0.509, 0.075], [0.535, 0.125], [0.560, 0.170], [0.590, 0.215], [0.620, 0.255], [0.650, 0.300]]"
NEW_TIPS = "[[0.327, 0.046], [0.359, 0.025], [0.395, 0.015], [0.432, 0.031], [0.473, 0.055], [0.516, 0.097], [0.538, 0.135], [0.570, 0.181], [0.598, 0.221], [0.628, 0.266], [0.653, 0.298]]"
rv('F2-design-tips-page', 'revert', PAGE, (A, "      ..." + NEW_TIPS + "\n", "      ..." + OLD_TIPS + "\n"))
rv('F2-design-tips-page-and-check', 'revert', PAGE, (A, "      ..." + NEW_TIPS + "\n", "      ..." + OLD_TIPS + "\n"), (T, "          .concat(" + NEW_TIPS + ".map(", "          .concat(" + OLD_TIPS + ".map("))
rv('F2-copy1-share-sentence', 'revert', PAGE, (A, "' The shimmer (the Shimmer tile) counts their power’s ' + pctAir(share) + ' share of what real air would take from this same throw at the full drag' + (tb.parts.passenger > 0 ? ', less what is still in their landing, which Safe passenger takes back' : '') + ': ' + fmtSI(tb.parts.drag, 'J') + '. That is not what their power cancels along the flight it actually flies, which slows less than in real air.'", "' The shimmer (the Shimmer tile) counts a different figure, ' + fmtSI(tb.parts.drag, 'J') + ': the ' + pctAir(share) + ' share of what real air would take from this same throw at the full drag' + (tb.parts.passenger > 0 ? ', less what is still in their landing, which Safe passenger takes back' : '') + ', not the share their power cancels along the flight it actually flies, which slows less than in real air.'"))
rv('F2-copy2-card', 'revert', PAGE, (S, "But with this power on, three things their own moves free go to the endless ocean too, and the Shimmer tile counts them: a catch’s energy", "But with this power on, what their own moves free goes to the endless ocean too, and the Shimmer tile counts it: a catch’s energy"), (S, " Nothing else their moves free is this power’s to take back: a punch’s or clap’s blast is Silent strike’s, the ground a stomp would break is Unbreakable footing’s, and a throw’s energy stays in what is thrown.", ""))
rv('F2-copy3-card', 'revert', PAGE, (S, "The drag counted is the share their power takes back (the Air resistance absorbed slider) of what real air would have taken from the same throw:", "The drag counted is what real air would have taken from the same throw:"))
rv('F2-copy4-wrestle-label', 'revert', PAGE, (A, "      if (f.relativistic && tb.parts.drag > 0 && isFinite(tb.parts.drag)) items.push('The shimmer (the Shimmer tile) counts ' + (share >= 1 ? '' : 'the ' + pctAir(share) + ' share of ') + 'what real air would have taken, ' + fmtSI(tb.parts.drag, 'J') + ': past 1% of light speed the lab gives real air all of his energy, an upper bound.');\n", ""))
rv('F2-copy4-toss-label', 'revert', PAGE, (A, "    if (t.v >= P.CATCH.V_FIREBALL && tb.parts.drag > 0 && isFinite(tb.parts.drag)) items.push(", "    if (false) items.push("))
rv('F2-code1-engine', 'revert', TALLY, (E, "    const TB_NONE = ['walk', 'lift', 'sprint', 'pull', 'wrestle', 'standoff'];", "    const TB_NONE = ['walk', 'lift', 'sprint', 'pull', 'arm', 'wrestle', 'standoff'];"),
   (E, "      const solo = !['wrestleThrow', 'catch', 'toss', 'collide', 'arm'].includes(move);\n      if (!(move in MOVES) && !['weight', 'wrestleThrow', 'catch', 'toss', 'collide', 'arm'].includes(move)", "      const solo = !['wrestleThrow', 'catch', 'toss', 'collide'].includes(move);\n      if (!(move in MOVES) && !['weight', 'wrestleThrow', 'catch', 'toss', 'collide'].includes(move)"),
   (E, "          if (A.unbreakable && r.outcome === 'pin' && r.pin && !r.relativistic && r.pin.v >= 2000 && isFinite(r.pin.E)) add(r.winner === 'A' ? whoA : whoB, 'footing', r.pin.E);\n", ""))
rv('F2-code1-engine-on-page', 'revert', PAGE, (E, "    const TB_NONE = ['walk', 'lift', 'sprint', 'pull', 'wrestle', 'standoff'];", "    const TB_NONE = ['walk', 'lift', 'sprint', 'pull', 'arm', 'wrestle', 'standoff'];"))
rv('F2-code1-page-tile', 'revert', PAGE, (A, "'ground treated as holding')); })(),\n      shimmerTile(tb, { duo: true })));", "'ground treated as holding')); })()));"))
rv('F2-code1-page-sentence', 'revert', PAGE, (A, "    else if (tb.parts.footing > 0) items.push('Unbreakable footing: on real ground the pin’s slam", "    else if (false) items.push('Unbreakable footing: on real ground the pin’s slam"))
rv('F2-code1-card', 'revert', PAGE, (S, "(Unbreakable footing: a stomp; an arm-wrestling pin’s slam, the winner’s take, and a thrown partner’s landing, each where real ground would take a crater)", "(Unbreakable footing: a stomp, or a thrown partner’s landing where real ground would take a crater)"))
rv('F2-code2-residue', 'revert', TALLY, (E, ": x === Infinity ? Infinity : x - arrive <= 1e-9 * x ? 0 : x - arrive);", ": x === Infinity ? Infinity : Math.max(0, x - arrive));"))
rv('F2-code2-arrival', 'revert', TALLY, (E, "              arrive = Math.max(tbJ(L.catch.Ecatch), L.vArrive > 0 ? keFromV(L.vArrive, ob.m) : 0);", "              arrive = tbJ(L.catch.Ecatch);"))
# ---------------------------------------------------------------- round 2's reviewers and skeptics
r2 = json.load(open(os.path.join(HERE, '..', 'r2code-mutants.json')))
CMDK = {'node test/powers.js --skip-off --tally-only': TALLY, 'node test/shots.js --pr5': PAGE, 'node test/ladder.js': LADDER}
for grp in ['mutants-engine', 'mutants-page', 'mutants-page2', 'mutants-ladder', 'mutants-ladder2']:
    for m in r2[grp]:
        if m['cmd'] not in CMDK: continue   # (L01-tie-upper-check: the reviewer's own probe of L01, not a test run)
        subs = m.get('subs') or [{'file': m['file'], 'find': m['find'], 'replace': m['replace']}]
        rv('r2code-' + m['id'], 'mutant', CMDK[m['cmd']], *[(x['file'], x['find'], x['replace']) for x in subs])
ns = {}; src = open(os.path.join(SP, 'review-pr5-r2', 'copy', 'js', 'revert.py')).read()
exec(src.split('only = sys.argv[1:]')[0].replace("HERE = os.path.dirname(os.path.abspath(__file__))", "HERE = '" + os.path.join(SP, 'review-pr5-r2', 'copy', 'js') + "'"), ns)
for name, edits in ns['R'].items():
    if name != 'BASE': rv('r2copy-' + name, 'revert-r1', PAGE, *edits)
rv('r2skeptic-mutA-cap', 'mutant', TALLY, (E, "      return f0.air ? Math.max(0, Math.min(E1, f0.air.E)) : 0;", "      return f0.air ? Math.max(0, f0.air.E) : 0;"))
rv('r2skeptic-mutB-belowStop', 'mutant', TALLY, (E, "          : keFromV(f.vImpact, obj.m) + tbPE(obj.m, f.belowStop ? 0 : hEnd);", "          : keFromV(f.vImpact, obj.m) + tbPE(obj.m, hEnd);"))
rv('r2skeptic-mutAB-on-page', 'mutant', PAGE, (E, "      return f0.air ? Math.max(0, Math.min(E1, f0.air.E)) : 0;", "      return f0.air ? Math.max(0, f0.air.E) : 0;"), (E, "          : keFromV(f.vImpact, obj.m) + tbPE(obj.m, f.belowStop ? 0 : hEnd);", "          : keFromV(f.vImpact, obj.m) + tbPE(obj.m, hEnd);"))
WT = "    const tb = takenBack('wrestleThrow', t, { A: cA, B: cB, whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: state.wAngle });"
rv('r2skeptic-P03-wrestle-whoA-rex', 'mutant', PAGE, (A, WT, WT.replace("whoA: nA === 'Rex' ? 'rex' : 'ollie'", "whoA: 'rex'")))
rv('r2skeptic-P04-collide-whoA-ollie', 'mutant', PAGE, (A, "    const tb = takenBack('collide', r, { A: cA, B: cB, whoA: X === 'Ollie' ? 'ollie' : 'rex' });", "    const tb = takenBack('collide', r, { A: cA, B: cB, whoA: 'ollie' });"))
rv('r2skeptic-P13-wrestle-allout', 'mutant', PAGE, (A, WT, "    const fA = Object.assign({}, cA, { F: fullF(nA === 'Rex' ? 'R' : 'O') }), fB = Object.assign({}, cB, { F: fullF(nB === 'Rex' ? 'R' : 'O') }); const tb = takenBack('wrestleThrow', P.throwPartner(fA, fB, state.wAngle), { A: fA, B: fB, whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: state.wAngle });"))
# ---------------------------------------------------------------- round 1's (its fix reverts, the review's mutants, the engine stage's 53)
ns1 = {}; src1 = open(os.path.join(SP, 'pr5', 'r1fix', 'js', 'revert1.py')).read()
exec(src1.split('only = sys.argv[1:]')[0].replace("HERE = os.path.dirname(os.path.abspath(__file__))", "HERE = '" + os.path.join(SP, 'pr5', 'r1fix', 'js') + "'"), ns1)
for name, (kind, test, edits) in ns1['R'].items():
    rv('r1-' + name, 'revert-r1' if kind == 'revert' else 'mutant', test, *edits)
# ---------------------------------------------------------------- the page stage's 29
nsp = {'__file__': os.path.join(SP, 'pr5', 'page-mutants', 'mutants.py')}; srcp = open(nsp['__file__']).read()
exec(srcp.split('def run(m):')[0], nsp)
for (name, what, guards, edits) in nsp['M']: rv('page-stage-' + name, 'mutant', PAGE, *edits)
# ---------------------------------------------------------------- patterns this round's edits moved, followed into its code
FOLLOW = json.load(open(os.path.join(HERE, 'follow2.json'))) if os.path.exists(os.path.join(HERE, 'follow2.json')) else {}
for name, eds in FOLLOW.items():
    kind, test, _ = R[name]; R[name] = (kind, test, [tuple(e) for e in eds])
args = [a for a in sys.argv[1:] if a != '--dry']; dry = '--dry' in sys.argv
def apply(d, edits):
    for f, old, new in edits:
        p = os.path.join(d, f); s = open(p, encoding='utf-8').read()
        if s.count(old) != 1: return 'pattern count %d in %s: %s' % (s.count(old), f, old[:100])
        s = s.replace(old, new, 1); open(p, 'w', encoding='utf-8').write(s)
    return None
def run(name):
    kind, test, edits = R[name]
    if dry:
        for f, old, new in edits:
            n = open(os.path.join(SRC, f), encoding='utf-8').read().count(old)
            if n != 1: return name, {'error': 'pattern count %d in %s: %s' % (n, f, old[:100])}
        return name, {'ok': True}
    safe = re.sub(r'[^\w.-]+', '_', name)
    root = os.path.join(TREES, safe); d = os.path.join(root, 'rex-strength-lab')
    shutil.rmtree(root, ignore_errors=True); os.makedirs(d)
    for x in ['src', 'test']: shutil.copytree(os.path.join(SRC, x), os.path.join(d, x))
    for x in ['build.js', 'build-data.py']: shutil.copy(os.path.join(SRC, x), d)
    for x in ['research', 'assets']: os.symlink(os.path.join(SRC, x), os.path.join(d, x))
    err = apply(d, edits)
    if err: shutil.rmtree(root, ignore_errors=True); return name, {'error': err}
    res = {'kind': kind, 'test': test}
    if test == PAGE:
        if any(f == S for f, _, _ in edits): subprocess.run(['python3', 'build-data.py'], cwd=d, capture_output=True)
        b = subprocess.run(['node', 'build.js'], cwd=d, capture_output=True, text=True)
        if b.returncode: res['build'] = b.stderr[-300:]
        p = subprocess.run(['node', 'test/shots.js', '--pr5'], cwd=d, capture_output=True, text=True, timeout=1800)
        out = p.stdout + p.stderr
        pl = ' '.join(l for l in out.splitlines() if l.startswith('PROBLEM'))
        res['fails'] = sorted(set(re.findall(r'pr5 \[[\w-]+\]', pl))) or ([pl[:300]] if pl else [])
        if p.returncode and not res['fails']: res['fails'] = ['crash: ' + ' '.join(out.strip().splitlines()[-3:])[:300]]
    else:
        cmd = {TALLY: ['node', 'test/powers.js', '--skip-off', '--tally-only'], PART1: ['node', 'test/powers.js', '--off-only'], LADDER: ['node', 'test/ladder.js']}[test]
        p = subprocess.run(cmd, cwd=d, capture_output=True, text=True, timeout=1800)
        out = p.stdout + p.stderr
        res['fails'] = [re.sub(r'\s+', ' ', l[5:])[:110] for l in out.splitlines() if l.startswith('FAIL ')]
        if p.returncode and not res['fails']: res['fails'] = ['crash: ' + ' '.join(out.strip().splitlines()[-2:])[:200]]
    res['exit'] = p.returncode; res['killed'] = p.returncode != 0
    shutil.rmtree(root, ignore_errors=True)
    return name, res
names = [n for n in R if not args or any(n.startswith(o) for o in args)]
out = {}
with cf.ThreadPoolExecutor(max_workers=int(os.environ.get('W', '3')) if not dry else 1) as ex:
    for name, res in ex.map(run, names):
        out[name] = res
        if dry:
            if 'error' in res: print('PATTERN ' + name + ': ' + res['error'], flush=True)
        else: print(('KILLED ' if res.get('killed') else 'SURVIVED ' if 'error' not in res else 'ERROR ') + name, json.dumps(res.get('fails', res.get('error')))[:400], flush=True)
if dry: print('%d entries, %d with a pattern that does not apply' % (len(out), sum('error' in r for r in out.values())))
else:
    rp = os.path.join(HERE, '..', 'revert2-results.json')
    prev = json.load(open(rp)) if os.path.exists(rp) else {}
    prev.update(out); json.dump(prev, open(rp, 'w'), indent=1)
