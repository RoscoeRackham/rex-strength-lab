"""Independent re-fit of the researcher's derived ANSUR II models.
usage: python3 -I check_fits.py <rawdir>
"""
import sys
import numpy as np
import pandas as pd
from scipy.optimize import nnls

raw = sys.argv[1]

def load(fn):
    D = pd.read_csv(f"{raw}/{fn}", encoding="latin-1")
    D.columns = [c.strip().lower() for c in D.columns]
    return D

G = {"chest": "chestcircumference", "waist": "waistcircumference", "biceps": "bicepscircumferenceflexed",
     "forearm": "forearmcircumferenceflexed", "thigh": "thighcircumference", "lthigh": "lowerthighcircumference",
     "calf": "calfcircumference", "neck": "neckcircumference", "wrist": "wristcircumference"}
SEVEN = ["chest", "waist", "biceps", "forearm", "thigh", "calf", "neck"]

def ols(X, y):
    X1 = np.column_stack([np.ones(len(y)), X])
    b, *_ = np.linalg.lstsq(X1, y, rcond=None)
    return b, X1 @ b

for sex, fn in [("M", "ANSUR_II_MALE_Public.csv"), ("F", "ANSUR_II_FEMALE_Public.csv")]:
    D = load(fn)
    W = D.weightkg.values / 10.0
    Hm = D.stature.values / 1000.0
    Hcm = Hm * 100
    g = {k: D[v].values / 10.0 for k, v in G.items()}
    X = np.sqrt(W / Hm)
    print(f"===== {sex} n={len(W)}")
    for k in ["chest", "waist", "biceps", "forearm", "thigh", "lthigh", "calf", "neck", "wrist"]:
        y = g[k]
        kk = (y @ X) / (X @ X)
        r2 = 1 - ((y - kk * X) ** 2).sum() / ((y - y.mean()) ** 2).sum()
        ratio = y / X
        b, fit = ols(np.log(X), np.log(y))
        se = np.sqrt(((np.log(y) - fit) ** 2).sum() / (len(y) - 2) / ((np.log(X) - np.log(X).mean()) ** 2).sum())
        bp, fitp = ols(np.column_stack([np.log(W), np.log(Hm)]), np.log(y))
        rsd = np.std(np.log(y) - fitp, ddof=3)
        print(f"{k:8s} k={kk:.4f} r2={r2:.3f} kp5={np.percentile(ratio,5):.4f} kp95={np.percentile(ratio,95):.4f} b={b[1]:.4f} CI=[{b[1]-1.96*se:.3f},{b[1]+1.96*se:.3f}]  A={np.exp(bp[0]):.4f} p={bp[1]:.4f} q={bp[2]:.4f} rsd={rsd*100:.1f}%")
    # weight regressions
    L = np.column_stack([np.log(Hcm)] + [np.log(g[k]) for k in SEVEN])
    b, fit = ols(L, np.log(W))
    smear = np.mean(np.exp(np.log(W) - fit))
    pred = smear * np.exp(fit)
    rmse = np.sqrt(np.mean((W - pred) ** 2))
    r2 = 1 - ((W - pred) ** 2).sum() / ((W - W.mean()) ** 2).sum()
    print("loglog coef", np.round(b, 5), "smear %.5f rmse %.3f r2 %.4f sumgirth %.3f" % (smear, rmse, r2, b[2:].sum()))
    res = W - pred
    print("loglog resid p5 %.2f p95 %.2f rmse%% %.2f" % (np.percentile(res, 5), np.percentile(res, 95), 100 * np.sqrt(np.mean((res / W) ** 2))))
    # geometric NNLS
    A = np.column_stack([Hm * g[k] ** 2 for k in SEVEN])
    c, _ = nnls(A, W)
    pg = A @ c
    print("geom c", np.round(c, 6), "rmse %.3f r2 %.4f" % (np.sqrt(np.mean((W - pg) ** 2)), 1 - ((W - pg) ** 2).sum() / ((W - W.mean()) ** 2).sum()))
    # linear
    Lin = np.column_stack([Hcm] + [g[k] for k in SEVEN])
    bl, pl = ols(Lin, W)
    print("linear coef", np.round(bl, 5), "rmse %.3f" % np.sqrt(np.mean((W - pl) ** 2)))
    bh, ph = ols(Hcm[:, None], W)
    print("height-only r2 %.4f rmse %.3f" % (1 - ((W - ph) ** 2).sum() / ((W - W.mean()) ** 2).sum(), np.sqrt(np.mean((W - ph) ** 2))))
    # 10-fold CV for loglog
    rng = np.random.default_rng(0)
    idx = rng.permutation(len(W))
    folds = np.array_split(idx, 10)
    errs = []
    for f in folds:
        tr = np.setdiff1d(idx, f)
        bb, ft = ols(L[tr], np.log(W[tr]))
        sm = np.mean(np.exp(np.log(W[tr]) - ft))
        p = sm * np.exp(np.column_stack([np.ones(len(f)), L[f]]) @ bb)
        errs.append(W[f] - p)
    print("loglog cv rmse %.3f" % np.sqrt(np.mean(np.concatenate(errs) ** 2)))
    # extrapolation tests
    for name, key in [("heaviest10", W), ("bigarm10", g["biceps"])]:
        thr = np.percentile(key, 90)
        te = key > thr
        tr = ~te
        out = {}
        bb, ft = ols(L[tr], np.log(W[tr])); sm = np.mean(np.exp(np.log(W[tr]) - ft))
        p = sm * np.exp(np.column_stack([np.ones(te.sum()), L[te]]) @ bb); out["loglog"] = W[te] - p
        cc, _ = nnls(A[tr], W[tr]); out["geom"] = W[te] - A[te] @ cc
        bb, _ = ols(Lin[tr], W[tr]); out["linear"] = W[te] - np.column_stack([np.ones(te.sum()), Lin[te]]) @ bb
        print(name, "n_test", te.sum(), {k: (round(v.mean(), 2), round(np.sqrt(np.mean(v ** 2)), 2)) for k, v in out.items()})
    # frustum volume model
    C = lambda col: D[col].values / 10.0  # cm
    def fr(c1, c2, Lcm):
        return Lcm / (12 * np.pi) * (c1 ** 2 + c1 * c2 + c2 ** 2) / 1000.0  # litres
    st = C("stature"); cerv = C("cervicaleheight"); chh = C("chestheight"); omph = C("waistheightomphalion")
    cro = C("crotchheight"); knee = C("kneeheightmidpatella"); lmal = C("lateralmalleolusheight")
    head = C("headcircumference"); neck = C("neckcircumference"); nb = C("neckcircumferencebase")
    chest = C("chestcircumference"); waist = C("waistcircumference"); butt = C("buttockcircumference")
    th = C("thighcircumference"); lth = C("lowerthighcircumference"); calf = C("calfcircumference"); ank = C("anklecircumference")
    bic = C("bicepscircumferenceflexed"); fa = C("forearmcircumferenceflexed"); wr = C("wristcircumference")
    ar = C("acromionradialelength"); rs = C("radialestylionlength")
    shank = knee - lmal
    parts = {
        "head_neck": fr(neck, head, st - cerv),
        "neck_chest": fr(nb, chest, cerv - chh),
        "chest_waist": fr(chest, waist, chh - omph),
        "waist_crotch": fr(waist, butt, omph - cro),
        "thigh2": 2 * fr(th, lth, cro - knee),
        "shank2": 2 * (fr(0.85 * lth, calf, shank / 3) + fr(calf, ank, 2 * shank / 3)),
        "uarm2": 2 * fr(bic, fa, ar),
        "farm2": 2 * fr(fa, wr, rs),
    }
    V = sum(parts.values())
    ratio = W / V
    kmed = np.median(ratio)
    print("frustum kg/L median %.4f p5 %.4f p95 %.4f sd %.4f; V p5/50/95 %.1f/%.1f/%.1f L; rmse(median k) %.2f; corr ratio-BMI %.3f" % (
        kmed, *np.percentile(ratio, [5, 95]), ratio.std(), *np.percentile(V, [5, 50, 95]), np.sqrt(np.mean((W - kmed * V) ** 2)),
        np.corrcoef(ratio, W / Hm ** 2)[0, 1]))
    print("shares", {k: round(np.median(v / V), 3) for k, v in parts.items()})
    # subgroups
    bmi = W / Hm ** 2
    if sex == "M":
        sg = {"leanheavy": (bmi >= 28) & (g["chest"] - g["waist"] >= 20)}
    else:
        sg = {"leanheavy": (bmi >= 26) & (g["chest"] - g["waist"] >= 15)}
    sg["bigwaist"] = (bmi >= 30) & (g["waist"] / Hcm >= 0.60)
    sg["normalbmi"] = (bmi >= 18.5) & (bmi < 25)
    for nm, m in sg.items():
        print(nm, "n", m.sum(), "W %.1f H %.1f chest %.1f waist %.1f biceps %.1f thigh %.1f calf %.1f; k chest %.3f waist %.3f biceps %.3f" % (
            np.median(W[m]), np.median(Hcm[m]), np.median(g["chest"][m]), np.median(g["waist"][m]), np.median(g["biceps"][m]),
            np.median(g["thigh"][m]), np.median(g["calf"][m]), np.median(g["chest"][m] / X[m]), np.median(g["waist"][m] / X[m]), np.median(g["biceps"][m] / X[m])))
