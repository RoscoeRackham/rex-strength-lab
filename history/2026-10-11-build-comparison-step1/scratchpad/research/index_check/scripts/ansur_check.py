import csv, sys, math, statistics as st
path = sys.argv[1]
H=[];W=[]
with open(path, newline='', encoding='latin-1') as f:
    r = csv.DictReader(f)
    for d in r:
        H.append(int(d['stature'])/1000); W.append(int(d['weightkg'])/10)
n=len(H); print('n',n,'H range',min(H),max(H),'W range',min(W),max(W), 'mean H',st.mean(H),'mean W',st.mean(W))
def ols(x,y):
    mx,my=st.mean(x),st.mean(y); sxx=sum((a-mx)**2 for a in x); syy=sum((b-my)**2 for b in y); sxy=sum((a-mx)*(b-my) for a,b in zip(x,y))
    return sxy/sxx, sxy/math.sqrt(sxx*syy)
lH=[math.log(h) for h in H]
bmi=[w/h**2 for h,w in zip(H,W)]; s=[1.8*w/h**3 for h,w in zip(H,W)]
print('slope lnBMI~lnH',ols(lH,[math.log(v) for v in bmi]))
print('slope lnS~lnH',ols(lH,[math.log(v) for v in s]))
print('r S vs lnH', ols(lH,s)[1], 'r S vs H', ols(H,s)[1])
print('OLS lnW~lnH', ols(lH,[math.log(w) for w in W]))
b,r=ols(lH,[math.log(w) for w in W]); print('RMA', b/r)
idx=sorted(range(n),key=lambda i:H[i])
for lo,hi in [(0,.1),(.45,.55),(.9,1)]:
    seg=idx[int(lo*n):int(hi*n)]
    print(lo,hi,len(seg),'medH %.4f medBMI %.3f medS %.3f meanS %.3f'%(st.median(H[i] for i in seg),st.median(bmi[i] for i in seg),st.median(s[i] for i in seg),st.mean(s[i] for i in seg)))
# ties check: how sorting handles ties at boundaries
# deciles by weight (reverse regression), to show binning dependence
idxw=sorted(range(n),key=lambda i:W[i])
for lo,hi in [(0,.1),(.9,1)]:
    seg=idxw[int(lo*n):int(hi*n)]
    print('by weight',lo,hi,'medH %.3f medW %.1f medBMI %.2f medS %.2f'%(st.median(H[i] for i in seg),st.median(W[i] for i in seg),st.median(bmi[i] for i in seg),st.median(s[i] for i in seg)))
# BMI-matched comparison: men with BMI 26-28.5 in shortest vs tallest decile
for lo,hi in [(0,.1),(.9,1)]:
    seg=[i for i in idx[int(lo*n):int(hi*n)] if 26<=bmi[i]<=28.5]
    print('BMI 26-28.5 band',lo,hi,len(seg),'medS %.2f'%st.median(s[i] for i in seg))
