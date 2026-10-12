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
# sign convention: Ginf/r term = -(1-nu)/(2 pi mu r): displacement opposite to +z axis definition; compare magnitudes/phases via the static limit
print('static check, small omega:', Gfreq(1e-3,1.0), ' expected', -(1-nu)/(2*np.pi))
# time-domain comparison via Hann pulse
T=1.0; r=3.0   # c_s=1, so r/(cs T)=3
dt=1e-4; t=np.arange(0,40,dt)
F=np.where(t<T,0.5*(1-np.cos(2*np.pi*t/T)),0.0)
dF=np.gradient(F,dt)
# closed form: w(t)=sum dF(t-s) w_step(s r?) ; tau = s/r (cs=1)
s=np.arange(dt/2,40,dt)
ws=w_step(s/r)/r
from scipy.signal import fftconvolve
wcf=fftconvolve(dF,ws)[:len(t)]*dt
# frequency-domain synthesis
N=2**16; dtf=40/N; tf=np.arange(N)*dtf
Ff=np.where(tf<T,0.5*(1-np.cos(2*np.pi*tf/T)),0.0)
Fw=np.fft.rfft(Ff); om=2*np.pi*np.fft.rfftfreq(N,dtf)
Gw=np.zeros_like(Fw)
for i,o in enumerate(om):
    if o==0: Gw[i]=-(1-nu)/(2*np.pi*r); continue
    if o>2*np.pi*12/T: break
    Gw[i]=Gfreq(o,r)
# e^{iwt} convention in Gfreq vs numpy's e^{-iwt} forward FFT: conj
wfd=np.fft.irfft(Fw*np.conj(Gw),N)
import sys
for tt in [1.0,2.0,2.5,3.0,3.3,3.6,4.0,5.0,8.0]:
    i=int(tt/dt); j=int(tt/dtf)
    print(f"t={tt:5.2f}  closed={wcf[i]: .5e}  freqdom={wfd[j]: .5e}")
print('peak velocity closed:', np.max(np.abs(np.gradient(wcf,dt))), ' freqdom:', np.max(np.abs(np.gradient(wfd,dtf))))
