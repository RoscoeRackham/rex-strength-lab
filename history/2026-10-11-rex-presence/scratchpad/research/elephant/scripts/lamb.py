# Sanity check: Rayleigh-wave vertical surface displacement from a vertical harmonic point force
# on a Poisson (nu=0.25) half-space (Lamb 1904 pole residue), to compare with measured elephant amplitudes.
import math
nu = 0.25
kb = 1.0
ka = kb * math.sqrt((1 - 2*nu) / (2*(1 - nu)))  # = 1/sqrt(3)
def FR(k):
    na = math.sqrt(k*k - ka*ka); nb = math.sqrt(k*k - kb*kb)
    return (2*k*k - kb*kb)**2 - 4*k*k*na*nb
# find Rayleigh root k_R > kb
lo, hi = 1.0001, 1.5
for _ in range(200):
    mid = (lo+hi)/2
    if FR(lo)*FR(mid) <= 0: hi = mid
    else: lo = mid
kR = (lo+hi)/2
h = 1e-7
dFR = (FR(kR+h) - FR(kR-h)) / (2*h)
na = math.sqrt(kR*kR - ka*ka)
G = kR * kb*kb * na / abs(dFR)   # dimensionless (in units of kb)
print('cR/cs = %.4f, G = %.4f' % (1/kR, G))
def uz(F, mu, cs, f, r):
    kbeta = 2*math.pi*f/cs
    kRr = kR*kbeta
    return F*kbeta/(2*mu) * G * math.sqrt(2/(math.pi*kRr*r))
for (name, rho, cs) in [('loose sand', 1700, 120), ('dense soil', 1900, 250), ('soft rock', 2200, 600)]:
    mu = rho*cs*cs
    for F in (125, 946):
        for f in (20,):
            row = []
            for r in (2, 5, 10, 20, 40):
                u = uz(F, mu, cs, f, r); v = 2*math.pi*f*u
                row.append('r=%dm v=%.2g m/s' % (r, v))
            print(name, 'F=%dN f=%dHz:' % (F, f), '; '.join(row))
