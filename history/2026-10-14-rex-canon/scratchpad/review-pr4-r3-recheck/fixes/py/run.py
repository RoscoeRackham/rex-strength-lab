# build each revert's tree and run its covering checks; one at a time
import json, os, re, subprocess, sys, time
sys.path.insert(0, os.path.dirname(__file__))
from mktree import tree, BASE
from reverts import R
OUT = BASE + '/revert-results.json'
names = sys.argv[1:] or list(R)
res = json.load(open(OUT)) if os.path.exists(OUT) else {}
for name in names:
    d = R[name]; t0 = time.time(); r = {}
    try:
        lab = tree(name, d['hunksel'], d['edits'], d['trim'] or 'r3')
    except SystemExit as e:
        res[name] = {'error': str(e)}; print(name, 'ERROR', e, flush=True); json.dump(res, open(OUT, 'w'), indent=1); continue
    if d['powers']:
        src = open(os.path.join(lab, 'test/powers.js'), encoding='utf-8').read().split('\n')
        i8 = next(i for i, l in enumerate(src) if l.startswith('// 8. Contests and Never knocked back'))
        open(os.path.join(lab, 'test/powers-trim.js'), 'w', encoding='utf-8').write('\n'.join(src[:71] + src[i8:]))
        p = subprocess.run(['node', 'test/powers-trim.js', '--skip-off'], cwd=lab, capture_output=True, text=True)
        fl = [l for l in p.stdout.split('\n') if l.startswith('FAIL')]
        r['powers_fail'] = [l[:160] for l in fl]; r['powers_tail'] = p.stdout.strip().split('\n')[-1][:80]
        if p.returncode and not fl: r['powers_err'] = p.stderr[-400:]
    if d['trim']:
        p = subprocess.run(['node', 'test/shots-trim.js', '--pr4'], cwd=lab, capture_output=True, text=True, timeout=1200)
        probs = [l for l in p.stdout.split('\n') if l.startswith('PROBLEM ')]
        labels = []
        for l in probs:
            body = l.split('): ', 1)[1] if '): ' in l else l
            for part in body.split(' ;; '): labels.append(part[:220])
        r['shots_fail'] = labels; r['shots_ok'] = [l[:60] for l in p.stdout.split('\n') if l.startswith('ok')]
        if p.returncode and not probs: r['shots_err'] = (p.stdout[-300:] + p.stderr[-600:])
    want = d['checks']
    got = r.get('powers_fail', []) + r.get('shots_fail', [])
    r['expected_failed'] = {c: any((g.startswith('FAIL ' + c) or g.startswith(c)) for g in got) for c in want}
    r['secs'] = round(time.time() - t0)
    res[name] = r
    print(name, json.dumps(r['expected_failed']), 'others:', [g[:90] for g in got if not any(g.startswith(c) or g.startswith('FAIL ' + c) for c in want)], r.get('powers_tail', ''), r.get('shots_err', '')[:300], r.get('powers_err', '')[:300], r['secs'], 's', flush=True)
    json.dump(res, open(OUT, 'w'), indent=1)
