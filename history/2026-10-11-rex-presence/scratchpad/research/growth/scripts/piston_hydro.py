# Independent check of the expanding-sphere solution: 1-D spherical Lagrangian hydro with
# von Neumann-Richtmyer artificial viscosity; piston expands at constant speed v from small R0.
import numpy as np, sys
g=1.4; c0=1.0; rho0=1.0; p0=rho0*c0*c0/g
def run(v, N=1500, R0=0.05, Rout=None, tend=None):
    tend = tend or 1.0/v
    Rout = Rout or (R0 + 2.6*max(v,1.0)*tend + 0.5)
    r=np.linspace(R0,Rout,N+1); u=np.zeros(N+1); u[0]=v
    vol=4*np.pi/3*(r[1:]**3-r[:-1]**3); m=rho0*vol; e=np.full(N,p0/((g-1)*rho0))
    mn=np.zeros(N+1); mn[1:-1]=0.5*(m[1:]+m[:-1]); mn[0]=0.5*m[0]; mn[-1]=0.5*m[-1]
    t=0.0
    while t<tend:
        vol=4*np.pi/3*(r[1:]**3-r[:-1]**3); rho=m/vol; p=(g-1)*rho*e
        c=np.sqrt(g*p/rho); du=u[1:]-u[:-1]; dr=r[1:]-r[:-1]
        q=np.where(du<0, rho*(2.0*du*du + 0.5*c*np.abs(du)), 0.0)
        dt=0.3*np.min(dr/(c+np.abs(du)+1e-12)); dt=min(dt,tend-t)
        P=p+q; A=4*np.pi*r**2
        acc=np.zeros(N+1); acc[1:-1]=-A[1:-1]*(P[1:]-P[:-1])/mn[1:-1]
        u=u+dt*acc; u[0]=v; u[-1]=0.0
        rn=r+dt*u; voln=4*np.pi/3*(rn[1:]**3-rn[:-1]**3)
        e=e-P*(voln-vol)/m; r=rn; t+=dt
    vol=4*np.pi/3*(r[1:]**3-r[:-1]**3); rho=m/vol; p=(g-1)*rho*e
    rc=0.5*(r[1:]+r[:-1])
    # shock position: outermost cell where p exceeds p0 by half the jump at the front
    dp=p/p0-1
    i=np.where(dp>0.5*dp[np.argmax(rc>r[0]*1.0)]*0+0.02*max(dp.max(),1e-3))[0]
    rs=rc[i.max()] if len(i) else float('nan')
    return dict(v=v,t=t,Rp=r[0],p_surface=(p[0]/p0-1),shock_speed=rs/t, p_profile=(rc,dp))
if __name__=='__main__':
  for v in [float(a) for a in sys.argv[1:]] or [0.5,1.0,2.0]:
    out=run(v)
    print(f"v={v}: piston R={out['Rp']:.3f}  surface dp/p0={out['p_surface']:.3f}  shock speed ~{out['shock_speed']:.3f} c0")
