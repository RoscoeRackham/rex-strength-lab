import sys, math
sys.path.insert(0,'/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/f7refute')
from eqair import *
T0=288.15; p0=101325.0
hinf=equil(T0,p0)['h']
def Tstag(v,p):
    h0=hinf+0.5*v*v; lo,hi=T0,1e10
    for _ in range(200):
        mid=math.sqrt(lo*hi)
        if equil(mid,p)['h']>h0: hi=mid
        else: lo=mid
        if hi/lo<1+1e-7: break
    return hi
# Anderson Apollo case: ~11 km/s (36,000 ft/s = 10.97 km/s), 53 km altitude
# US Std Atm 1976 rho at 53 km ~ 6.65e-4 kg/m3 (interp 50 km 1.027e-3, 55 km 5.68e-4)
rho53 = 1.027e-3*math.exp(math.log(5.68e-4/1.027e-3)*3/5)
for v in [10973, 11000]:
    pst = rho53*v*v
    print(f"Anderson-like: v={v} rho53={rho53:.3e} p_stag={pst/p0:.2f} atm  Teq={Tstag(v,pst):.0f} K")
for v in [11000]:
    pst=1.225*v*v
    print(f"Sea-level: v={v} p_stag={pst/p0:.0f} atm Teq={Tstag(v,pst):.0f} K")
