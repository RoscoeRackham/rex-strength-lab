import math
P=101325
def kg(Z): return 808*(1+(Z/4.5)**2)/(math.sqrt(1+(Z/0.048)**2)*math.sqrt(1+(Z/0.32)**2)*math.sqrt(1+(Z/1.35)**2))
def dist(W,dp):
    lo,hi=0.01,1e7
    for _ in range(200):
        m=math.sqrt(lo*hi)
        if kg(m/W**(1/3))*P>dp: lo=m
        else: hi=m
    return lo
for lab,Ex in (('Chicxulub size (Taylor)',8.93e8),('Chicxulub size (planar)',1.45e9),('Chicxulub mix',1.33e7),('Sun size',9.56e11),('Sun mix',6.71e8)):
    W=2*Ex/4.184e6   # free-air equivalent with rigid ground (E'=2E, Baker 1977)
    Rbar2=2*(2*Ex/P)**(1/3)
    print(f"{lab}: W_free={W:.3g} kg TNT; Sachs Rbar=2 at R={Rbar2:.3g} m; dp at 20 m {kg(20/W**(1/3))*P/1e3:.3g} kPa, 50 m {kg(50/W**(1/3))*P/1e3:.3g} kPa, 100 m {kg(100/W**(1/3))*P/1e3:.3g} kPa")
    print(f"    windows (6.9 kPa) to {dist(W,6895):.3g} m; (3.4 kPa) to {dist(W,3447):.3g} m; 100 Pa to {dist(W,100):.3g} m (KG fit likely poor this far)")
