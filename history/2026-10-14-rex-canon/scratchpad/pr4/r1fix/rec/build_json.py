import json, sys
B = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/'
raw = json.load(open(B + 'round1-raw.json'))
O = {}; exec(open(B + 'r1fix/rec/outcomes.py', encoding='utf-8').read(), O); O = O['O']
rev = json.load(open(B + 'r1fix/revert-results.json'))
def seen(names):
    out = []
    for n in names:
        r = rev.get(n)
        if r is None: out.append(n + ': not run'); continue
        parts = []
        if 'powers' in r: parts.append('powers.js ' + ('fails ' + '; '.join(x[5:9].strip(': ') for x in r['powers']) if r['powers'] else 'passes'))
        lab = lambda x: (': '.join(x.split(': ')[:2]) if x.startswith('review round 1: ') or x.startswith('Never knocked back: ') else x.split(': ')[0])
        if 'page' in r: parts.append('shots.js ' + ('fails ' + '; '.join("'" + lab(x) + "'" for x in r['page']) if r['page'] else 'passes'))
        out.append(n + ' -> ' + ', '.join(parts))
    return out
counts = {'findings': 0, 'confirmed': 0, 'refuted': [], 'no_verdict': []}
lenses = []
for L in raw:
    fs = []
    for f in L['findings']:
        counts['findings'] += 1
        v = f.get('verdict') or {}
        if not v: counts['no_verdict'].append(f['id'])
        elif v.get('real'): counts['confirmed'] += 1
        else: counts['refuted'].append(f['id'])
        text, names = O[f['id']]
        g = dict(f)
        g['outcome'] = text + ((' Reverted in a scratch copy (scratchpad pr4/r1fix/js/revert.py): ' + ' | '.join(seen(names)) + '.') if names else '')
        fs.append(g)
    lenses.append({'lens': L['lens'], 'verified_ok': L['verified_ok'], 'findings': fs})
assert counts == {'findings': 28, 'confirmed': 26, 'refuted': ['duo-arm-reading-b-justification', 'copy-paradox-pronoun'], 'no_verdict': []}, counts
WHAT = open(B + 'r1fix/rec/what.txt', encoding='utf-8').read().strip()
rec = {'round': 1, 'what': WHAT, 'script': 'workflow canon-review (args {pr: 4, round: 1, lenses: [physics, duo, copy]}); kept in history at the end of the run', 'counts': counts, 'lenses': lenses}
json.dump(rec, open(sys.argv[1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
open(sys.argv[1], 'a').write('\n')
print('written', counts)
