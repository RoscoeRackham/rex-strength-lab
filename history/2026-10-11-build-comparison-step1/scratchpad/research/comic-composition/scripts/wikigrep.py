import json,sys,re
pat=re.compile(sys.argv[1], re.I)
for fn in sys.argv[2:]:
    d=json.load(open(fn))
    t=d['parse']['wikitext']['*']
    print('########', fn.split('/')[-1], d['parse'].get('title'))
    seen=set()
    for line in t.split('\n'):
        for s in re.split(r'(?<=[.!?])\s+', line):
            if pat.search(s) and s not in seen:
                seen.add(s); print('  -', s.strip()[:450])
