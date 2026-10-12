import numpy as np
pi=np.pi
N=2**20; dt=1e-4  # T=1
t=np.arange(N)*dt
T=1.0
hann=np.where(t<=T,0.5*(1-np.cos(2*pi*t/T)),0.0)
# ramp derivative: dF/dt = (pi/(2 tau)) sin(pi t/tau) for t<tau
tau=1.0
rampdot=np.where(t<=tau,(pi/(2*tau))*np.sin(pi*t/tau),0.0)
f=np.fft.rfftfreq(N,dt); w=2*pi*f
def frac(x,alpha):
    X=np.fft.rfft(x)
    m=(1j*w)**alpha
    return np.fft.irfft(X*m,N)
d15h=frac(hann,1.5); d05r=frac(rampdot,0.5)
ch=np.abs(d15h).max(); cr=np.abs(d05r).max()
print("max|D1.5 hann| =",ch," -> far const 0.07634*c =",0.07634*ch)
print("max|D0.5 rampdot| =",cr," -> far const =",0.07634*cr)
# sanity: D^1 of hann max = pi
print("check D1 hann max",np.abs(frac(hann,1.0)).max(), "pi=",pi)
