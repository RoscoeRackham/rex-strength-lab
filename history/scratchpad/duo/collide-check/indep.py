# Independent recomputation of the Collide design's test cases (50-digit Decimal arithmetic).
# Does not import the engine or the reference implementation.
from decimal import Decimal as D, getcontext
getcontext().prec = 60
import math

c = D(299792458); c2 = c * c
g = D('9.80665'); G = D('6.6743e-11'); ME = D('5.9722e24'); RE = D('6.371e6')
rho0 = D('1.225')
PI = D('3.14159265358979323846264338327950288419716939937510')

def sqrt(x): return D(x).sqrt()
def ln(x): return D(x).ln()
def tanh(x):
    e = (2 * x).exp(); return (e - 1) / (e + 1)

def gamma_from_v(v): return 1 / sqrt(1 - (v / c) ** 2)

def head_on(p, mA, mT):
    """Target at rest. Boost to CM frame with Lorentz velocity transforms (no rapidities)."""
    EA = sqrt((mA * c2) ** 2 + (p * c) ** 2)
    Etot = EA + mT * c2
    M = sqrt(Etot ** 2 - (p * c) ** 2) / c2          # invariant mass, from the definition
    Q = (M - mA - mT) * c2                             # direct (high precision, cancellation is harmless at 60 digits)
    V = p * c2 / Etot                                  # CM velocity = common velocity after a splat
    vA = p * c2 / EA                                   # charger speed
    # velocities in CM frame
    def to_cm(u): return (u - V) / (1 - u * V / c2)
    def from_cm(u): return (u + V) / (1 + u * V / c2)
    uA = to_cm(vA); uT = to_cm(D(0))
    vA2 = from_cm(-uA); vT2 = from_cm(-uT)            # elastic: reverse velocities in the CM frame
    gA = gamma_from_v(uA); pstar = mA * gA * uA       # CM momentum
    # conservation check
    pA2 = mA * vA2 * gamma_from_v(vA2); pT2 = mT * vT2 * gamma_from_v(vT2)
    E2 = mA * c2 * gamma_from_v(vA2) + mT * c2 * gamma_from_v(vT2)
    return dict(Q=Q, V=V, M=M, vA=vA2, vT=vT2, pstar=pstar, KA=EA - mA * c2,
                dp=(pA2 + pT2 - p) / p, dE=(E2 - Etot) / Etot)

def show(name, d, keys):
    print(name, ', '.join(f"{k}={float(d[k]):.6g}" for k in keys))

# ---- headOn tests
m = D(180)
v = D('46.4916'); h = head_on(m * v, m, m); show('T1 equal non-rel', h, ['Q', 'V', 'vA', 'vT', 'pstar'])
gb = D('0.5') / sqrt(D('0.75')); h = head_on(gb * m * c, m, D(360)); show('T2 0.5c into 360', h, ['Q', 'M', 'dp', 'dE']); print('   V/c', float(h['V'] / c), 'vA/c', float(h['vA'] / c), 'vT/c', float(h['vT'] / c))
gb = D('0.9') / sqrt(1 - D('0.81')); h = head_on(gb * m * c, m, m); show('T3 0.9c equal', h, ['Q', 'M']); print('   V/c', float(h['V'] / c), 'vA', float(h['vA']), 'vT/c', float(h['vT'] / c), 'TNT Gt', float(h['Q'] / D('4.184e18')))
h = head_on(D('1e-5') * m * c, m, D('7.416e16')); show('T4 heavy target', h, ['Q', 'dp']); print('   vT/c', float(h['vT'] / c))
# infinite-momentum bounce limit: large p
for big in [D('1e6'), D('1e9')]:
    h = head_on(big * m * c, m, D(360)); print('T5 p=%g mc: vA/c' % float(big), float(h['vA'] / c))

# ---- body model (engine conventions, recomputed by hand)
V0 = D('0.18'); r_eq = (3 * V0 / (4 * PI)) ** (D(1) / D(3)); L = 2 * r_eq; s = L / 2
W = m * g
thrust = D('0.6') * W
k = D('0.5') * rho0 * D('0.8')
vtop = sqrt(2 * thrust / (rho0 * D('0.8')))
print('depth L', float(L), 's', float(s), 'vTop', float(vtop))
HULK = 100 * D('907.18474') * g
print('Hulk F', float(HULK))
KA = m * vtop ** 2 / 2
Fheld = KA / s
print('C1 KA', float(KA), 'Fheld', float(Fheld))

