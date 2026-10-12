# Independent solution of Taylor's (1946) constant-speed expanding sphere, self-similar. Pure python RK4.
import math
g=1.4; c0=1.0; p0=1.0; rho0=g*p0/c0**2   # units: c0=1, p0=1 -> rho0=1.4
def shock_state(M):
    us=(2/(g+1))*(M-1/M)
    pr=1+2*g*(M*M-1)/(g+1)
    rr=(g+1)*M*M/((g-1)*M*M+2)
    cs=math.sqrt(pr/rr)
    return us,pr,rr,cs
def rhs(eta,u,c):
    du=2*u*c*c/(eta*((u-eta)**2-c*c))
    dc=-(g-1)*(u-eta)*du/(2*c)
    return du,dc
def piston(M,n=20000):
    us,pr,rr,cs=shock_state(M)
    eta=M; u=us; c=cs; h=-M/n
    while eta>1e-4:
        k1=rhs(eta,u,c)
        k2=rhs(eta+h/2,u+h/2*k1[0],c+h/2*k1[1])
        k3=rhs(eta+h/2,u+h/2*k2[0],c+h/2*k2[1])
        k4=rhs(eta+h,u+h*k3[0],c+h*k3[1])
        un=u+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]); cn=c+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]); en=eta+h
        if un-en>=0:   # crossed u=eta: linear interpolate
            f0=u-eta; f1=un-en; s=f0/(f0-f1)
            eta=eta+s*h; u=u+s*(un-u); c=c+s*(cn-c)
            psurf=pr*(c/cs)**(2*g/(g-1))
            return eta,psurf-1.0,us,pr-1
        eta,u,c=en,un,cn
    return None
def bis(f,a,b,it=60):
    fa=f(a)
    for _ in range(it):
        m=(a+b)/2; fm=f(m)
        if (fm>0)==(fa>0): a,fa=m,fm
        else: b=m
    return (a+b)/2
if __name__=='__main__':
    print(" Xi/c0   xi0/c0   us/c0  dp_surf/p0  ratio_rho0u2  shock dp/p0")
    for M in [1.001,1.005,1.01,1.02,1.05,1.1,1.17,1.2,1.25,1.27,1.3,1.329,1.4,1.52,1.73,2.0,2.2,2.21,2.264,2.5,3.0,4.0,6.0,10.0]:
        r=piston(M)
        if r:
            xi,dp,us,dps=r
            print(f"{M:6.3f} {xi:8.4f} {us:7.4f} {dp:10.4f} {dp/(rho0*xi*xi):10.4f} {dps:10.4f}")
    print()
    for xi in [0.2,0.3,0.45,0.6,0.8,0.92,1.0,1.18,1.19,1.2,1.29,1.3,1.5,2.0,3.0,4.53]:
        M=bis(lambda M: piston(M,4000)[0]-xi, 1.000001, 12)
        r=piston(M)
        print(f"u/c0={xi:5.2f}  shock M={M:.4f}  dp_surf/p0={r[1]:.4f}  ratio to rho0u^2={r[1]/(rho0*xi*xi):.4f}")
