import math
G = 6.67430e-11
def shells_U(layers, R, N=20000):
    # layers: function rho(r); integrate U = int G M(r) dm / r and M, I
    M = 0.0; U = 0.0; I = 0.0
    dr = R/N
    for i in range(N):
        r = (i+0.5)*dr
        rho = layers(r)
        dm = 4*math.pi*r*r*rho*dr
        Min = M + 0.5*dm
        U += G*Min*dm/r
        I += 2/3*dm*r*r
        M += dm
    return M, U, I/(M*R*R)

def two_layer(rc, rhoc, rhom):
    return lambda r: rhoc if r < rc else rhom

def fit_two_layer(M, R, moi, rc):
    # solve for rhoc, rhom given mass and MoI
    x = rc/R
    V = 4/3*math.pi*R**3
    # M = V*(rhom + (rhoc-rhom) x^3); I/(M R^2) = 0.4*(rhom + (rhoc-rhom) x^5)/(rhom + (rhoc-rhom)x^3)
    rbar = M/V
    # let d = rhoc - rhom: rhom + d x^3 = rbar ; 0.4*(rhom + d x^5) = moi*rbar
    # subtract: d (x^3 - x^5) = rbar - moi*rbar/0.4
    d = rbar*(1 - moi/0.4)/(x**3 - x**5)
    rhom = rbar - d*x**3
    return rhom + d, rhom

print('--- Mars (M=6.4169e23, R=3389.5 km, MoI 0.366); uniform U = 4.865e30')
for rc in [1500e3, 1700e3, 1830e3, 2000e3]:
    rc_, rm = fit_two_layer(6.4169e23, 3389.5e3, 0.366, rc)
    M, U, moi = shells_U(two_layer(rc, rc_, rm), 3389.5e3)
    print(f'rc={rc/1e3:.0f} km rho_c={rc_:.0f} rho_m={rm:.0f} -> M={M:.4e} MoI={moi:.4f} U={U:.4e} ratio={U/4.8649e30:.3f}')
print('--- Moon (MoI 0.394); uniform 1.2438e29')
for rc in [300e3, 400e3, 500e3]:
    rc_, rm = fit_two_layer(7.346e22, 1737.4e3, 0.394, rc)
    M, U, moi = shells_U(two_layer(rc, rc_, rm), 1737.4e3)
    print(f'rc={rc/1e3:.0f} km rho_c={rc_:.0f} rho_m={rm:.0f} -> MoI={moi:.4f} U={U:.4e} ratio={U/1.2438e29:.3f}')
print('--- Pluto: ice mantle + rock core, fit mean density 1854; uniform 5.7231e27')
Mp, Rp = 1.303e22, 1188e3
V = 4/3*math.pi*Rp**3; rbar = Mp/V
for rhom in [950, 1000]:
    for rhoc in [2500, 3000, 3500]:
        x3 = (rbar - rhom)/(rhoc - rhom); rc = Rp*x3**(1/3)
        M, U, moi = shells_U(two_layer(rc, rhoc, rhom), Rp)
        print(f'rho_m={rhom} rho_c={rhoc} rc={rc/1e3:.0f} km -> M={M:.4e} MoI={moi:.3f} U={U:.4e} ratio={U/5.7231e27:.3f}')
print('--- Earth PREM (Dziewonski & Anderson 1981 polynomials, via GENIE source)')
def prem(r):
    rk = r/1e3; x = rk/6371.0
    if rk <= 1221.5: p = 13.0885 - 8.8381*x*x
    elif rk <= 3480.0: p = 12.5815 - 1.2638*x - 3.6426*x*x - 5.5281*x**3
    elif rk <= 5701.0: p = 7.9565 - 6.4761*x + 5.5283*x*x - 3.0807*x**3
    elif rk <= 5771.0: p = 5.3197 - 1.4836*x
    elif rk <= 5971.0: p = 11.2494 - 8.0298*x
    elif rk <= 6151.0: p = 7.1089 - 3.8045*x
    elif rk <= 6346.6: p = 2.691 + 0.6924*x
    elif rk <= 6356.0: p = 2.90
    elif rk <= 6368.0: p = 2.60
    else: p = 1.02
    return p*1000
M, U, moi = shells_U(prem, 6371e3, 200000)
print(f'PREM: M={M:.5e} MoI={moi:.4f} U={U:.5e}; scaled to M=5.9722e24: U*(M0/M)^2={U*(5.9722e24/M)**2:.4e}')

print('--- Lane-Emden polytropes: MoI and U factor')
def lane_emden(n, h=1e-5):
    # integrate theta'' = -theta^n - 2/xi theta'
    xi = 1e-6; th = 1 - xi*xi/6; dth = -xi/3
    pts = []
    while th > 0:
        def f(xi, th, dth): return dth, -(max(th,0))**n - 2/xi*dth
        k1 = f(xi, th, dth); k2 = f(xi+h/2, th+h/2*k1[0], dth+h/2*k1[1]); k3 = f(xi+h/2, th+h/2*k2[0], dth+h/2*k2[1]); k4 = f(xi+h, th+h*k3[0], dth+h*k3[1])
        th += h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]); dth += h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]); xi += h
        pts.append((xi, max(th,0)**n))
    return xi, pts
for n in [0.5, 1.0, 1.1, 1.2]:
    xi1, pts = lane_emden(n, 1e-4)
    # rho ∝ theta^n ; build profile
    R = xi1
    N = len(pts)
    M=0; I=0; U=0
    prev = 0
    for i,(xi,rho) in enumerate(pts):
        dr = xi - prev; prev = xi
        dm = 4*math.pi*xi*xi*rho*dr
        U += (M+0.5*dm)*dm/xi; I += 2/3*dm*xi*xi; M += dm
    print(f'n={n}: xi1={xi1:.4f} MoI={I/(M*R*R):.4f} U/(GM^2/R)={U*R/(M*M):.4f} (Ritter 3/(5-n)={3/(5-n):.4f})')
