import math
g=9.80665; mu=0.6; M=180.0; m=1340.0; mh=2*0.022*M; mS=m+mh; Mb=M-mh
v=8.42243; gam=math.radians(45.5906); s=math.sin(gam); c=math.cos(gam); d=0.6
v1=v*m/mS; E2=0.5*mS*v1**2 + m*g*d*s; relNeed=2*E2/mS/(2*d)
N=lambda F: M*g + F*s + m*g*c*c
R1=(mu*(M*g+m*g*c*c)+m*g*s*c)/(c-mu*s)
Nmax=2.5e6*2*0.045
R2=(mu*Nmax)/c + m*g*s
R=min(R1,R2)
def Rslide(F):
    if F<=R: return R
    H=F*c - m*g*s*c - mu*min(N(F),Nmax)
    return F - c*max(0,H)
gap=lambda F: F/mS + (F-Rslide(F))/Mb - relNeed
lo,hi=R,E2/d
for i in range(200):
    mid=(lo+hi)/2
    if gap(mid)>0: hi=mid
    else: lo=mid
F=hi
print('R',R,'FA',E2/d,'F',F)
# now a simple 2-D time-stepping check: catcher (Mb) slides horizontally; object+hands (mS) decelerated by arm force F along line opposing relative motion; gravity on object.
# Use F constant as engine; integrate until relative displacement along line = d
aC_line=(F-Rslide(F))/Mb
aH=aC_line/c  # catcher horizontal accel
print('catcher horiz accel',aH)
# 2D: object velocity components (toward catcher +x, down -y)
vx=v1*c; vy=-v1*s; X=0;Y=0; cx=0; cvx=0; t=0; dt=1e-6
ux, uy = c, -s  # line direction (object's travel)
while True:
    # arm force on object along -line direction
    ax=-F*ux/mS; ay=-F*uy/mS - m*g/mS  # gravity on object only (hands' weight carried by arms separately)
    # catcher: horizontal net = F*c (reaction) - friction mu*N
    Nn=M*g + F*s + m*g*c*c  # same N model
    Hn=F*c - m*g*s*c - mu*Nn
    cax=max(0,Hn)/Mb if cvx>0 or Hn>0 else 0
    vx+=ax*dt; vy+=ay*dt; X+=vx*dt; Y+=vy*dt; cvx+=cax*dt; cx+=cvx*dt; t+=dt
    rel=( (X-cx)*ux + Y*uy )
    if rel>=d or (vx-cvx)*ux+vy*uy<=0: break
print('t',t,'rel',rel,'obj v',vx,vy,'catcher v',cvx,'slide during',cx)
