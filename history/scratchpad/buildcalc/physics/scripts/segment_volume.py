"""Crude segmental frustum volume model on ANSUR II, to measure how well a geometric
(girths + lengths) body volume predicts scale weight, and how the implied
effective density W/V varies with build.

argv[1] male csv, argv[2] female csv, argv[3] output json.
All ANSUR lengths in mm (converted to m); weightkg in tenths of kg.

Trunk cross-sections, two variants:
  'circle'  : area = C^2 / (4 pi) from the measured circumference only (girths-only calculator)
  'ellipse' : area = pi * (breadth/2) * (depth/2) from ANSUR breadth/depth
Limbs: circular cross-sections from circumferences (frustum between levels).
Head: ellipsoid (head length x head breadth x 0.13*stature). Hands, feet: simple boxes/stadia.
"""
import json
import sys

import numpy as np
import pandas as pd

PI = np.pi


def frustum(a1, a2, h):
    return h * (a1 + a2 + np.sqrt(a1 * a2)) / 3.0


def circ_area(c):
    return c ** 2 / (4 * PI)


def ell_area(b, d):
    return PI * b * d / 4


def ellipse_perimeter(b, d):
    a, c = b / 2, d / 2
    return PI * (3 * (a + c) - np.sqrt((3 * a + c) * (a + 3 * c)))


def model(d, trunk="circle"):
    m = lambda c: d[c].values / 1000.0
    st, ss, ch, wo, bh, cr = m("stature"), m("suprasternaleheight"), m("chestheight"), m("waistheightomphalion"), m("buttockheight"), m("crotchheight")
    kn, ti, lm = m("kneeheightmidpatella"), m("tibialheight"), m("lateralmalleolusheight")
    thigh, lthigh, calf, ankle = m("thighcircumference"), m("lowerthighcircumference"), m("calfcircumference"), m("anklecircumference")
    if trunk == "circle":
        A_b, A_w, A_c = circ_area(m("buttockcircumference")), circ_area(m("waistcircumference")), circ_area(m("chestcircumference"))
    else:
        A_b = ell_area(m("hipbreadth"), m("buttockdepth"))
        A_w = ell_area(m("waistbreadth"), m("waistdepth"))
        A_c = ell_area(m("chestbreadth"), m("chestdepth"))
    A_cr = 2 * circ_area(thigh)
    A_nb = circ_area(m("neckcircumferencebase"))
    V_trunk = frustum(A_cr, A_b, np.clip(bh - cr, 0.005, None)) + frustum(A_b, A_w, wo - bh) + \
        frustum(A_w, A_c, ch - wo) + frustum(A_c, A_nb, ss - ch)
    head_h = 0.13 * st
    V_head = PI / 6 * m("headlength") * m("headbreadth") * head_h
    V_neck = circ_area(m("neckcircumference")) * np.clip(st - ss - head_h, 0.02, None)
    # arms (x2)
    V_uarm = frustum(circ_area(m("bicepscircumferenceflexed")), circ_area(m("forearmcircumferenceflexed")), m("shoulderelbowlength"))
    V_farm = frustum(circ_area(m("forearmcircumferenceflexed")), circ_area(m("wristcircumference")), m("radialestylionlength"))
    P, w = m("handcircumference"), m("handbreadth")
    t = np.clip((P - 2 * w) / (PI - 2), 0.01, None)
    V_hand = ((w - t) * t + PI * t ** 2 / 4) * m("handlength") * 0.6
    # legs (x2)
    lt_lvl = kn + 0.05
    calf_lvl = lm + 0.65 * (ti - lm)
    ank_lvl = lm + 0.04
    V_thigh = frustum(circ_area(thigh), circ_area(lthigh), cr - lt_lvl)
    V_knee = frustum(circ_area(lthigh), circ_area(calf), lt_lvl - calf_lvl)
    V_shank = frustum(circ_area(calf), circ_area(ankle), calf_lvl - ank_lvl)
    V_foot = m("footlength") * m("footbreadthhorizontal") * ank_lvl * 0.4
    V = V_trunk + V_head + V_neck + 2 * (V_uarm + V_farm + V_hand + V_thigh + V_knee + V_shank + V_foot)
    parts = {"trunk": V_trunk, "head_neck": V_head + V_neck, "arms_hands": 2 * (V_uarm + V_farm + V_hand),
             "legs_feet": 2 * (V_thigh + V_knee + V_shank + V_foot)}
    return V, parts


