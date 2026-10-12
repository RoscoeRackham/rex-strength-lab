import csv,sys,statistics as st,re
rows=list(csv.DictReader(open(sys.argv[1])))
subj={}
for r in rows:
    if r['AgeGroup']!='Young': continue
    fn=r['FileName']
    m=re.match(r'WBDS(\d+)walkO(\d+)C\.c3d$',fn)
    if not m: continue
    s=r['Subject']
    try: v=float(r['GaitSpeed(m/s)'])
    except: continue
    subj.setdefault(s,{'v':[],'L':float(r['LegLength']),'H':float(r['Height'])/100})['v'].append(v)
print('n subjects',len(subj))
frs=[];vs=[];Ls=[];ratios=[];vhat=[]
for s,d in subj.items():
    v=st.mean(d['v']); L=d['L']
    frs.append(v*v/(9.81*L)); vs.append(v); Ls.append(L); ratios.append(L/d['H']); vhat.append(v/(9.81*L)**0.5)
print('ntrials per subj', [len(d['v']) for d in subj.values()])
print('v mean %.3f sd %.3f'%(st.mean(vs),st.stdev(vs)))
print('L mean %.3f; H mean %.3f'%(st.mean(Ls),st.mean([d['H'] for d in subj.values()])))
print('Fr mean %.3f sd %.3f min %.3f max %.3f median %.3f'%(st.mean(frs),st.stdev(frs),min(frs),max(frs),st.median(frs)))
print('Fr of mean v and mean L: %.3f'%(st.mean(vs)**2/(9.81*st.mean(Ls))))
print('vhat mean %.3f'%st.mean(vhat))
print('L/H mean %.4f sd %.4f'%(st.mean(ratios),st.stdev(ratios)))
# alt: unique gaitspeed per subject  (are speeds per trial or per subject?)
