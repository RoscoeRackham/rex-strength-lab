import sys, numpy as np, pandas as pd
raw=sys.argv[1]
d=pd.read_csv(f"{raw}/ansur/male.csv", encoding="latin-1")
H=d.stature/1000; W=d.weightkg/10
G={"chest":"chestcircumference","waist":"waistcircumference","arm":"bicepscircumferenceflexed","forearm":"forearmcircumferenceflexed","thigh":"thighcircumference","calf":"calfcircumference","neck":"neckcircumference"}
Wr=np.exp(np.log(W).mean()); Hr=np.exp(np.log(H).mean())
bmi=W/H**2; q=pd.qcut(bmi,5,labels=False)
for k,c in G.items():
    g=d[c]/1000; gr=np.exp(np.log(g).mean())
    pred=gr*np.sqrt((W/Wr)/(H/Hr)); e=np.log(g/pred)
    print(k, "sd%%=%.1f"%(100*e.std()), "Q1 bias(pred-obs)%%=%.1f Q5=%.1f"%(-100*e[q==0].mean(), -100*e[q==4].mean()), " obs-pred Q1=%.1f Q5=%.1f"%(100*e[q==0].mean(),100*e[q==4].mean()))
def ram(a,b): return np.pi*(3*(a+b)-np.sqrt((3*a+b)*(a+3*b)))
for nm,dep,br,circ in [("chest","chestdepth","chestbreadth","chestcircumference"),("waist","waistdepth","waistbreadth","waistcircumference"),("buttock","buttockdepth","hipbreadth","buttockcircumference")]:
    if br not in d: print("no",br); continue
    r=(d[dep]/d[br]).mean(); P=ram(d[br]/2,d[dep]/2); print(nm,"d/b=%.3f C/Pell=%.3f"%(r,(d[circ]/P).mean()))
