import sys, numpy as np, pandas as pd
d=sys.argv[1]
for fn in ["ansurMen.csv","ansurWomen.csv"]:
    D=pd.read_csv(f"{d}/{fn}",encoding="latin-1")
    D.columns=[c.strip() for c in D.columns]
    n=D["WAIST_CIRC_NATURAL"]/10; o=D["WAIST_CIRC-OMPHALION"]/10
    bic=[c for c in D.columns if "BICEPS" in c.upper()]
    print(fn,"n",len(D),"weight col sample",D["WEIGHT"].head(3).tolist(),"stature",D["STATURE"].head(3).tolist(), "biceps cols", bic)
    r=n/o
    print("  natural waist median %.1f, omphalion median %.1f cm; ratio nat/omph median %.3f p5 %.3f p95 %.3f; diff median %.1f cm" % (n.median(),o.median(),r.median(),*np.percentile(r,[5,95]),(o-n).median()))
    if bic:
        a=D["ARM_CIRC-AXILLARY"]/10; b=D[bic[0]]/10
        print("  axillary arm (relaxed) median %.1f, flexed biceps median %.1f, ratio flexed/axillary median %.3f" % (a.median(),b.median(),(b/a).median()))
