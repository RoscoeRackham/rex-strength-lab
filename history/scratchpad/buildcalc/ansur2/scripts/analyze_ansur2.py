#!/usr/bin/env python3
"""ANSUR II (US Army 2012) baselines for the build calculator.

Reads the public working databases (Penn State OPEN Design Lab mirror) and writes:
  out/descriptives.csv         percentiles / means per sex
  out/segments.csv             segment lengths and breadths per sex
  out/fits.json                all fitted coefficients + fit statistics
  out/report.txt               human-readable summary
Units: CSV is mm, weightkg is kg*10 (per the NSRDEC memorandum 14 Apr 2017).
"""
import json, sys, os
import numpy as np
import pandas as pd
from scipy import optimize, stats

RAW = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)

files = {"male": "ANSUR_II_MALE_Public.csv", "female": "ANSUR_II_FEMALE_Public.csv"}

GIRTHS = {
    "chest": "chestcircumference",
    "waist_omphalion": "waistcircumference",
    "biceps_flexed": "bicepscircumferenceflexed",
    "forearm_flexed": "forearmcircumferenceflexed",
    "thigh_upper": "thighcircumference",
    "thigh_lower": "lowerthighcircumference",
    "calf": "calfcircumference",
    "neck": "neckcircumference",
    "neck_base": "neckcircumferencebase",
    "wrist": "wristcircumference",
    "ankle": "anklecircumference",
    "buttock_hip": "buttockcircumference",
    "shoulder": "shouldercircumference",
    "head": "headcircumference",
}
CORE7 = ["chest", "waist_omphalion", "biceps_flexed", "forearm_flexed", "thigh_upper", "calf", "neck"]

LENGTHS = {
    "stature": "stature",
    "cervicale_height": "cervicaleheight",
    "acromial_height": "acromialheight",
    "suprasternale_height": "suprasternaleheight",
    "chest_height": "chestheight",
    "axilla_height": "axillaheight",
    "tenth_rib_height": "tenthribheight",
    "waist_height_omphalion": "waistheightomphalion",
    "iliocristale_height": "iliocristaleheight",
    "trochanterion_height": "trochanterionheight",
    "buttock_height": "buttockheight",
    "crotch_height": "crotchheight",
    "knee_height_midpatella": "kneeheightmidpatella",
    "lateral_femoral_epicondyle_height": "lateralfemoralepicondyleheight",
    "tibiale_height": "tibialheight",
    "lateral_malleolus_height": "lateralmalleolusheight",
    "wrist_height": "wristheight",
    "sitting_height": "sittingheight",
    "span": "span",
    "acromion_radiale_len_upperarm": "acromionradialelength",
    "radiale_stylion_len_forearm": "radialestylionlength",
    "shoulder_elbow_len": "shoulderelbowlength",
    "hand_length": "handlength",
    "foot_length": "footlength",
    "head_length": "headlength",
    "head_breadth": "headbreadth",
    "tragion_top_of_head": "tragiontopofhead",
    "biacromial_breadth": "biacromialbreadth",
    "bideltoid_breadth": "bideltoidbreadth",
    "chest_breadth": "chestbreadth",
    "chest_depth": "chestdepth",
    "waist_breadth": "waistbreadth",
    "waist_depth": "waistdepth",
    "hip_breadth": "hipbreadth",
    "buttock_depth": "buttockdepth",
}

PCTS = [1, 5, 25, 50, 75, 95, 99]


def load(sex):
    df = pd.read_csv(os.path.join(RAW, files[sex]), encoding="latin-1")
    df.columns = [c.lower() for c in df.columns]
    d = pd.DataFrame(index=df.index)
    d["stature_cm"] = df["stature"] / 10.0
    d["weight_kg"] = df["weightkg"] / 10.0
    for k, c in GIRTHS.items():
        d[k + "_cm"] = df[c] / 10.0
    for k, c in LENGTHS.items():
        d["L_" + k + "_cm"] = df[c] / 10.0
    d["age"] = df["age"]
    d["heightin_selfrep"] = df["heightin"]
    d["weightlbs_selfrep"] = df["weightlbs"]
    d["bmi"] = d.weight_kg / (d.stature_cm / 100) ** 2
    return d


def desc(x):
    x = np.asarray(x, float)
    x = x[np.isfinite(x)]
    r = {"n": int(x.size), "mean": float(x.mean()), "sd": float(x.std(ddof=1)),
         "min": float(x.min()), "max": float(x.max())}
    for p in PCTS:
        r[f"p{p}"] = float(np.percentile(x, p))
    return r


