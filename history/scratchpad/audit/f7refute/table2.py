import sys; sys.path.insert(0,'.')
from stag import Tstag, ideal, rho0, p0atm
for v in [80000,112473,120000,200000,400000,1e6,2.99e6]:
    p=max(p0atm,rho0*v*v); T=Tstag(v,p)
    print(f"[{v:.0f}, {T:.4g}],  # ideal {ideal(v):.3g}  ratio {ideal(v)/T:.2f}")
