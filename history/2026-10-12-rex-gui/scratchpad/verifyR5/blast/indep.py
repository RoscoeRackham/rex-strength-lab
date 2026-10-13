import json, math, sys
from decimal import Decimal as mpf, getcontext
getcontext().prec = 60
msqrt = lambda v: v.sqrt()
c = 299792458.0; rho0 = 1.225; p0 = 101325.0; g = 9.80665; Hs = p0/(rho0*g); TNT = 4.184e6
def kg(Z):
    return 808*(1+(Z/4.5)**2)/(math.sqrt(1+(Z/0.048)**2)*math.sqrt(1+(Z/0.32)**2)*math.sqrt(1+(Z/1.35)**2))
def Zof(ratio):
    # kgRatio is decreasing in Z over the range used; solve with brentq-like bisection in log space
    lo, hi = 1e-3, 1e8
    for _ in range(400):
        mid = math.sqrt(lo*hi)
        if kg(mid) > ratio: lo = mid
        else: hi = mid
    return math.sqrt(lo*hi)
def radius(E, dp):
    if E <= 0: return 0.0
    return Zof(dp/p0) * (E/TNT)**(1/3)
def snow_within(m, A, E, theta, k, d):
    # independent: invariant-mass snowplow, gamma_f = (g0 + x)/sqrt(1 + 2 g0 x + x^2); air takes (g0 - gf) m c^2
    m = mpf(repr(m)); E = mpf(repr(E))
    g0 = 1 + E/(m*mpf(repr(c))**2)
    L = Hs/max(math.sin(math.radians(theta)), 0.03)
    x = mpf(repr(k))*mpf(repr(rho0))*mpf(repr(A))*mpf(repr(min(d, L)))/m
    gf = (g0 + x)/msqrt(1 + 2*g0*x + x*x)
    return float((g0 - gf)*m*mpf(repr(c))**2)
def reach(m, A, E, theta, k, Enear, dp):
    # fixed point R = radius(max(Enear, snow(R))) by bisection on h(R) = radius(E(R)) - R in log space
    f = lambda R: radius(max(Enear, snow_within(m, A, E, theta, k, R)), dp) - R
    lo, hi = 1e-6, 1e13
    if f(lo) < 0: return 0.0
    for _ in range(300):
        mid = math.sqrt(lo*hi)
        if f(mid) > 0: lo = mid
        else: hi = mid
    return math.sqrt(lo*hi)
rows = json.load(open(sys.argv[1]))
for x in rows:
    if not x['rel'] or x['sh'] in (0, 1): continue
    k = 1 - x['sh']; Enear = max(x['land'], x['path'])
    out = []
    for key, dp in (('air', 100), ('airRattle', 36), ('windows', 6900), ('houses', 26800)):
        R = reach(x['m'], x['A'], x['E'], x['ang'], k, Enear, dp)
        out.append('%s eng %.5g indep %.5g rel %.1e' % (key, x[key], R, (x[key]-R)/R if R else 0))
    print(x['id'], x['ang'], x['sh'], ' | '.join(out))
