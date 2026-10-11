# Convert natural-limit anchors to the rescaled index S = 1.8*FFM/H^3.
# Identities: plain FFMI F = FFM/H^2; S = 1.8*F/H. Kouri-normalized N = F + k*(1.8-H) (k = 6.1 in the paper body, 6.3 in the abstract).
# Trexler-normalized uses k = 2.943. At H = 1.80 m, F = N = S.
def S_from_F(F, H): return 1.8*F/H
def F_from_N(N, H, k=6.1): return N - k*(1.8-H)

print('Kouri non-user limit N=25.0 expressed as S at several heights (k=6.1; k=6.3 in brackets):')
for H in (1.60, 1.70, 1.75, 1.80, 1.85, 1.90, 2.00):
    print('  H %.2f: plain FFMI %.2f, S %.2f  [k=6.3: S %.2f]' % (H, F_from_N(25,H), S_from_F(F_from_N(25,H),H), S_from_F(F_from_N(25,H,6.3),H)))
print('Kouri users: highest bin 31-31.9 (normalized). At 1.80 m S = N.')
print()
# Kondo 1994: largest FFM 121.3 kg, stature 186 cm, mass 181 kg, 33.0% fat
ffm, H = 121.3, 1.86
F = ffm/H**2
print('Kondo largest sumo: FFMI %.2f, S %.2f, Kouri-norm %.2f; check FFM from mass*(1-fat) = %.1f; FFM/stature %.3f kg/cm' % (F, S_from_F(F,H), F+6.1*(1.8-H), 181*(1-0.33), ffm/186))
for r in (0.61, 0.66, 0.70):
    for H in (1.75, 1.80, 1.85):
        ffm = r*H*100
        print('  FFM/stature %.2f kg/cm at H %.2f: FFM %.1f kg, FFMI %.1f, S %.1f' % (r, H, ffm, ffm/H**2, 1.8*ffm/H**3))
print()
# Trexler 2017: FFMI_Adj = F + 2.943*(1.8 - H); max 31.7; P97.5 28.1; mean height 184.7 cm
for N, lab in [(31.7,'max'), (28.1,'P97.5'), (23.7,'mean')]:
    out = []
    for H in (1.80, 1.847, 1.90, 1.95):
        F = F_from_N(N, H, 2.943)
        out.append('H %.3f: F %.2f S %.2f' % (H, F, S_from_F(F,H)))
    print('Trexler', lab, N, '|', '; '.join(out))
# Currier 2019: P97.5 28.32 (all), rugby 29.1; mean height 182.9 cm; slope not in abstract -> bracket with k 0..6.1
for N, lab in [(28.32,'P97.5 all'), (29.1,'P97.5 rugby'), (22.8,'mean')]:
    vals = []
    for k in (0, 2.943, 6.1):
        F = F_from_N(N, 1.829, k); vals.append('k=%.1f: S %.2f' % (k, S_from_F(F,1.829)))
    print('Currier', lab, N, 'at mean height 1.829 m |', '; '.join(vals))
# Hattori 1999 sumo Sekitori cutoff FFMI ~30 (plain, FFM/H^2); heights of sekitori not in abstract
for H in (1.75, 1.80, 1.85, 1.90):
    print('  Hattori cutoff F=30 at H %.2f: S %.2f' % (H, S_from_F(30,H)))
# Chappell 2019 natural pros (self-reported 1.77 m, 82.3 kg end of prep), assumed 5% fat
ffm = 82.3*0.95; H = 1.77
print('Chappell PROs: FFMI %.2f S %.2f Kouri-norm %.2f' % (ffm/H**2, 1.8*ffm/H**3, ffm/H**2+6.1*(1.8-H)))
# Rossow 2013 FFMI 24.9 (height unknown)
for H in (1.70, 1.80, 1.90):
    print('  Rossow F=24.9 if H=%.2f: S %.2f' % (H, S_from_F(24.9,H)))
# Berkhan's own data points
for name,H,BW,bf in [('Marcus',1.81,79,4.25),('Andreaz',1.69,70,5.5),('Robert',1.82,82,7),('Berkhan',1.86,86,5.5)]:
    ffm = BW*(1-bf/100)
    print('Berkhan pt %s: FFMI %.2f S %.2f' % (name, ffm/H**2, 1.8*ffm/H**3))
