# Frame-based and rule-based natural-limit predictions, converted to FFMI and to the
# rescaled index S = 1.8 * FFM / H^3 (FFMI of the same shape scaled to 1.80 m).
import csv, statistics as st, sys, math

path = sys.argv[1]
rows = list(csv.DictReader(open(path, newline='', encoding='latin-1')))
W = [float(r['wristcircumference'])/10 for r in rows]   # cm
A = [float(r['anklecircumference'])/10 for r in rows]   # cm
H = [float(r['stature'])/10 for r in rows]              # cm
def pct(v, p):
    v = sorted(v); k = (len(v)-1)*p/100; f = math.floor(k); c = min(f+1, len(v)-1)
    return v[f] + (v[c]-v[f])*(k-f)
print('ANSUR II men n=%d' % len(rows))
for name, v in [('wrist cm', W), ('ankle cm', A), ('stature cm', H)]:
    print(name, 'p5 %.1f p50 %.1f p95 %.1f mean %.2f' % (pct(v,5), pct(v,50), pct(v,95), st.mean(v)))
sub = [(w,a) for w,a,h in zip(W,A,H) if 175 <= h <= 185]
print('men 175-185 cm: n=%d wrist p50 %.1f ankle p50 %.1f' % (len(sub), pct([s[0] for s in sub],50), pct([s[1] for s in sub],50)))

def butt_lbm_kg(h_cm, w_cm, a_cm, bf):
    # Butt: M(lb) = H^1.5 (sqrt(W)/22.6670 + sqrt(A)/17.0104) (F/224 + 1), H, W, A in inches, F in %.
    Hi, Wi, Ai = h_cm/2.54, w_cm/2.54, a_cm/2.54
    lb = Hi**1.5 * (math.sqrt(Wi)/22.6670 + math.sqrt(Ai)/17.0104) * (bf/224 + 1)
    return lb*0.45359237
def metric_check(h_cm, w_cm, a_cm, bf):
    return h_cm**1.5 * (math.sqrt(w_cm)/322.4 + math.sqrt(a_cm)/241.9) * (bf/224 + 1)

print('\nButt: McDonald table check (7 in wrist, 8.75 in ankle, 10% fat):')
for ft, inch in [(5,8),(5,10),(6,0)]:
    h = (ft*12+inch)*2.54
    lbm = butt_lbm_kg(h, 7*2.54, 8.75*2.54, 10)
    print('  %d\'%d": LBM %.0f lb, weight at 10%% %.0f lb' % (ft, inch, lbm/0.45359237, lbm/0.45359237/0.9))
print('metric constants check:', round(butt_lbm_kg(180,17.6,22.0,10),3), round(metric_check(180,17.6,22.0,10),3))

def idx(ffm, h_m):
    return ffm/h_m**2, 1.8*ffm/h_m**3, ffm/h_m**2 + 6.1*(1.8-h_m)
print('\nButt at 1.80 m (FFMI = S = Kouri-normalized at exactly 1.80 m):')
wp = {p: pct([s[0] for s in sub], p) for p in (5,50,95)}
ap = {p: pct([s[1] for s in sub], p) for p in (5,50,95)}
for p in (5,50,95):
    for bf in (5, 10):
        lbm = butt_lbm_kg(180, wp[p], ap[p], bf)
        f, S, N = idx(lbm, 1.8)
        print('  frame p%d (wrist %.1f, ankle %.1f cm), F=%d%%: LBM %.1f kg, FFMI %.1f' % (p, wp[p], ap[p], bf, lbm, f))
print('\nButt height dependence (median frame of 175-185 cm men held fixed), F=10%:')
for h in (165, 170, 180, 190, 200):
    lbm = butt_lbm_kg(h, wp[50], ap[50], 10)
    f, S, N = idx(lbm, h/100)
    print('  H %d cm: LBM %.1f kg FFMI %.1f S %.1f Kouri-norm %.1f' % (h, lbm, f, S, N))

print('\nBerkhan: weight(kg) = H(cm) - 100 at 5-6% fat; his height-specific offsets: 160:-98, 170:-99, 180:-100, 190:-101')
for h, off in [(160,98),(170,99),(180,100),(190,101)]:
    for bf in (5, 6):
        ffm = (h-off)*(1-bf/100)
        f, S, N = idx(ffm, h/100)
        print('  H %d cm, BW %d kg, fat %d%%: FFM %.1f FFMI %.2f S %.2f Kouri-norm %.2f' % (h, h-off, bf, ffm, f, S, N))
