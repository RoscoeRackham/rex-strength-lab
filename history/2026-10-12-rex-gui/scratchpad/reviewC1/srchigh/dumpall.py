import json,sys,glob
by={}
for fn in glob.glob('/home/user/rex-strength-lab/rex-strength-lab/research/final-*.json'):
    d=json.load(open(fn))
    for f in d['facts']:
        by.setdefault(f['key'],[]).append((fn.split('/')[-1],f))
for k in sys.argv[1:]:
    if k not in by: print('MISSING',k); continue
    for fn,f in by[k]:
        print('='*30, fn)
        print(json.dumps(f,indent=1,ensure_ascii=False))
