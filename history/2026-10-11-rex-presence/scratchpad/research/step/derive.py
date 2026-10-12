"""Derived numbers for the 'step' research topic. Every input is printed with its source key."""
import math

g = 9.81
M = 3007.0          # canon mass, kg (each)
H = 3.048           # canon height, m
W = M * g           # body weight, N
A_rex = 0.31        # one paw sole, m^2 (rex_ollie_picture_build)
A_ollie = 0.15      # one boot sole, m^2

print("Body weight W = %.0f N (%.1f kN)" % (W, W / 1e3))

# --- Hip height (leg length) --------------------------------------------------
# ANSUR II men (n=4082): crotch 0.4815 H, trochanterion 0.5128 H (computed from build-calculator/data/ansur2)
crotch_h, troch_h = 0.4815, 0.5128
gap = troch_h - crotch_h
# Turnaround measurements (our own): crotch / full height
for name, cr in (("rex", 305 / 737), ("ollie", 313 / 757)):
    hip_add = cr + gap
    hip_mul = cr * troch_h / crotch_h
    print("%s crotch %.3f H -> hip %.3f H (add) / %.3f H (ratio)" % (name, cr, hip_add, hip_mul))
h_lo, h_mid, h_hi = 0.42 * H, 0.45 * H, 0.48 * H
print("hip height range %.2f / %.2f / %.2f m" % (h_lo, h_mid, h_hi))

# --- Froude scaling of preferred walking -------------------------------------
# Fukuchi 2018 dataset (24 young adults, overground comfortable): Fr = 0.18 (0.10-0.29), leg = ASIS-malleolus
for Fr in (0.10, 0.18, 0.25, 0.29, 0.5):
    print("Fr %.2f -> v = %.2f m/s at h=%.2f (%.2f-%.2f for h range)" % (
        Fr, math.sqrt(Fr * g * h_mid), h_mid, math.sqrt(Fr * g * h_lo), math.sqrt(Fr * g * h_hi)))

# CADENCE-adults: 113.6 steps/min at 3.0 mph (1.341 m/s), cohort stature 1.707 m (treadmill)
v_h = 3.0 * 0.44704
f_h = 113.6 / 60
H_h = 1.707
h_h = troch_h * H_h        # hip height via ANSUR ratio
Fr_h = v_h ** 2 / (g * h_h)
fhat = f_h * math.sqrt(h_h / g)
print("CADENCE human: v %.3f m/s, f %.3f Hz, hip %.3f m, Fr %.3f, f-hat %.3f, step %.3f m" % (
    v_h, f_h, h_h, Fr_h, fhat, v_h / f_h))
for h in (h_lo, h_mid, h_hi):
    v_r = math.sqrt(Fr_h * g * h)
    f_r = fhat * math.sqrt(g / h)
    print("  scaled to hip %.2f m: v %.2f m/s, f %.3f Hz (%.0f steps/min), step %.2f m, stride period %.2f s" % (
        h, v_r, f_r, f_r * 60, v_r / f_r, 2 / f_r))
# stance time = duty factor x stride period (Alexander 2004: 0.7 very slow ... 0.55 fast)
for beta in (0.55, 0.6, 0.7):
    T_h = 2 / f_h
    T_r = 2 / (fhat * math.sqrt(g / h_mid))
    print("  beta %.2f: human stance %.2f s; Rex/Ollie stance %.2f s" % (beta, beta * T_h, beta * T_r))
time_scale = math.sqrt(h_mid / h_h)
print("time scale factor (equal Fr) sqrt(h_rex/h_human) = %.3f" % time_scale)

# --- Step forces ---------------------------------------------------------------
for k in (1.0, 1.2, 1.5):
    print("walking peak %.1f BW = %.1f kN per foot; pressure Rex %.0f kPa, Ollie %.0f kPa" % (
        k, k * W / 1e3, k * W / A_rex / 1e3, k * W / A_ollie / 1e3))