def ols(X, y):
    """OLS with intercept column already in X. Returns dict of stats."""
    n, k = X.shape
    beta, *_ = np.linalg.lstsq(X, y, rcond=None)
    yhat = X @ beta
    res = y - yhat
    sse = float(res @ res)
    sst = float(((y - y.mean()) ** 2).sum())
    s2 = sse / (n - k)
    cov = s2 * np.linalg.inv(X.T @ X)
    se = np.sqrt(np.diag(cov))
    return {"beta": beta, "se": se, "r2": 1 - sse / sst, "adj_r2": 1 - (sse / (n - k)) / (sst / (n - 1)),
            "see": float(np.sqrt(s2)), "res": res, "yhat": yhat, "n": n, "k": k}


def kfold_idx(n, k=10, seed=12345):
    rng = np.random.default_rng(seed)
    idx = rng.permutation(n)
    return np.array_split(idx, k)


def cv_rmse(fit_predict, n, k=10):
    errs = np.empty(n)
    for fold in kfold_idx(n, k):
        train = np.setdiff1d(np.arange(n), fold)
        errs[fold] = fit_predict(train, fold)
    return errs


def scaling_fits(d):
    """Girth vs X = sqrt(W/H), W kg, H m."""
    W = d.weight_kg.values
    H = d.stature_cm.values / 100.0
    X = np.sqrt(W / H)
    out = {}
    for g in GIRTHS:
        if g in ("head", "shoulder"):
            pass
        G = d[g + "_cm"].values
        # (1) proportional, through origin: G = k X
        k_ls = float((G @ X) / (X @ X))
        res = G - k_ls * X
        sst = ((G - G.mean()) ** 2).sum()
        r2_prop = 1 - (res @ res) / sst
        kk = G / X
        # (2) free power law: ln G = ln a + b ln X
        f2 = ols(np.column_stack([np.ones_like(X), np.log(X)]), np.log(G))
        a2, b2 = np.exp(f2["beta"][0]), f2["beta"][1]
        # back-transformed RMSE in cm
        pred2 = a2 * X ** b2
        rmse2 = float(np.sqrt(np.mean((G - pred2) ** 2)))
        # (3) allometric two-predictor: ln G = c + p ln W + q ln H
        f3 = ols(np.column_stack([np.ones_like(X), np.log(W), np.log(H)]), np.log(G))
        out[g] = {
            "proportional_k_cm_per_sqrt_kg_per_m": round(k_ls, 4),
            "proportional_r2": round(float(r2_prop), 4),
            "proportional_rmse_cm": round(float(np.sqrt(np.mean(res ** 2))), 3),
            "proportional_rmse_pct": round(float(np.sqrt(np.mean((res / G) ** 2)) * 100), 2),
            "per_subject_k_p5_p50_p95": [round(float(np.percentile(kk, p)), 4) for p in (5, 50, 95)],
            "per_subject_k_mean_sd": [round(float(kk.mean()), 4), round(float(kk.std(ddof=1)), 4)],
            "powerlaw_a": round(float(a2), 4),
            "powerlaw_b": round(float(b2), 4),
            "powerlaw_b_se": round(float(f2["se"][1]), 4),
            "powerlaw_b_95ci": [round(float(b2 - 1.96 * f2["se"][1]), 4), round(float(b2 + 1.96 * f2["se"][1]), 4)],
            "powerlaw_r2_log": round(float(f2["r2"]), 4),
            "powerlaw_see_log": round(float(f2["see"]), 4),
            "powerlaw_rmse_cm": round(rmse2, 3),
            "allometric_lnG_c": round(float(f3["beta"][0]), 4),
            "allometric_exp_W": round(float(f3["beta"][1]), 4),
            "allometric_exp_W_se": round(float(f3["se"][1]), 4),
            "allometric_exp_H": round(float(f3["beta"][2]), 4),
            "allometric_exp_H_se": round(float(f3["se"][2]), 4),
            "allometric_r2_log": round(float(f3["r2"]), 4),
            "allometric_see_log": round(float(f3["see"]), 4),
        }
    return out


