import json, sys
d=json.load(open(sys.argv[1]))
def walk(o, path=''):
    if isinstance(o, dict):
        for k,v in o.items(): yield from walk(v, path+'/'+k)
    elif isinstance(o, list):
        for i,v in enumerate(o): yield from walk(v, path+'/'+str(i))
    else: yield path, o
hits = None
r = d.get('response',{})
try:
    hits = r['body']['hits']['hits']
except Exception as e:
    print('no hits key', list(r.keys())); 
    for p,v in walk(d):
        if 'total' in p: print(p,v)
    sys.exit()
print('total', r['body']['hits'].get('total'))
for h in hits:
    f=h.get('fields',{})
    print('==', f.get('identifier'), '|', f.get('title'), '|', f.get('year') or f.get('date'))
    hl=h.get('highlight',{})
    for k,v in hl.items():
        for s in v: print('   ', k, ':', s.replace('\n',' ')[:500])
