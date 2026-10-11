import sys, numpy as np, pandas as pd
raw=sys.argv[1]
for fn in ["ANSUR_II_MALE_Public.csv","ANSUR_II_FEMALE_Public.csv"]:
    D=pd.read_csv(f"{raw}/{fn}",encoding="latin-1"); D.columns=[c.strip().lower() for c in D.columns]
    m=lambda c: np.median(D[c])/10
    print(fn, "cerv",m("cervicaleheight"),"chesth",m("chestheight"),"omph",m("waistheightomphalion"),"crotch",m("crotchheight"),"knee",m("kneeheightmidpatella"),
      "AR",m("acromionradialelength"),"RS",m("radialestylionlength"),"biac",m("biacromialbreadth"),"bidelt",m("bideltoidbreadth"),"span",m("span"),
      "chestB/D",round(np.median(D.chestbreadth/D.chestdepth),4),"waistB/D",round(np.median(D.waistbreadth/D.waistdepth),4),
      "thighlen(cr-knee)",np.median(D.crotchheight-D.kneeheightmidpatella)/10,"trunk",np.median(D.suprasternaleheight-D.crotchheight)/10)
    hb=D.heightin*2.54-D.stature/10
    print("  height selfreport bias outliers |d|>10cm:", (hb.abs()>10).sum(), "max", round(hb.max(),1), "trimmed mean(|d|<=10)", round(hb[hb.abs()<=10].mean(),2))
    wb=D.weightlbs*0.45359237-D.weightkg/10
    print("  weight selfreport outliers |d|>20kg:", (wb.abs()>20).sum(), "trimmed mean", round(wb[wb.abs()<=20].mean(),2))
