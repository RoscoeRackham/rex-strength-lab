import json, glob, os, sys
def load(root):
    out={}
    for p in glob.glob(root+'/rex-strength-lab/research/final-*.json'):
        for f in json.load(open(p,encoding='utf-8'))['facts']:
            out[f['key']]=(os.path.basename(p), f)
    return out
A=load(sys.argv[1]); B=load(sys.argv[2])
print('main facts', len(A), 'branch facts', len(B))
print('removed keys:', sorted(set(A)-set(B)))
moved=[k for k in A if k in B and A[k][0]!=B[k][0]]
print('moved:', len(moved))
for k in sorted(moved): 
    a=A[k][1]; b=B[k][1]
    ch=[x for x in set(a)|set(b) if a.get(x)!=b.get(x)]
    print('  ', k, A[k][0], '->', B[k][0], 'value', a.get('value_si'), '->', b.get('value_si'), 'changed fields', sorted(ch))
for k in sorted(set(A)&set(B)):
    if A[k][0]==B[k][0] and A[k][1]!=B[k][1]:
        a=A[k][1]; b=B[k][1]
        print('changed in place', k, A[k][0], [ (x, a.get(x), b.get(x)) for x in sorted(set(a)|set(b)) if a.get(x)!=b.get(x) and x in ('value_si','low_si','high_si','status','unit_si','category')])
