import json,re
src=open('/home/user/rex-strength-lab/rex-strength-lab/build-data.py').read()
i=src.find('LADDER = ['); j=src.find(']\n',i)
pairs=re.findall(r"\('(\w+)', '(\w+)'\)", src[i:j])
d=json.load(open('/home/user/rex-strength-lab/rex-strength-lab/research/final-energy.json'))
F={f['key']:f for f in d['facts']}
for rid,k in pairs:
    f=F[k]
    v=f['value_si']; lo=f.get('low_si'); hi=f.get('high_si')
    print(f"{rid:13s} {f['status']:9s} v={v:.4g} lo={lo if lo is None else format(lo,'.4g')} hi={hi if hi is None else format(hi,'.4g')} rough={f.get('rough')}")
    print('   DISPLAY:', f['display'])
    print('   SHORT  :', f['page_short'])
