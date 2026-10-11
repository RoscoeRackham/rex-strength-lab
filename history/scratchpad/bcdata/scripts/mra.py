import json, re, math
R='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/research-all.json'
d=json.load(open(R)); f={x['key']:x for t in d for x in t['research']['facts']}
v=json.loads(f['mr_america_1938_1954_program_girths']['values'])
IN=0.0254; LB=0.45359237
def h(s):
    m=re.match(r"(\d+)'([\d.]*)",s); return (int(m.group(1))*12+(float(m.group(2)) if m.group(2) else 0))*IN
cols=v['columns']; rows=v['rows']
import statistics as st
H=[h(r[2]) for r in rows]; W=[r[3]*LB for r in rows]
print('n',len(rows),'H mean %.4f W mean %.2f'%(st.mean(H),st.mean(W)))
for i,c in enumerate(cols[4:],4):
    vals=[r[i] for r in rows if r[i] is not None]
    print(c,'n',len(vals),'mean in %.3f -> m %.4f'%(st.mean(vals),st.mean(vals)*IN), 'min',min(vals),'max',max(vals))
pis=[w/hh**3 for w,hh in zip(W,H)]
print('PI of mean body %.2f; mean of PIs %.2f; range %.1f-%.1f'%(st.mean(W)/st.mean(H)**3, st.mean(pis),min(pis),max(pis)))
for r,p in zip(rows,pis): print(r[0],r[1],'%.1f'%p)
