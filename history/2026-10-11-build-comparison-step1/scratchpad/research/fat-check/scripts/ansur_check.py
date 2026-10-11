import csv,sys,statistics as st
fn=sys.argv[1]
rows=list(csv.DictReader(open(fn,encoding='latin-1')))
print('n',len(rows))
print('sample weightkg',[r['weightkg'] for r in rows[:5]],'waist',[r['waistcircumference'] for r in rows[:5]],'stature',[r['stature'] for r in rows[:5]])
def pct(a,p):
    a=sorted(a); i=(len(a)-1)*p; lo=int(i); return a[lo]+(a[min(lo+1,len(a)-1)]-a[lo])*(i-lo)
out={}
for r in rows:
    w=float(r['weightkg'])/10; wl=w*2.2046226218
    ab=float(r['waistcircumference'])/25.4
    h=float(r['stature'])/1000
    for nm,(a,bw,bab) in {'AD':(-26.97,-0.12,1.99),'T1':(-27.05,-0.12,2.06)}.items():
        b=a+bw*wl+bab*ab
        out.setdefault(nm,[]).append(b)
        ffm=w*(1-b/100)
        out.setdefault(nm+'_FFMI',[]).append(ffm/h**2)
        out.setdefault(nm+'_S',[]).append(1.8*ffm/h**3)
    out.setdefault('BMI',[]).append(w/h**2)
    out.setdefault('S_at15',[]).append(1.8*w*0.85/h**3)
    out.setdefault('S_at24',[]).append(1.8*w*0.76/h**3)
    out.setdefault('H',[]).append(h); out.setdefault('W',[]).append(w)
for k,a in out.items():
    print(k,'mean %.2f sd %.2f'%(st.mean(a),st.stdev(a)),' '.join('p%d=%.2f'%(p*100,pct(a,p)) for p in [0.01,0.05,0.10,0.25,0.5,0.75,0.9,0.95,0.99]),'min %.2f max %.2f'%(min(a),max(a)))
# median man: median height & weight
H=st.median(out['H']); W=st.median(out['W'])
print('median H',H,'median W',W)
for bf in [0.15,0.20,0.24,0.243,0.28]:
    print('bf',bf,'S %.2f FFMI %.2f'%(1.8*W*(1-bf)/H**3, W*(1-bf)/H**2))
# what bf gives S=24 for median-ish man
import math
print('bf for S=24 at median H,W: %.3f'%(1-24*H**3/(1.8*W)))
