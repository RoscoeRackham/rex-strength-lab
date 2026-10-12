import csv,sys,statistics as st,re
rows=list(csv.DictReader(open(sys.argv[1])))
subj={}
for r in rows:
    fn=r['FileName']
    m=re.match(r'WBDS(\d+)walkO(\d+)?C\.txt$',fn) or re.match(r'WBDS(\d+)walkOC(\d+)?\.txt$',fn)
    if not re.search(r'walkO.*C.*\.txt$',fn): continue
    try: v=float(r['GaitSpeed(m/s)'])
    except: continue
    s=r['Subject']; subj.setdefault(s,{'g':r['AgeGroup'],'H':float(r['Height']),'L':float(r['LegLength']),'sex':r['Gender'],'v':[]})['v'].append(v)
print('example names', [r['FileName'] for r in rows if 'walkO' in r['FileName']][:8])
for grp in ('Young','Old'):
    S=[d for d in subj.values() if d['g']==grp]
    if not S: continue
    v=[st.mean(d['v']) for d in S]; L=[d['L'] for d in S]; H=[d['H']/100 for d in S]
    fr=[vi*vi/(9.81*Li) for vi,Li in zip(v,L)]
    ratio=[Li/Hi for Li,Hi in zip(L,H)]
    print(grp,'n=',len(S),'speed mean %.2f sd %.2f'%(st.mean(v),st.stdev(v)),'leg %.3f'%st.mean(L),'H %.3f'%st.mean(H),
          'Fr mean %.3f sd %.3f min %.3f max %.3f'%(st.mean(fr),st.stdev(fr),min(fr),max(fr)),'leg/H %.3f sd %.3f'%(st.mean(ratio),st.stdev(ratio)))
