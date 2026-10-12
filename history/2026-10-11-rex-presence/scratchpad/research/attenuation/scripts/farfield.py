import numpy as np, json
C1=0.19957134; xiR=1.0876638
coef=C1/np.sqrt(2*np.pi*xiR)
print('coef 0.0763?',coef)
N=2**18; Tw=200; dt=Tw/N; t=np.arange(N)*dt - 50
def far(kind):
    if kind=='hann': f=np.where((t>=0)&(t<=1),0.5*(1-np.cos(2*np.pi*t)),0.0)
    if kind=='ramp':
        f=np.where(t<0,0.0,np.where(t<=1,0.5*(1-np.cos(np.pi*t)),1.0))
        f=np.gradient(f,dt)  # use derivative and divide by (i w) below
    F=np.fft.rfft(f); w=2*np.pi*np.fft.rfftfreq(N,dt)
    best=0
    for ph in [3*np.pi/4, -3*np.pi/4, np.pi/4, -np.pi/4]:
        H=np.exp(1j*ph)*w**1.5
        if kind=='ramp':
            H=np.where(w>0,H/(1j*w),0)
        h=np.fft.irfft(F*H,N)
        best=max(best,np.max(np.abs(h)))
        print(kind,'phase',round(ph,3),'max',np.max(np.abs(h))*coef)
    return best*coef
print('hann far Pi*sqrt(x):',far('hann'))
print('ramp far Pi*sqrt(x):',far('ramp'))
