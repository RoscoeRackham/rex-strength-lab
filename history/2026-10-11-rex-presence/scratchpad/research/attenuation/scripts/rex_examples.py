import numpy as np
from model import ppv
g=9.80665; m=3007
grounds={'loose sand':(1600,120,0.04),'dense sand/gravel':(2000,300,0.03),'soft clay':(1700,110,0.05),'stiff clay':(1900,250,0.03),'road/slab subgrade':(1950,250,0.03),'granite':(2700,3000,0.01)}
cases={'walk: 1.2 BW, 0.1 s rise (ramp)':('ramp',1.2*m*g,0.1),
       'walk: 1.2 BW, 0.2 s rise (ramp)':('ramp',1.2*m*g,0.2),
       'heavy step: 3 BW Hann 0.05 s':('hann',3*m*g,0.05),
       'stamp: 10 BW Hann 0.03 s':('hann',10*m*g,0.03)}
rs=[1,3,10,30,100,200]
for cname,(kind,F,T) in cases.items():
    print('==',cname,f'F={F/1e3:.1f} kN T={T}s')
    for gname,(rho,cs,xi) in grounds.items():
        vals=[1000*ppv(F,T,r,rho,cs,kind,xi) for r in rs]
        vals0=[1000*ppv(F,T,r,rho,cs,kind,0) for r in rs]
        print(f"   {gname:20s} " + '  '.join(f"{r}m:{v:.3g}({v0:.3g})" for r,v,v0 in zip(rs,vals,vals0)))
