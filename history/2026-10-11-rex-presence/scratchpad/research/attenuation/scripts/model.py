import numpy as np, json
d=json.load(open('ppv_table.json')); X=np.array(d['x'])
def Pi(kind,x):
    y=np.array(d[kind]); return np.exp(np.interp(np.log(x),np.log(X),np.log(y)))
def ppv(Fp,T,r,rho,cs,kind='hann',xi=0.0):
    x=r/(cs*T); cR=0.9194*cs; f=1.0/T
    alpha=2*np.pi*xi*f/cR
    return Fp/(rho*cs**3*T**2)*Pi(kind,x)*np.exp(-alpha*r)
if __name__=='__main__':
    # Pisa drop load: 130 kg from 3 m, p=997.4 kg m/s
    p=997.4; meas={2.5:9,5:5,35:0.5,60:0.2}
    for cs in [150,170,200]:
      for T in [0.02,0.03,0.04]:
        Fp=2*p/T
        for xi in [0.0,0.03,0.05]:
            s=' '.join(f"{r}m:{1000*ppv(Fp,T,r,1850,cs,'hann',xi):.3g}" for r in meas)
            print(f"cs={cs} T={T} Fp={Fp/1e3:.0f}kN xi={xi}: {s}   (meas {meas})")
