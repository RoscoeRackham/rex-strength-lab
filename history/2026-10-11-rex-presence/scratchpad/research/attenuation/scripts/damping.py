import numpy as np, json
N=2**18; Tw=400; dt=Tw/N; t=np.arange(N)*dt - 100
w=2*np.pi*np.fft.rfftfreq(N,dt)
def pulseF(kind):
    if kind=='hann': f=np.where((t>=0)&(t<=1),0.5*(1-np.cos(2*np.pi*t)),0.0); return np.fft.rfft(f)
    if kind=='ramp':
        f=np.where(t<0,0.0,np.where(t<=1,0.5*(1-np.cos(np.pi*t)),1.0)); df=np.gradient(f,dt)
        F=np.fft.rfft(df); return np.where(w>0,F/(1j*np.where(w>0,w,1)),0)
out={}
zetas=np.concatenate([[0],np.logspace(-3,2,51)])
for kind in ['hann','ramp']:
    F=pulseF(kind)
    H=np.exp(1j*3*np.pi/4)*w**1.5
    base=np.max(np.abs(np.fft.irfft(F*H,N)))
    D=[]
    for z in zetas:
        # attenuation exp(-w * xi * r / cR) ; in units T=1: exponent = w*zeta where zeta = xi*r/(cR*T)
        h=np.fft.irfft(F*H*np.exp(-w*z),N)
        D.append(np.max(np.abs(h))/base)
    out[kind]=D
    print(kind)
    for z,dv in zip(zetas,D):
        if z==0 or abs(np.log10(z)*10-round(np.log10(z)*10))<1e-6 and round(np.log10(z)*10)%5==0:
            print(f"   zeta={z:8.4f}  D={dv:.4g}   D*zeta^1.5={dv*z**1.5 if z>0 else 0:.4g}")
json.dump({'zeta':zetas.tolist(),**out},open('damping.json','w'))
# fit D ~ (1 + (z/z0)^p)^(-1.5/p)
for kind in ['hann','ramp']:
    D=np.array(out[kind]); z=zetas
    best=None
    for z0 in np.logspace(-2,1,121):
        for p in np.arange(0.5,4.01,0.1):
            f=(1+(z/z0)**p)**(-1.5/p)
            e=np.max(np.abs(np.log(f[1:]/D[1:])))
            if best is None or e<best[0]: best=(e,z0,p)
    print(kind,'fit D=(1+(zeta/z0)^p)^(-1.5/p): z0=%.4f p=%.2f max factor err %.3f'%(best[1],best[2],np.exp(best[0])))
