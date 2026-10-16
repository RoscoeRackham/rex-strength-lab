# Each round 1 fix reverted on its own in a scratch tree; its covering checks run there.
# python3 revert.py [names...]   (results in ../revert-results.json)
import json, os, shutil, subprocess, sys, concurrent.futures as cf
SRC = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/duo/repo/rex-strength-lab'
HERE = os.path.dirname(os.path.abspath(__file__)); TREES = os.environ.get('TREES', '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/duo/trees')
E, A, S = 'src/engine.js', 'src/app.html', 'src/static-data.js'
R = {}
def rv(name, test, *edits): R[name] = (test, edits)

rv('N1-boltsrc-T-push-only', 'r1', (A, "? srcOf(wC, { J: wJ, T: Math.max(P.limbPulse(wC.body), r.t) }) : null;", "? srcOf(wC, { J: wJ, T: r.t }) : null;"), (A, ": boltSrc && quakes(wC, { J: wJ, T: Math.max(P.limbPulse(wC.body), r.t) })", ": boltSrc && quakes(wC, { J: wJ, T: r.t })"))
rv('N2-push-pusher-rock-modelled', 'all', (A, "ground: cB.anchor === 'bolted' || (cA.anchor === 'bolted' && !r.ownRecoil) };", "ground: cB.anchor === 'bolted' || cA.anchor === 'bolted' };"))
rv('N3-noanswer-no-judged', 'r1', (A, "(f.judged ? '; it judges only ' + f.judged : '')", "''"))
rv('N6-both-stalled-either', 'sec+r1', (E, "out.stalled = !!(rP.stalled && rT.stalled);", "out.stalled = !!(rP.stalled || rT.stalled);"))
rv('N7-loserpad-no-holdarm', 'sec', (E, "loserPad = Math.abs(AW.holdArm * ml * aP - (Pl + AW.effMass * ml * aP));", "loserPad = Pl + AW.effMass * ml * aP;"))
rv('N8-push-footB-zero', 'sec', (E, "footB: out.HB * s.t, relativistic", "footB: 0, relativistic"))
rv('N9-bothslide-either', 'all', (A, "const bothSlide = !!r.both && (r.slideA || 0) > near && (r.slideB || 0) > near;", "const bothSlide = !!r.both && ((r.slideA || 0) > near || (r.slideB || 0) > near);"))
rv('N11-mean-text-always', 'all', (A, "if (eff.mean && eff.p.factsAt(eff.never || !isFinite(eff.use) ? topU : eff.use, 'mean').meant)", "if (eff.mean)"))

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
    subprocess.run(['node', 'build.js'], cwd=d, capture_output=True)
    res = {}
    if 'sec' in test:
        p = subprocess.run(['node', os.path.join(HERE, 'sec.js'), os.path.join(d, E), os.path.join(d, 'test/powers.js'), '6', '8'], cwd=d, capture_output=True, text=True)
        res['powers'] = [l[:170] for l in p.stdout.splitlines() if l.startswith('FAIL')] + ([p.stderr[-300:]] if p.returncode and not any(l.startswith('FAIL') for l in p.stdout.splitlines()) else [])
    mode = 'all' if 'all' in test else 'r1' if 'r1' in test else None
    if mode:
        p = subprocess.run(['node', os.path.join(HERE, 'blk.js'), os.path.join(d, 'test/shots.js'), d, mode], cwd=d, capture_output=True, text=True)
        res['page'] = [l[6:190] for l in p.stdout.splitlines() if l.startswith('FAILS')] + ([p.stderr[-300:]] if p.returncode else [])
    shutil.rmtree(os.path.join(d, 'dist'), ignore_errors=True)
    return name, res
names = [n for n in R if not only or n in only]
out = {}
with cf.ThreadPoolExecutor(max_workers=int(os.environ.get('W','1'))) as ex:
    for name, res in ex.map(run, names):
        out[name] = res
        print(name, json.dumps(res)[:600], flush=True)
prev = {}
rp = os.environ.get('RP', os.path.join(HERE, '..', 'revert-results.json'))
if os.path.exists(rp): prev = json.load(open(rp))
prev.update(out); json.dump(prev, open(rp, 'w'), indent=1)