def weight_models(d):
    W = d.weight_kg.values
    Hc = d.stature_cm.values
    G = np.column_stack([d[g + "_cm"].values for g in CORE7])
    n = len(W)
    results = {}

    def summarize(name, pred_insample, cv_err, extra):
        res = W - pred_insample
        sst = ((W - W.mean()) ** 2).sum()
        results[name] = dict(extra)
        results[name].update({
            "r2": round(float(1 - (res @ res) / sst), 4),
            "rmse_kg": round(float(np.sqrt(np.mean(res ** 2))), 3),
            "mae_kg": round(float(np.mean(np.abs(res))), 3),
            "rmse_pct": round(float(np.sqrt(np.mean((res / W) ** 2)) * 100), 2),
            "resid_p5_p95_kg": [round(float(np.percentile(res, 5)), 2), round(float(np.percentile(res, 95)), 2)],
            "cv10_rmse_kg": round(float(np.sqrt(np.mean(cv_err ** 2))), 3),
            "cv10_mae_kg": round(float(np.mean(np.abs(cv_err))), 3),
        })

    # 0) height only (reference)
    X0 = np.column_stack([np.ones(n), Hc])
    f0 = ols(X0, W)
    cv0 = cv_rmse(lambda tr, te: W[te] - X0[te] @ np.linalg.lstsq(X0[tr], W[tr], rcond=None)[0], n)
    summarize("height_only_linear", f0["yhat"], cv0, {"form": "W = b0 + bH*H_cm",
              "coef": {"b0": float(f0["beta"][0]), "H_cm": float(f0["beta"][1])}})

    # 1) linear OLS: W = b0 + bH*H + sum bi*Gi
    X1 = np.column_stack([np.ones(n), Hc, G])
    f1 = ols(X1, W)
    cv1 = cv_rmse(lambda tr, te: W[te] - X1[te] @ np.linalg.lstsq(X1[tr], W[tr], rcond=None)[0], n)
    names = ["intercept", "stature_cm"] + [g + "_cm" for g in CORE7]
    summarize("linear_H_plus_7girths", f1["yhat"], cv1, {
        "form": "W_kg = b0 + b_H*stature_cm + sum(b_i*girth_i_cm)",
        "coef": {nm: float(b) for nm, b in zip(names, f1["beta"])},
        "coef_se": {nm: float(s) for nm, s in zip(names, f1["se"])},
        "adj_r2": round(float(f1["adj_r2"]), 4), "see_kg": round(f1["see"], 3)})

    # 2) log-log: ln W = b0 + bH ln H + sum bi ln Gi  (geometric expectation: bH=1, sum bi = 2)
    X2 = np.column_stack([np.ones(n), np.log(Hc), np.log(G)])
    y2 = np.log(W)
    f2 = ols(X2, y2)
    smear = float(np.mean(np.exp(f2["res"])))  # Duan smearing factor
    pred2 = np.exp(f2["yhat"]) * smear

    def fp2(tr, te):
        b = np.linalg.lstsq(X2[tr], y2[tr], rcond=None)[0]
        sm = np.mean(np.exp(y2[tr] - X2[tr] @ b))
        return W[te] - np.exp(X2[te] @ b) * sm
    cv2 = cv_rmse(fp2, n)
    names2 = ["ln_intercept", "ln_stature_cm"] + ["ln_" + g + "_cm" for g in CORE7]
    summarize("loglog_H_plus_7girths", pred2, cv2, {
        "form": "W_kg = smear * exp(b0) * stature_cm^bH * prod(girth_i_cm^b_i)",
        "coef": {nm: float(b) for nm, b in zip(names2, f2["beta"])},
        "coef_se": {nm: float(s) for nm, s in zip(names2, f2["se"])},
        "smearing_factor": round(smear, 5),
        "sum_girth_exponents": round(float(f2["beta"][2:].sum()), 4),
        "see_log": round(f2["see"], 4)})

    # 3) geometric 'sum of cylinders': W = H_m * sum c_i * G_i^2 (G in cm), c_i >= 0 (NNLS), no intercept
    A = (Hc / 100.0)[:, None] * G ** 2
    c3, _ = optimize.nnls(A, W)

    def fp3(tr, te):
        c, _ = optimize.nnls(A[tr], W[tr])
        return W[te] - A[te] @ c
    cv3 = cv_rmse(fp3, n)
    summarize("geometric_H_times_sum_ci_Gi2", A @ c3, cv3, {
        "form": "W_kg = stature_m * sum(c_i * girth_i_cm^2), c_i >= 0 (non-negative least squares, no intercept)",
        "coef": {g: float(c) for g, c in zip(CORE7, c3)},
        "note": "doubles girths at fixed height -> 4x weight; scales as s^3 under isometric scaling"})

    # 4) geometric with a single free shape constant: W = k * H_m * (mean of G^2) -> one parameter
    Gm2 = (G ** 2).mean(axis=1) * (Hc / 100.0)
    k4 = float((Gm2 @ W) / (Gm2 @ Gm2))

    def fp4(tr, te):
        kk = (Gm2[tr] @ W[tr]) / (Gm2[tr] @ Gm2[tr])
        return W[te] - kk * Gm2[te]
    cv4 = cv_rmse(fp4, n)
    summarize("geometric_1param_H_times_meanG2", k4 * Gm2, cv4, {
        "form": "W_kg = k * stature_m * mean(girth_i_cm^2 over the 7 girths)", "coef": {"k": k4}})

    # 5) reduced sets that a user may know: H + chest + waist ; H + chest + waist + biceps + thigh + calf
    for label, subset in [("linear_H_chest_waist", ["chest", "waist_omphalion"]),
                          ("linear_H_chest_waist_biceps_thigh_calf", ["chest", "waist_omphalion", "biceps_flexed", "thigh_upper", "calf"])]:
        Gs = np.column_stack([d[g + "_cm"].values for g in subset])
        Xs = np.column_stack([np.ones(n), Hc, Gs])
        fs = ols(Xs, W)
        cvs = cv_rmse(lambda tr, te, Xs=Xs: W[te] - Xs[te] @ np.linalg.lstsq(Xs[tr], W[tr], rcond=None)[0], n)
        nm = ["intercept", "stature_cm"] + [g + "_cm" for g in subset]
        summarize(label, fs["yhat"], cvs, {"form": "linear", "coef": {a: float(b) for a, b in zip(nm, fs["beta"])}})
        # log version
        Xl = np.column_stack([np.ones(n), np.log(Hc), np.log(Gs)])
        fl = ols(Xl, y2)
        sm = float(np.mean(np.exp(fl["res"])))

        def fpl(tr, te, Xl=Xl):
            b = np.linalg.lstsq(Xl[tr], y2[tr], rcond=None)[0]
            s = np.mean(np.exp(y2[tr] - Xl[tr] @ b))
            return W[te] - np.exp(Xl[te] @ b) * s
        cvl = cv_rmse(fpl, n)
        nml = ["ln_intercept", "ln_stature_cm"] + ["ln_" + g + "_cm" for g in subset]
        summarize(label.replace("linear", "loglog"), np.exp(fl["yhat"]) * sm, cvl,
                  {"form": "loglog", "coef": {a: float(b) for a, b in zip(nml, fl["beta"])}, "smearing_factor": sm})

    # Extrapolation test: train on everyone below the 90th pct of weight, test on the heaviest 10%
    cut = np.percentile(W, 90)
    tr = np.where(W < cut)[0]
    te = np.where(W >= cut)[0]
    ext = {}
    b1 = np.linalg.lstsq(X1[tr], W[tr], rcond=None)[0]
    e1 = W[te] - X1[te] @ b1
    b2 = np.linalg.lstsq(X2[tr], y2[tr], rcond=None)[0]
    s2 = np.mean(np.exp(y2[tr] - X2[tr] @ b2))
    e2 = W[te] - np.exp(X2[te] @ b2) * s2
    c, _ = optimize.nnls(A[tr], W[tr])
    e3 = W[te] - A[te] @ c
    kk = (Gm2[tr] @ W[tr]) / (Gm2[tr] @ Gm2[tr])
    e4 = W[te] - kk * Gm2[te]
    for nm, e in [("linear", e1), ("loglog", e2), ("geometric_nnls", e3), ("geometric_1param", e4)]:
        ext[nm] = {"mean_error_kg(obs-pred)": round(float(e.mean()), 2), "rmse_kg": round(float(np.sqrt(np.mean(e ** 2))), 2)}
    results["_extrapolation_test_heaviest10pct"] = {"train": f"W < {cut:.1f} kg (n={tr.size})",
                                                   "test": f"W >= {cut:.1f} kg (n={te.size})", **ext}

    # Extrapolation test 2: most muscular-armed 10% (biceps / sqrt(W/H) top decile) held out
    Xs_ = np.sqrt(W / (Hc / 100))
    ratio = d["biceps_flexed_cm"].values / Xs_
    cut2 = np.percentile(d["biceps_flexed_cm"].values, 90)
    tr = np.where(d["biceps_flexed_cm"].values < cut2)[0]
    te = np.where(d["biceps_flexed_cm"].values >= cut2)[0]
    ext2 = {}
    b1 = np.linalg.lstsq(X1[tr], W[tr], rcond=None)[0]
    b2 = np.linalg.lstsq(X2[tr], y2[tr], rcond=None)[0]
    s2 = np.mean(np.exp(y2[tr] - X2[tr] @ b2))
    c, _ = optimize.nnls(A[tr], W[tr])
    for nm, e in [("linear", W[te] - X1[te] @ b1), ("loglog", W[te] - np.exp(X2[te] @ b2) * s2),
                  ("geometric_nnls", W[te] - A[te] @ c)]:
        ext2[nm] = {"mean_error_kg(obs-pred)": round(float(e.mean()), 2), "rmse_kg": round(float(np.sqrt(np.mean(e ** 2))), 2)}
    results["_extrapolation_test_biggest_biceps10pct"] = {"train": f"biceps flexed < {cut2:.1f} cm (n={tr.size})",
                                                         "test": f"biceps flexed >= {cut2:.1f} cm (n={te.size})", **ext2}
    return results


