import sys, numpy as np, pandas as pd
sys.path.insert(0, sys.argv[2])
import svlib
raw=sys.argv[1]
for sex in ["male","female"]:
    d=pd.read_csv(f"{raw}/ansur/{sex}.csv", encoding="latin-1")
    W=d.weightkg.values/10
    V,_=svlib.model(d,"circle"); k=W/V; kb=np.exp(np.mean(np.log(k))); e=np.log(kb*V/W)
    print(sex,"full-input frustum: k=%.1f sd%%=%.2f"%(kb,100*e.std()))
    # calculator-only version: keep stature + 7 girths; replace everything else with mean ratio to stature (lengths) or to a calculator girth
    c=d.copy(); st=d.stature
    lengths=["suprasternaleheight","chestheight","waistheightomphalion","buttockheight","crotchheight","kneeheightmidpatella","tibialheight","lateralmalleolusheight","headlength","headbreadth","shoulderelbowlength","radialestylionlength","handlength","handbreadth","handcircumference","footlength","footbreadthhorizontal"]
    for L in lengths: c[L]=st*(d[L]/st).mean()
    # girth-derived: buttock from waist&thigh (log-linear fit), others from nearest calculator girth ratio
    X=np.column_stack([np.ones(len(d)),np.log(d.waistcircumference),np.log(d.thighcircumference),np.log(st)])
    b,*_=np.linalg.lstsq(X,np.log(d.buttockcircumference),rcond=None); c["buttockcircumference"]=np.exp(X@b)
    for tgt,src in [("lowerthighcircumference","thighcircumference"),("anklecircumference","calfcircumference"),("wristcircumference","forearmcircumferenceflexed"),("neckcircumferencebase","neckcircumference")]:
        c[tgt]=d[src]*(d[tgt]/d[src]).mean()
    V2,_=svlib.model(c,"circle"); k2=W/V2; kb2=np.exp(np.mean(np.log(k2))); e2=np.log(kb2*V2/W)
    print(sex,"7-girth+H frustum (imputed rest): k=%.1f sd%%=%.2f p95abs=%.2f"%(kb2,100*e2.std(),100*np.percentile(np.abs(e2-e2.mean()),95)))
