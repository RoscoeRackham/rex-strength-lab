import json, glob, os
R='/home/user/rex-strength-lab/rex-strength-lab/research/'
F={}
for p in glob.glob(R+'final-*.json'):
    for f in json.load(open(p,encoding='utf-8'))['facts']:
        F.setdefault(f['key'],[]).append(os.path.basename(p))
print('dupe keys', [k for k,v in F.items() if len(v)>1])
facts={}
for p in glob.glob(R+'final-*.json'):
    for f in json.load(open(p,encoding='utf-8'))['facts']: facts[f['key']]=f
import re
src=open('/home/user/rex-strength-lab/rex-strength-lab/build-data.py').read()
lad=re.findall(r"\('(\w+)', '(energy_\w+)'\)", src[src.index('LADDER = ['):src.index('def rough_fact')])
print(len(lad))
from collections import Counter
st=Counter()
for rid,k in lad:
    f=facts[k]
    st[f['status']]+=1
    lo,hi,v=f.get('low_si'),f.get('high_si'),f['value_si']
    print(f"{rid:13} {f['status']:9} v={v:.4g} lo={lo} hi={hi} rough={f.get('rough')} unit={f['unit_si']} disp={f['display']!r} nsrc={len(f['sources'])}")
print(st)
