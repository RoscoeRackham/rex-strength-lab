"""Scaling / allometry checks on measured anthropometric data.

Inputs (passed as paths, read-only):
  argv[1] ANSUR_II_MALE_Public.csv   (https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv)
  argv[2] ANSUR_II_FEMALE_Public.csv (https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv)
  argv[3] fat.dat.txt                (https://jse.amstat.org/datasets/fat.dat.txt; Penrose et al. 1985 data)
  argv[4] output json path

ANSUR II units: lengths/circumferences in mm, weightkg in tenths of kg.
"""
import json
import sys

import numpy as np
import pandas as pd

male_p, female_p, jse_p, out_p = sys.argv[1:5]
rng = np.random.default_rng(12345)

GIRTHS = {
    "chest": "chestcircumference",
    "waist": "waistcircumference",
    "upper_arm_flexed": "bicepscircumferenceflexed",
    "forearm_flexed": "forearmcircumferenceflexed",
    "thigh": "thighcircumference",
    "calf": "calfcircumference",
    "neck": "neckcircumference",
    "hip_buttock": "buttockcircumference",
    "wrist": "wristcircumference",
}


def load_ansur(p):
    d = pd.read_csv(p, encoding="latin-1")
    out = pd.DataFrame()
    out["H"] = d["stature"] / 1000.0
    out["W"] = d["weightkg"] / 10.0
    for k, c in GIRTHS.items():
        out[k] = d[c] / 1000.0
    keep = ["H", "W"] + list(GIRTHS)
    # extra columns for the segmental volume model
    extra = [
        "stature", "suprasternaleheight", "chestheight", "waistheightomphalion", "buttockheight",
        "crotchheight", "kneeheightmidpatella", "tibialheight", "lateralmalleolusheight",
        "chestbreadth", "chestdepth", "waistbreadth", "waistdepth", "hipbreadth", "buttockdepth",
        "chestcircumference", "waistcircumference", "buttockcircumference", "neckcircumference",
        "neckcircumferencebase", "thighcircumference", "lowerthighcircumference", "calfcircumference",
        "anklecircumference", "bicepscircumferenceflexed", "forearmcircumferenceflexed",
        "wristcircumference", "shoulderelbowlength", "radialestylionlength", "handlength",
        "handbreadth", "handcircumference", "footlength", "footbreadthhorizontal", "headlength",
        "headbreadth", "headcircumference", "tragiontopofhead", "mentonsellionlength",
        "cervicaleheight", "axillaheight",
    ]
    for c in extra:
        out["raw_" + c] = d[c] / 1000.0
    return out.dropna(subset=keep).reset_index(drop=True)


def ols(X, y):
    X1 = np.column_stack([np.ones(len(y)), X])
    beta, *_ = np.linalg.lstsq(X1, y, rcond=None)
    resid = y - X1 @ beta
    dof = len(y) - X1.shape[1]
    s2 = resid @ resid / dof
    cov = s2 * np.linalg.inv(X1.T @ X1)
    r2 = 1 - (resid @ resid) / ((y - y.mean()) @ (y - y.mean()))
    return beta, np.sqrt(np.diag(cov)), r2, np.sqrt(s2), resid


def pct(x):
    return float(round(100 * x, 2))


results = {"notes": __doc__}
data = {"male": load_ansur(male_p), "female": load_ansur(female_p)}

# ---------------------------------------------------------------- 1. W vs H
for sex, d in data.items():
    lh, lw = np.log(d.H.values), np.log(d.W.values)
    b, se, r2, s, _ = ols(lh[:, None], lw)
    r = np.corrcoef(lh, lw)[0, 1]
    rma = np.std(lw) / np.std(lh)  # reduced major axis slope
    results[f"{sex}_mass_vs_height"] = {
        "n": int(len(d)), "ols_exponent_p": round(b[1], 3), "se": round(se[1], 3), "r": round(r, 3),
        "rma_exponent": round(rma, 3),
        "bmi_mean": round(float((d.W / d.H**2).mean()), 2),
        "H_mean_m": round(float(d.H.mean()), 4), "W_mean_kg": round(float(d.W.mean()), 2),
    }

