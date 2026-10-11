import csv,sys,math,statistics as st
LB=0.45359237
def butt_lb(Hi,Wi,Ai,bf): return Hi**1.5*(math.sqrt(Wi)/22.6670+math.sqrt(Ai)/17.0104)*(bf/224+1)
for h in (68,70,72):
    m=butt_lb(h,7,8.75,10); print(h,"in: LBM",round(m,1),"lb; weight at 10%",round(m/0.9,1))
def butt_kg(hcm,wcm,acm,bf): return butt_lb(hcm/2.54,wcm/2.54,acm/2.54,bf)*LB
rows=list(csv.DictReader(open(sys.argv[1],newline='',encoding='latin-1')))
print("n",len(rows), "weightkg sample", rows[0]['weightkg'], "stature", rows[0]['stature'])
def pct(v,p):
    v=sorted(v);k=(len(v)-1)*p/100;f=math.floor(k);c=min(f+1,len(v)-1);return v[f]+(v[c]-v[f])*(k-f)
band=[r for r in rows if 1750<=float(r['stature'])<=1850]
band2=[r for r in rows if 1750<=float(r['stature'])<1850]
for b,nm in ((band,'175-185 incl'),(band2,'175-<185')):
    W=[float(r['wristcircumference'])/10 for r in b]; A=[float(r['anklecircumference'])/10 for r in b]
    print(nm,"n",len(b),"median wrist",st.median(W),"ankle",st.median(A),"p5/p95 wrist",pct(W,5),pct(W,95),"ankle",pct(A,5),pct(A,95))
W=[float(r['wristcircumference'])/10 for r in band]; A=[float(r['anklecircumference'])/10 for r in band]
mw,ma=st.median(W),st.median(A)
for bf in (5,10):
    m=butt_kg(180,mw,ma,bf); print("180cm median frame bf",bf,"LBM",round(m,2),"FFMI",round(m/3.24,2))
print("p5 frame 5%:",round(butt_kg(180,pct(W,5),pct(A,5),5)/3.24,2),"p95 frame 10%:",round(butt_kg(180,pct(W,95),pct(A,95),10)/3.24,2))
# per-man frame percentile combos (predicted FFMI at 180 across band men)
for bf in (5,10):
    P=[butt_kg(180,float(r['wristcircumference'])/10,float(r['anklecircumference'])/10,bf)/3.24 for r in band]
    print(" per-man at 180 bf",bf,"p5",round(pct(P,5),2),"p50",round(pct(P,50),2),"p95",round(pct(P,95),2))
for bf in (5,10):
    F=[];S=[];bb={}
    for r in rows:
        h=float(r['stature'])/10;m=butt_kg(h,float(r['wristcircumference'])/10,float(r['anklecircumference'])/10,bf);H=h/100
        F.append(m/H/H);S.append(1.8*m/H**3);bb.setdefault(int(h//5*5),[]).append(1.8*m/H**3)
    print("all bf",bf,"FFMI p5",round(pct(F,5),2),"p50",round(pct(F,50),2),"p95",round(pct(F,95),2))
    if bf==10:
        for k in (155,190): print("  band",k,len(bb[k]),round(st.median(bb[k]),2))
# girths
H=180/2.54;Wi=mw/2.54;Ai=ma/2.54
g=dict(chest=1.625*Wi+1.3682*Ai+0.3562*H,biceps=1.1709*Wi+0.1350*H,forearm=0.950*Wi+0.1041*H,neck=1.1875*Wi+0.1301*H,thigh=1.4737*Ai+0.1918*H,calf=0.9812*Ai+0.1250*H)
print({k:round(v*2.54,1) for k,v in g.items()})
# ANSUR median man S
Hs=[float(r['stature'])/1000 for r in rows];Ws=[float(r['weightkg'])/10 for r in rows]
print("median H",st.median(Hs),"median W",st.median(Ws))
for bf in (0.15,0.20):
    S=[1.8*w*(1-bf)/h**3 for h,w in zip(Hs,Ws)]; print("ANSUR S median at bf",bf,round(st.median(S),2))
    Sm=1.8*st.median(Ws)*(1-bf)/st.median(Hs)**3; print("  S of median H/W",round(Sm,2))
