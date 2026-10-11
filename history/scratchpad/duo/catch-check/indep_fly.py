# Independent flat-ish check: 2-D point mass over a round Earth with exponential atmosphere,
# Mach-dependent Cd (linear blend 0.8-1.2), adaptive RK4 written from scratch (not from engine.js).
import math
g0=9.80665; GM=3.986004418e14; R=6.371e6; rho0=1.225; Hs=101325/(1.225*9.80665); a0=340.29
def cd(Cd,Cs,M):
    if M<=0.8: return Cd
    if M>=1.2: return Cs
    return Cd+(Cs-Cd)*(M-0.8)/0.4
def fly(v0,th,h0,m,A,Cd,Cs,hstop=None,xstop=None,dtmax=1e-3):
    th=math.radians(th); x=0.0; y=R+h0; vx=v0*math.cos(th); vy=v0*math.sin(th); t=0.0
    above = (hstop is None) or h0>=hstop
    def acc(x,y,vx,vy):
        r=math.hypot(x,y); rho=rho0*math.exp(-max(0,r-R)/Hs); v=math.hypot(vx,vy)
        k=-cd(Cd,Cs,v/a0)*A*rho*v/(2*m); gk=-GM/r**3
        return gk*x+k*vx, gk*y+k*vy
    apex=h0
    while True:
        v=math.hypot(vx,vy); dt=min(dtmax, 2e-3*max(1.0,1.0)/max(v,1e-9)*1.0 if v>100 else dtmax)
        dt=min(dt, 0.01/max(v,1e-9))  # at most 1 cm per step
        def f(s):
            x,y,vx,vy=s; ax,ay=acc(x,y,vx,vy); return (vx,vy,ax,ay)
        s=(x,y,vx,vy)
        k1=f(s); k2=f(tuple(s[i]+dt/2*k1[i] for i in range(4))); k3=f(tuple(s[i]+dt/2*k2[i] for i in range(4))); k4=f(tuple(s[i]+dt*k3[i] for i in range(4)))
        n=tuple(s[i]+dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]) for i in range(4))
        rng=R*math.atan2(n[0],n[1]); h=math.hypot(n[0],n[1])-R
        if xstop is not None and rng>=xstop:
            f_=(xstop-R*math.atan2(x,y))/(rng-R*math.atan2(x,y))
            vxi=vx+(n[2]-vx)*f_; vyi=vy+(n[3]-vy)*f_; xi=x+(n[0]-x)*f_; yi=y+(n[1]-y)*f_
            return dict(t=t+dt*f_, range=xstop, h=math.hypot(xi,yi)-R, v=math.hypot(vxi,vyi), apex=apex)
        stop = (hstop if (hstop is not None and above) else 0.0)
        if h<stop and (n[0]*n[2]+n[1]*n[3])<0:
            hp=math.hypot(x,y)-R; f_=(hp-stop)/(hp-h)
            vxi=vx+(n[2]-vx)*f_; vyi=vy+(n[3]-vy)*f_; xi=x+(n[0]-x)*f_; yi=y+(n[1]-y)*f_
            ri=math.hypot(xi,yi); vr=(xi*vxi+yi*vyi)/ri; vi=math.hypot(vxi,vyi)
            return dict(t=t+dt*f_, range=R*math.atan2(xi,yi), v=vi, ang=math.degrees(math.asin(min(1.0,abs(vr)/vi))), apex=apex, below=(hstop is not None and not above))
        x,y,vx,vy=n; t+=dt; apex=max(apex,h)
        if hstop is not None and not above and h>=hstop: above=True
bb=dict(m=0.1453,A=0.00427,Cd=0.35,Cs=0.92)



# vacuum check
print('T3 vacuum sqrt(gD)=',math.sqrt(g0*10),' t=',2*math.sqrt(g0*10)*math.sin(math.pi/4)/g0)
print('T7 terminal', math.sqrt(2*0.1453*g0/(1.225*0.35*0.00427)))
# T6: farthest at 629 m/s for angles
best=(0,0)
for th in []:
    r=fly(629.136,th,1.8,hstop=1.8,**bb); best=max(best,(r['range'],th)); print('T6 629 m/s th',th,'range',round(r['range'],2))
print('best',best)

# T14 partner: m 180, A 0.8, Cd 1.0, CdSup 1.75 straight up from 1.8 to apex 10 m
P=dict(m=180,A=0.8,Cd=1.0,Cs=1.75)
lo,hi=10,20
for i in range(60):
    mid=(lo+hi)/2; r=fly(mid,90-1e-7,1.8,hstop=1.8,**P)
    if r['apex']>=10: hi=mid
    else: lo=mid
r=fly(hi,90-1e-7,1.8,hstop=1.8,**P); print('T14 toss v',hi,'t',r['t'],'vimp',r['v'],'F',180*r['v']**2/1.2)
r=fly(71.2,90-1e-7,1.8,hstop=1.8,**P); print('T14b 71.2 up: apex',r['apex'],'v back',r['v'])
