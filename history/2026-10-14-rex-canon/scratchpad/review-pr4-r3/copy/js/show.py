import json, sys
d = json.load(open(sys.argv[1]))
ids = sys.argv[2:] or list(d)
for k in ids:
    r = d[k]
    print('#'*10, k, 'overflow', r['overflow'], 'errs', r['errs'], 'wide', r['wide'])
    for f in ['verdict','chips','tiles','effort','callouts','happens','math','svgs','muted']:
        v = r[f]
        if not v: continue
        print('--', f.upper())
        for x in v: print('   ', x)
