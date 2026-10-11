import json, sys, os
OUT = sys.argv[1]
f = json.load(open(os.path.join(OUT, "fits.json")))
SRC_CSV = [{"title": "ANSUR II male CSV (OPEN Design Lab)", "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"},
           {"title": "ANSUR II female CSV (OPEN Design Lab)", "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"}]
SRC_PAGE = {"title": "OPEN Design Lab ANSUR II page", "url": "https://www.openlab.psu.edu/ansur2/"}
SRC_MFR = {"title": "NSRDEC memo 14 Apr 2017: ANSUR II working databases", "url": "https://tools.openlab.psu.edu/publicData/ANSURII-MFR.pdf"}
SRC_TR = {"title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)", "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"}
SRC_HB = {"title": "Hotzman et al. 2011, NATICK/TR-11/017 (Measurer's Handbook)", "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"}
facts = []
def add(key, label, status, values, sources, notes):
    facts.append({"key": key, "label": label, "status": status, "values": json.dumps(values, separators=(",", ":")), "sources": sources, "notes": notes})

add("ansur2_dataset", "ANSUR II public working databases: what they are", "official",
    {"n_male": 4082, "n_female": 1986, "age_min_yr": 17, "age_max_yr": 58, "male_age_median_yr": 28, "female_age_median_yr": 27,
     "orig": "93 directly measured dimensions; CSV units mm, weightkg column = kg*10; survey Oct 2010 - Apr 2012"},
    [SRC_PAGE, SRC_MFR, SRC_TR] + SRC_CSV,
    "Downloaded both CSVs (sha256 male 0547aea0..., female ed7e800a...) from tools.openlab.psu.edu over HTTPS (the http:// links on the OPEN Lab page now return an HTML app shell; https works). Memo: 'All measurements are recorded in millimeters with the exception of the variable weightkg' (kg*10). TR-15/007 p.33: the working databases are stratified random samples matched to Total Army age/race/component distributions (DMDC 30 Sep 2011), so plain unweighted statistics are the intended population estimates; memo says male and female files should be analysed separately. Population is US Army soldiers aged 17-58 (fitter and younger than the general US adult population); memo cautions it may not represent other populations.")

add("ansur2_measurement_definitions", "How ANSUR II girths were taken (matters when comparing to bodybuilding tape numbers)", "official",
    {"allowable_observer_error_chest_m": 0.014, "allowable_observer_error_waist_m": 0.012, "allowable_observer_error_biceps_m": 0.006,
     "allowable_observer_error_forearm_m": 0.005, "allowable_observer_error_thigh_m": 0.006, "allowable_observer_error_calf_m": 0.004,
     "allowable_observer_error_neck_m": 0.006, "allowable_observer_error_weight_kg": 0.3, "orig": "Allowable observer error (mm): chest 14, waist 12, biceps 6, forearm 5, thigh 6, calf 4, neck 6; weight 0.3 kg"},
    [SRC_HB, SRC_TR],
    "Measurer's Handbook sec. 6.4: CHEST = horizontal at chest point anterior (fullest part of chest/bust), at the maximum point of QUIET respiration (not a puffed/expanded chest). WAIST (OMPHALION) = horizontal at the centre of the navel, abdomen not tensed; ANSUR II did NOT measure natural-waist (narrowest) circumference (TR-15/007 App. F lists natural-indentation waist only for ANSUR 1988), so omphalion waist runs larger than a 'natural waist' tape number. BICEPS FLEXED = right upper arm horizontal forward, elbow ~90 deg, fist clenched toward head, 'maximum effort in making a muscle', tape at highest point of flexed biceps, perpendicular to arm. FOREARM FLEXED = at the elbow crease, upper arm horizontal, elbow 90 deg, fist tightly clenched. THIGH = at the gluteal furrow (top of thigh), muscles relaxed. LOWER THIGH = at suprapatella (just above knee). CALF = maximum horizontal calf girth, standing. NECK = at infrathyroid landmark (just below Adam's apple), perpendicular to neck axis; NECK BASE is a separate, larger measure. Allowable observer error from Table G-1.")

