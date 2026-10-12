import numpy as np
from numpy import sqrt, pi
def brentq(f,a,b,tol=1e-14):
    fa=f(a)
    for _ in range(200):
        m=0.5*(a+b); fm=f(m)
        if fa*fm<=0: b=m
        else: a=m; fa=fm
    return 0.5*(a+b)
for nu in [0.25,0.33,0.45]:
    g2=(1-2*nu)/(2*(1-nu))  # (cs/cp)^2
    # nondim: ks=1, mu=1, rho=1 => cs=1 (omega=1)
    kp=sqrt(g2)
    def R(k):
        na=sqrt(k*k-kp*kp); nb=sqrt(k*k-1)
        return (2*k*k-1)**2-4*k*k*na*nb
    kR=brentq(R,1.0000001,2.0)
    cR=1/kR
    h=1e-6; dR=(R(kR+h)-R(kR-h))/(2*h)
    na=sqrt(kR**2-kp**2); nb=sqrt(kR**2-1)
    # residue amplitude of uz for P=1: (1/(2pi)) * pi * |ks^2 na kR / R'| * |H0(kR r)|, |H0|~sqrt(2/(pi kR r))
    A=0.5*abs(na*kR/dR)   # uz = A*sqrt(2/(pi kR r))
    # coefficient in form C1*sqrt(ks/(2 pi xiR r)) with xiR=kR: A*sqrt(2/(pi kR)) = C1/sqrt(2 pi kR) -> C1 = A*sqrt(2/(pi kR))*sqrt(2 pi kR)=2A
    C1=2*A
    farcoef=C1/sqrt(2*pi*kR)
    # energy check: Rayleigh eigenfunctions (z>=0 depth), amplitude normalised to surface uz
    q=na; s=nb; k=kR
    z=np.linspace(0,60,600001)
    ux=k*(np.exp(-q*z)-(2*q*s/(s*s+k*k))*np.exp(-s*z))
    uz=q*(np.exp(-q*z)-(2*k*k/(s*s+k*k))*np.exp(-s*z))
    norm=uz[0]
    I=np.trapezoid((ux/norm)**2+(uz/norm)**2,z)   # integral of amp^2 per unit surface uz amplitude^2
    HV=abs(ux[0]/uz[0])
    # power through cylinder radius r: 2 pi r * cR * (rho w^2/2) * I * Uz^2 ; Uz = farcoef_disp/sqrt(r) where disp coef = C1/sqrt(2 pi kR)
    Uz2r=(C1/sqrt(2*pi*kR))**2
    P_R=2*pi*cR*0.5*I*Uz2r
    cp=1/kp
    MP=0.6735*1.209/(pi*cp**3) if abs(nu-0.25)<1e-9 else float('nan')
    print(f"nu={nu} cR/cs={cR:.5f} C1={C1:.5f} farcoef={farcoef:.5f} H/V={HV:.3f} P_R={P_R:.5f} MillerPursey_R={MP:.5f} near=(1-nu)/2pi={(1-nu)/(2*pi):.5f}")
