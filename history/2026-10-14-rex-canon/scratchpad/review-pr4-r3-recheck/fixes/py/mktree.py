# build a scratch tree with chosen round 3 fixes reverted (hunks of git diff f25f9b4..ad1aa9c, and/or string edits)
import json, os, shutil, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from hunks import hunks, REPO
BASE = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3-recheck/fixes'
TREES = BASE + '/trees'
E, A, S = 'rex-strength-lab/src/engine.js', 'rex-strength-lab/src/app.html', 'rex-strength-lab/src/static-data.js'
def tree(name, hunksel=(), edits=(), trim='r3'):
    root = os.path.join(TREES, name); lab = os.path.join(root, 'rex-strength-lab')
    shutil.rmtree(root, ignore_errors=True); os.makedirs(root)
    shutil.copytree(os.path.join(REPO, 'rex-strength-lab'), lab, ignore=shutil.ignore_patterns('shots', 'dist'))
    os.makedirs(os.path.join(lab, 'dist'))
    for path, sel in hunksel:
        head, hs = hunks(path)
        p = os.path.join(root, 'rev-%s.patch' % os.path.basename(path))
        open(p, 'w').write('\n'.join(head + sum([hs[i] for i in sel], [])) + '\n')
        r = subprocess.run(['git', 'apply', '-R', '--unidiff-zero', p], cwd=root, capture_output=True, text=True)
        if r.returncode: raise SystemExit(name + ': git apply failed: ' + r.stderr)
    for path, old, new in edits:
        f = os.path.join(root, path); s = open(f, encoding='utf-8').read()
        if s.count(old) != 1: raise SystemExit(name + ': edit count %d for %r' % (s.count(old), old[:90]))
        open(f, 'w', encoding='utf-8').write(s.replace(old, new))
    for cmd in (['python3', 'build-data.py'], ['node', 'build.js']):
        r = subprocess.run(cmd, cwd=lab, capture_output=True, text=True)
        if r.returncode: raise SystemExit(name + ': build failed ' + r.stderr[-400:])
    subprocess.run(['python3', BASE + '/py/trim.py', os.path.join(lab, 'test/shots.js'), os.path.join(lab, 'test/shots-trim.js'), trim], check=True, capture_output=True)
    return lab
