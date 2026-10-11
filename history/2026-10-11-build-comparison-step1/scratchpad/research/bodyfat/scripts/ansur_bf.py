import csv,sys,statistics as st
fn=sys.argv[1]
rows=list(csv.DictReader(open(fn,encoding='latin-1')))
print(len(rows)); print([k for k in rows[0].keys() if 'waist' in k.lower() or 'weight' in k.lower() or k.lower() in('stature','age','component','branch')])
bf=[];bf2=[];ffmi=[];S=[]
for r in rows:
    w=float(r['weightkg'])/10; wl=w/0.45359237
    ab=float(r['waistcircumference'])/25.4
    h=float(r['stature'])/1000
    b=-26.97-0.12*wl+1.99*ab
    b2=-27.05-0.12*wl+2.06*ab
    bf.append(b); bf2.append(b2)
    ffm=w*(1-b/100); ffmi.append(ffm/h**2); S.append(1.8*ffm/h**3)
def pct(a,p):
    a=sorted(a); i=(len(a)-1)*p; lo=int(i); return a[lo]+(a[min(lo+1,len(a)-1)]-a[lo])*(i-lo)
for name,a in [('AR one-site %BF',bf),('Taylor 1-site manual %BF',bf2),('FFMI from AR %BF',ffmi),('S=1.8FFM/H^3',S)]:
    print(name,'mean %.1f sd %.1f'%(st.mean(a),st.stdev(a)),' '.join('p%d=%.1f'%(p*100,pct(a,p)) for p in [0.01,0.05,0.10,0.25,0.5,0.75,0.9,0.95,0.99]), 'min %.1f max %.1f'%(min(a),max(a)))
