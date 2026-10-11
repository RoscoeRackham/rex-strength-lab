import sys, json
import numpy as np, pandas as pd
raw = sys.argv[1]
res = {}
G = {"chest":"chestcircumference","waist":"waistcircumference","arm":"bicepscircumferenceflexed",
     "forearm":"forearmcircumferenceflexed","thigh":"thighcircumference","calf":"calfcircumference","neck":"neckcircumference"}
def load(f):
    d = pd.read_csv(f, encoding="latin-1")
    o = pd.DataFrame({"H": d.stature/1000.0, "W": d.weightkg/10.0})
    for k,c in G.items(): o[k] = d[c]/1000.0
    return o
for sex in ["male","female"]:
    d = load(f"{raw}/ansur/{sex}.csv")
    r = {}
    r["n"] = len(d)
    r["mean_H"] = d.H.mean(); r["mean_W"] = d.W.mean(); r["mean_BMI"] = (d.W/d.H**2).mean()
    x = np.log(d.H); y = np.log(d.W)
    c = np.corrcoef(x,y)[0,1]
    ols = np.polyfit(x,y,1)[0]
    r["ols_p"] = ols; r["r"] = c; r["rma_p"] = np.sign(c)*y.std()/x.std()
    # percentiles
    for k in ["H","W","arm","chest","waist"]:
        r[f"pct_{k}"] = {p: float(np.percentile(d[k], p)) for p in [2.5,50,97.5]}
        r[f"max_{k}"] = float(d[k].max()); r[f"min_{k}"]=float(d[k].min())
    r["max_BMI"] = float((d.W/d.H**2).max())
    # girth allometry
    al = {}
    for g in G:
        X = np.column_stack([np.ones(len(d)), np.log(d.W), np.log(d.H)])
        b, *_ = np.linalg.lstsq(X, np.log(d[g]), rcond=None)
        res_ = np.log(d[g]) - X@b
        R2 = 1 - res_.var()/np.log(d[g]).var()
        al[g] = [round(b[1],3), round(b[2],3), round(R2,3), round(100*res_.std(),1)]
    r["allometry"] = al
    # log-linear weight model
    cols = ["chest","waist","arm","forearm","thigh","calf","neck"]
    X = np.column_stack([np.ones(len(d)), np.log(d.H)] + [np.log(d[g]) for g in cols])
    b, *_ = np.linalg.lstsq(X, y, rcond=None)
    r["loglin_coef"] = dict(zip(["const","lnH"]+cols, [round(v,4) for v in b]))
    rr = y - X@b
    r["loglin_insample_sd_pct"] = 100*rr.std()
    # 10-fold CV
    rng = np.random.default_rng(0); idx = rng.permutation(len(d)); folds = np.array_split(idx,10)
    cvres = np.empty(len(d))
    for f in folds:
        tr = np.setdiff1d(idx,f)
        bb,*_ = np.linalg.lstsq(X[tr], y.values[tr], rcond=None)
        cvres[f] = y.values[f] - X[f]@bb
    r["loglin_cv_sd_pct"] = 100*cvres.std(); r["loglin_cv_mae_pct"] = 100*np.abs(cvres).mean()
    r["loglin_cv_p95abs_pct"] = 100*np.percentile(np.abs(cvres),95)
    # Behnke-type: W = k H (sum G)^2
    S = d[cols].sum(axis=1)
    kk = d.W/(d.H*S**2)
    r["behnke_k_geomean"] = float(np.exp(np.log(kk).mean())); r["behnke_sd_pct"] = 100*np.log(kk).std()
    # single chest
    kc = d.W/(d.H*d.chest**2); r["chest_k"] = float(np.exp(np.log(kc).mean())); r["chest_sd_pct"] = 100*np.log(kc).std()
    kw = d.W/(d.H*d.waist**2); r["waist_sd_pct"] = 100*np.log(kw).std()
    # top 2.5% arm holdout
    thr = np.percentile(d.arm, 97.5); m = d.arm >= thr
    bb,*_ = np.linalg.lstsq(X[~m.values], y.values[~m.values], rcond=None)
    e = y.values[m.values] - X[m.values]@bb
    r["top_arm"] = {"n": int(m.sum()), "thr_cm": 100*thr, "mean_W": float(d.W[m].mean()), "mean_BMI": float((d.W/d.H**2)[m].mean()),
                    "bias_pct(pred-obs)": float(-100*e.mean()), "sd_pct": float(100*e.std())}
    bmi = d.W/d.H**2; thr = np.percentile(bmi,97.5); m = bmi>=thr
    bb,*_ = np.linalg.lstsq(X[~m.values], y.values[~m.values], rcond=None)
    e = y.values[m.values] - X[m.values]@bb
    r["top_bmi"] = {"n": int(m.sum()), "thr": float(thr), "bias_pct(pred-obs)": float(-100*e.mean())}
    res[sex] = r
# Penrose / JSE
cols = ["case","bf_brozek","bf_siri","D","age","wt_lb","ht_in","bmi","ffw_lb","neck","chest","abdomen","hip","thigh","knee","ankle","biceps","forearm","wrist"]
j = pd.read_csv(f"{raw}/jse/fat.dat.txt", sep=r"\s+", header=None, names=cols)
res["jse_n_rows"] = len(j)
jj = j[j.case != 42]
H = jj.ht_in*0.0254; W = jj.wt_lb*0.45359237; FFM = jj.ffw_lb*0.45359237
res["jse"] = {"n": len(jj), "D_min": jj.D.min(), "D_max": jj.D.max(), "D_mean": jj.D.mean(),
  "D_p2.5": float(np.percentile(jj.D,2.5)), "D_p97.5": float(np.percentile(jj.D,97.5)),
  "D_min_all": j.D.min(), "D_max_all": j.D.max(),
  "ffmi_mean": float((FFM/H**2).mean()), "ffmi_sd": float((FFM/H**2).std()), "ffmi_min": float((FFM/H**2).min()), "ffmi_max": float((FFM/H**2).max()),
  "age_min": int(jj.age.min()), "age_max": int(jj.age.max())}
i = (FFM/H**2).idxmax(); res["jse"]["ffmi_max_case"] = jj.loc[i, ["case","bf_brozek","bf_siri","wt_lb","ht_in","ffw_lb","abdomen"]].to_dict()
# check doc: ffw consistent with brozek?
res["jse"]["ffw_check_max_absdiff_lb"] = float((jj.ffw_lb - jj.wt_lb*(1-jj.bf_brozek/100)).abs().max())
# FFMI recomputed from W*(1-brozek)
ffm2 = W*(1-jj.bf_brozek/100)
res["jse"]["ffmi_max_from_bf"] = float((ffm2/H**2).max())
print(json.dumps(res, indent=1, default=float))
