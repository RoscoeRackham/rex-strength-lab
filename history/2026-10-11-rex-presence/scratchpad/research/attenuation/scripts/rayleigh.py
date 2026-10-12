import numpy as np

def brentq(f,a,b,tol=1e-14):
    fa=f(a)
    for _ in range(200):
        m=(a+b)/2; fm=f(m)
        if (fm>0)==(fa>0): a,fa=m,fm
        else: b=m
    return (a+b)/2
def consts(nu):
    g2 = (1-2*nu)/(2*(1-nu))   # (cs/cp)^2
    D = lambda x: (2*x*x-1)**2 - 4*x*x*np.sqrt(x*x-g2)*np.sqrt(x*x-1)
    xR = brentq(D, 1.0000001, 1.5)
    h=1e-7
    Dp = (D(xR+h)-D(xR-h))/(2*h)
    sa = np.sqrt(xR**2-g2)
    C1 = abs(xR*sa/Dp)
    # eigenfunction energy integral, k_s = 1 units
    k = xR; q = np.sqrt(k*k-g2); s = np.sqrt(k*k-1)
    A = 1.0
    B = -2j*k*q*A/(s*s+k*k)
    # u_x = i k A e^{-qz} + s B e^{-sz};  u_z = -q A e^{-qz} + i k B e^{-sz}
    ax, bx = 1j*k*A, s*B
    az, bz = -q*A, 1j*k*B
    def I2(a,b):  # integral |a e^{-qz} + b e^{-sz}|^2 dz
        return (abs(a)**2/(2*q) + abs(b)**2/(2*s) + 2*np.real(a*np.conj(b))/(q+s))
    Iint = I2(ax,bx)+I2(az,bz)
    W = az+bz
    U = ax+bx
    J = Iint*k/abs(W)**2       # I = J |W|^2 / k_R
    HV = abs(U)/abs(W)
    coefPR = J*C1**2/(2*xR**3)   # P_R = coefPR * w^2 F^2 /(rho cs^3)
    return dict(nu=nu, xi_R=xR, cR_over_cs=1/xR, C1=C1, J=J, HV=HV, coefPR=coefPR, g2=g2)
for nu in [0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.49]:
    c = consts(nu); print({k:(round(v,5) if isinstance(v,float) else v) for k,v in c.items()})
c=consts(0.25)
mp = 0.6735*1.209/(np.pi*3**1.5)
print('Miller-Pursey Rayleigh coef (x w^2 F^2/(rho cs^3)):', mp, ' mine:', c['coefPR'], ' ratio', c['coefPR']/mp)
print('Pekeris K/16 =', np.sqrt(3*np.sqrt(3)+5)/16, ' C1 =', c['C1'])