def frustum(c1, c2, L):
    """Volume of a circular frustum from end circumferences c1,c2 (cm) and length L (cm) -> cm^3."""
    return L / (12 * np.pi) * (c1 ** 2 + c1 * c2 + c2 ** 2)


def volume_model(d):
    """Crude circular-frustum segment model (relaxed shape not available: arm girths are FLEXED).
    Returns per-subject model volume in litres and the effective kg/L to match measured weight."""
    g = lambda k: d[k + "_cm"].values
    L = lambda k: d["L_" + k + "_cm"].values
    head_neck = frustum(g("neck"), g("head"), L("stature") - L("cervicale_height"))
    neck_to_chest = frustum(g("neck_base"), g("chest"), L("cervicale_height") - L("chest_height"))
    chest_to_waist = frustum(g("chest"), g("waist_omphalion"), L("chest_height") - L("waist_height_omphalion"))
    waist_to_crotch = frustum(g("waist_omphalion"), g("buttock_hip"), L("waist_height_omphalion") - L("crotch_height"))
    thigh = frustum(g("thigh_upper"), g("thigh_lower"), L("crotch_height") - L("knee_height_midpatella"))
    shank_len = L("knee_height_midpatella") - L("lateral_malleolus_height")
    shank = frustum(g("thigh_lower") * 0.85, g("calf"), shank_len / 3) + frustum(g("calf"), g("ankle"), 2 * shank_len / 3)
    upper_arm = frustum(g("biceps_flexed"), g("forearm_flexed"), L("acromion_radiale_len_upperarm"))
    forearm = frustum(g("forearm_flexed"), g("wrist"), L("radiale_stylion_len_forearm"))
    V = head_neck + neck_to_chest + chest_to_waist + waist_to_crotch + 2 * (thigh + shank + upper_arm + forearm)
    V_L = V / 1000.0
    parts = {"head_neck": head_neck, "neck_to_chest": neck_to_chest, "chest_to_waist": chest_to_waist,
             "waist_to_crotch": waist_to_crotch, "thigh_x2": 2 * thigh, "shank_x2": 2 * shank,
             "upper_arm_x2": 2 * upper_arm, "forearm_x2": 2 * forearm}
    share = {k: float(np.median(v / V)) for k, v in parts.items()}
    ratio = d.weight_kg.values / V_L
    return {
        "description": ("Circular frustums: head+neck (neck->head circ over stature-cervicale), neck_base->chest "
                        "(cervicale->chest height), chest->waist(omphalion), waist->buttock circ (omphalion->crotch "
                        "height), thigh upper->lower (crotch->midpatella), shank (0.85*lower thigh->calf over top third, "
                        "calf->ankle over lower two thirds, midpatella->lateral malleolus), upper arm biceps(flexed)->"
                        "forearm(flexed) over acromion-radiale, forearm(flexed)->wrist over radiale-stylion. Hands/feet omitted."),
        "model_volume_L_p5_p50_p95": [round(float(np.percentile(V_L, p)), 1) for p in (5, 50, 95)],
        "kg_per_model_L_mean_sd": [round(float(ratio.mean()), 4), round(float(ratio.std(ddof=1)), 4)],
        "kg_per_model_L_p5_p50_p95": [round(float(np.percentile(ratio, p)), 4) for p in (5, 50, 95)],
        "corr_with_bmi": round(float(np.corrcoef(ratio, d.bmi.values)[0, 1]), 3),
        "median_volume_share": {k: round(v, 3) for k, v in share.items()},
        "prediction_rmse_kg_using_median_ratio": round(float(np.sqrt(np.mean((d.weight_kg.values - np.median(ratio) * V_L) ** 2))), 2),
    }


