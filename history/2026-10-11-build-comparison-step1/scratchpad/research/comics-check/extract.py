import json,sys,re
for fn in sys.argv[1:]:
    try:
        d=json.load(open(fn))
    except Exception as e:
        print(fn,'ERR',e); continue
    print('=====',fn)
    def walk(o,path=''):
        if isinstance(o,dict):
            for k,v in o.items():
                walk(v,path+'/'+k)
        elif isinstance(o,list):
            for i,v in enumerate(o): walk(v,path)
        elif isinstance(o,str):
            if 'highlight' in path or 'error' in path.lower() or path.endswith('/identifier') or path.endswith('/title'):
                print(path[-60:],'::',o[:600].replace('\n',' '))
    walk(d.get('response',d))