def splat_footing(mA, mB, v, s, H):
    mu = mA * mB / (mA + mB); arel = v * v / (2 * s)
    F = mu * (arel + H / mB); tau = v / arel
    V = v - F * tau / mA; xB = ((F - H) / mB) * tau * tau / 2
    return dict(F=F, tau=tau, V=V, Q=F * s, xB=xB)

def slide(mm, v, R, A):
    kk = D('0.5') * rho0 * A
    return mm / (2 * kk) * ln(1 + kk * v * v / R)

H = D('0.6') * W
pf = splat_footing(m, m, vtop, s, H)
print('C1 partial F', float(pf['F']), 'tau', float(pf['tau']), 'V', float(pf['V']), 'Q', float(pf['Q']), 'xB', float(pf['xB']))
sl = slide(2 * m, pf['V'], 2 * H, D('0.8'))
print('C1 slide', float(sl), 'moved', float(sl + pf['xB']))
print('C1 bounce slide', float(slide(m, vtop, H, D('0.8'))))
# energy audit
print('C1 energy: KE0', float(KA), ' = KEpair', float(m * pf['V'] ** 2), '+ Q', float(pf['Q']), '+ H xB', float(H * pf['xB']), ' sum', float(m * pf['V'] ** 2 + pf['Q'] + H * pf['xB']))
# light ceiling
pstar = m * vtop / 2
gbs = pstar / (m * c); gs = sqrt(1 + gbs * gbs); bs = gbs / gs
tc = L / (gs * c * (1 + bs)); print('C1 light ceiling F', float(pstar / tc), 't', float(tc), ' matter F', float(pstar / (L / 36100)))
# C2 bolted
p = m * vtop
print('C2 dvE', float(p / (ME + m)), 't1mm', float(D('1e-3') / (p / (ME + m))), 'x age', float(D('1e-3') / (p / (ME + m)) / (D('13.787e9') * D('3.15576e7'))))
rT = sqrt(Fheld / (2 * PI * D('8.38e6'))); rC = sqrt(Fheld / (2 * PI * D('2e8')))
print('C2 rT', float(rT), 'rC', float(rC), 'tear', float(Fheld / (D('1.5e6') * D('0.2'))), 'quake', (math.log10(float(KA) * 1e-4) - 4.8) / 1.5)
# day change for C2 (they print it though run-up cancels)
Tsid = D('23.9345') * 3600
print('C2 dT', float(Tsid ** 2 * p / (2 * PI * D('0.3308') * ME * RE)))