for k in (3.4, 4.4, 6.5):
    print("stamp %.1f BW = %.0f kN; pressure Rex %.0f kPa, Ollie %.0f kPa" % (
        k, k * W / 1e3, k * W / A_rex / 1e3, k * W / A_ollie / 1e3))

# Rise time of the walking load: Keller 1996 loading rate 8 BW/s at the slow end
print("walking rise to 1.2 BW at 8 BW/s: %.2f s (human); scaled %.2f s" % (1.2 / 8, 1.2 / 8 * time_scale))

# --- Heel strike (impact part of a normal step) ------------------------------
# Baines 2018: v_heel 0.57 m/s (0.39-0.78), tp 17.5 ms, te 29.8 ms, W = 3.8 J (1.4-6.9), Me 11.1 % BM (8.6-19.5),
# mean mass 76.7 kg, speed 1.3 m/s, step freq 1.9 Hz. Leg length not reported: assume stature 1.75 m -> hip 0.90 m.
m_h, h_hum = 76.7, 0.5128 * 1.75
E_h = 3.8
Ehat = E_h / (m_h * g * h_hum)
print("heel strike: E/(M g h) = %.2e" % Ehat)
for h in (h_lo, h_mid, h_hi):
    print("  Rex/Ollie heel-strike energy (equal Fr) at hip %.2f: %.0f J (range %.0f-%.0f J)" % (
        h, Ehat * M * g * h, 1.4 / E_h * Ehat * M * g * h, 6.9 / E_h * Ehat * M * g * h))
v_heel_r = 0.57 * math.sqrt(h_mid / h_hum)
print("  heel speed scaled: %.2f m/s (%.2f-%.2f)" % (v_heel_r, 0.39 * math.sqrt(h_mid / h_hum), 0.78 * math.sqrt(h_mid / h_hum)))
for f in (0.041, 0.063, 0.111, 0.176):
    print("  effective mass %.1f%% -> %.0f kg; KE at %.2f m/s = %.0f J" % (f * 100, f * M, v_heel_r, 0.5 * f * M * v_heel_r ** 2))
print("  timing scaled: tp %.0f ms, te %.0f ms (only if heel pad scaled dynamically: see caveat)" % (17.5 * time_scale, 29.8 * time_scale))

# --- Stamp ---------------------------------------------------------------------
# Carden 2015: stamp from thigh horizontal. Foot raised by ~ thigh length. ANSUR: trochanterion 0.5128 H,
# lateral femoral epicondyle 0.2799 H -> thigh ~0.233 H.
thigh = (0.5128 - 0.2799)
for Hx, lab in ((1.80, "human 1.80 m"), (H, "Rex/Ollie")):
    drop = thigh * Hx
    print("%s: foot raised %.2f m; free-fall contact speed %.2f m/s" % (lab, drop, math.sqrt(2 * g * drop)))
# impulse check: half-sine pulse of peak 6.5 BW, duration 2 x tp (tp 16-36 ms, Rawcliffe 2020)
for tp in (0.016, 0.025, 0.036):
    J = 2 / math.pi * 6.5 * 2 * tp     # in BW.s
    print("  half-sine 6.5 BW, tp %.0f ms: impulse %.3f BW s = M x %.2f m/s; minus 1 BW x duration -> M x %.2f m/s" % (
        tp * 1e3, J, J * g, (J - 2 * tp) * g))

# --- Elephants -------------------------------------------------------------------
# Larramendi 2016: African bush cow 3,000 kg (2.60 m), bull 6,000 kg (3.20 m); Asian cow 2,700 kg (2.40 m), bull 4,000 kg (2.75 m)
for lab, m in (("African bush bull", 6000), ("African bush cow", 3000), ("Asian bull", 4000), ("Asian cow", 2700), ("forest bull", 2000)):
    print("Rex/Ollie / %s = %.2f" % (lab, M / m))
