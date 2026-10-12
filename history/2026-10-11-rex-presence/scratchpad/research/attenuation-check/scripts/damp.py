import numpy as np
pi=np.pi
N=2**21; dt=2e-4
t=np.arange(N)*dt
hann=np.where(t<=1,0.5*(1-np.cos(2*pi*t)),0.0)
rampdot=np.where(t<=1,(pi/2)*np.sin(pi*t),0.0)
f=np.fft.rfftfreq(N,dt); w=2*pi*f
H=np.fft.rfft(hann)*(1j*w)**1.5
R=np.fft.rfft(rampdot)*(1j*w)**0.5
h0=np.abs(np.fft.irfft(H,N)).max(); r0=np.abs(np.fft.irfft(R,N)).max()
fitH=lambda z:(1+(z/0.224)**1.4)**(-2.5/1.4)
fitR=lambda z:(1+(z/0.195)**2.05)**(-1.5/2.05)
print(" zeta   D_hann  fit   ratio |  D_ramp  fit  ratio")
for z in [0.001,0.01,0.0316,0.1,0.316,0.43,1,3.16,10,31.6,100]:
    a=np.exp(-w*z)
    dh=np.abs(np.fft.irfft(H*a,N)).max()/h0
    dr=np.abs(np.fft.irfft(R*a,N)).max()/r0
    print(f"{z:7.4f} {dh:.3e} {fitH(z):.3e} {fitH(z)/dh:5.2f} | {dr:.3e} {fitR(z):.3e} {fitR(z)/dr:5.2f}")
