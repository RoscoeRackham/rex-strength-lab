"""Bias of three weight-from-girth estimators in the most V-shaped / most 'muscular-looking' ANSUR II subjects.
argv[1] male csv, argv[2] female csv, argv[3] out json. Imports model() from segment_volume.py (same dir)."""
import json, sys, os
import numpy as np, pandas as pd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib.util
spec = importlib.util.spec_from_file_location("sv", os.path.join(os.path.dirname(os.path.abspath(__file__)), "segment_volume_lib.py"))
sv = importlib.util.module_from_spec(spec); spec.loader.exec_module(sv)
G7 = ["chestcircumference","waistcircumference","bicepscircumferenceflexed","forearmcircumferenceflexed","thighcircumference","calfcircumference","neckcircumference"]
res = {}
for sex, p in [("male", sys.argv[1]), ("female", sys.argv[2])]:
    d = pd.read_csv(p, encoding="latin-1")
    W = d.weightkg.values/10; H = d.stature.values/1000
    G = d[G7].values/1000
    V, _ = sv.model(d, "circle")
    k = np.exp(np.mean(np.log(W/V)))
    S = G.sum(1); kb = np.exp(np.mean(np.log(W/(H*S**2))))
    X = np.column_stack([np.ones(len(W)), np.log(H), np.log(G)])
    beta, *_ = np.linalg.lstsq(X, np.log(W), rcond=None)
    est = {"frustum_circle": k*V, "behnke_type": kb*H*S**2, "loglinear": np.exp(X@beta)}
    groups = {
      "top2.5pct_chest_over_waist": d.chestcircumference/d.waistcircumference >= (d.chestcircumference/d.waistcircumference).quantile(.975),
      "top2.5pct_arm_over_waist": d.bicepscircumferenceflexed/d.waistcircumference >= (d.bicepscircumferenceflexed/d.waistcircumference).quantile(.975),
      "bottom2.5pct_chest_over_waist": d.chestcircumference/d.waistcircumference <= (d.chestcircumference/d.waistcircumference).quantile(.025),
    }
    r = {}
    for g, sel in groups.items():
        sel = sel.values
        r[g] = {"n": int(sel.sum()), "mean_W": round(float(W[sel].mean()),1), "mean_BMI": round(float((W/H**2)[sel].mean()),1),
                "mean_chest_cm": round(float(d.chestcircumference[sel].mean()/10),1), "mean_waist_cm": round(float(d.waistcircumference[sel].mean()/10),1),
                "mean_arm_cm": round(float(d.bicepscircumferenceflexed[sel].mean()/10),1)}
        for e, Wp in est.items():
            r[g][e+"_bias_pct"] = round(float(100*(Wp[sel]/W[sel]-1).mean()),2)
    res[sex] = r
json.dump(res, open(sys.argv[3], "w"), indent=1); print(json.dumps(res, indent=1))