labels = {"stature_cm": ("ansur2_stature", "Stature (standing height)"), "weight_kg": ("ansur2_weight", "Body weight (scale)"),
          "bmi": ("ansur2_bmi", "BMI computed from measured stature and weight"),
          "chest_cm": ("ansur2_chest", "Chest circumference"), "waist_omphalion_cm": ("ansur2_waist_omphalion", "Waist circumference at omphalion (navel)"),
          "biceps_flexed_cm": ("ansur2_biceps_flexed", "Upper-arm (biceps) circumference, flexed"), "forearm_flexed_cm": ("ansur2_forearm_flexed", "Forearm circumference, flexed (at elbow crease)"),
          "thigh_upper_cm": ("ansur2_thigh", "Thigh circumference (at gluteal furrow, relaxed)"), "thigh_lower_cm": ("ansur2_lower_thigh", "Lower thigh circumference (above knee)"),
          "calf_cm": ("ansur2_calf", "Calf circumference (maximum)"), "neck_cm": ("ansur2_neck", "Neck circumference (below Adam's apple)"),
          "neck_base_cm": ("ansur2_neck_base", "Neck circumference at base"), "wrist_cm": ("ansur2_wrist", "Wrist circumference"),
          "buttock_hip_cm": ("ansur2_hip", "Buttock (hip) circumference")}
tr_check = {"stature_cm": "TR-15/007 (75) STATURE: M 5th/50th/95th 164.8/175.5/187.0, mean 175.62 SD 6.86; F 152.5/162.6/174.0, mean 162.85 SD 6.42 - matches.",
            "weight_kg": "TR-15/007 (91) WEIGHT: M 64.4/84.6/110.7 kg, mean 85.52 SD 14.22; F 51.3/66.8/87.1, mean 67.76 SD 10.98 - matches (F p95 87.08 vs 87.10 is a percentile-interpolation difference).",
            "chest_cm": "TR-15/007 (24) CHEST CIRCUMFERENCE: M 92.2/105.6/120.7, mean 105.87 SD 8.74; F 82.4/94.0/109.4, mean 94.69 SD 8.27 - matches.",
            "waist_omphalion_cm": "TR-15/007 (87) WAIST CIRCUMFERENCE (OMPHALION): M 76.8/93.7/113.1, mean 94.06 SD 11.17; F 71.0/85.2/104.0, mean 86.09 SD 9.99 - matches.",
            "biceps_flexed_cm": "TR-15/007 (9) BICEPS CIRCUMFERENCE, FLEXED: M 30.3/35.7/41.8, mean 35.81 SD 3.46; F 25.9/30.4/36.0, mean 30.56 SD 3.08 - matches.",
            "forearm_flexed_cm": "TR-15/007 (38) FOREARM CIRCUMFERENCE, FLEXED: M 27.5/31.0/34.8, mean 31.01 SD 2.20; F 23.5/26.3/29.6, mean 26.41 SD 1.85 - matches.",
            "thigh_upper_cm": "TR-15/007 (78) THIGH CIRCUMFERENCE: M 53.2/62.4/72.3, mean 62.51 SD 5.85; F 52.7/61.3/71.1, mean 61.61 SD 5.58 - matches.",
            "calf_cm": "TR-15/007 (21) CALF CIRCUMFERENCE: M 34.6/39.2/44.3, mean 39.23 SD 2.97; F 32.8/37.2/42.3, mean 37.33 SD 2.85 - matches.",
            "neck_cm": "TR-15/007 (62) NECK CIRCUMFERENCE: M 36.0/39.5/44.3, mean 39.76 SD 2.58; F 30.2/32.8/36.3, mean 32.98 SD 1.92 - matches.",
            "neck_base_cm": "TR-15/007 (63) NECK CIRCUMFERENCE, BASE: M 39.5/43.3/47.9, mean 43.46; F 34.0/37.0/40.5, mean 37.12 - matches."}
