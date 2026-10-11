# Seated arm abduction angle implied by forearm-forearm breadth (ANSUR II men).
# Posture (TR-11-017 sec 6.1.2): upper arms hanging loosely at the sides, elbows flexed 90 deg, palms in.
import csv, sys, math, statistics as st
rows = list(csv.DictReader(open(sys.argv[1], encoding='latin-1')))
def g(r,k): return float(r[k])/1000
def pct(v,p):
    s=sorted(v); k=(len(s)-1)*p; f=math.floor(k); c=math.ceil(k); return s[f]+(s[c]-s[f])*(k-f)
res=[]
for delta in (0.015,0.02,0.03):
    th=[]
    for r in rows:
        xgh = g(r,'biacromialbreadth')/2 - delta
        rfa = g(r,'forearmcircumferenceflexed')/(2*math.pi)
        xe = g(r,'forearmforearmbreadth')/2 - rfa
        U = g(r,'acromionradialelength') - 0.03
        s = (xe - xgh)/U
        th.append(math.degrees(math.asin(max(-1,min(1,s)))))
    print(f"delta={delta}: theta p5 {pct(th,.05):.1f} p50 {pct(th,.5):.1f} p95 {pct(th,.95):.1f} p99 {pct(th,.99):.1f} max {max(th):.1f} min {min(th):.1f}")
    if delta==0.02: res=th
bmi=[float(r['weightkg'])/10/(g(r,'stature')**2) for r in rows]
bic=[g(r,'bicepscircumferenceflexed') for r in rows]
def corr(a,b):
    ma,mb=st.mean(a),st.mean(b); sa,sb=st.pstdev(a),st.pstdev(b)
    return sum((x-ma)*(y-mb) for x,y in zip(a,b))/len(a)/sa/sb
print("corr(theta, BMI) =", round(corr(res,bmi),2), " corr(theta, biceps flexed) =", round(corr(res,bic),2))
for lo,hi in ((0,25),(25,30),(30,35),(35,99)):
    t=[x for x,b in zip(res,bmi) if lo<=b<hi]
    print(f"BMI {lo}-{hi}: n={len(t)} median theta {st.median(t):.1f}  p95 {pct(t,.95):.1f}")
i=max(range(len(res)),key=lambda i:res[i]); r=rows[i]
print("max-theta subject: BMI %.1f weight %.1f kg stature %.3f biceps %.3f FFB %.3f biacromial %.3f theta %.1f" % (bmi[i], float(r['weightkg'])/10, g(r,'stature'), bic[i], g(r,'forearmforearmbreadth'), g(r,'biacromialbreadth'), res[i]))
# subjects with the largest arms
idx=sorted(range(len(rows)),key=lambda i:-bic[i])[:10]
print("top-10 flexed biceps: theta values", [round(res[i],1) for i in idx], "BMI", [round(bmi[i],1) for i in idx])
