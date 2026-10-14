import math
import numpy as np
def lane_emden(n, h=1e-5):
    # integrate theta''+2/xi theta' + theta^n = 0
    xi=1e-6; th=1-xi**2/6; dth=-xi/3
    xs=[0.0]; ths=[1.0]
    def f(x,t,dt):
        return dt, -max(t,0)**n - 2*dt/x
    while th>0:
        k1=f(xi,th,dth); k2=f(xi+h/2,th+h/2*k1[0],dth+h/2*k1[1]); k3=f(xi+h/2,th+h/2*k2[0],dth+h/2*k2[1]); k4=f(xi+h,th+h*k3[0],dth+h*k3[1])
        th_new=th+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]); dth_new=dth+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])
        if th_new<=0:
            frac=th/(th-th_new); xi1=xi+frac*h
            xs.append(xi1); ths.append(0.0); break
        xi+=h; th=th_new; dth=dth_new
        xs.append(xi); ths.append(th)
    return np.array(xs), np.array(ths)
G=6.6743e-11; M=1.89813e27; R=69911e3
for n in [0.9,1.0,1.06,1.1,1.2]:
    x,t=lane_emden(n, h=2e-4)
    rho=np.clip(t,0,None)**n
    xi1=x[-1]
    r=x/xi1
    m=np.concatenate([[0],np.cumsum(0.5*(rho[1:]*r[1:]**2+rho[:-1]*r[:-1]**2)*np.diff(r))])*4*math.pi
    Mt=m[-1]
    I=(8*math.pi/3)*np.trapezoid(rho*r**4,r)
    # potential energy U = int G m dm / r
    dm=4*math.pi*rho*r**2
    integrand=np.where(r>0, m*dm/np.where(r>0,r,1),0)
    W=np.trapezoid(integrand,r)
    alpha=W/Mt**2
    print("n=%.2f xi1=%.4f I/MR2=%.4f alpha(num)=%.4f ritter=%.4f U=%.3e"%(n,xi1,I/Mt,alpha,3/(5-n),alpha*G*M*M/R))
print("GM^2/R=%.4e uniform=%.4e"%(G*M*M/R,0.6*G*M*M/R))
# normalization radius check
a=71492; c=66854; RI=math.sqrt((2*a*a+c*c)/3); print("Jupiter R_I",RI,"(RI/Rmean)^2",(RI/69911)**2, "(a/Rmean)^2",(a/69911)**2)
print("0.254 rescaled to mean radius if it were C/Ma^2:",0.254*(a/69911)**2)