# ---------------------------------------------- 2. girth allometry log G = a + b log W + c log H
for sex, d in data.items():
    lh, lw = np.log(d.H.values), np.log(d.W.values)
    tab = {}
    for g in GIRTHS:
        lg = np.log(d[g].values)
        b, se, r2, s, _ = ols(np.column_stack([lw, lh]), lg)
        # geometric-similarity prediction from the sample mean person: G = Gref*sqrt((W/Wref)/(H/Href))
        gm = np.exp(lg.mean() - 0.5 * (lw.mean() - lh.mean()))
        pred_geo = np.log(gm) + 0.5 * (lw - lh)
        res_geo = lg - pred_geo
        # fixed-BMI height exponent: log G = a + c' log H + d log BMI
        lbmi = lw - 2 * lh
        b2, se2, *_ = ols(np.column_stack([lh, lbmi]), lg)
        tab[g] = {
            "exp_W": round(b[1], 3), "se_W": round(se[1], 3),
            "exp_H": round(b[2], 3), "se_H": round(se[2], 3),
            "R2": round(r2, 3), "resid_sd_pct": pct(np.exp(s) - 1),
            "geo_sqrtWoverH_resid_sd_pct": pct(np.exp(res_geo.std()) - 1),
            "geo_bias_by_BMI_quintile_pct": [
                pct(np.exp(res_geo[q].mean()) - 1)
                for q in [lbmi <= np.quantile(lbmi, .2),
                          (lbmi > np.quantile(lbmi, .2)) & (lbmi <= np.quantile(lbmi, .4)),
                          (lbmi > np.quantile(lbmi, .4)) & (lbmi <= np.quantile(lbmi, .6)),
                          (lbmi > np.quantile(lbmi, .6)) & (lbmi <= np.quantile(lbmi, .8)),
                          lbmi > np.quantile(lbmi, .8)]],
            "fixedBMI_exp_H": round(b2[1], 3), "fixedBMI_se_H": round(se2[1], 3),
            "exp_BMI": round(b2[2], 3),
            "mean_cm": round(float(d[g].mean() * 100), 1),
        }
    results[f"{sex}_girth_allometry"] = tab

# ---------------------------------------------- 3. weight from girths
def kfold_loglinear(X, y, k=10):
    idx = rng.permutation(len(y))
    folds = np.array_split(idx, k)
    pred = np.empty_like(y)
    for f in folds:
        tr = np.setdiff1d(idx, f)
        X1 = np.column_stack([np.ones(len(tr)), X[tr]])
        beta, *_ = np.linalg.lstsq(X1, y[tr], rcond=None)
        pred[f] = np.column_stack([np.ones(len(f)), X[f]]) @ beta
    return pred


def err_stats(W, Wp):
    e = Wp / W - 1
    return {"mean_pct": pct(e.mean()), "sd_pct": pct(e.std()), "mae_pct": pct(np.abs(e).mean()),
            "p95_abs_pct": pct(np.quantile(np.abs(e), .95)),
            "rmse_kg": round(float(np.sqrt(((Wp - W) ** 2).mean())), 2)}


