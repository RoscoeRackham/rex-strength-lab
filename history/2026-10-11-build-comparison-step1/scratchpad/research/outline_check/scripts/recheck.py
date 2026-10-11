import csv, sys, math
import numpy as np
p = sys.argv[1]
rows = list(csv.DictReader(open(p, newline='', encoding='latin-1')))
N = len(rows)
def c(n): return np.array([float(r[n]) for r in rows])
S = c('stature'); W = c('weightkg')/10; BMI = W/(S/1000)**2
def q(x): x=np.asarray(x); return [round(float(np.percentile(x,k)),4) for k in (50,5,95)]
print('N', N, 'stature p50', np.median(S), 'weight p50', np.median(W), 'BMI range', BMI.min(), BMI.max())
print('--- heights/stature [p50,p5,p95]')
for h in ['cervicaleheight','suprasternaleheight','acromialheight','axillaheight','chestheight','tenthribheight','waistheightomphalion','iliocristaleheight','buttockheight','trochanterionheight','crotchheight','kneeheightmidpatella','lateralfemoralepicondyleheight','tibialheight','lateralmalleolusheight','wristheight']:
    x=c(h); print(h, q(x/S), 'p50mm', np.median(x), 'sd', round(float(np.std(x/S,ddof=1)),4))
print('fingertip', q((c('wristheight')-c('handlength'))/S))
print('tragion', q((S-c('tragiontopofhead'))/S), 'tragiontop/S', q(c('tragiontopofhead')/S), 'p50mm', np.median(c('tragiontopofhead')))
print('--- dims/stature')
for d in ['biacromialbreadth','bideltoidbreadth','chestbreadth','chestdepth','waistbreadth','waistdepth','hipbreadth','buttockdepth','headbreadth','headlength','handlength','palmlength','handbreadth','footlength','footbreadthhorizontal','bimalleolarbreadth','heelbreadth','acromionradialelength','radialestylionlength','span','bizygomaticbreadth','mentonsellionlength']:
    x=c(d); print(d, q(x/S), 'p50mm', np.median(x))
def ram(B,D):
    a=B/2;b=D/2;h=((a-b)/(a+b))**2
    return math.pi*(a+b)*(1+3*h/(10+np.sqrt(4-3*h)))
qs=np.percentile(BMI,[0,20,40,60,80,100]); print('BMI quintile edges', np.round(qs,1))
def quint(z):
    m=[]
    for i in range(5):
        mm=(BMI>=qs[i])&((BMI<=qs[i+1]) if i==4 else (BMI<qs[i+1])); m.append(mm)
    return m
Q=quint(BMI)
print('--- ellipse')
for k,(b,d,g) in {'chest':('chestbreadth','chestdepth','chestcircumference'),'waist':('waistbreadth','waistdepth','waistcircumference'),'buttock':('hipbreadth','buttockdepth','buttockcircumference'),'head':('headbreadth','headlength','headcircumference')}.items():
    B,D,G=c(b),c(d),c(g); r=G/ram(B,D)
    print(k,'mean',round(r.mean(),4),'sd',round(r.std(ddof=1),4),'p5/50/95',q(r)[1],q(r)[0],q(r)[2],'min',round(r.min(),4),'within5',round(float(np.mean(abs(r-1)<=0.05)),4))
    print('  by BMI quint mean ratio',[round(float(r[m].mean()),3) for m in Q])
    print('  d/b p50', round(float(np.median(D/B)),3),'mean',round(float(np.mean(D/B)),3))
    print('  b/g p50',round(float(np.median(B/G)),3),'d/g p50',round(float(np.median(D/G)),3))
    print('  b/g by quint (median)',[round(float(np.median((B/G)[m])),3) for m in Q])
    print('  d/g by quint (median)',[round(float(np.median((D/G)[m])),3) for m in Q])
    # fit
    A=np.vstack([np.ones(N),BMI]).T; co,*_=np.linalg.lstsq(A,r,rcond=None); pr=A@co
    print('  slope/BMI',round(co[1],5),'r2',round(1-((r-pr)**2).sum()/((r-r.mean())**2).sum(),3))
    # effective breadth
    lo=np.ones(N); hi=np.full(N,5000.)
    for _ in range(80):
        mid=(lo+hi)/2; s=ram(mid,D)<G; lo=np.where(s,mid,lo); hi=np.where(s,hi,mid)
    be=(lo+hi)/2
    print('  eff breadth/girth p50',round(float(np.median(be/G)),3),'eff/caliper',q(be/B))
print('--- shoulders')
print('half(bidelt-biacr) mm', q((c('bideltoidbreadth')-c('biacromialbreadth'))/2))
print('half(bidelt-chestb) mm', q((c('bideltoidbreadth')-c('chestbreadth'))/2))
print('bidelt/shouldercirc', q(c('bideltoidbreadth')/c('shouldercircumference')))
print('--- joint centres')
AR=c('acromionradialelength'); TRO=c('trochanterionheight'); TIB=c('tibialheight'); AH=c('acromialheight')
print('AR p50',np.median(AR),'RS p50',np.median(c('radialestylionlength')))
sj=AH-0.104*AR; ej=AH-AR+0.0431*AR; hj=TRO+0.0071*(TRO-TIB); kj=TIB+0.0739*(TRO-TIB); wj=c('wristheight')-0.006*c('radialestylionlength')
for n,x in [('shoulder',sj),('elbow',ej),('wrist',wj),('hip',hj),('knee',kj)]: print(n,q(x/S))
print('sh below acr mm',q(0.104*AR),'hip above tro',q(0.0071*(TRO-TIB)),'knee above tib',q(0.0739*(TRO-TIB)),'knee-LFE',q(kj-c('lateralfemoralepicondyleheight')))
print('TRO-TIB p50', np.median(TRO-TIB))
print('--- head')
R=238.7/138.6; hh=c('tragiontopofhead')*R
print('ratio',R,'hh mm',q(hh),'hh/S',q(hh/S),'heads',q(S/hh),'chin/S',q((S-hh)/S),'chin-cerv',q(S-hh-c('cervicaleheight')))
print('head l/b', q(c('headlength')/c('headbreadth')))