for var, (key, label) in labels.items():
    vals = {}
    orig = []
    for sex in ("male", "female"):
        d = f[sex]["descriptives"][var]
        if var == "weight_kg":
            for q in ("mean", "sd", "p5", "p50", "p95", "min", "max"):
                vals[f"{sex}_{q}_kg"] = round(d[q], 2)
            orig.append(f"{sex}: p5/p50/p95 {d['p5']:.1f}/{d['p50']:.1f}/{d['p95']:.1f} kg = {d['p5']/0.45359237:.0f}/{d['p50']/0.45359237:.0f}/{d['p95']/0.45359237:.0f} lb; mean {d['mean']:.2f} SD {d['sd']:.2f} kg; range {d['min']:.1f}-{d['max']:.1f}")
        elif var == "bmi":
            for q in ("mean", "sd", "p5", "p50", "p95", "min", "max"):
                vals[f"{sex}_{q}_kg_per_m2"] = round(d[q], 2)
            orig.append(f"{sex}: p5/p50/p95 {d['p5']:.1f}/{d['p50']:.1f}/{d['p95']:.1f}, mean {d['mean']:.2f}")
        else:
            for q in ("mean", "sd", "p5", "p50", "p95", "min", "max"):
                vals[f"{sex}_{q}_m"] = round(d[q] / 100, 4 if q in ("mean", "sd") else 3)
            orig.append(f"{sex}: p5/p50/p95 {d['p5']:.1f}/{d['p50']:.1f}/{d['p95']:.1f} cm = {d['p5']/2.54:.1f}/{d['p50']/2.54:.1f}/{d['p95']/2.54:.1f} in; mean {d['mean']:.2f} SD {d['sd']:.2f} cm; range {d['min']:.1f}-{d['max']:.1f} cm")
    vals["orig"] = " | ".join(orig)
    status = "derived" if var == "bmi" else "measured"
    note = "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. " + tr_check.get(var, "Not cross-checked against a TR table.")
    if var == "waist_omphalion_cm":
        note += " This is NAVEL-level waist, not natural (narrowest) waist; ANSUR II has no natural-waist girth."
    if var == "thigh_upper_cm":
        note += " Measured at the gluteal furrow (very top of thigh), relaxed; typically the largest thigh girth, larger than a mid-thigh tape."
    if var == "biceps_flexed_cm":
        note += " Flexed with maximal effort; comparable to a bodybuilder's 'flexed arm' number taken at the biceps peak (bodybuilders' numbers are often taken cold vs pumped, and are usually self-reported)."
    sources = SRC_CSV + ([SRC_TR] if var in tr_check else [])
    add(key, label, status, vals, sources, note)

for sex in ("male", "female"):
    sr = f[sex]["selfreport_minus_measured"]
    pass
add("ansur2_selfreport_bias", "Self-reported vs measured height and weight in ANSUR II", "derived",
    {"male_height_bias_m": round(f["male"]["selfreport_minus_measured"]["height_cm_mean"] / 100, 4), "male_weight_bias_kg": f["male"]["selfreport_minus_measured"]["weight_kg_mean"],
     "female_height_bias_m": round(f["female"]["selfreport_minus_measured"]["height_cm_mean"] / 100, 4), "female_weight_bias_kg": f["female"]["selfreport_minus_measured"]["weight_kg_mean"],
     "orig": f"Mean self-report minus measured: men +{f['male']['selfreport_minus_measured']['height_cm_mean']} cm, {f['male']['selfreport_minus_measured']['weight_kg_mean']} kg; women +{f['female']['selfreport_minus_measured']['height_cm_mean']} cm, {f['female']['selfreport_minus_measured']['weight_kg_mean']} kg"},
    SRC_CSV + [SRC_MFR],
    "Heightin/Weightlbs columns are self-reported (memo). People over-report height by ~1-2 cm on average even in a population that is routinely measured; useful caveat when the calculator takes reported heights of athletes/celebrities.")