def main():
    fits = {"source": {
        "data": "ANSUR II public working databases (NSRDEC, 2012 survey; released 2017), mirrored by Penn State OPEN Design Lab",
        "urls": ["https://www.openlab.psu.edu/ansur2/",
                 "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv",
                 "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"],
        "units_in_csv": "mm; weightkg in kg*10", "units_here": "cm, kg, stature in m where stated"}}
    desc_rows, seg_rows, report = [], [], []
    for sex in ("male", "female"):
        d = load(sex)
        fits[sex] = {"n": int(len(d))}
        cols = ["stature_cm", "weight_kg", "bmi", "age"] + [g + "_cm" for g in GIRTHS]
        fits[sex]["descriptives"] = {}
        for c in cols:
            r = desc(d[c])
            fits[sex]["descriptives"][c] = {k: (round(v, 3) if isinstance(v, float) else v) for k, v in r.items()}
            desc_rows.append({"sex": sex, "var": c, **r})
        # self-reported vs measured
        sr_h = d.heightin_selfrep * 2.54
        sr_w = d.weightlbs_selfrep * 0.45359237
        ok = (d.heightin_selfrep > 0) & (d.weightlbs_selfrep > 0)
        fits[sex]["selfreport_minus_measured"] = {
            "height_cm_mean": round(float((sr_h - d.stature_cm)[ok].mean()), 2),
            "weight_kg_mean": round(float((sr_w - d.weight_kg)[ok].mean()), 2), "n": int(ok.sum())}
        # segments
        seg = {}
        for k in LENGTHS:
            v = d["L_" + k + "_cm"]
            r = desc(v)
            r["median_ratio_to_stature"] = float(np.median(v / d.stature_cm))
            seg[k] = {kk: round(vv, 4) if isinstance(vv, float) else vv for kk, vv in r.items()}
            seg_rows.append({"sex": sex, "var": k, **r})
        derived = {
            "thigh_len_trochanterion_to_lat_femoral_epicondyle": d.L_trochanterion_height_cm - d.L_lateral_femoral_epicondyle_height_cm,
            "thigh_len_crotch_to_midpatella": d.L_crotch_height_cm - d.L_knee_height_midpatella_cm,
            "shank_len_tibiale_to_lat_malleolus": d.L_tibiale_height_cm - d.L_lateral_malleolus_height_cm,
            "head_neck_len_stature_minus_cervicale": d.L_stature_cm - d.L_cervicale_height_cm,
            "trunk_len_suprasternale_to_crotch": d.L_suprasternale_height_cm - d.L_crotch_height_cm,
            "chest_breadth_over_depth": d.L_chest_breadth_cm / d.L_chest_depth_cm,
            "waist_breadth_over_depth": d.L_waist_breadth_cm / d.L_waist_depth_cm,
        }
        for k, v in derived.items():
            r = desc(v)
            r["median_ratio_to_stature"] = float(np.median(v / d.stature_cm)) if "over" not in k else None
            seg[k] = {kk: round(vv, 4) if isinstance(vv, float) else vv for kk, vv in r.items()}
            seg_rows.append({"sex": sex, "var": k, **r})
        fits[sex]["segments"] = seg
        fits[sex]["girth_scaling"] = scaling_fits(d)
        fits[sex]["weight_models"] = weight_models(d)
        fits[sex]["volume_model"] = volume_model(d)
        # correlations among core girths and with weight
        cm = d[["weight_kg", "stature_cm"] + [g + "_cm" for g in CORE7]].corr().round(3)
        fits[sex]["correlations"] = cm.to_dict()

    pd.DataFrame(desc_rows).to_csv(os.path.join(OUT, "descriptives.csv"), index=False, float_format="%.3f")
    pd.DataFrame(seg_rows).to_csv(os.path.join(OUT, "segments.csv"), index=False, float_format="%.4f")
    with open(os.path.join(OUT, "fits.json"), "w") as f:
        json.dump(fits, f, indent=1, default=float)
    print("ok")


if __name__ == "__main__":
    main()
