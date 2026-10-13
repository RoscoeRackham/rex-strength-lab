# Gravitational binding energy of Earth from PREM (Dziewonski & Anderson 1981, Table I density polynomials)
import math
G = 6.67430e-11  # CODATA 2018
a = 6371.0e3
# (r_in_km, r_out_km, [c0, c1, c2, c3]) density in g/cm^3 as polynomial in x = r/a
layers = [
    (0.0, 1221.5, [13.0885, 0, -8.8381, 0]),
    (1221.5, 3480.0, [12.5815, -1.2638, -3.6426, -5.5281]),
    (3480.0, 5701.0, [7.9565, -6.4761, 5.5283, -3.0807]),
    (5701.0, 5771.0, [5.3197, -1.4836, 0, 0]),
    (5771.0, 5971.0, [11.2494, -8.0298, 0, 0]),
    (5971.0, 6151.0, [7.1089, -3.8045, 0, 0]),
    (6151.0, 6346.6, [2.6910, 0.6924, 0, 0]),
    (6346.6, 6356.0, [2.900, 0, 0, 0]),
    (6356.0, 6368.0, [2.600, 0, 0, 0]),
    (6368.0, 6371.0, [1.020, 0, 0, 0]),
]
def rho(r):
    x = r / a
    for r0, r1, c in layers:
        if r0*1e3 <= r <= r1*1e3 + 1e-6:
            return 1000.0 * (c[0] + c[1]*x + c[2]*x*x + c[3]*x**3)
    raise ValueError(r)
N = 400000
dr = a / N
M = 0.0; U = 0.0; I = 0.0
for i in range(N):
    r = (i + 0.5) * dr
    dm = 4*math.pi*r*r*rho(r)*dr
    Mmid = M + dm/2
    U += G * Mmid * dm / r
    I += (2/3) * r*r * dm
    M += dm
print(f"M = {M:.5e} kg (NASA fact sheet 5.9722e24)")
print(f"U = {U:.5e} J")
print(f"I/(M a^2) = {I/(M*a*a):.4f} (PREM ~0.3308)")
Mu = 5.9722e24
print(f"uniform 3GM^2/5R with M=5.9722e24, R=6.371e6: {3*G*Mu**2/(5*a):.4e} J")
print(f"U scaled to M=5.9722e24 (U ~ M^2): {U*(Mu/M)**2:.4e} J")
