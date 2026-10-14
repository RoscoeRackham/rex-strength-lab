import json,sys,difflib,re
d=json.load(open(sys.argv[1]))
for k in d:
    if not k.startswith('main|'): continue
    a=d[k]; b=d[k.replace('main|','branch|')]
    if a==b: continue
    # sentence-level diff
    sa=re.split(r'(?<=[.:])\s', a); sb=re.split(r'(?<=[.:])\s', b)
    print('=====', k[5:])
    for l in difflib.unified_diff(sa,sb,lineterm='',n=0):
        if l.startswith(('---','+++','@@')): continue
        print('  '+l[:400])