CALC_GIRTHS = ["chest", "waist", "upper_arm_flexed", "forearm_flexed", "thigh", "calf", "neck"]
for sex, d in data.items():
    W, H = d.W.values, d.H.values
    out = {}
    # (a) Behnke-type: W = k * H * (sum G)^2 ; k fitted as geometric mean ratio
    S = d[CALC_GIRTHS].sum(axis=1).values
    k = np.exp(np.mean(np.log(W / (H * S**2))))
    out["behnke_type_sum7"] = {"k_kg_per_m3": round(float(k), 3), **err_stats(W, k * H * S**2)}
    # (b) per-girth geometric: W_i = k_i * H * G_i^2 averaged (geometric mean of implied weights)
    implied = []
    for g in CALC_GIRTHS:
        kg = np.exp(np.mean(np.log(W / (H * d[g].values ** 2))))
        implied.append(np.log(kg * H * d[g].values ** 2))
        out[f"single_girth_{g}"] = {"k": round(float(kg), 3), **err_stats(W, kg * H * d[g].values ** 2)}
    Wimp = np.exp(np.mean(implied, axis=0))
    out["mean_of_7_single_girth_estimates"] = err_stats(W, Wimp)
    # (c) log-linear regression on log H + log of 7 girths (10-fold CV)
    X = np.column_stack([np.log(H)] + [np.log(d[g].values) for g in CALC_GIRTHS])
    beta, se, r2, s, _ = ols(X, np.log(W))
    out["loglinear_7girths_H"] = {
        "coef": dict(zip(["const", "log_H"] + ["log_" + g for g in CALC_GIRTHS], [round(x, 4) for x in beta])),
        "sum_of_girth_exponents": round(float(beta[2:].sum()), 3), "R2": round(r2, 4),
        "cv10": err_stats(W, np.exp(kfold_loglinear(X, np.log(W)))),
    }
    results[f"{sex}_weight_from_girths"] = out

# ---------------------------------------------- 4. extrapolation tests
ext = {}
d = data["male"]
W, H = d.W.values, d.H.values
X = np.column_stack([np.log(H)] + [np.log(d[g].values) for g in CALC_GIRTHS])
S = d[CALC_GIRTHS].sum(axis=1).values
# muscularity proxy: flexed upper-arm girth relative to sqrt(W/H) -> select the 2.5% largest arms (absolute)
arm = d["upper_arm_flexed"].values
big = arm >= np.quantile(arm, 0.975)
rest = ~big
X1 = np.column_stack([np.ones(rest.sum()), X[rest]])
beta, *_ = np.linalg.lstsq(X1, np.log(W[rest]), rcond=None)
pred_big = np.exp(np.column_stack([np.ones(big.sum()), X[big]]) @ beta)
k_rest = np.exp(np.mean(np.log(W[rest] / (H[rest] * S[rest] ** 2))))
ext["male_fit_on_rest_test_on_top2.5pct_arm"] = {
    "n_test": int(big.sum()), "arm_threshold_cm": round(float(np.quantile(arm, .975) * 100), 1),
    "test_mean_W": round(float(W[big].mean()), 1), "test_mean_BMI": round(float((W[big] / H[big] ** 2).mean()), 1),
    "loglinear": err_stats(W[big], pred_big),
    "behnke_type": err_stats(W[big], k_rest * H[big] * S[big] ** 2),
}
# heaviest 2.5% by BMI
bmi = W / H**2
hv = bmi >= np.quantile(bmi, 0.975)
X1 = np.column_stack([np.ones((~hv).sum()), X[~hv]])
beta, *_ = np.linalg.lstsq(X1, np.log(W[~hv]), rcond=None)
k_rest = np.exp(np.mean(np.log(W[~hv] / (H[~hv] * S[~hv] ** 2))))
ext["male_fit_on_rest_test_on_top2.5pct_BMI"] = {
    "n_test": int(hv.sum()), "bmi_threshold": round(float(np.quantile(bmi, .975)), 1),
    "loglinear": err_stats(W[hv], np.exp(np.column_stack([np.ones(hv.sum()), X[hv]]) @ beta)),
    "behnke_type": err_stats(W[hv], k_rest * H[hv] * S[hv] ** 2),
}
# cross-sex: fit on women, apply to men (shape-change extrapolation)
f = data["female"]
Xf = np.column_stack([np.log(f.H.values)] + [np.log(f[g].values) for g in CALC_GIRTHS])
beta, *_ = np.linalg.lstsq(np.column_stack([np.ones(len(f)), Xf]), np.log(f.W.values), rcond=None)
Sf = f[CALC_GIRTHS].sum(axis=1).values
kf = np.exp(np.mean(np.log(f.W.values / (f.H.values * Sf**2))))
ext["fit_on_women_apply_to_men"] = {
    "loglinear": err_stats(W, np.exp(np.column_stack([np.ones(len(d)), X]) @ beta)),
    "behnke_type": err_stats(W, kf * H * S**2),
    "k_female": round(float(kf), 3),
}
results["extrapolation_tests"] = ext

