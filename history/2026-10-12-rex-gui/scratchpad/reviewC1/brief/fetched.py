import json,glob,re
d=json.load(open('research/reviews/gui-c-research.json'))
fetched={}  # key -> set(urls)
allf=set()
for t in d['topics']:
    for c in t['skeptic']['checks']:
        fetched.setdefault(c['key'],set()).update(c.get('fetched',[]))
        allf.update(c.get('fetched',[]))
facts={}
for f in glob.glob('research/final-*.json'):
    for x in json.load(open(f))['facts']: facts[x['key']]=x
src=open('build-data.py').read()
lad=re.findall(r"\('(\w+)', '(\w+)'\)", re.search(r'LADDER = \[(.*?)\n\]',src,re.S).group(1))
norm=lambda u:u.rstrip('/').replace('http://','https://')
alln={norm(u) for u in allf}
for rid,k in lad:
    f=facts[k]
    own={norm(u) for u in fetched.get(k,set())}
    miss=[s['url'] for s in f['sources'] if norm(s['url']) not in own]
    miss_any=[u for u in miss if norm(u) not in alln]
    print(rid.ljust(14), 'checked' if k in fetched else 'NO SKEPTIC CHECK', '| not fetched for this key:', len(miss), '| not fetched anywhere:', miss_any)