# C3 granite
thr = D('0.5') * W; v3 = sqrt(2 * thr / (rho0 * D('0.8'))); K3 = m * v3 ** 2 / 2
print('C3 v', float(v3), 'Q', float(K3), 'Fheld splat', float(K3 / s), 'Fheld BOUNCE peak (2Q/s)', float(2 * K3 / s), 'H', float(HULK), 'claws', float(thr + D('36e6') * D('0.2')))
# C4 claws concrete
H4 = D('0.6') * W + D('1.5e6') * D('0.2'); pf4 = splat_footing(m, m, vtop, s, H4)
print('C4 F', float(pf4['F']), 'V', float(pf4['V']), 'Q', float(pf4['Q']), 'xB', float(pf4['xB']), 'slide', float(slide(2 * m, pf4['V'], D('0.6') * W + H4, D('0.8'))))
print('C4 bounce peak force (free) 2Q/s', float(2 * (m * vtop ** 2 / 4) / s), ' vs H', float(H4))
# C7 0.9c free
gb9 = D('0.9') / sqrt(D('0.19')); p9 = gb9 * m * c; h9 = head_on(p9, m, m)
print('C7 Q', float(h9['Q']), 'soft F', float(h9['Q'] / s), 't', float(h9['pstar'] * s / h9['Q']))
gbs = h9['pstar'] / (m * c); gs = sqrt(1 + gbs * gbs); bs = gbs / gs; tc = L / (gs * c * (1 + bs))
print('C7 light F', float(h9['pstar'] / tc), 't', float(tc), 'air', float(D('0.49') * (gb9 * c) ** 2 * 20), 'KA', float(h9['KA']))
# C8 held 0.9c
h8 = head_on(p9, m, m + ME)
print('C8 Q', float(h8['Q']), 'quake', (math.log10(float(h8['Q']) * 1e-4) - 4.8) / 1.5, 'dvE', float(p9 / (ME + m)), 'dT', float(Tsid ** 2 * p9 / (2 * PI * D('0.3308') * ME * RE)))
F8 = h8['Q'] / s; rT8 = sqrt(F8 / (2 * PI * D('8.38e6')))
tau8 = h8['pstar'] * s / h8['Q']
print('C8 soft F', float(F8), 'tau', float(tau8), 'rT', float(rT8), ' P-wave reach in tau (5.5 km/s):', float(D(5500) * tau8), 'm')
# C12 NS Rex
mB = D('4.12e17') * D('0.18'); d0 = D(20); dC = L
vf2 = 2 * G * (m + mB) * (1 / dC - 1 / d0); vrel = sqrt(vtop ** 2 + vf2)
print('C12 vf', float(sqrt(vf2)), 'vRel', float(vrel), 'Q', float(m * vrel ** 2 / 2), 'gNear', float(G * m * mB / dC ** 2), 'H', float(D('0.6') * mB * g))
vesc = sqrt(2 * G * (m + mB) / dC); print('C12 escape at contact', float(vesc))
# g at 20 m from NS Rex, in g's
print('C12 pull on Ollie at 20 m: %.4g m/s^2 = %.4g g' % (float(G * mB / 400), float(G * mB / 400 / g)))
# C13
mm = mB; Q13 = G * mm * mm * (1 / dC - 1 / d0) + (mm / 2) * 1 / 2
print('C13 Q', float(Q13), 'vRel', float(sqrt(1 + 2 * G * 2 * mm * (1 / dC - 1 / d0))))
# C15 real
v15 = D('17.9'); pf15 = splat_footing(m, m, v15, s, H)
print('C15 F', float(pf15['F']), 'tau', float(pf15['tau']), 'V', float(pf15['V']), 'Q', float(pf15['Q']), 'moved', float(pf15['xB'] + slide(2 * m, pf15['V'], 2 * H, D('0.8'))))
# C18
F18 = D('1e20') * g; uleg = D('12.42') * sqrt((F18 - W) / (511 * g - 180 * g)); udrag = sqrt(2 * F18 / D('0.98'))
p18 = m * uleg; g18 = sqrt(1 + (uleg / c) ** 2); K18 = (g18 - 1) * m * c2
print('C18 uleg', float(uleg), 'udrag', float(udrag), 'gb', float(uleg / c), 'p', float(p18), 'K', float(K18), 'Gt', float(K18 / D('4.184e18')), 'air', float(D('0.49') * uleg ** 2 * 20))
# C19
v19 = D(11200); print('C19 Q', float(m * v19 ** 2 / 4), 'slide pair', float(slide(2 * m, v19 / 2, 2 * H, D('0.8'))), 'bounce slide', float(slide(m, v19, H, D('0.8'))))
# C22 plush
mB22 = D(30) * D('0.18'); H22 = D('0.6') * mB22 * g; pf22 = splat_footing(m, mB22, vtop, s, H22)
print('C22 H', float(H22), 'V', float(pf22['V']), 'Q', float(pf22['Q']))
# Push rock thresholds and F_HALVES
print('crack-through C', float(2 * PI * D('8.38e6')), 'beyond crust C', float(2 * PI * D('8.38e6') * D(41100) ** 2), 'F_HALVES', float(3 * G * ME * ME / (16 * RE * RE)))
# dipole correction: pair of opposite anchor loads 2 m apart; far-field stress ~ C d/(2 pi r^3)
for C in [D('9.80665e10'), D('9.80665e16'), D('5.9722e24') * g]:
    r_single = sqrt(C / (2 * PI * D('8.38e6'))); r_dip = (C * 2 / (2 * PI * D('8.38e6'))) ** (D(1) / D(3))
    print('push C=%.3g: single-anchor rT %.4g m, dipole rT %.4g m' % (float(C), float(r_single), float(r_dip)))
# set-speed air heating vs kinetic energy: gamma where 0.49*20*(gb)^2 c^2 = (gamma-1) 180 c^2
for gbv in [1, 5, 10, 18, 20, 100, 1e4]:
    gbv = D(gbv); air = D('0.49') * 20 * gbv ** 2; ke = (sqrt(1 + gbv ** 2) - 1) * 180
    print('gb %g: air/KE = %.3g' % (float(gbv), float(air / ke)))
