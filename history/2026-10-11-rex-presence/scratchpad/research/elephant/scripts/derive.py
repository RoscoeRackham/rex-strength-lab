import math, json
two_pi = 2 * math.pi
# Steinmann et al. 2025 Fig 3/4 digitized peak vertical displacement (m), distance (m), station, dominant freq (Hz, median & quartiles)
rows = [
 ('elephant walking', 'NWP05 (sandy dry ground)', 20, 4.0e-8, 1.9e-8, 18.7, 13.8, 24.3),
 ('elephant running', 'NTA02', 38, 2.5e-8, 1.3e-8, 27.8, 19.2, 36.8),
 ('elephant group of 4 walking', 'NWP05', 20, 5.3e-9, 3.0e-9, 22.5, 17.9, 30.1),
 ('giraffe walking', 'NWP05', 20, 2.5e-7, 1.0e-7, 24.3, 19.8, 28.5),
 ('zebra', 'NWP05', 47, 2.3e-8, 1.9e-8, 23.5, 18.5, 29.8),
 ('human', 'NWP05', 53, 1.6e-8, 1.2e-8, 20.0, 14.9, 24.9),
 ('hyena', 'NWP05', 17, 1.7e-9, 1.2e-9, 20.9, 16.4, 27.0),
 ('warthog', 'NTA02', 32, 2.7e-9, 1.9e-9, 33.2, 24.0, 41.7),
 ('giraffe walking (Fig 4a)', 'NNL62 (rocky ground)', 34, 2.3e-9, 1.1e-9, None, None, None),
 ('giraffe walking (Fig 4b)', 'ETA00 (by waterhole)', 26, 3.5e-9, 1.9e-9, None, None, None),
 ('giraffe walking (Fig 4c)', 'ETA00 (by waterhole)', 103, 2.2e-10, 1.65e-10, None, None, None),
]
out = []
for name, st, d, umax, utyp, f, flo, fhi in rows:
    fuse = f or 20.0
    v = two_pi * fuse * umax
    vtyp = two_pi * fuse * utyp
    vlo = two_pi * (flo or 15) * umax
    vhi = two_pi * (fhi or 30) * umax
    out.append(dict(animal=name, station=st, distance_m=d, peak_disp_m=umax, typical_step_disp_m=utyp,
                    dominant_Hz=f, ppv_mm_s=round(v*1e3, 5), ppv_typical_mm_s=round(vtyp*1e3, 5),
                    ppv_range_mm_s=[round(vlo*1e3, 5), round(vhi*1e3, 5)]))
for o in out: print(o)
# scale all elephant anchors to 20 m with n = 0.5 and 1
def to20(v, r, n): return v * (r / 20.0) ** n
anchors = {
 'Steinmann walk 20 m (max step)': (0.0048, 20),
 'Steinmann running 38 m': (0.0044, 38),
 'OConnell 2000 stomp 3-12 m (0-pk = p-p/2 = 24.4 um/s), r=3': (0.02435, 3),
 'OConnell 2000 stomp 3-12 m, r=12': (0.02435, 12),
 'OConnell 2000 stomp 40 m (8.5 um/s)': (0.0085, 40),
 'Mortimer fast walk 0.36 mm/s, r=2': (0.36, 2),
 'Mortimer fast walk 0.36 mm/s, r=30': (0.36, 30),
}
for k, (v, r) in anchors.items():
    print('%-60s n=0.5: %.4f  n=1: %.4f mm/s at 20 m' % (k, to20(v, r, 0.5), to20(v, r, 1.0)))
# decay exponents
print('n OConnell stomps 3..12 -> 40 m:', [round(math.log(24.35/8.5)/math.log(40/r), 2) for r in (3, 6, 12)])
print('n Wood 20 dB overhead(1-2 m) -> 20 m:', [round(math.log(10)/math.log(20/r), 2) for r in (1, 1.5, 2)])
print('n Steinmann giraffe ETA00 26 -> 103 m:', round(math.log(3.5e-9/2.2e-10)/math.log(103/26), 2))
# Mortimer source force fraction of body weight, assumed 2,500-3,500 kg
for F in (125, 273, 279, 289, 946, 1190):
    print('F=%d N: %.2f%% - %.2f%% of body weight (3500..2500 kg)' % (F, 100*F/(3500*9.81), 100*F/(2500*9.81)))
