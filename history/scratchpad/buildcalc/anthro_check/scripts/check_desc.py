"""Independent recompute of ANSUR II descriptives and comparison to TR-15/007 tables.
usage: python3 -I check_desc.py <rawdir> <outdir>
"""
import sys, re, json
import numpy as np
import pandas as pd

raw, out = sys.argv[1], sys.argv[2]
M = pd.read_csv(f"{raw}/ANSUR_II_MALE_Public.csv", encoding="latin-1")
F = pd.read_csv(f"{raw}/ANSUR_II_FEMALE_Public.csv", encoding="latin-1")
M.columns = [c.strip().lower() for c in M.columns]
F.columns = [c.strip().lower() for c in F.columns]
print("shapes", M.shape, F.shape)
print("age M min/max/median", M.age.min(), M.age.max(), M.age.median(), "F", F.age.min(), F.age.max(), F.age.median())
print("dates", M.date.iloc[0], F.date.iloc[0])

txt = open(f"{out}/ANSURII-TR15-007.txt", encoding="utf-8", errors="replace").read().split("\n")

def tr_table(num, name):
    # find right-aligned summary header "(num) NAME" (second occurrence)
    pat = re.compile(r"^\s{10,}\(" + str(num) + r"\) " + re.escape(name) + r"\s*$")
    idx = [i for i, l in enumerate(txt) if pat.match(l)]
    res = {}
    if idx:
        i = idx[0]
        blk = txt[i:i + 14]
        for l in blk:
            for key, lab in [("mean", r"MEAN"), ("sd", r"STANDARD DEVIATION"), ("min", r"MINIMUM"), ("max", r"MAXIMUM")]:
                m = re.match(r"^\s*([\d.]+)\s+" + lab + r"\s+[\d.]+\s+([\d.]+)\s+" + lab + r"\b", l)
                if m and key not in res:
                    res[key] = (float(m.group(1)), float(m.group(2)))
    # percentile table: first occurrence "(num) NAME" at line start, then rows with "5TH" etc
    pat2 = re.compile(r"^\f?\(" + str(num) + r"\) " + re.escape(name))
    idx2 = [i for i, l in enumerate(txt) if pat2.match(l)]
    if idx2:
        i = idx2[0]
        for l in txt[i:i + 60]:
            m = re.match(r"^\s*([\d.]+)\s+([\d.]+)\s+(1ST|5TH|50TH|95TH|99TH)\s+([\d.]+)\s+([\d.]+)", l)
            if m:
                res["p" + re.sub(r"\D", "", m.group(3))] = (float(m.group(1)), float(m.group(4)))
    return res

dims = [
    (75, "STATURE", "stature", 10),
    (91, "WEIGHT", "weightkg", 10),
    (24, "CHEST CIRCUMFERENCE", "chestcircumference", 10),
    (87, "WAIST CIRCUMFERENCE (OMPHALION)", "waistcircumference", 10),
    (9, "BICEPS CIRCUMFERENCE, FLEXED", "bicepscircumferenceflexed", 10),
    (38, "FOREARM CIRCUMFERENCE, FLEXED", "forearmcircumferenceflexed", 10),
    (78, "THIGH CIRCUMFERENCE", "thighcircumference", 10),
    (60, "LOWER THIGH CIRCUMFERENCE", "lowerthighcircumference", 10),
    (21, "CALF CIRCUMFERENCE", "calfcircumference", 10),
    (62, "NECK CIRCUMFERENCE", "neckcircumference", 10),
    (63, "NECK CIRCUMFERENCE, BASE", "neckcircumferencebase", 10),
    (92, "WRIST CIRCUMFERENCE", "wristcircumference", 10),
    (16, "BUTTOCK CIRCUMFERENCE", "buttockcircumference", 10),
]
rows = []
for num, name, col, div in dims:
    tr = tr_table(num, name)
    for sex, D, j in [("F", F, 0), ("M", M, 1)]:
        x = D[col].astype(float) / div
        mine = dict(mean=x.mean(), sd=x.std(ddof=1), min=x.min(), max=x.max(),
                    p1=np.percentile(x, 1), p5=np.percentile(x, 5), p50=np.percentile(x, 50),
                    p95=np.percentile(x, 95), p99=np.percentile(x, 99))
        line = [f"{name[:22]:22s} {sex}"]
        worst = 0
        for k in ["mean", "sd", "min", "max", "p1", "p5", "p50", "p95", "p99"]:
            t = tr.get(k, (None, None))[j] if k in tr else None
            if t is not None:
                d = mine[k] - t
                worst = max(worst, abs(d))
                line.append(f"{k}={mine[k]:.2f}/{t:.2f}")
            else:
                line.append(f"{k}={mine[k]:.2f}/NA")
        line.append(f"maxdiff={worst:.2f}")
        print(" ".join(line))

# BMI
for sex, D in [("M", M), ("F", F)]:
    h = D.stature / 1000.0
    w = D.weightkg / 10.0
    b = w / h ** 2
    print(sex, "BMI mean %.2f sd %.2f p5 %.2f p50 %.2f p95 %.2f min %.2f max %.2f" % (
        b.mean(), b.std(), *np.percentile(b, [5, 50, 95]), b.min(), b.max()))
    # self report bias
    hb = D.heightin * 2.54 - D.stature / 10.0
    wb = D.weightlbs * 0.45359237 - D.weightkg / 10.0
    print(sex, "selfreport: height bias mean %.2f cm median %.2f; weight bias mean %.2f kg median %.2f; n valid h %d w %d; weightlbs zeros %d heightin min %s max %s" % (
        hb.mean(), hb.median(), wb.mean(), wb.median(), hb.notna().sum(), wb.notna().sum(), (D.weightlbs <= 0).sum(), D.heightin.min(), D.heightin.max()))
    good = (D.weightlbs > 50)
    wb2 = D.weightlbs[good] * 0.45359237 - D.weightkg[good] / 10.0
    print(sex, "weight bias excluding implausible weightlbs<=50: mean %.2f median %.2f n %d" % (wb2.mean(), wb2.median(), good.sum()))
    # top flexed arms
    t = D.sort_values("bicepscircumferenceflexed", ascending=False).head(3)
    for _, r in t.iterrows():
        print(sex, "top arm", r.bicepscircumferenceflexed / 10, "stature", r.stature / 10, "wt", r.weightkg / 10,
              "BMI %.1f" % (r.weightkg / 10 / (r.stature / 1000) ** 2), "chest", r.chestcircumference / 10,
              "waist", r.waistcircumference / 10, "forearm", r.forearmcircumferenceflexed / 10, "thigh", r.thighcircumference / 10,
              "calf", r.calfcircumference / 10, "neck", r.neckcircumference / 10)
