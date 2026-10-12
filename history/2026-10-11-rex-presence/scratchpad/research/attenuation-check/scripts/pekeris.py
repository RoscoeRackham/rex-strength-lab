import numpy as np
pi=np.pi; s3=np.sqrt(3)
g2=(3+s3)/4; g=np.sqrt(g2); b=(3-s3)/4; tP=1/s3
A=np.sqrt(3*s3+5); B=np.sqrt(3*s3-5)
def L(t,a): return np.log(t+np.sqrt(t*t-a))
def G1(t):  # 1/sqrt3 < t <= 1
    return (1/(32*pi))*(6*(t-tP) - s3*(L(t,0.25)-L(tP,0.25)) - A*(np.arcsin(t/g)-np.arcsin(tP/g)) + B*(L(t,b)-L(tP,b)))
G1end=G1(1.0)
def G2(t):  # 1 < t <= g
    return G1end + (1/(16*pi))*(6*(t-1) - A*(np.arcsin(np.minimum(t/g,1))-np.arcsin(1/g)))
G2end=G2(g)
def Ghat(t):
    t=np.asarray(t,float); out=np.zeros_like(t)
    m1=(t>tP)&(t<=1); out[m1]=G1(t[m1])
    m2=(t>1)&(t<=g); out[m2]=G2(t[m2])
    m3=t>g; out[m3]=G2end+(6/(16*pi))*(t[m3]-g)
    return out
# check slope after g equals static 3/(8pi)
print("static check", 6/(16*pi), 3/(8*pi))
def ppv(x, shape, ns=4000):
    # F=1, rho=cs=1, T or tau=1
    s=np.linspace(0,1,ns+1); ds=s[1]-s[0]
    wq=np.full(ns+1,ds); wq[0]=wq[-1]=ds/2
    if shape=='hann':
        Fdd=2*pi**2*np.cos(2*pi*s)
        tmax=x*g+1.5
        extra=0
    else:
        Fdd=(pi**2/2)*np.cos(pi*s)
        tmax=x*g+1.5
    t=np.linspace(x*tP-0.01, tmax, 30001)
    # u(t) = int Fdd(s) Ghat((t-s)/x) ds  (+ boundary terms for ramp: Fdot(0)=0, Fdot(1)=0 ok both)
    U=np.array([np.sum(wq*Fdd*Ghat((tt-s)/x)) for tt in t])
    if shape=='ramp':
        # ramp holds at F=1 after tau: u = int Fdot(s) w(t-s) ds ; Fdot(0)=Fdot(1)=0 so by parts u=int Fdd G
        pass
    v=np.gradient(U,t)
    return np.abs(v).max()
xs=[0.02,0.137,0.493,0.936,1.778,3.375,12.164,43.843,158.021]
ref_h=dict(zip([0.02,0.038,0.072,0.137,0.26,0.493,0.936,1.778,3.375,6.407,12.164,23.094,43.843,83.236,158.021,300.0],[18.8,9.88,5.22,2.79,1.51,0.885,0.566,0.426,0.312,0.239,0.175,0.132,0.1,0.0686,0.05,0.0348]))
ref_r=dict(zip([0.02,0.038,0.072,0.137,0.26,0.493,0.936,1.778,3.375,6.407,12.164,23.094,43.843,83.236,158.021,300.0],[9.38,4.94,2.6,1.38,0.73,0.398,0.227,0.145,0.0977,0.0707,0.0515,0.0383,0.0287,0.02,0.0145,0.0102]))
for x in xs:
    ph=ppv(x,'hann'); pr=ppv(x,'ramp')
    print(f"x={x:8.3f} hann {ph:.4f} (table {ref_h[x]}, near {0.375/x:.4f}, far {0.620/np.sqrt(x):.4f})  ramp {pr:.4f} (table {ref_r[x]}, near {0.1875/x:.4f}, far {0.181/np.sqrt(x):.4f})")
