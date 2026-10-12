import numpy as np
pi=np.pi; s3=np.sqrt(3)
GR2=(3+s3)/4; GR=np.sqrt(GR2); BB=(3-s3)/4; TP=1/s3
CA=np.sqrt(3*s3+5); CB=np.sqrt(3*s3-5)
def Lg(t,a): return np.log(t+np.sqrt(t*t-a))
def G1(t): return (1/(32*pi))*(6*(t-TP) - s3*(Lg(t,0.25)-Lg(TP,0.25)) - CA*(np.arcsin(t/GR)-np.arcsin(TP/GR)) + CB*(Lg(t,BB)-Lg(TP,BB)))
G1E=G1(1.0)
def G2(t): return G1E + (1/(16*pi))*(6*(t-1) - CA*(np.arcsin(np.minimum(t/GR,1))-np.arcsin(1/GR)))
G2E=G2(GR)
def Ghat(t):
    t=np.asarray(t,float); out=np.zeros_like(t)
    m1=(t>TP)&(t<=1); out[m1]=G1(t[m1])
    m2=(t>1)&(t<=GR); out[m2]=G2(t[m2])
    m3=t>GR; out[m3]=G2E+(6/(16*pi))*(t[m3]-GR)
    return out
SH={'hann':(lambda s:2*pi**2*np.cos(2*pi*s), lambda s:-4*pi**3*np.sin(2*pi*s)),
    'ramp':(lambda s:(pi**2/2)*np.cos(pi*s), lambda s:-(pi**3/2)*np.sin(pi*s))}
def ppv(x,shape,ns=3000,nt=40001):
    Fdd,Fddd=SH[shape]
    s=np.linspace(0,1,ns+1); wq=np.full(ns+1,1.0/ns); wq[0]=wq[-1]=0.5/ns
    t=np.linspace(x*TP, x*GR+1.2, nt)
    v=np.empty_like(t)
    f3=wq*Fddd(s)
    for i,tt in enumerate(t):
        v[i]=Fdd(0.0)*Ghat(np.array([tt/x]))[0] - Fdd(1.0)*Ghat(np.array([(tt-1)/x]))[0] + np.dot(f3,Ghat((tt-s)/x))
    return np.abs(v).max()
if __name__=='__main__':
    for x in (0.02,0.137,0.493,0.936,1.3,1.778,3.375,12.164,43.843):
        print(x, 'hann',round(ppv(x,'hann'),4), 'near',round(0.375/x,4),'far',round(0.620/np.sqrt(x),4),'| ramp',round(ppv(x,'ramp'),4),'near',round(0.1875/x,4),'far',round(0.181/np.sqrt(x),4))
