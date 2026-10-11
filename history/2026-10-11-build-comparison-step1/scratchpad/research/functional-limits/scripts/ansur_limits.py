import csv, sys, math, statistics as st
path = sys.argv[1]
rows = list(csv.DictReader(open(path, encoding='latin-1')))
def col(name, scale=0.001):
    return [float(r[name])*scale for r in rows]
n = len(rows)
H = col('stature'); W = [float(r['weightkg'])/10 for r in rows]
bmi = [w/h**2 for w,h in zip(W,H)]
def pct(v, p):
    s = sorted(v); k=(len(s)-1)*p; f=math.floor(k); c=math.ceil(k)
    return s[f]+(s[c]-s[f])*(k-f)
def summ(name, v):
    print(f"{name:32s} p5 {pct(v,.05):.3f} p50 {pct(v,.5):.3f} p95 {pct(v,.95):.3f} max {max(v):.3f} (n={len(v)})")
cols = ['stature','acromialheight','biacromialbreadth','bideltoidbreadth','chestbreadth','waistbreadth','hipbreadth','forearmforearmbreadth',
        'shoulderelbowlength','acromionradialelength','radialestylionlength','forearmhandlength','handlength','bicepscircumferenceflexed',
        'forearmcircumferenceflexed','thighcircumference','lowerthighcircumference','crotchheight','kneeheightmidpatella','iliocristaleheight',
        'trochanterionheight','tragiontopofhead','mentonsellionlength','lateralmalleolusheight','wristheight','waistheightomphalion','chestheight','axillaheight','bicristalbreadth']
print("n men", n)
for c in cols: summ(c, col(c))
summ('weight_kg', [w*1000 for w in W]); summ('bmi', [b*1000 for b in bmi])
# BMI groups as in Zwerus 2017
groups = [('<18.5',0,18.5),('18.5-25',18.5,25),('25-30',25,30),('>=30',30,99)]
print("\nBMI group medians (ANSUR men): biceps flexed, forearm flexed, sum")
ref=None
for g,lo,hi in groups:
    idx=[i for i,b in enumerate(bmi) if lo<=b<hi]
    if not idx: print(g,'none'); continue
    bc=st.median(float(rows[i]['bicepscircumferenceflexed']) for i in idx)
    fc=st.median(float(rows[i]['forearmcircumferenceflexed']) for i in idx)
    print(f"  {g:8s} n={len(idx):5d} biceps {bc:.0f} mm forearm {fc:.0f} mm sum {bc+fc:.0f}")
