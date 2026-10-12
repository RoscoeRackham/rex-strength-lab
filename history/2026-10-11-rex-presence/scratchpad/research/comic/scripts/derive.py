"""Derived numbers for the comic-switch research (topic: comic). Inputs are existing verified keys
or the sources fetched in this run; every formula is printed with its result."""
import math

g = 9.80665            # earth_standard_gravity
GM = 3.986004418e14    # earth_gm
R = 6.371e6            # collide_earth_inertia_rotation (mean radius)
rho = 1.225            # atm_isa_sea_level_density
P0 = 20e-6             # reference pressure for sound pressure level, Pa
PSI = 6894.757
PSF = 47.880259

print('--- 1. Earth tidal stretch across a 4 m, 1,340 kg car (end to end, vertical) ---')
m_car, L = 1340.4, 4.0
k = 2 * GM / R**3                          # tidal gradient along the radial line, s^-2
print(f'2GM/R^3 = {k:.4e} s^-2')
print(f'tidal acceleration difference, end to end (L={L} m): {k*L:.3e} m/s^2 = {k*L/g:.2e} g')
T_mid = m_car * L * GM / (4 * R**3)       # tension at the middle of a uniform rod along the radial line
print(f'tension through the middle of a uniform 1,340 kg, 4 m rod: {T_mid*1e3:.2f} mN; weight {m_car*g:.0f} N; ratio {T_mid/(m_car*g):.1e}')
print('his spread push at 10 g: b = a everywhere, so gradient = 0 and added tidal stress = 0 exactly')
F10 = m_car * 10 * g
print(f'by contrast, 10 g through a grip: {F10/1e3:.0f} kN through his hands (plus weight {m_car*g/1e3:.1f} kN)')

print('\n--- 2. Felt (net) acceleration of a passenger: n = |a - g_vec| / g ---')
for a_push, desc in [(0, 'standing still'), (g, '1 g up'), (5 * g, '5 g up')]:
    print(f'{desc}: felt = {(a_push + g)/g:.1f} g (vertical push)')
for n_felt in (2, 4, 6):
    a_h = g * math.sqrt(n_felt**2 - 1)
    print(f'horizontal push that gives {n_felt} g felt: a = {a_h/g:.2f} g')

print('\n--- 3. Fastest no-harm release over an arm stroke at a felt-g cap (horizontal push) ---')
# Rex's throw stroke = 1.6 * s with s = H / 2.0 (engine makeBody); at H = 3.048 m, d = 2.44 m
s = 3.048 / 2.0
d = 1.6 * s
for n_felt in (2, 4, 6):
    a = g * math.sqrt(n_felt**2 - 1)
    v = math.sqrt(2 * a * d)
    t = 2 * d / v
    rng = v * v / g
    print(f'cap {n_felt} g felt: a={a/g:.2f} g, stroke {d:.2f} m -> v = {v:.1f} m/s in {t:.2f} s; '
          f'45-deg range on flat ground, no drag: {rng:.0f} m (release height ignored)')

print('\n--- 4. Air drag on a flying passenger (felt as a push on the front) ---')
m_p = 90.26   # human_us_adult_male_mass
A = 0.67      # human_projected_area (orientation mean, estimate)
Cd = 1.1      # cd_bluff_body_tumbling_subsonic (estimate)
for n in (1, 2, 4, 6):
    v = math.sqrt(2 * n * g * m_p / (rho * Cd * A))
    print(f'drag deceleration {n} g at v = {v:.0f} m/s (q = {0.5*rho*v*v/1e3:.1f} kPa)')
for (lab, AA, CC) in (('head-first box face 0.11 m^2, Cd 1.1', 0.11, 1.1), ('front 0.79 m^2, Cd 1.1', 0.79, 1.1)):
    v = math.sqrt(2 * 6 * g * m_p / (rho * CC * AA))
    print(f'  6 g at {v:.0f} m/s for {lab}')

print('\n--- 5. Sound pressure level <-> overpressure ---')
for L_dB in (105, 120, 129, 133, 134, 136, 141, 143, 145, 148, 151, 154, 168, 170):
    p = P0 * 10 ** (L_dB / 20)
    print(f'{L_dB} dB = {p:.1f} Pa = {p/PSI:.4f} psi = {p/PSF:.2f} psf')
for psf in (1.0, 1.5, 2.0, 2.5, 5.0, 6.0, 6.5, 7.6, 11, 20):
    p = psf * PSF
    print(f'{psf} psf = {p:.0f} Pa = {20*math.log10(p/P0):.1f} dB')
for psi in (0.03, 0.05, 0.10, 0.75, 0.88, 1.10):
    p = psi * PSI
    print(f'{psi} psi = {p:.0f} Pa = {20*math.log10(p/P0):.1f} dB')

print('\n--- 6. Soft landing: impulse, force over a chosen time, the stroke it needs ---')
M = 3007.0
W = M * g
Mearth = 5.9722e24
for v in (5, 20, 100):
    J = M * v
    for T in (0.1, 0.5, 2.0):
        F = J / T + W
        d = v * T / 2
        print(f'v={v} m/s: J={J:.3g} N s; over T={T} s mean ground force = {F/1e3:.0f} kN '
              f'({F/W:.1f} x his weight); constant-force stop needs {d:.2f} m of travel')
    print(f'   residual energy left in the Earth after taking J: J^2/(2 M_E) = {J*J/(2*Mearth):.1e} J')
print('force kept to the walking load 1.2 W needs T = v / (0.2 g):', ', '.join(f'v={v}: {v/(0.2*g):.1f} s' for v in (1, 5, 20)))
leg = 0.5 * 1.524   # engine body.strokes.leg = 0.5 * s
for v in (5, 20, 100):
    F = M * v * v / (2 * leg) + W
    print(f'stopping within his leg stroke {leg:.2f} m from {v} m/s: mean force {F/1e3:.0f} kN = {F/W:.0f} x weight, '
          f'pressure on two paw soles (2 x 0.31 m^2) {F/0.62/1e6:.2f} MPa, two boot soles (2 x 0.15) {F/0.30/1e6:.2f} MPa')