GN = ["chest", "waist_omphalion", "biceps_flexed", "forearm_flexed", "thigh_upper", "thigh_lower", "calf", "neck"]
for sex in ("male", "female"):
    gs = f[sex]["girth_scaling"]
    vals = {}
    parts = []
    for g in GN:
        v = gs[g]
        vals[f"{g}_k_cm_per_sqrt_kg_per_m"] = v["proportional_k_cm_per_sqrt_kg_per_m"]
        vals[f"{g}_k_p5"] = v["per_subject_k_p5_p50_p95"][0]
        vals[f"{g}_k_p95"] = v["per_subject_k_p5_p50_p95"][2]
        vals[f"{g}_free_b"] = v["powerlaw_b"]
        parts.append(f"{g} R2 {v['proportional_r2']:.3f}, RMSE {v['proportional_rmse_cm']:.2f} cm; b 95%CI [{v['powerlaw_b_95ci'][0]:.3f},{v['powerlaw_b_95ci'][1]:.3f}], R2log {v['powerlaw_r2_log']:.3f}")
    vals["orig"] = "girth_cm = k * sqrt(weight_kg / stature_m); fit stats: " + "; ".join(parts)
    add(f"ansur2_girth_scaling_{sex}", f"How each girth scales with sqrt(weight/height), {sex}s", "derived", vals, SRC_CSV,
        "Same method as ansur2_girth_scaling_male; n=1986." if sex == "female" else "Geometric expectation: if body SHAPE is fixed (isometric scaling, or widening at fixed height), every girth is proportional to sqrt(W/H), i.e. exponent b=1. Two fits per girth: (1) proportional through origin G=k*X with X=sqrt(W[kg]/H[m]) - k is a per-girth shape constant, and per-subject k=G/X percentiles show how much shape varies; R2 is vs the mean of G (it is negative for girths that barely track mass, e.g. wrist -0.22 M / -0.17 F). (2) free power law ln G = ln a + b ln X (OLS). Results: chest tracks the geometric law almost exactly (b~1.02-1.04); waist grows much faster than geometric (b~1.4: extra mass in this population goes to the abdomen); upper thigh and biceps a bit faster (b~1.09-1.24); lower thigh about geometric (0.91 M, 1.02 F); forearm, calf, neck slower (b~0.62-0.85). These exponents describe how soldiers differ (mostly fat variation), NOT how a body changes when it adds muscle - a bodybuilder adds girth to arms/chest/thighs, not waist, so use with care outside the sample. Also fitted: ln G = c + p ln W + q ln H (see allometric fact) and per-girth values are saved in fits.json.")

for sex in ("male", "female"):
    a = f["extras"][sex]["allometric_girth_predictor"]["coef"]
    vals = {}
    parts = []
    for g in GN:
        c = a[g]
        vals[f"{g}_A"] = c["A"]; vals[f"{g}_p_weight"] = c["p_weight"]; vals[f"{g}_q_height"] = c["q_height_m"]
        parts.append(f"{g} {c['resid_sd_log']*100:.1f}%")
    chk = f["extras"][sex]["check_at_median_H_W"]
    vals["orig"] = "girth_cm = A * weight_kg^p * stature_m^q; residual SD: " + "; ".join(parts) + f". Check at median H={chk['stature_m']} m, W={chk['weight_kg']} kg: predicted {chk['pred_cm']} vs observed medians {chk['observed_median_cm']}"
    r2 = {g: f[sex]["girth_scaling"][g]["allometric_r2_log"] for g in GN}
    add(f"ansur2_girth_predictor_{sex}", f"Predict 'average-shape' girths from weight and height, {sex}s", "derived", vals, SRC_CSV,
        f"OLS on logs, n={f[sex]['n']}. R2 (log scale) by girth: {r2}. resid_sd_log is the residual SD of ln(girth), approximately the fractional 1-SD scatter. This is the 'everyday body' baseline: it gives the girths of a soldier of that height and weight, whose extra weight is mostly fat. Valid only inside the sample range (M weight 39-144 kg, stature 149-199 cm; F 36-120 kg, 141-183 cm); do not use it for bodybuilders or super-heroes without a build-specific shape adjustment.")

