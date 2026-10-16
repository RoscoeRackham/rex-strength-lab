# Review round 2 of pull request 5: each of this round's fixes reverted on its own in a scratch tree, and every earlier
# mutant re-run on the fixed tree against the checks that guard it: the round 2 reviewers' and skeptics'
# (scratchpad review-pr5-r2/code, copy, verify-code), round 1's (pr5/r1fix/js/revert1.py: its fix reverts, the review's
# page and engine mutants, and the engine stage's 53), and the page stage's 29 (pr5/page-mutants).
# python3 revert2b.py [--dry] [name-prefix ...]   (the follow-ups; results added to ../revert2-results.json)
import json, os, re, shutil, subprocess, sys, concurrent.futures as cf
SP = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad'
SRC = '/home/user/rex-strength-lab/rex-strength-lab'
HERE = os.path.dirname(os.path.abspath(__file__)); TREES = os.path.join(HERE, '..', 'trees')
E, A, S, L, T = 'src/engine.js', 'src/app.html', 'src/static-data.js', 'src/ladder.js', 'test/shots.js'
TALLY, PAGE, PART1, LADDER = 'tally', 'page', 'part1', 'ladder'
R = {}
def rv(name, kind, test, *edits): R[name] = (kind, test, edits)

# ---------------------------------------------------------------- follow-ups: the game of catch's label (copy-4, followed),
# the skeptics' two engine mutants together against section 9, and code-3's checks removed (section 9 as at f6d20c3)
OLDP = open(os.path.join(HERE, '..', 'before', 'powers-f6d20c3.js'), encoding='utf-8').read()
rv('F2-copy4-catch-label', 'revert', PAGE, (A, "    if (fastDrag.length) items.push(", "    if (false) items.push("))
rv('r2skeptic-mutAB', 'mutant', TALLY, (E, "      return f0.air ? Math.max(0, Math.min(E1, f0.air.E)) : 0;", "      return f0.air ? Math.max(0, f0.air.E) : 0;"), (E, "          : keFromV(f.vImpact, obj.m) + tbPE(obj.m, f.belowStop ? 0 : hEnd);", "          : keFromV(f.vImpact, obj.m) + tbPE(obj.m, hEnd);"))
rv('F2-code3-checks-removed', 'revert', TALLY, ('test/powers.js', None, OLDP))
rv('F2-code3-checks-removed+mutA', 'revert', TALLY, ('test/powers.js', None, OLDP), (E, "      return f0.air ? Math.max(0, Math.min(E1, f0.air.E)) : 0;", "      return f0.air ? Math.max(0, f0.air.E) : 0;"))
rv('F2-code3-checks-removed+mutB', 'revert', TALLY, ('test/powers.js', None, OLDP), (E, "          : keFromV(f.vImpact, obj.m) + tbPE(obj.m, f.belowStop ? 0 : hEnd);", "          : keFromV(f.vImpact, obj.m) + tbPE(obj.m, hEnd);"))
rv('F2-code2-checks-removed+N29', 'revert', TALLY, ('test/powers.js', None, OLDP), (E, '(!(x > 0) || arrive === Infinity ? 0 :', '(!(x > 0) ? 0 :'))

FOLLOW = {}
for name, eds in FOLLOW.items():
    kind, test, _ = R[name]; R[name] = (kind, test, [tuple(e) for e in eds])
args = [a for a in sys.argv[1:] if a != '--dry']; dry = '--dry' in sys.argv
def apply(d, edits):
    for f, old, new in edits:
        p = os.path.join(d, f)
        if old is None: open(p, 'w', encoding='utf-8').write(new); continue
        s = open(p, encoding='utf-8').read()
        if s.count(old) != 1: return 'pattern count %d in %s: %s' % (s.count(old), f, old[:100])
        s = s.replace(old, new, 1); open(p, 'w', encoding='utf-8').write(s)
    return None
def run(name):
    kind, test, edits = R[name]
    if dry:
        for f, old, new in edits:
            if old is None: continue
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