# ---------------------------------------------- 5. cross-dataset: ANSUR men -> JSE (Penrose 1985) men
cols = ["case", "bf_brozek", "bf_siri", "density", "age", "weight_lb", "height_in", "bmi", "ffw_lb",
        "neck", "chest", "abdomen", "hip", "thigh", "knee", "ankle", "biceps_ext", "forearm", "wrist"]
j = pd.read_csv(jse_p, sep=r"\s+", header=None, names=cols)
j = j[j.case != 42]  # documented height error (29.5 in)
j["W"] = j.weight_lb * 0.45359237
j["H"] = j.height_in * 0.0254
jres = {"n": int(len(j)),
        "density_min": float(j.density.min()), "density_max": float(j.density.max()),
        "density_mean": round(float(j.density.mean()), 4),
        "density_p2_5": round(float(j.density.quantile(.025)), 4),
        "density_p97_5": round(float(j.density.quantile(.975)), 4),
        }
# Siri vs Brozek check from density
siri = 495 / j.density - 450
broz = 457 / j.density - 414.2
jres["siri_minus_brozek_pctpoints_at_density"] = {
    str(D): round(float((495 / D - 450) - (457 / D - 414.2)), 2) for D in [1.00, 1.03, 1.06, 1.09, 1.10]}
jres["siri_recomputed_vs_file_maxabs"] = round(float((siri.clip(lower=0) - j.bf_siri).abs().drop([47, 75, 95], errors="ignore").max()), 2)
# FFMI distribution (Brozek FFM)
ffm = j.ffw_lb * 0.45359237
ffmi = ffm / j.H**2
jres["ffmi_brozek"] = {"mean": round(float(ffmi.mean()), 2), "sd": round(float(ffmi.std()), 2),
                       "min": round(float(ffmi.min()), 2), "max": round(float(ffmi.max()), 2)}
# allometry of JSE girths on W and H
alo = {}
for g in ["neck", "chest", "abdomen", "hip", "thigh", "biceps_ext", "forearm", "wrist", "knee", "ankle"]:
    b, se, r2, s, _ = ols(np.column_stack([np.log(j.W), np.log(j.H)]), np.log(j[g].values))
    alo[g] = {"exp_W": round(b[1], 3), "se_W": round(se[1], 3), "exp_H": round(b[2], 3), "se_H": round(se[2], 3),
              "R2": round(r2, 3)}
jres["girth_allometry"] = alo
# cross-dataset weight prediction with common girths: neck, chest, waist~abdomen, thigh, wrist (+H)
common_ans = ["neck", "chest", "waist", "thigh", "wrist"]
common_jse = ["neck", "chest", "abdomen", "thigh", "wrist"]
Xa = np.column_stack([np.log(d.H.values)] + [np.log(d[g].values) for g in common_ans])
beta, se, r2, s, _ = ols(Xa, np.log(d.W.values))
Xj = np.column_stack([np.log(j.H.values)] + [np.log(j[g].values / 100.0) for g in common_jse])
pj = np.exp(np.column_stack([np.ones(len(j)), Xj]) @ beta)
Sa = d[common_ans].sum(axis=1).values
ka = np.exp(np.mean(np.log(d.W.values / (d.H.values * Sa**2))))
Sj = (j[common_jse].sum(axis=1).values / 100.0)
jres["ansur_fit_applied_to_jse"] = {
    "girths": "neck, chest, waist(omphalion)/abdomen(umbilicus), thigh, wrist + stature",
    "ansur_in_sample_resid_sd_pct": pct(np.exp(s) - 1),
    "loglinear": err_stats(j.W.values, pj),
    "behnke_type": {"k": round(float(ka), 3), **err_stats(j.W.values, ka * j.H.values * Sj**2)},
}
results["jse_penrose1985"] = jres

json.dump(results, open(out_p, "w"), indent=1)
print(json.dumps(results, indent=1)[:200])
