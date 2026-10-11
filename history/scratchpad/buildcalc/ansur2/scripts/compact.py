import json, sys, os
OUT = sys.argv[1]
f = json.load(open(os.path.join(OUT, "fits.json")))
core = ["stature_cm", "weight_kg", "bmi", "chest_cm", "waist_omphalion_cm", "biceps_flexed_cm", "forearm_flexed_cm",
        "thigh_upper_cm", "thigh_lower_cm", "calf_cm", "neck_cm"]
c = {"source": f["source"], "notes": {
    "waist": "ANSUR II waist is at OMPHALION (navel level), not natural-waist indentation (natural waist not measured in ANSUR II).",
    "biceps": "Flexed: upper arm horizontal forward, elbow 90 deg, fist clenched, maximal 'make a muscle', tape at the highest point of the flexed biceps.",
    "forearm": "Flexed: circumference at the elbow crease with fist tightly clenched (near-maximal forearm girth).",
    "thigh_upper": "At the gluteal furrow (top of thigh), relaxed, perpendicular to thigh axis.",
    "thigh_lower": "Just above the knee (suprapatella).",
    "calf": "Maximum horizontal calf circumference, standing.",
    "neck": "At the infrathyroid landmark (just below the Adam's apple), perpendicular to neck axis.",
    "chest": "Horizontal at chest point anterior (fullest part of the chest/bust), at the maximum point of quiet respiration (i.e. relaxed, not expanded)."}}
for sex in ("male", "female"):
    s = f[sex]
    c[sex] = {
        "n": s["n"],
        "percentiles": {k: {q: s["descriptives"][k][q] for q in ("mean", "sd", "p5", "p50", "p95", "min", "max")} for k in core},
        "girth_from_weight_height": s["extras"] if False else f["extras"][sex]["allometric_girth_predictor"],
        "girth_k_over_sqrt_W_over_H": {g: {"k_ls": v["proportional_k_cm_per_sqrt_kg_per_m"], "k_p5_p50_p95": v["per_subject_k_p5_p50_p95"],
                                           "free_exponent_b": v["powerlaw_b"], "b_95ci": v["powerlaw_b_95ci"]}
                                       for g, v in s["girth_scaling"].items() if g in ("chest", "waist_omphalion", "biceps_flexed", "forearm_flexed", "thigh_upper", "thigh_lower", "calf", "neck")},
        "weight_models": {k: s["weight_models"][k] for k in ("loglog_H_plus_7girths", "geometric_H_times_sum_ci_Gi2", "linear_H_plus_7girths", "loglog_H_chest_waist", "loglog_H_chest_waist_biceps_thigh_calf")},
        "volume_model": s["volume_model"],
        "segment_ratio_to_stature_median": {k: v["median_ratio_to_stature"] for k, v in s["segments"].items() if v.get("median_ratio_to_stature")},
        "cross_section_breadth_over_depth_median": {k: s["segments"][k]["p50"] for k in ("chest_breadth_over_depth", "waist_breadth_over_depth")},
    }
json.dump(c, open(os.path.join(OUT, "ansur2_coefficients_compact.json"), "w"), indent=1)
print(os.path.getsize(os.path.join(OUT, "ansur2_coefficients_compact.json")))
