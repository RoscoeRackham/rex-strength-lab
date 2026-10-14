import math, sys
GM=398600441800000.0; R=6371000.0; rho0=1.225; Hs=8434.509818774577; a0=340.29
def cd(Cd,CdSup,M):
    if CdSup is None or M<=0.8: return Cd
    if M>=1.2: return CdSup
    return Cd+(CdSup-Cd)*(M-0.8)/0.4
def run(v0,thdeg,h0,m,A,Cd,CdSup,dK,dt=None):
    th=math.radians(thdeg)
    x,y=0.0,R+h0; vx,vy=v0*math.cos(th),v0*math.sin(th)
    def acc(x,y,vx,vy):
        r=math.hypot(x,y); v=math.hypot(vx,vy); rho=rho0*math.exp(-(r-R)/Hs) if r>R else rho0
        g=-GM/r**3; k=-cd(Cd,CdSup,v/a0)*A/(2*m)*rho*v*dK
        D=0.5*cd(Cd,CdSup,v/a0)*rho*A*v*v
        return g*x+k*vx, g*y+k*vy, D
    E=0; px=0; py=0; Ps=0; t=0
    if dt is None: dt=1e-3*v0/9.8/10
    while True:
        ax,ay,D=acc(x,y,vx,vy)
        def f(s): 
            X,Y,VX,VY=s; a=acc(X,Y,VX,VY); return (VX,VY,a[0],a[1])
        s=(x,y,vx,vy)
        k1=f(s); s2=tuple(s[i]+0.5*dt*k1[i] for i in range(4)); k2=f(s2)
        s3=tuple(s[i]+0.5*dt*k2[i] for i in range(4)); k3=f(s3)
        s4=tuple(s[i]+dt*k3[i] for i in range(4)); k4=f(s4)
        n=tuple(s[i]+dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]) for i in range(4))
        # trapezoid drag tally
        _,_,Dn=acc(*n)
        v=math.hypot(vx,vy); vn=math.hypot(n[2],n[3])
        E+=0.5*(D*v+Dn*vn)*dt
        px+=0.5*(D*vx/v+Dn*n[2]/vn)*dt; py+=0.5*(D*vy/v+Dn*n[3]/vn)*dt
        Ps+=0.5*(D+Dn)*dt
        x,y,vx,vy=n; t+=dt
        if math.hypot(x,y)<R: break
    return E, math.hypot(px,py), Ps, t
for args in [(500,45,2.7432,1340,8.7,1.15,1.75,0),(50,45,2.7432,1340,8.7,1.15,1.75,0),(400,45,2.7432,0.1453,0.00427,0.35,0.92,0),(40,45,2.7432,0.1453,0.00427,0.35,0.92,0),(1000,10,2.7432,1340,8.7,1.15,1.75,0)]:
    E,P,Ps,t=run(*args)
    print(args[0],args[1],args[4], 'E=%.6g Pvec=%.6g Pscalar=%.6g t=%.5g'%(E,P,Ps,t))
