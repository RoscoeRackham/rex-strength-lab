# The re-check of review round 3 of pull request 4: each round 3 fix the re-check found unguarded, reverted on its own
# in a scratch tree, run against the extended check (today's shots.js) and against the check as it was (ad1aa9c's).
# python3 revert-rc.py [names...]   (results in rc-results.json)
import json, os, shutil, subprocess, sys, concurrent.futures as cf
SRC = '/home/user/rex-strength-lab/rex-strength-lab'
HERE = os.path.dirname(os.path.abspath(__file__)); TREES = os.path.join(HERE, 'trees')
A, T = 'src/app.html', 'test/shots.js'
OLD = os.path.join(HERE, 'shots-ad1aa9c.js')
R = {}
def rv(name, modes, *edits): R[name] = (modes, edits)
# control: no revert
rv('C0-control', ['r1', 'r3'])
# fixes-arm-torn-winner-text-unchecked: the bolted winner's branch of bayArm's pin verdict (the tornOf(sideW) branch)
rv('RC1-arm-torn-winner-text', ['r3'], (A, "(tornOf(sideW) ? capital(tornLine(sideW)) + ', less than ' + L + '’s press, so ' + W + '’s feet slide too.' : L + '’s press is more than '", "(false ? '' : L + '’s press is more than '"))
# fixes-takeoff-preset-ceiling-unchecked: the preset view's courtesy-ceiling line back to 'those do'
rv('RC2-preset-ceiling-those-do', ['r1'], (A, "(fCn.judged ? ' Even all-out, ' + judgedDo(fCn) + ' no harm", "(fCn.judged ? ' Even all-out, those do no harm"))
only = sys.argv[1:]
def run(name):
    modes, edits = R[name]
    root = os.path.join(TREES, name); d = os.path.join(root, 'rex-strength-lab')
    shutil.rmtree(root, ignore_errors=True); os.makedirs(d)
    for x in ['src', 'test']: shutil.copytree(os.path.join(SRC, x), os.path.join(d, x))
    for x in ['build.js', 'build-data.py']: shutil.copy(os.path.join(SRC, x), d)
    for x in ['research', 'assets']: os.symlink(os.path.join(SRC, x), os.path.join(d, x))
    for f, old, new in edits:
        p = os.path.join(d, f); s = open(p, encoding='utf-8').read()
        if s.count(old) != 1: return name, {'error': 'pattern count %d: %s' % (s.count(old), old[:80])}
        open(p, 'w', encoding='utf-8').write(s.replace(old, new))
    subprocess.run(['python3', 'build-data.py'], cwd=d, capture_output=True)
    b = subprocess.run(['node', 'build.js'], cwd=d, capture_output=True, text=True)
    res = {}
    if b.returncode: res['build'] = b.stderr[-300:]
    for mode in modes:
        for lab, shots in [('new', os.path.join(d, T)), ('old', OLD)]:
            p = subprocess.run(['node', os.path.join(HERE, 'blk3.js'), shots, d, mode], cwd=d, capture_output=True, text=True)
            res[lab + '-' + mode] = [l[6:400] for l in p.stdout.splitlines() if l.startswith('FAILS')] + ([p.stderr[-300:]] if p.returncode else [])
    return name, res
names = [n for n in R if not only or n in only]
out = {}
with cf.ThreadPoolExecutor(max_workers=int(os.environ.get('W', '3'))) as ex:
    for name, res in ex.map(run, names):
        out[name] = res
        print(name, json.dumps(res, ensure_ascii=False)[:1500], flush=True)
rp = os.path.join(HERE, 'rc-results.json')
prev = json.load(open(rp)) if os.path.exists(rp) else {}
prev.update(out); json.dump(prev, open(rp, 'w'), indent=1, ensure_ascii=False)
