# Independent 1-D straight-through-centre fall of neutron-star Rex, PREM density (polynomials), own gravity integration.
import math
G=6.6743e-11; GM=3.986004418e14; RE=6.371e6
PREM=[(1221.5e3,[13.0885,0,-8.8381,0],True),(3480.0e3,[12.5815,-1.2638,-3.6426,-5.5281],False),(5701.0e3,[7.9565,-6.4761,5.5283,-3.0807],True),(5771.0e3,[5.3197,-1.4836,0,0],True),(5971.0e3,[11.2494,-8.0298,0,0],True),(6151.0e3,[7.1089,-3.8045,0,0],True),(6346.6e3,[2.6910,0.6924,0,0],True),(6356.0e3,[2.9,0,0,0],True),(6371.0e3,[2.6,0,0,0],True)]
def layer(r):
    for i,(top,a,s) in enumerate(PREM):
        if r<=top: return i
    return len(PREM)-1
def rho(r):
    a=PREM[layer(r)][1]; x=r/RE; return 1000*(a[0]+x*(a[1]+x*(a[2]+x*a[3])))
def solid(r): return PREM[layer(r)][2]
# mass profile by numeric integration
N=20000; dr=RE/N; Mc=[0.0]*(N+1)
for i in range(N):
    r1=i*dr; r2=r1+dr; rm=0.5*(r1+r2); Mc[i+1]=Mc[i]+4*math.pi*rm*rm*rho(rm)*dr
scale=GM/(G*Mc[N])
def g(r):
    if r<=0: return 0.0
    f=r/dr; i=min(N-1,int(f)); t=f-i; M=(Mc[i]*(1-t)+Mc[i+1]*t)*scale
    return G*M/(r*r)
m=4.12e17*0.18; A=0.3; V=0.18; sig=1.7e9; k=1.0; cs=6000.0; lnL=5.0
def I(Mach):
    if Mach<1e-3: return Mach**3/3
    if Mach<1: return min(lnL,0.5*math.log((1+Mach)/(1-Mach))-Mach)
    return max(0,min(lnL,0.5*math.log(max(1e-300,1-1/Mach**2))+lnL))
def drag(rr,v, df=True):
    if v<=0: return 0
    d=k*rho(rr)*A*v*v + (sig*A if solid(rr) else 0)
    if df: d+=4*math.pi*G*G*m*m*rho(rr)*I(v/cs)/(v*v)
    return d
for df in (True,False):
    x=RE; v=0.0; t=0.0; dt=0.02; Eloss=0.0
    # x is signed position along diameter; start at +RE moving toward -RE
    while True:
        r=abs(x); gr=g(r); s=1 if x>0 else -1
        a=-s*gr*(1-rho(r)*V/m) - (drag(r,abs(v),df)/m)*(1 if v>0 else -1 if v<0 else 0)
        v+=a*dt; x+=v*dt; t+=dt
        Eloss+=drag(r,abs(v),df)*abs(v)*dt
        if x<0 and v>=0: break
    print('DF' if df else 'noDF','turn at depth below far surface', RE-abs(x),'m; t',t,'s; loss J',Eloss)
