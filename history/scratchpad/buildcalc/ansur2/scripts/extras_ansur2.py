#!/usr/bin/env python3
"""Extras: readable allometric girth predictors, a lean-heavy ('muscular') subgroup, sanity predictions.
Appends to out/fits.json under key 'extras'."""
import json, os, sys
import numpy as np
import pandas as pd

RAW, OUT = sys.argv[1], sys.argv[2]
fits = json.load(open(os.path.join(OUT, "fits.json")))
CORE = ["chest", "waist_omphalion", "biceps_flexed", "forearm_flexed", "thigh_upper", "thigh_lower", "calf", "neck"]
COLS = {"chest": "chestcircumference", "waist_omphalion": "waistcircumference", "biceps_flexed": "bicepscircumferenceflexed",
        "forearm_flexed": "forearmcircumferenceflexed", "thigh_upper": "thighcircumference",
        "thigh_lower": "lowerthighcircumference", "calf": "calfcircumference", "neck": "neckcircumference"}
files = {"male": "ANSUR_II_MALE_Public.csv", "female": "ANSUR_II_FEMALE_Public.csv"}
extras = {}
for sex in ("male", "female"):
    df = pd.read_csv(os.path.join(RAW, files[sex]), encoding="latin-1")
    df.columns = [c.lower() for c in df.columns]
    H = df.stature / 1000.0  # m
    W = df.weightkg / 10.0
    bmi = W / H ** 2
    G = {g: df[c] / 10.0 for g, c in COLS.items()}
    whtr = G["waist_omphalion"] / (H * 100)
    e = {}
    # 1) readable allometric predictors G_cm = A * W_kg^p * H_m^q
    allo = {}
    for g in CORE:
        s = fits[sex]["girth_scaling"][g]
        A = float(np.exp(s["allometric_lnG_c"]))
        allo[g] = {"A": round(A, 4), "p_weight": s["allometric_exp_W"], "q_height_m": s["allometric_exp_H"],
                   "resid_sd_log": s["allometric_see_log"]}
    e["allometric_girth_predictor"] = {"form": "girth_cm = A * weight_kg^p * stature_m^q (fit by OLS on logs; resid_sd_log ~ fractional SD)",
                                      "coef": allo}
    # sanity predictions at the sample medians
    Hm, Wm = float(np.median(H)), float(np.median(W))
    e["check_at_median_H_W"] = {"stature_m": Hm, "weight_kg": Wm,
                                "pred_cm": {g: round(allo[g]["A"] * Wm ** allo[g]["p_weight"] * Hm ** allo[g]["q_height_m"], 1) for g in CORE},
                                "observed_median_cm": {g: float(np.median(G[g])) for g in CORE}}
    # 2) lean-heavy subgroup: BMI >= 30 and waist-to-height < 0.52 -> muscular-ish
    drop = G["chest"] - G["waist_omphalion"]
    lean_heavy = ("bmi_ge28_chest_minus_waist_ge20cm", (bmi >= 28) & (drop >= 20)) if sex == "male" else \
                 ("bmi_ge26_chest_minus_waist_ge15cm", (bmi >= 26) & (drop >= 15))
    for label, mask in [lean_heavy,
                        ("bmi_ge30_whtr_ge0.60", (bmi >= 30) & (whtr >= 0.60)),
                        ("bmi_18.5_25", (bmi >= 18.5) & (bmi < 25))]:
        sub = {"n": int(mask.sum())}
        if mask.sum() >= 10:
            sub["median"] = {"stature_cm": round(float(np.median(H[mask] * 100)), 1), "weight_kg": round(float(np.median(W[mask])), 1),
                             "bmi": round(float(np.median(bmi[mask])), 1)}
            sub["median"].update({g + "_cm": round(float(np.median(G[g][mask])), 1) for g in CORE})
            X = np.sqrt(W[mask] / H[mask])
            sub["median_k_girth_over_sqrt_W_over_H"] = {g: round(float(np.median(G[g][mask] / X)), 3) for g in CORE}
        e["subgroup_" + label] = sub
    # 3) top-1% individuals for arm size (largest measured flexed biceps) -- what the data's ceiling looks like
    top = df.copy().assign(H=H * 100, W=W, bmi=bmi).nlargest(5, "bicepscircumferenceflexed")
    e["largest_5_biceps"] = [{"stature_cm": round(r.H, 1), "weight_kg": r.W, "bmi": round(r.bmi, 1),
                              "biceps_flexed_cm": r.bicepscircumferenceflexed / 10, "chest_cm": r.chestcircumference / 10,
                              "waist_cm": r.waistcircumference / 10, "forearm_cm": r.forearmcircumferenceflexed / 10,
                              "thigh_cm": r.thighcircumference / 10, "calf_cm": r.calfcircumference / 10, "neck_cm": r.neckcircumference / 10}
                             for r in top.itertuples()]
    # 4) height-normalised girths (girth / stature) percentiles, for geometric rescaling across heights
    e["girth_over_stature_p5_p50_p95"] = {g: [round(float(np.percentile(G[g] / (H * 100), p)), 4) for p in (5, 50, 95)] for g in CORE}
    extras[sex] = e

fits["extras"] = extras
json.dump(fits, open(os.path.join(OUT, "fits.json"), "w"), indent=1, default=float)
print(json.dumps(extras, indent=1))