for sex in ("male", "female"):
    wm = f[sex]["weight_models"]
    ll = wm["loglog_H_plus_7girths"]; lin = wm["linear_H_plus_7girths"]; geo = wm["geometric_H_times_sum_ci_Gi2"]; h0 = wm["height_only_linear"]
    vals = {"loglog_" + k: round(v, 5) for k, v in ll["coef"].items()}
    vals["loglog_smearing_factor"] = ll["smearing_factor"]
    vals["loglog_r2"] = ll["r2"]; vals["loglog_rmse_kg"] = ll["rmse_kg"]; vals["loglog_cv10_rmse_kg"] = ll["cv10_rmse_kg"]; vals["loglog_rmse_pct"] = ll["rmse_pct"]
    vals["loglog_resid_p5_kg"] = ll["resid_p5_p95_kg"][0]; vals["loglog_resid_p95_kg"] = ll["resid_p5_p95_kg"][1]
    vals.update({"geom_c_" + k: round(v, 6) for k, v in geo["coef"].items()})
    vals["geom_r2"] = geo["r2"]; vals["geom_rmse_kg"] = geo["rmse_kg"]; vals["geom_cv10_rmse_kg"] = geo["cv10_rmse_kg"]
    vals.update({"linear_" + k: round(v, 5) for k, v in lin["coef"].items()})
    vals["linear_r2"] = lin["r2"]; vals["linear_rmse_kg"] = lin["rmse_kg"]; vals["linear_cv10_rmse_kg"] = lin["cv10_rmse_kg"]
    vals["height_only_r2"] = h0["r2"]; vals["height_only_rmse_kg"] = h0["rmse_kg"]
    e1 = wm["_extrapolation_test_heaviest10pct"]; e2 = wm["_extrapolation_test_biggest_biceps10pct"]
    vals["orig"] = (f"LOG-LOG: W_kg = {ll['smearing_factor']:.5f} * exp({ll['coef']['ln_intercept']:.4f}) * H_cm^{ll['coef']['ln_stature_cm']:.4f} * chest^{ll['coef']['ln_chest_cm']:.4f} * waist^{ll['coef']['ln_waist_omphalion_cm']:.4f} * biceps^{ll['coef']['ln_biceps_flexed_cm']:.4f} * forearm^{ll['coef']['ln_forearm_flexed_cm']:.4f} * thigh^{ll['coef']['ln_thigh_upper_cm']:.4f} * calf^{ll['coef']['ln_calf_cm']:.4f} * neck^{ll['coef']['ln_neck_cm']:.4f} (girths cm); "
                    f"R2 {ll['r2']}, RMSE {ll['rmse_kg']} kg ({ll['rmse_pct']}%), 10-fold CV RMSE {ll['cv10_rmse_kg']} kg, 90% of residuals in [{ll['resid_p5_p95_kg'][0]}, {ll['resid_p5_p95_kg'][1]}] kg; sum of girth exponents {ll['sum_girth_exponents']} (geometry predicts 2), height exponent {ll['coef']['ln_stature_cm']:.3f} (geometry predicts 1). "
                    f"GEOMETRIC: W_kg = H_m * sum(c_i * G_i_cm^2), c = {{{', '.join(f'{k}: {v:.5f}' for k, v in geo['coef'].items())}}}; R2 {geo['r2']}, RMSE {geo['rmse_kg']} kg, CV RMSE {geo['cv10_rmse_kg']} kg. "
                    f"LINEAR: W_kg = {lin['coef']['intercept']:.3f} + {lin['coef']['stature_cm']:.4f}*H_cm + {lin['coef']['chest_cm']:.4f}*chest + {lin['coef']['waist_omphalion_cm']:.4f}*waist + {lin['coef']['biceps_flexed_cm']:.4f}*biceps + {lin['coef']['forearm_flexed_cm']:.4f}*forearm + {lin['coef']['thigh_upper_cm']:.4f}*thigh + {lin['coef']['calf_cm']:.4f}*calf + {lin['coef']['neck_cm']:.4f}*neck; R2 {lin['r2']}, RMSE {lin['rmse_kg']} kg, CV RMSE {lin['cv10_rmse_kg']} kg. "
                    f"Height alone: R2 {h0['r2']}, RMSE {h0['rmse_kg']} kg.")
    add(f"ansur2_weight_regression_{sex}", f"Weight from height + 7 girths (chest, waist, flexed biceps, flexed forearm, thigh, calf, neck), {sex}s", "derived", vals, SRC_CSV,
        f"OLS fits, n={f[sex]['n']}; 10-fold cross-validated errors are essentially equal to in-sample errors (no overfitting). Extrapolation tests: trained on all but the heaviest 10% and predicted the heaviest 10% -> mean error (observed - predicted) linear {e1['linear']['mean_error_kg(obs-pred)']} kg (RMSE {e1['linear']['rmse_kg']}), log-log {e1['loglog']['mean_error_kg(obs-pred)']} kg (RMSE {e1['loglog']['rmse_kg']}), geometric {e1['geometric_nnls']['mean_error_kg(obs-pred)']} kg (RMSE {e1['geometric_nnls']['rmse_kg']}); trained without the 10% biggest flexed arms and predicted them -> linear {e2['linear']['mean_error_kg(obs-pred)']} kg, log-log {e2['loglog']['mean_error_kg(obs-pred)']} kg, geometric {e2['geometric_nnls']['mean_error_kg(obs-pred)']} kg. Recommendation: use the log-log or geometric (H x girth^2) form for extreme builds; the linear form under-predicts large bodies. Even so, all were fitted on soldiers (max flexed arm 49.0 cm M / 43.5 cm F); predictions for 55-60 cm arms are extrapolations and should be labelled estimates. Coefficients are not interpretable individually (girths are strongly collinear, pairwise r 0.53-0.89). Reduced models: H+chest+waist only -> R2 {wm['loglog_H_chest_waist']['r2']}, RMSE {wm['loglog_H_chest_waist']['rmse_kg']} kg (log-log); H+chest+waist+biceps+thigh+calf -> R2 {wm['loglog_H_chest_waist_biceps_thigh_calf']['r2']}, RMSE {wm['loglog_H_chest_waist_biceps_thigh_calf']['rmse_kg']} kg; coefficients in fits.json.")