# Panagiotopoulou 2016 subject 2: ~3000 kg, forefoot circumference 1.27 m; subjects 1.06-1.27 m
for C in (1.06, 1.21, 1.27):
    print("forefoot circumference %.2f m -> circle area %.3f m^2" % (C, C * C / (4 * math.pi)))
# Schanz 2013: footprint 0.32 x 0.30 m (ellipse)
A_sch = math.pi / 4 * 0.32 * 0.30
print("Schanz footprint ellipse area %.3f m^2 (cow 2,530 kg)" % A_sch)
# Ren 2010 walking per-limb peaks read from Fig 1A: fore ~0.55 BW, hind ~0.36 BW
Fe = 0.55 * 3000 * g
print("3,000 kg elephant forefoot peak walking force %.1f kN; pressure %.0f-%.0f kPa" % (Fe / 1e3, Fe / 0.128 / 1e3, Fe / A_sch / 1e3))
print("Rex walking foot force / elephant forefoot = %.1f" % (1.2 * W / Fe))

# --- Schanz back-calculated foot speed -------------------------------------------
# sigma_dyn = m v^2 / (2 s A); f_dyn = sigma_(dyn+stat)/sigma_stat = 3.5 for forelimb (Table 2) on loading step 2 (99 kPa, f_wd 0.32)
m_limb = 0.32 * 2530
s = 0.022
A_plate = math.pi * 0.16 ** 2
sig_dyn = (3.5 - 1) * 99e3
v1 = math.sqrt(sig_dyn * 2 * s * A_plate / m_limb)
print("Schanz implied forefoot touchdown speed %.2f m/s (m %.0f kg, s %.3f m, A %.4f m^2, sigma_dyn %.0f kPa)" % (v1, m_limb, s, A_plate, sig_dyn / 1e3))
print("Schanz implied peak forefoot force %.2f BW (3.5 x 0.32)" % (3.5 * 0.32))

# --- Engine-style sinking check against Schanz footprint ---------------------------
def nq(phi):
    t = math.tan(math.radians(phi))
    return math.exp(math.pi * t) * math.tan(math.radians(45 + phi / 2)) ** 2
def ng_vesic(phi):
    return 2 * (nq(phi) + 1) * math.tan(math.radians(phi))
gamma = 1.6 * g * 1000  # dry density 1.6 g/cm3
B = math.sqrt(A_sch)
for phi in (30, 35, 40):
    q0 = 0.5 * gamma * B * ng_vesic(phi) * 0.6
    for F_bw, lab in ((0.55, "Ren walking peak"), (1.12, "Schanz dyn")):
        p = F_bw * 2530 * g / A_sch
        D = max(0.0, (p - q0) / (gamma * nq(phi)))
        print("phi %d: Nq %.1f Ngamma(V) %.1f q0 %.0f kPa; %s p %.0f kPa -> sink %.3f m (measured 0.020-0.026)" % (
            phi, nq(phi), ng_vesic(phi), q0 / 1e3, lab, p / 1e3, D))

# Engine loose-sand numbers for Rex/Ollie walking on one foot
q_ls, Bref = 37000, math.sqrt(0.1)
for lab, A in (("Rex", A_rex), ("Ollie", A_ollie)):
    Bf = math.sqrt(A)
    q0 = q_ls * Bf / Bref
    for k in (1.0, 1.2):
        p = k * W / A
        D = max(0, (p - q0) / (1600 * g * 18.40))
        print("%s loose sand (engine): q0 %.0f kPa, p(%.1f BW) %.0f kPa -> sink %.2f m" % (lab, q0 / 1e3, k, p / 1e3, D))

# Elastic settlement check against Schanz (to show it underestimates)
for Es in (9.6e6, 28.8e6, 47.9e6):
    sE = 350e3 * 0.32 * (1 - 0.25 ** 2) * (math.pi / 4) / Es
    print("elastic s at 350 kPa, B 0.32, nu 0.25, I pi/4, Es %.0f MPa: %.1f mm" % (Es / 1e6, sE * 1e3))
