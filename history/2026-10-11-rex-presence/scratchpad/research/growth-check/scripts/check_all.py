import math, sys
sys.path.insert(0, sys.argv[1])
from taylor_mine import piston, bis
c=299792458.0; c2=c*c; G=6.67430e-11
m0=3007.0; H0=3.048; rhob=1060.0; V0=m0/rhob; R0=(3*V0/(4*math.pi))**(1/3)
rho_a=1.225; p0=101325.0; a0=340.29; gam=1.4
print(f"V0={V0:.4f} R0={R0:.4f} R0/H0={R0/H0:.4f}")
Es={'Krak 8.4e17':8.4e17,'Krak HP lo 4.184e17':4.184e17,'Krak HP hi 6.276e17':6.276e17,'Krak 1e17':1e17,'Krak 4.56e18':4.56e18,'Krak 1.5Gt':1.5e3*4.184e15,'Krak 12Gt':12e3*4.184e15,
    'Chx 1e23':1e23,'Chx 4.2e23':4.2e23,'Chx 5e23':5e23,'Sun 1s':3.828e26}
def form(E,a):
    dm=E/c2; k=1+dm/m0; V=V0*k**a; H=H0*(V/V0)**(1/3); R=R0*(V/V0)**(1/3); rho=m0*k/V
    return dm,k,V,H,R,rho
print("\n== worked examples ==")
for n,E in Es.items():
    dm,k,_,Hs,Rs,_=form(E,1); _,_,_,Hm,Rm,rm=form(E,0.5); _,_,_,_,_,rd=form(E,0)
    print(f"{n:22s} dm={dm:.4g} kg k={k:.6g} | mix H={Hm:.4f} R={Rm:.3f} rho={rm:.4g} | size H={Hs:.4f} R={Rs:.3f} | dens rho={rd:.4g}")
# ---- gradual profile ----
def prof(k,a,N=200000):
    # s(t)=t-sin(2pi t)/(2pi), T=1
    import math
    V=lambda s: V0*(1+(k-1)*s)**a
    Hh=lambda s: H0*(V(s)/V0)**(1/3)
    dV=V(1)-V(0); dH=Hh(1)-Hh(0)
    h=1.0/N
    best_acc=0; best_hd=0
    def sf(t): return t-math.sin(2*math.pi*t)/(2*math.pi)
    prevV=None
    for i in range(1,N):
        t=i*h
        Vm=V(sf(t-h)); Vc=V(sf(t)); Vp=V(sf(t+h))
        acc=abs(Vp-2*Vc+Vm)/(h*h)
        hd=(Hh(sf(t+h))-Hh(sf(t-h)))/(2*h)
        best_acc=max(best_acc,acc); best_hd=max(best_hd,hd)
    return best_acc/dV if dV>0 else 0, best_hd/dH if dH>0 else 0, dV, dH
print("\n== kV, kH ==")
res={}
for n in ['Krak 8.4e17','Chx 1e23','Chx 4.2e23','Sun 1s']:
    E=Es[n]; dm=E/c2; k=1+dm/m0
    for a,fn in [(1,'size'),(0.5,'mix')]:
        kV,kH,dV,dH=prof(k,a,20000)
        res[(n,fn)]=(kV,kH,dV,dH,k,a)
        print(f"{n:12s} {fn:4s} k={k:.5g} kV={kV:.3f} kH={kH:.3f} dV={dV:.5g} dH={dH:.5g}")
print("\n== T_pressure (rigid ground, r=R_final+5) and T_shove ==")
for (n,fn),(kV,kH,dV,dH,k,a) in res.items():
    Rf=R0*(V0*k**a/V0)**(1/3); dR=Rf-R0; r=Rf+5
    Tp=lambda ps: math.sqrt(rho_a*kV*dV/(2*math.pi*r*ps))
    # side: kR same as kH since R ∝ H
    print(f"{n:12s} {fn:4s} Tp100={Tp(100):.4g} Tp20={Tp(20):.4g} Ts_head0.25={kH*dH/0.25:.4g} Ts_side0.25={kH*dR/0.25:.4g} Ts_head1.4={kH*dH/1.4:.4g} ratio dR/dH={dR/dH:.3f}")
# ---- instant ----
def flat(u):
    x=(gam+1)*u/(4*a0); M=x+math.sqrt(x*x+1); return p0*(2*gam/(gam+1))*(M*M-1), M
def kgR(Z): return 808*(1+(Z/4.5)**2)/(math.sqrt(1+(Z/0.048)**2)*math.sqrt(1+(Z/0.32)**2)*math.sqrt(1+(Z/1.35)**2))
def reach(W,dp):
    lo,hi=1e-3,1e6
    for _ in range(200):
        mid=math.sqrt(lo*hi)
        if p0*kgR(mid/W**(1/3))>dp: lo=mid
        else: hi=mid
    return lo
print("\n== flat piston table ==")
for u in [1,10,100,340.3,405,1000,1540]:
    dp,M=flat(u); print(f"u={u} M={M:.4f} dp={dp/1e3:.4g} kPa  rho c u={rho_a*a0*u/1e3:.3g} 1.2rho u^2={1.2*rho_a*u*u/1e3:.4g}")
print("\n== instant growth ==")
for n in ['Krak 8.4e17','Chx 1e23','Chx 4.2e23','Sun 1s']:
    for a,fn in [(1,'size'),(0.5,'mix')]:
        dm,k,V,H,R,rho=form(Es[n],a)
        tx=H/1540; uh=(H-H0)/tx; us=(R-R0)/tx; dV=V-V0
        dpf,_=flat(us)
        xi=us/a0
        if xi>0.45:
            M=bis(lambda M: piston(M,3000)[0]-xi,1.000001,12); dps=piston(M)[1]*p0
        else:
            dps=float('nan')
        Exl=dps*dV; Exh=dpf*dV
        line=f"{n:12s} {fn:4s} tx={tx*1e3:.3g}ms head={uh:.4g} side={us:.4g} (M{us/a0:.3f}) dp_sph={dps/1e3:.4g}kPa dp_flat={dpf/1e3:.4g}kPa"
        if Exl==Exl:
            Wl=Exl/4.184e6; Wh=Exh/4.184e6
            line+=f" Ex={Exl:.3g}-{Exh:.3g} TNT={Wl:.3g}-{Wh:.3g}kg Wfree={2*Wl:.3g}-{2*Wh:.3g} win6.9={reach(2*Wl,6895):.3g}-{reach(2*Wh,6895):.3g} win3.4={reach(2*Wl,3447):.3g}-{reach(2*Wh,3447):.3g} Rbar2 at {2/(p0/(2*Exl))**(1/3):.3g}-{2/(p0/(2*Exh))**(1/3):.3g} m"
            line+=f" | loop air={(p0+dps)*dV/(dm*c2):.3g}-{(p0+dpf)*dV/(dm*c2):.3g} slow={p0*dV/(dm*c2):.3g}"
        else:
            line+=f" p0dV={p0*dV:.3g} J"
        print(line)
