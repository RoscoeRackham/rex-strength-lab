import sys, numpy as np, pandas as pd
raw=sys.argv[1]
d=pd.read_csv(f"{raw}/ansur/male.csv", encoding="latin-1")
H=(d.stature/1000).values; W=(d.weightkg/10).values
G={"chest":"chestcircumference","waist":"waistcircumference","arm":"bicepscircumferenceflexed","forearm":"forearmcircumferenceflexed","thigh":"thighcircumference","calf":"calfcircumference","neck":"neckcircumference","wrist":"wristcircumference"}
g={k:(d[c]/1000).values for k,c in G.items()}
cols=["chest","waist","arm","forearm","thigh","calf","neck"]
X=np.column_stack([np.ones(len(d)),np.log(H)]+[np.log(g[c]) for c in cols]); y=np.log(W)
S=sum(g[c] for c in cols)
def test(mask,label):
    b,*_=np.linalg.lstsq(X[~mask],y[~mask],rcond=None); e=X[mask]@b-y[mask]
    k=np.exp(np.mean(np.log(W[~mask]/(H[~mask]*S[~mask]**2)))); eb=np.log(k*H[mask]*S[mask]**2/W[mask])
    print(label,"n=",mask.sum(),"arm=%.1f waist=%.1f"%(100*g['arm'][mask].mean(),100*g['waist'][mask].mean()),"loglin bias(pred-obs)%%=%.2f behnke=%.2f"%(100*e.mean(),100*eb.mean()))
r=g['arm']/g['waist']; test(r>=np.percentile(r,97.5),"vtaper arm/waist")
r=g['chest']/g['waist']; test(r>=np.percentile(r,97.5),"vtaper chest/waist"); test(r<=np.percentile(r,2.5),"potbelly")
# Penrose cross-test with 5 girths
cols5=["neck","chest","waist","thigh","wrist"]
X5=np.column_stack([np.ones(len(d)),np.log(H)]+[np.log(g[c]) for c in cols5])
b,*_=np.linalg.lstsq(X5,y,rcond=None)
cn=['case','bf_brozek','bf_siri','D','age','wt_lb','ht_in','bmi','ffw_lb','neck','chest','abdomen','hip','thigh','knee','ankle','biceps','forearm','wrist']
j=pd.read_csv(f"{raw}/jse/fat.dat.txt",sep=r"\s+",header=None,names=cn); j=j[j.case!=42]
Hj=j.ht_in.values*0.0254; Wj=j.wt_lb.values*0.45359237
Xj=np.column_stack([np.ones(len(j)),np.log(Hj)]+[np.log(j[c].values/100) for c in ["neck","chest","abdomen","thigh","wrist"]])
e=[redacted](Wj); print("Penrose 5-girth: bias%%=%.2f sd%%=%.2f n=%d"%(100*e.mean(),100*e.std(),len(j)))
print("coef5",np.round(b,3))
