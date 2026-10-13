c=299792458.0; c2=c*c
L=3.828e26; yr=3.155693e7; yr365=3.1536e7
mE=5.9722e24; mM=7.346e22; mS=1.9884e30; mJ=1.89813e27
erg=1e-7
def ke(m,v): return 0.5*m*v*v
print("c2",c2)
print("earth orbit KE", ke(mE,29780), ke(mE,29290), ke(mE,30290))
print("sun year", L*yr, "365d", L*yr365)
print("jupiter orbit", ke(mJ,13060), ke(mJ,12440), ke(mJ,13720))
print("century", L*yr*100, "millennium", L*yr*1e3, "Myr", L*yr*1e6, "Gyr", L*yr*1e9)
print("nova NASA hi 1e5*sun-year", 1e5*L*yr)
d=(8.7/15)**2; dlo=(7.2/15)**2; dhi=(10.5/15)**2
print("magnetar Palmer@8.7",2e46*d*erg,"Hurley@8.7",3.7e46*d*erg, "Palmer@7.2",2e46*dlo*erg, "Hurley hi@15",4.6e46*erg, "Hurley hi@10.5",4.6e46*dhi*erg, "Hurley lo @7.2", 2.8e46*dlo*erg)
print("quarter million sun-years", 2.5e5*L*yr)
print("moon mc2", mM*c2, "earth mc2", mE*c2, "sun mc2", mS*c2, "jup mc2", mJ*c2)
print("sun gal KE", ke(mS,247e3), ke(mS,243e3), ke(mS,251e3))
import math
print("3D speed with U=10.6,W=7.6:", math.sqrt(247**2+10.6**2+7.6**2))
Msc2=mS*c2
print("GW150914", 3.0*Msc2, 2.5*Msc2, 3.5*Msc2)
print("GW190521", 7.6*Msc2, 5.7*Msc2, 9.8*Msc2, "all models", 5.0*Msc2, 10.6*Msc2)
print("earth mc2 / binding 2.49e32", mE*c2/2.49e32)
# ladder steps
rungs=[("earth binding",2.49e32),("earth orbit",ke(mE,29780)),("sun year",L*yr),("jup orbit",ke(mJ,13060)),("century",L*yr*100),("millennium",L*yr*1e3),("nova",1e38),("magnetar",1e39),("moon mc2",mM*c2),("sun gal",ke(mS,247e3)),("earth mc2",mE*c2),("sn light",1e42),("Gyr",L*yr*1e9),("sn blast",1e44),("jup mc2",mJ*c2),("hypernova",3e45),("sn nu",3e46),("sun mc2",Msc2),("gw150914",3*Msc2),("gw190521",7.6*Msc2)]
for a,b in zip(rungs,rungs[1:]): print(f"{a[0]:>12} -> {b[0]:<12} {b[1]/a[1]:.2f}x")
