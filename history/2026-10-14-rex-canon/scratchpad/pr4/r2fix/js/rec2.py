# Writes research/reviews/canon-4-round2.json: round2-raw.json's lenses verbatim, each finding with its outcome and the
# reverts that cover it (revert2-results.json). python3 rec2.py
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, '..', '..', 'round2-raw.json')
RES = json.load(open(os.path.join(HERE, '..', 'revert2-results.json')))
OUT = '/home/user/rex-strength-lab/rex-strength-lab/research/reviews/canon-4-round2.json'
META = json.load(open(os.path.join(HERE, 'rec2-meta.json')))

def pname(x):
    # a shots.js failure is 'check name: detail'; a check name may itself start with 'review round N: '
    pre = ''
    for p in ('review round 1: ', 'review round 2: '):
        if x.startswith(p): pre, x = p, x[len(p):]
    return pre + x.split(': ')[0]

def rev_text(names):
    parts = []
    for n in names:
        r = RES.get(n)
        if r is None: parts.append(n + ' -> not run'); continue
        bits = []
        if r.get('powers'): bits.append('powers.js fails ' + '; '.join(sorted(set(x.split(':')[0].replace('FAIL ', '').strip() for x in r['powers']))))
        elif 'powers' in r: bits.append('powers.js passes')
        if r.get('page'): bits.append('shots.js fails ' + '; '.join(sorted(set("'" + pname(x) + "'" for x in r['page']))))
        elif 'page' in r: bits.append('shots.js passes')
        if r.get('error'): bits.append('ERROR ' + r['error'])
        parts.append(n + ' -> ' + ', '.join(bits))
    return 'Reverted in a scratch copy (scratchpad pr4/r2fix/js/revert2.py): ' + ' | '.join(parts) + '.'

raw = json.load(open(RAW))
lenses = []
for lens in raw:
    L = dict(lens)
    L['findings'] = []
    for f in lens['findings']:
        g = dict(f)
        o = META['outcomes'][f['id']]
        txt = o['text']
        if o.get('reverts'): txt += ' ' + rev_text(o['reverts'])
        g['outcome'] = txt
        L['findings'].append(g)
    lenses.append(L)
n = sum(len(l['findings']) for l in lenses)
rec = {'round': 2, 'what': META['what'], 'script': META['script'], 'counts': {'findings': n, 'confirmed': n, 'refuted': [], 'no_verdict': []}, 'lenses': lenses}
json.dump(rec, open(OUT, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
open(OUT, 'a', encoding='utf-8').write('\n')
print('wrote', OUT, n, 'findings')
missing = [f['id'] for l in raw for f in l['findings'] if f['id'] not in META['outcomes']]
print('missing outcomes:', missing)
