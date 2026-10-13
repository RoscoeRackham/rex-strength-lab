import json,sys
d=json.load(open('/home/user/rex-strength-lab/rex-strength-lab/research/final-energy.json'))
by={f['key']:f for f in d['facts']}
keys=sys.argv[1:]
for k in keys:
    f=by.get(k)
    if not f: print('MISSING',k); continue
    print('='*100)
    print(json.dumps(f,indent=1,ensure_ascii=False))
