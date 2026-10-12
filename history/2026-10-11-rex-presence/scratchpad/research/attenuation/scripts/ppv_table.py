import numpy as np, json, sys
from scipy.signal import fftconvolve
nu=0.25
gR=np.sqrt((3+np.sqrt(3))/4); K=np.sqrt(3*np.sqrt(3)+5)
def w_step(tau):
    tau=np.asarray(tau,float); w=np.zeros_like(tau)
    a=(tau>1/np.sqrt(3))&(tau<1); t=tau[a]
    w[a]=(1/(32*np.pi))*(6-np.sqrt(3)/np.sqrt(t**2-0.25)-K/np.sqrt(gR**2-t**2)+np.sqrt(3*np.sqrt(3)-5)/np.sqrt(t**2-(3-np.sqrt(3))/4))
    b=(tau>=1)&(tau<gR); t=tau[b]
    w[b]=(1/(16*np.pi))*(6-K/np.sqrt(gR**2-t**2))
    w[tau>=gR]=6/(16*np.pi)
    return w
def pulse(kind,t):
    if kind=='hann':   # 0.5(1-cos 2pi t), 0<=t<=1
        f=np.where((t>=0)&(t<=1),0.5*(1-np.cos(2*np.pi*t)),0.0)
    elif kind=='halfsine':
        f=np.where((t>=0)&(t<=1),np.sin(np.pi*t),0.0)
    elif kind=='ramp':   # raised-cosine rise over 1 then hold
        f=np.where(t<0,0.0,np.where(t<=1,0.5*(1-np.cos(np.pi*t)),1.0))
    return f
def ppv(kind,x,n_per_T=4000):
    # c_s=1, T=1, F_p=1, rho=1 -> PPV in units F_p/(rho cs^3 T^2)
    dt=1/n_per_T
    t0=max(x/np.sqrt(3)-0.0,0.0)
    tend=gR*x+1.5
    # kernel samples on s in (0, tend]; but only s>=x/sqrt3 nonzero
    s=np.arange(0.5*dt, tend+dt, dt)
    ker=w_step(s/x)/x
    t=np.arange(0,tend+dt,dt)
    f=pulse(kind,t); df=np.gradient(f,dt)
    w=fftconvolve(df,ker)[:len(t)]*dt
    v=np.gradient(w,dt)
    m=t>=t0
    return np.max(np.abs(v[m]))
if __name__=='__main__':
    kinds=['hann','halfsine','ramp']
    xs=np.round(np.logspace(np.log10(0.02),np.log10(300),31),4)
    out={}
    for kind in kinds:
        row=[]
        for x in xs:
            n=4000 if x<30 else 2000
            p=ppv(kind,x,n)
            row.append(p)
            print(kind,x,p,p*x, p*np.sqrt(x), flush=True)
        out[kind]=row
    json.dump({'x':xs.tolist(),**out},open('ppv_table.json','w'))
