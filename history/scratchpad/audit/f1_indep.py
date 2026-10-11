# Independent check: adaptive Dormand-Prince 5(4) through the atmosphere, exact Kepler coast above H_SW.
import math
GM=3.986004418e14; R=6.371e6; rho0=1.225; Hs=101325/(1.225*9.80665)
m=66800.; A=15.; Cd=1.0; beta=Cd*A/(2*m)
v0=112472.67720731982; h0=1.8; th=math.radians(30)
H_SW=300e3
def f(s):
    x,y,vx,vy=s; r=math.hypot(x,y); h=r-R; rho=rho0*math.exp(-h/Hs) if h>0 else rho0
    v=math.hypot(vx,vy); g=-GM/r**3; d=-beta*rho*v
    return (vx,vy,g*x+d*vx,g*y+d*vy)
# Dormand-Prince tableau
c=[0,1/5,3/10,4/5,8/9,1,1]
a=[[],[1/5],[3/40,9/40],[44/45,-56/15,32/9],[19372/6561,-25360/2187,64448/6561,-212/729],
   [9017/3168,-355/33,46732/5247,49/176,-5103/18656],[35/384,0,500/1113,125/192,-2187/6784,11/84]]
b5=[35/384,0,500/1113,125/192,-2187/6784,11/84,0]
b4=[5179/57600,0,7571/16695,393/640,-92097/339200,187/2100,1/40]
def step(s,dt):
    k=[]
    for i in range(7):
        si=tuple(s[j]+dt*sum(a[i][l]*k[l][j] for l in range(i)) for j in range(4)) if i else s
        k.append(f(si))
    y5=tuple(s[j]+dt*sum(b5[l]*k[l][j] for l in range(7)) for j in range(4))
    y4=tuple(s[j]+dt*sum(b4[l]*k[l][j] for l in range(7)) for j in range(4))
    return y5,y4
def integrate(s,t,stop,tol=1e-11,dt=1e-4):
    # stop(s)-> signed function; integrate until it crosses from >0 to <=0, then bisect the step
    while True:
        y5,y4=step(s,dt)
        err=max(abs(y5[j]-y4[j])/(1e-6+abs(y5[j])) for j in range(4))
        if err>tol:
            dt*=max(0.2,0.9*(tol/err)**0.2); continue
        if stop(y5)<=0:
            lo,hi=0.0,dt
            for _ in range(80):
                mid=(lo+hi)/2; ym,_=step(s,mid)
                if stop(ym)<=0: hi=mid
                else: lo=mid
            ym,_=step(s,hi); return ym,t+hi
        s=y5; t+=dt; dt*=min(5,0.9*(tol/max(err,1e-30))**0.2)
s=(0.0,R+h0,v0*math.cos(th),v0*math.sin(th))
s1,t1=integrate(s,0.0,lambda q: (R+H_SW)-math.hypot(q[0],q[1]))
x,y,vx,vy=s1; r=math.hypot(x,y); v=math.hypot(vx,vy)
print('exit 300 km: t=%.3f s  v=%.3f m/s'%(t1,v))
# Kepler coast
hmom=x*vy-y*vx; eps=v*v/2-GM/r; aa=-GM/(2*eps); p=hmom*hmom/GM; e=math.sqrt(1-p/aa)
cosnu=(p/r-1)/e; nu1=math.acos(max(-1,min(1,cosnu)))  # ascending: 0<nu<pi
def M_of(nu):
    E=2*math.atan(math.sqrt((1-e)/(1+e))*math.tan(nu/2)); return E-e*math.sin(E)
n=math.sqrt(GM/aa**3); M1=M_of(nu1); dtc=(2*math.pi-2*M1)/n
dang=2*math.pi-2*nu1; rapo=aa*(1+e)
print('coast: a=%.6e e=%.9f apo alt=%.6e m  coast time=%.4f d  central angle=%.6f rad'%(aa,e,rapo-R,dtc/86400,dang))
# Re-entry state: rotate exit position by -dang about origin in the sense of motion, velocity mirrored in radial component.
ang_exit=math.atan2(x,y); sgn=1 if hmom<0 else -1  # engine angle uses atan2(x,y)
# radial/tangential components at exit
ur=(x/r,y/r); vr=vx*ur[0]+vy*ur[1]; ut=(-ur[1],ur[0]) if hmom>0 else (ur[1],-ur[0]); vt=vx*ut[0]+vy*ut[1]
phi=ang_exit+sgn*(-1)*dang if False else None
# simpler: build re-entry state in a frame, then integrate; position angle measured as atan2(x,y)
ang2=ang_exit+dang*(1 if (x*vy-y*vx)<0 else -1)
xr,yr=r*math.sin(ang2),r*math.cos(ang2)
ur2=(xr/r,yr/r); ut2=(-ur2[1],ur2[0]) if hmom>0 else (ur2[1],-ur2[0])
vr2=-vr
s2=(xr,yr,vr2*ur2[0]+vt*ut2[0],vr2*ur2[1]+vt*ut2[1])
print('check h conserved:', hmom, xr*s2[3]-yr*s2[2])
s3,t3=integrate(s2,0.0,lambda q: math.hypot(q[0],q[1])-R)
xf,yf=s3[0],s3[1]
ttot=t1+dtc+t3; angtot=abs(math.atan2(xf,yf)) if False else None
# total central angle = angle(exit) + dang + angle travelled during re-entry
def dang_between(p,q):
    d=math.atan2(q[0],q[1])-math.atan2(p[0],p[1])
    while d>math.pi: d-=2*math.pi
    while d<-math.pi: d+=2*math.pi
    return d
total=abs(dang_between((0,R+h0),s1)+ (dang if (x*vy-y*vx)<0 else -dang) + dang_between(s2,s3))
vimp=math.hypot(s3[2],s3[3])
print('LANDING: time=%.3f d  range=%.1f km  vImpact=%.1f m/s  apex alt=%.4e m'%(ttot/86400,R*total/1000,vimp,rapo-R))
