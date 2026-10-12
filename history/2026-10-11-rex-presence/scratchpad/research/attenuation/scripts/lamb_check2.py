import numpy as np
from scipy.special import j0
from scipy.signal import fftconvolve
exec(open('lamb_common.py').read())
T=1.0
for r in [1.0,3.0,10.0]:
    dt=1e-4; tmax=r*1.5+5; t=np.arange(0,tmax,dt)
    F=np.where(t<T,0.5*(1-np.cos(2*np.pi*t/T)),0.0); dF=np.gradient(F,dt)
    s=np.arange(dt/2,tmax,dt); ws=w_step(s/r)/r
    wcf=fftconvolve(dF,ws)[:len(t)]*dt
    # freq domain
    N=2**15; Tw=tmax+20; dtf=Tw/N; tf=np.arange(N)*dtf
    Ff=np.where(tf<T,0.5*(1-np.cos(2*np.pi*tf/T)),0.0)
    Fw=np.fft.rfft(Ff); om=2*np.pi*np.fft.rfftfreq(N,dtf)
    Gw=np.zeros(len(om),complex)
    for i,o in enumerate(om):
        if o==0: Gw[i]=-(1-nu)/(2*np.pi*r); continue
        if o>2*np.pi*10/T: break
        Gw[i]=Gfreq(o,r)
    wfd=-np.fft.irfft(Fw*Gw,N)   # minus: Gfreq sign is opposite (static check)
    wfd2=-np.fft.irfft(Fw*np.conj(Gw),N)
    tt=np.arange(0,tmax,0.05)
    a=np.interp(tt,t,wcf); b=np.interp(tt,tf,wfd); c=np.interp(tt,tf,wfd2)
    print(f"r={r}: max|closed|={np.max(np.abs(a)):.4e}  rms diff (no conj)={np.sqrt(np.mean((a-b)**2)):.3e}  rms diff (conj)={np.sqrt(np.mean((a-c)**2)):.3e}")
    vc=np.gradient(wcf,dt); vf=np.gradient(wfd,dtf); vf2=np.gradient(wfd2,dtf)
    print(f"   PPV closed={np.max(np.abs(vc)):.4e}  freqdom={np.max(np.abs(vf[tf<tmax])):.4e} / conj {np.max(np.abs(vf2[tf<tmax])):.4e}")
    for x in [0.5*r,0.8*r,r,1.1*r,1.2*r,1.5*r,1.5*r+1]:
        print(f"     t={x:6.2f} closed={np.interp(x,t,wcf): .4e} fd={np.interp(x,tf,wfd): .4e} fdconj={np.interp(x,tf,wfd2): .4e}")
