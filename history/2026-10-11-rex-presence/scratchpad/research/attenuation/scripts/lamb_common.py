# Compare (a) Pekeris-type closed form for step vertical point load (nu=1/4, as recalled)
# with (b) numerical wavenumber integral of the frequency-domain Green's function.
import numpy as np
from scipy.special import j0, jv
nu=0.25; g2=(1-2*nu)/(2*(1-nu))
gR=np.sqrt((3+np.sqrt(3))/4)
K=np.sqrt(3*np.sqrt(3)+5)
def w_step(tau):  # displacement * (mu r / P), positive = in load direction
    tau=np.asarray(tau,float); w=np.zeros_like(tau)
    a=(tau>1/np.sqrt(3))&(tau<1)
    t=tau[a]
    w[a]=(1/(32*np.pi))*(6-np.sqrt(3)/np.sqrt(t**2-0.25)-K/np.sqrt(gR**2-t**2)+np.sqrt(3*np.sqrt(3)-5)/np.sqrt(t**2-(3-np.sqrt(3))/4))
    b=(tau>=1)&(tau<gR); t=tau[b]
    w[b]=(1/(16*np.pi))*(6-K/np.sqrt(gR**2-t**2))
    c=tau>=gR
    w[c]=6/(16*np.pi)
    return w
# frequency domain Green's function u_z(r,w)*mu/F, with damping delta, c_s=1, r given
def Gfreq(om, r, delta=0.002):
    ks=om*(1-1j*delta); kp=ks*np.sqrt(g2)
    # k grid
    kR=gR*om
    kmax=max(60*om, 60/r)
    # nonuniform grid: dense around poles/branch points
    k1=np.linspace(0,kmax,200001)
    k=k1+0j
    na=np.sqrt(k**2-kp**2); nb=np.sqrt(k**2-ks**2)
    R=(2*k**2-ks**2)**2-4*k**2*na*nb
    G=ks**2*na*k/R
    Ginf=-(1-nu)
    f=(G-Ginf)*j0(k1*r)
    I=np.trapezoid(f,k1)
    mu=(1-1j*delta)**2
    return (I+Ginf/r)/(2*np.pi*mu)
