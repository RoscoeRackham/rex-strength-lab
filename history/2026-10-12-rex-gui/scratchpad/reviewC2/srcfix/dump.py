import json,glob,sys
R='/home/user/rex-strength-lab/rex-strength-lab/research/'
facts={}
for fn in glob.glob(R+'final-*.json'):
    d=json.load(open(fn))
    lst = d if isinstance(d,list) else d.get('facts', d)
    if isinstance(lst,dict): lst=list(lst.values())
    for f in lst:
        if isinstance(f,dict) and 'key' in f: facts[f['key']]=(fn.split('/')[-1],f)
keys=sys.argv[1:]
for k in keys:
    fn,f=facts[k]
    print('=====',k,fn)
    print(json.dumps(f,indent=1,ensure_ascii=False))
