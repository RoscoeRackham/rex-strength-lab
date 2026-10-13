import math

G=6.67430e-11; a=6371e3
# PREM Table I density polynomials (g/cm3), x=r/a
layers=[(0,1221.5,[13.0885,0,-8.8381]),
(1221.5,3480.0,[12.5815,-1.2638,-3.6426,-5.5281]),
(3480.0,5701.0,[7.9565,-6.4761,5.5283,-3.0807]),
(5701.0,5771.0,[5.3197,-1.4836]),
(5771.0,5971.0,[11.2494,-8.0298]),
(5971.0,6151.0,[7.1089,-3.8045]),
(6151.0,6346.6,[2.6910,0.6924]),
(6346.6,6356.0,[2.900]),
(6356.0,6368.0,[2.600]),
(6368.0,6371.0,[1.020])]
def rho(r):
    x=r/a
    for lo,hi,c in layers:
        if lo*1e3<=r<=hi*1e3+1e-6:
            return 1000*sum(ci*x**i for i,ci in enumerate(c))
    return 0
# build fine grid
import numpy as np
rs=[];
for lo,hi,c in layers:
    rs.append(np.linspace(lo*1e3,hi*1e3,4001)[:-1] if hi<6371 else np.linspace(lo*1e3,hi*1e3,4001))
r=np.concatenate(rs)
d=np.array([rho(ri) for ri in r])
# use midpoint integration per segment
M=0; U=0; I=0
for i in range(len(r)-1):
    r0,r1=r[i],r[i+1]; rm=0.5*(r0+r1)
    # density evaluated at midpoint within layer
    dm=rho(rm)
    dm_=4*math.pi*rm**2*dm*(r1-r0)
    Mm=M+0.5*dm_
    U+=G*Mm*dm_/rm
    I+=(2/3)*rm**2*dm_
    M+=dm_
print("PREM mass %.4e kg  U=%.4e J  I/(Ma^2)=%.4f"%(M,U,I/(M*a*a)))
Me=5.9722e24
print("uniform 3GM^2/5R = %.4e (with PREM M) ; %.4e (with 5.9722e24)"%(3*G*M*M/(5*a),3*G*Me*Me/(5*a)))
# baseball
mph=0.44704
v=105.8*mph; oz=0.028349523125
m=(5+5.25)/2*oz
print("pitch v=%.4f m/s  m=%.5f kg KE=%.2f low=%.2f high=%.2f"%(v,m,0.5*m*v*v,0.5*5*oz*v*v,0.5*5.25*oz*v*v))
# spin
rb=9.125*0.0254/(2*math.pi); Ib=0.4*m*rb**2; w=2400*2*math.pi/60
print("spin KE at 2400 rpm (uniform sphere) %.2f J"%(0.5*Ib*w*w))
# corolla
lb=0.45359237
for name,w_ in [('LE',2955),('XSE',3150),('HybLE',2850),('HybSE-2',3250)]:
    mk=w_*lb; vv=100/3.6
    print("Corolla %s %.1f kg KE=%.4e J"%(name,mk,0.5*mk*vv*vv))
print("driver 75 kg adds %.0f J"%(0.5*75*(100/3.6)**2))
# grenade
fill=6.5*oz
print("fill %.5f kg"%fill)
for lbl,q in [('Comp B 5.02 MJ/kg',5.02e6),('4.69',4.69e6),('AMCP 1240 cal/g',1240*4184),('1.20 kcal/g',1.20*4.184e6)]:
    print(" grenade %s -> %.4e J"%(lbl,fill*q))
print(" grenade via ballistic mortar 133%%TNT: %.4e J ; via 1.33xTNT 4.184: same"%(fill*1.33*4.184e6))
print(" TNT-equiv by energy convention: %.3f kg TNT"%(fill*5.02e6/4.184e6))
# MOAB
fillm=18700*lb
print("MOAB fill %.1f kg"%fillm)
print(" 11 t TNT = %.4e J"%(11*4.184e9))
print(" fill x1.35 = %.3f t TNT = %.4e J"%(fillm*1.35/1000,fillm*1.35*4.184e6))
print(" fill x 923 cal/g = %.4e J"%(fillm*923*4184))
print(" fill x 3972 cal/g = %.4e J"%(fillm*3972*4184))
print(" 8500 kg x1.35 = %.4e"%(8500*1.35*4.184e6))
# nuclear
kt=4.184e12; Mt=4.184e15
print("Hiroshima 15kt %.4e  12kt %.4e 18kt %.4e 16kt %.4e"%(15*kt,12*kt,18*kt,16*kt))
print("Bravo 15Mt %.4e  Tsar 50Mt %.4e 57Mt %.4e"%(15*Mt,50*Mt,57*Mt))
print("Krakatoa 100 %.4e 125 %.4e 150 %.4e 200 %.4e"%(100*Mt,125*Mt,150*Mt,200*Mt))
# chicxulub
for D,v_ in [(17e3,12e3),(21e3,12e3),(10e3,20e3)]:
    mm=4/3*math.pi*(D/2)**3*2630
    print("Chicx D=%.0f km v=%.0f km/s KE=%.3e"%(D/1e3,v_/1e3,0.5*mm*v_**2))
print("Sharpton 4e8 Mt %.4e 4e9 Mt %.4e"%(4e8*Mt,4e9*Mt))
print("100 million Mt = %.3e"%(1e8*Mt))
# ratios between rungs
rungs=[('pitch',162.5),('corolla',5.171e5),('grenade',9.25e5),('MOAB',4.6024e10),('Hiroshima',6.276e13),('Bravo',6.276e16),('Tsar',2.092e17),('Krakatoa',5.23e17),('Chicx',5e23),('Sun1s',3.828e26),('Earth',2.489e32)]
for (a_,x),(b_,y) in zip(rungs,rungs[1:]):
    print("%s->%s ratio %.3g"%(a_,b_,y/x))
