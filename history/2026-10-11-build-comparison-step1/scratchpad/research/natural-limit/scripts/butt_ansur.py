# Butt's max-LBM formula applied to every ANSUR II man (his own stature, wrist, ankle).
# Reports the spread of predicted FFMI and of S = 1.8*FFM/H^3, by height band.
import csv, sys, math, statistics as st
rows = list(csv.DictReader(open(sys.argv[1], newline='', encoding='latin-1')))
def butt(h_cm, w_cm, a_cm, bf):
    Hi, Wi, Ai = h_cm/2.54, w_cm/2.54, a_cm/2.54
    return Hi**1.5*(math.sqrt(Wi)/22.6670 + math.sqrt(Ai)/17.0104)*(bf/224+1)*0.45359237
def pct(v,p):
    v=sorted(v); k=(len(v)-1)*p/100; f=math.floor(k); c=min(f+1,len(v)-1); return v[f]+(v[c]-v[f])*(k-f)
for bf in (5, 7.5, 10):
    F=[];S=[];byband={}
    for r in rows:
        h=float(r['stature'])/10; w=float(r['wristcircumference'])/10; a=float(r['anklecircumference'])/10
        m=butt(h,w,a,bf); H=h/100
        F.append(m/H**2); S.append(1.8*m/H**3)
        band=int(h//5*5); byband.setdefault(band,[]).append(1.8*m/H**3)
    print('bf %.1f%%: FFMI p5 %.1f p50 %.1f p95 %.1f | S p5 %.1f p50 %.1f p95 %.1f max %.1f' % (bf, pct(F,5),pct(F,50),pct(F,95),pct(S,5),pct(S,50),pct(S,95),max(S)))
    if bf==10:
        for b in sorted(byband):
            if len(byband[b])>=30: print('   height %d-%d cm n=%d: S median %.1f' % (b,b+5,len(byband[b]),st.median(byband[b])))
print('overall-median frame (17.6, 22.8) at 180 cm, 5%%/10%%: %.1f / %.1f kg' % (butt(180,17.6,22.8,5), butt(180,17.6,22.8,10)))