def summarize(d, trunk):
    W = d["weightkg"].values / 10.0
    H = d["stature"].values / 1000.0
    V, parts = model(d, trunk)
    k = W / V  # effective density, kg/m^3
    kbar = np.exp(np.mean(np.log(k)))
    e = (kbar * V) / W - 1
    bmi = W / H ** 2
    qs = np.quantile(bmi, [0, .2, .4, .6, .8, 1])
    by_q = []
    for i in range(5):
        sel = (bmi >= qs[i]) & (bmi <= qs[i + 1])
        by_q.append({"bmi_range": [round(qs[i], 1), round(qs[i + 1], 1)], "k_mean": round(float(k[sel].mean()), 1),
                     "calibrated_err_mean_pct": round(float(100 * e[sel].mean()), 2)})
    arm = d["bicepscircumferenceflexed"].values
    big = arm >= np.quantile(arm, .975)
    return {
        "V_mean_L": round(float(V.mean() * 1000), 1),
        "share_pct": {kk: round(float(100 * (vv / V).mean()), 1) for kk, vv in parts.items()},
        "k_eff_geomean_kg_m3": round(float(kbar), 1), "k_eff_sd": round(float(k.std()), 1),
        "calibrated_mass_err_sd_pct": round(float(100 * e.std()), 2),
        "calibrated_mass_mae_pct": round(float(100 * np.abs(e).mean()), 2),
        "calibrated_mass_p95_abs_pct": round(float(100 * np.quantile(np.abs(e), .95)), 2),
        "by_bmi_quintile": by_q,
        "top2.5pct_flexed_arm": {"n": int(big.sum()), "k_mean": round(float(k[big].mean()), 1),
                                 "calibrated_err_mean_pct": round(float(100 * e[big].mean()), 2)},
        "corr_k_bmi": round(float(np.corrcoef(k, bmi)[0, 1]), 3),
    }


out = {"notes": __doc__}
for sex, p in [("male", sys.argv[1]), ("female", sys.argv[2])]:
    d = pd.read_csv(p, encoding="latin-1")
    out[sex] = {t: summarize(d, t) for t in ["circle", "ellipse"]}
    # trunk shape factors: measured circumference vs ellipse perimeter from breadth/depth,
    # and ellipse area relative to circle-of-same-circumference area
    sf = {}
    for lvl, (c, b, dp) in {"chest": ("chestcircumference", "chestbreadth", "chestdepth"),
                            "waist": ("waistcircumference", "waistbreadth", "waistdepth"),
                            "buttock": ("buttockcircumference", "hipbreadth", "buttockdepth")}.items():
        C, B, D = d[c].values / 1000, d[b].values / 1000, d[dp].values / 1000
        sf[lvl] = {"breadth_cm": round(float(B.mean() * 100), 1), "depth_cm": round(float(D.mean() * 100), 1),
                   "depth_over_breadth": round(float((D / B).mean()), 3),
                   "C_measured_over_ellipse_perimeter": round(float((C / ellipse_perimeter(B, D)).mean()), 3),
                   "ellipse_area_over_circle_area": round(float((ell_area(B, D) / circ_area(C)).mean()), 3)}
    out[sex]["trunk_shape"] = sf

json.dump(out, open(sys.argv[3], "w"), indent=1)
print(json.dumps({s: {t: {k: v for k, v in out[s][t].items() if k in ("V_mean_L", "k_eff_geomean_kg_m3", "calibrated_mass_err_sd_pct", "corr_k_bmi", "share_pct", "by_bmi_quintile", "top2.5pct_flexed_arm")} for t in ["circle", "ellipse"]} for s in ["male", "female"]}, indent=0))
print(json.dumps({s: out[s]["trunk_shape"] for s in ["male", "female"]}))
