import sys; sys.path.insert(0,'.')
from stag import Tstag, ideal, rho0, p0atm
import math
vs=[1500,2000,3000,4000,5000,6000,7000,8500,10000,12500,15000,20000,30000,50000,80000,1.2e5,2e5,4e5,1e6,3e6]
out=[]
for v in vs:
    p=max(p0atm,rho0*v*v); T=Tstag(v,p); out.append((v,T))
    print(f"[{v:.0f}, {T:.0f}],  # ideal {ideal(v):.3g}  ratio {ideal(v)/T:.2f}")
# speed where ratio crosses 2x
lo,hi=4000,8000
for _ in range(40):
    m=(lo+hi)/2
    if ideal(m)/Tstag(m,rho0*m*m)>2: hi=m
    else: lo=m
print('ratio 2x at v =',round(hi),'m/s, Mach',round(hi/340.29,1))
