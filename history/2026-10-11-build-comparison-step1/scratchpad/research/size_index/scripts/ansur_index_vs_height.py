import csv, sys, math, statistics as st
path = sys.argv[1]
rows = []
with open(path, newline='', encoding='latin-1') as f:
    r = csv.DictReader(f)
    for d in r:
        H = float(d['stature'])/1000.0
        W = float(d['weightkg'])/10.0
        rows.append((H, W))
print('n', len(rows), 'stature range m', min(h for h,_ in rows), max(h for h,_ in rows), 'weight range', min(w for _,w in rows), max(w for _,w in rows))
def ols(xs, ys):
    mx, my = st.mean(xs), st.mean(ys)
    sxx = sum((x-mx)**2 for x in xs); sxy = sum((x-mx)*(y-my) for x,y in zip(xs,ys))
    b = sxy/sxx; a = my - b*mx
    syy = sum((y-my)**2 for y in ys)
    r = sxy/math.sqrt(sxx*syy)
    return a, b, r
lh = [math.log(h) for h,_ in rows]
for name, f in [('BMI W/H^2', lambda h,w: w/h**2), ('S_w = 1.8 W/H^3', lambda h,w: 1.8*w/h**3)]:
    vals = [f(h,w) for h,w in rows]
    a,b,r = ols(lh, [math.log(v) for v in vals])
    print(name, 'log-log slope vs height', round(b,3), 'r', round(r,3), 'median', round(st.median(vals),2))
# height bins
qs = sorted(rows)
n = len(qs)
for lo, hi in [(0,0.1),(0.45,0.55),(0.9,1.0)]:
    seg = qs[int(lo*n):int(hi*n)]
    hs = [h for h,_ in seg]
    print(f'height decile band {lo}-{hi}: median H {st.median(hs):.3f} m, median BMI {st.median([w/h**2 for h,w in seg]):.2f}, median 1.8W/H^3 {st.median([1.8*w/h**3 for h,w in seg]):.2f}')
hs = sorted(h for h,_ in rows)
print('H p5 p50 p95', hs[int(0.05*n)], hs[int(0.5*n)], hs[int(0.95*n)])