for sex in ("male", "female"):
    vm = f[sex]["volume_model"]
    vals = {"kg_per_model_litre_median": vm["kg_per_model_L_p5_p50_p95"][1], "kg_per_model_litre_p5": vm["kg_per_model_L_p5_p50_p95"][0],
            "kg_per_model_litre_p95": vm["kg_per_model_L_p5_p50_p95"][2], "kg_per_model_litre_sd": vm["kg_per_model_L_mean_sd"][1],
            "model_volume_median_m3": round(vm["model_volume_L_p5_p50_p95"][1] / 1000, 4), "rmse_kg": vm["prediction_rmse_kg_using_median_ratio"],
            "corr_ratio_with_bmi": vm["corr_with_bmi"]}
    vals.update({"share_" + k: v for k, v in vm["median_volume_share"].items()})
    vals["orig"] = f"weight_kg = {vm['kg_per_model_L_p5_p50_p95'][1]} * V_model_litres; V_model p5/p50/p95 {vm['model_volume_L_p5_p50_p95']} L; volume shares {vm['median_volume_share']}"
    add(f"ansur2_volume_model_{sex}", f"Calibration of a simple frustum (stacked-cone) body-volume model, {sex}s", "derived", vals, SRC_CSV,
        "Same model as ansur2_volume_model_male; n=1986." if sex == "female" else vm["description"] + " Frustum volume = L/(12*pi)*(C1^2 + C1*C2 + C2^2). The calibration constant (kg per model litre) is NOT body density: it absorbs non-circular cross-sections, flexed (over-sized) arm girths and the omitted hands/feet. Its small spread (SD ~2.3-2.8%) means this geometric model predicts weight about as well as the regressions (RMSE ~1.9 kg) and, being physical, scales sensibly to extreme builds. Ratio falls slightly with BMI (corr shown), so very fat bodies run a little lighter per model-litre.")

