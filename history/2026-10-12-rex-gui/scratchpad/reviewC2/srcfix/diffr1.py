import json,subprocess,sys
def load(rev,path):
    s=subprocess.run(['git','-C','/home/user/rex-strength-lab','show',f'{rev}:rex-strength-lab/research/{path}'],capture_output=True,text=True).stdout
    d=json.loads(s)
    lst=d['facts'] if isinstance(d,dict) else d
    return {f['key']:f for f in lst}
for path in ['final-energy.json','final-objects.json','final-presence.json','final-humans.json','final-environment.json']:
    a=load('fca37d6',path); b=load('cf4f03b',path)
    for k in sorted(set(a)|set(b)):
        fa=a.get(k); fb=b.get(k)
        if fa==fb: continue
        print('=====',path,k)
        if fa is None or fb is None: print('  added/removed', fa is None); continue
        for fld in sorted(set(fa)|set(fb)):
            if fa.get(fld)!=fb.get(fld):
                print('  --',fld)
                print('     OLD:',json.dumps(fa.get(fld),ensure_ascii=False)[:3000])
                print('     NEW:',json.dumps(fb.get(fld),ensure_ascii=False)[:3000])
