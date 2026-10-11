import sys; sys.path.insert(0,'.')
from eqair import *
T0=288.15; rho0=1.225; p0atm=101325.0; a0=340.29
hinf=equil(T0,p0atm)['h']
def Tstag(v,p):
    h0=hinf+0.5*v*v
    lo,hi=T0,1.0e10
    for _ in range(100):
        mid=math.sqrt(lo*hi)
        if equil(mid,p)['h']>h0: hi=mid
        else: lo=mid
        if hi/lo<1+1e-7: break
    return hi
def ideal(v): return T0*(1+0.2*(v/a0)**2)
print('Apollo-like check (Anderson): v=11 km/s, post-shock p ~ 1 atm')
for p in [0.5*p0atm, 1*p0atm, 2*p0atm]:
    print(f"  p={p/p0atm:.1f} atm  T_eq={Tstag(11000,p):8.0f} K  ideal={ideal(11000):8.0f} K")
print('Sea-level stagnation, p0 = rho0*v^2 (also 0.5x and 2x p0 for sensitivity)')
for v in [1000,2000,3000,4000,5000,7000,11000,11028,15000,20000,30000,50000,112473]:
    p=max(p0atm, rho0*v*v)
    Te=Tstag(v,p); Tl=Tstag(v,0.5*p); Th=Tstag(v,2*p)
    print(f"v={v:7d} M={v/a0:6.1f} p0={p/p0atm:9.1f} atm ideal={ideal(v):11.0f} K  eq={Te:10.0f} K  (0.5p {Tl:9.0f}, 2p {Th:9.0f})  ratio ideal/eq={ideal(v)/Te:6.2f}")
