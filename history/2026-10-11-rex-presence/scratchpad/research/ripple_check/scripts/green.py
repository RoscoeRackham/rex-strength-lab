# Numerical check of the radiated amplitude from an oscillating meniscus pressure P(x)=rho*A*zm*exp(-|x|/lc)
# (mirror-image form of a wall with free contact angle), deep water, capillary-gravity.
import numpy as np, math
g=9.80665; sig=0.07274; rho=998.0; lc=math.sqrt(sig/(rho*g))
A=1.0; zm=3.127e-3
def run(f, gam=0.3):
    w=2*math.pi*f
    kk=np.linspace(-40000,40000,4000001); dk=kk[1]-kk[0]
    Ph=rho*A*zm*2*lc/(1+(kk*lc)**2)
    wk2=g*np.abs(kk)+sig/rho*np.abs(kk)**3
    eta_h=-np.abs(kk)*Ph/(rho*(wk2-w*w-2j*gam*w))
    # analytic k
    k=brent(w); cg=(g+3*sig/rho*k*k)/(2*w)
    out=[]
    for x in [0.0, 0.03,0.06]:
        e=np.sum(eta_h*np.exp(1j*kk*x))*dk/(2*math.pi)
        out.append((x,abs(e)*math.exp(gam*x/cg)))
    a_formula=A*zm*k*lc/((1+(k*lc)**2)*w*cg)
    a_res=A/(2*g)*zm/math.sqrt(1+(k*lc)**2)
    return k,out,a_formula,a_res
def brent(w):
    lo,hi=1e-3,1e6
    for _ in range(200):
        m=math.sqrt(lo*hi)
        if g*m+sig/rho*m**3<w*w: lo=m
        else: hi=m
    return m
for f in [0.5,10,20,40]:
    k,out,af,ar=run(f)
    print(f"f={f}: k={k:.0f}; numeric |eta| (decay-corrected) at x=0,30,60 mm: "+", ".join(f"{o[1]*1e6:.1f}um" for o in out)+f"; formula far-field {af*1e6:.1f}um; researcher {ar*1e6:.1f}um; static A zm/2g {A*zm/(2*g)*1e6:.1f}um")