for sex in ("male", "female"):
    seg = f[sex]["segments"]
    keys = ["stature", "cervicale_height", "acromial_height", "suprasternale_height", "chest_height", "waist_height_omphalion", "trochanterion_height", "crotch_height",
            "knee_height_midpatella", "lateral_femoral_epicondyle_height", "tibiale_height", "lateral_malleolus_height", "sitting_height", "span",
            "acromion_radiale_len_upperarm", "radiale_stylion_len_forearm", "hand_length", "foot_length", "head_length", "head_breadth", "biacromial_breadth", "bideltoid_breadth",
            "chest_breadth", "chest_depth", "waist_breadth", "waist_depth", "hip_breadth", "thigh_len_trochanterion_to_lat_femoral_epicondyle", "thigh_len_crotch_to_midpatella",
            "shank_len_tibiale_to_lat_malleolus", "head_neck_len_stature_minus_cervicale", "trunk_len_suprasternale_to_crotch"]
    vals = {}
    parts = []
    for k in keys:
        s = seg[k]
        vals[f"{k}_p50_m"] = round(s["p50"] / 100, 4)
        parts.append(f"{k} {s['p5']:.1f}/{s['p50']:.1f}/{s['p95']:.1f} ({s['median_ratio_to_stature']:.3f})")
    vals["chest_breadth_over_depth_median"] = seg["chest_breadth_over_depth"]["p50"]
    vals["waist_breadth_over_depth_median"] = seg["waist_breadth_over_depth"]["p50"]
    vals["orig"] = "cm p5/p50/p95 (median ratio to stature): " + "; ".join(parts)
    add(f"ansur2_segments_{sex}", f"Segment lengths, heights and breadths for a volume model, {sex}s", "measured", vals, SRC_CSV + [SRC_HB],
        "Direct measurements except the derived lengths (thigh = trochanterion height - lateral femoral epicondyle height, or crotch height - knee height midpatella; shank = tibiale height - lateral malleolus height; head+neck = stature - cervicale height; trunk = suprasternale height - crotch height) and breadth/depth ratios (chest and waist cross-sections are wider than deep: use an ellipse, not a circle, if building cross-sections from breadths). Heights are landmark heights above the floor, standing. Ratios to stature let a calculator rescale to any height assuming the same proportions.")

for sex in ("male", "female"):
    e = f["extras"][sex]
    lk = [k for k in e if k.startswith("subgroup_bmi_ge2")][0]
    vals = {}
    orig = []
    for k, tag in [(lk, "leanheavy"), ("subgroup_bmi_ge30_whtr_ge0.60", "bigwaist"), ("subgroup_bmi_18.5_25", "normalbmi")]:
        s_ = e[k]
        vals[f"{tag}_n"] = s_["n"]
        vals[f"{tag}_weight_kg"] = s_["median"]["weight_kg"]
        vals[f"{tag}_stature_m"] = round(s_["median"]["stature_cm"] / 100, 3)
        for g in ("chest", "waist_omphalion", "biceps_flexed", "thigh_upper", "calf"):
            vals[f"{tag}_{g}_m"] = round(s_["median"][g + "_cm"] / 100, 4)
        orig.append(f"{tag} [{k.replace('subgroup_', '')}] n={s_['n']} medians {json.dumps(s_['median'])}; k {json.dumps(s_['median_k_girth_over_sqrt_W_over_H'])}")
    vals["orig"] = " || ".join(orig)
    add(f"ansur2_{sex}_subgroups", f"ANSUR II {sex} subgroups: lean-but-heavy vs big-waist vs normal BMI (medians)", "derived", vals, SRC_CSV,
        "Subgroups I selected from the CSV (rules in orig). 'leanheavy' = high BMI with chest far larger than navel waist, the most athletic shape in ANSUR II; small n and NOT a bodybuilder sample. Compare shape constants k=girth/sqrt(W/H): in the lean-heavy group chest k is higher and waist k lower than in the big-waist group (men: biceps k also higher; women: not), which is the direction a muscular build shifts the girths.")
    lb = e["largest_5_biceps"][:3]
    vals = {"top_biceps_flexed_m": lb[0]["biceps_flexed_cm"] / 100, "top_weight_kg": lb[0]["weight_kg"], "top_stature_m": round(lb[0]["stature_cm"] / 100, 3),
            "orig": "3 largest flexed arms in sample (cm, kg): " + json.dumps(lb)}
    add(f"ansur2_{sex}_largest_arms", f"Ceiling of the data: largest flexed arms in ANSUR II, {sex}s", "measured", vals, SRC_CSV,
        "Individual anonymous rows of the public database. Shows the edge of the data: the regressions and predictors are not validated beyond these sizes.")

json.dump(facts, open(os.path.join(OUT, "facts.json"), "w"), indent=1)
print(len(facts), os.path.getsize(os.path.join(OUT, "facts.json")))
