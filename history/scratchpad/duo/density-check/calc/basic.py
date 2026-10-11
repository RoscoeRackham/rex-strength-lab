import math
G=6.67430e-11; c=299792458.0; g=9.80665; GME=3.986004418e14; RE=6.371e6; ME=5.9722e24
Msun=1.9884e30; Rsun=6.957e8
f=lambda x,n=5: f"{x:.{n}g}"
V=0.18; R=(3*V/(4*math.pi))**(1/3)
print("R eq",f(R,7))
for nm,rho in [("plush",30),("human",1060),("water",1000),("steel",7850),("osmium",22587),("WD",2.77e9),("nucleus",2.7e17),("NS",4.12e17)]:
    print("preset",nm,f(rho*V))
# Sirius B
M=1.017*Msun; Rw=0.00803*Rsun; rhoWD=M/(4/3*math.pi*Rw**3); print("SiriusB mean rho",f(rhoWD))
for (mm,rr) in [(1.017-0.025,0.00803+0.00011),(1.017+0.025,0.00803-0.00011),(1.017,0.00808)]:
    print("  range", f(mm*Msun/(4/3*math.pi*(rr*Rsun)**3)))
print("  ESA rounded", f(0.98*Msun/(4/3*math.pi*(6e6)**3)))
# NS
for (mm,rr) in [(1.5,12e3),(1.4,13e3),(2.0,11e3)]:
    print("NS rho",mm,rr,f(mm*Msun/(4/3*math.pi*rr**3)))
print("n0*mn",f(0.16e45*1.67492750e-27))
# BH density
def Rof(H): return (3*0.18*(H/2)**3/(4*math.pi))**(1/3)
for H in [0.4,2,50,0.1]:
    Rh=Rof(H); rho=3*c*c/(8*math.pi*G*Rh*Rh); m=rho*0.18*(H/2)**3
    print("BH",H,"R",f(Rh),"rho",f(rho),"m",f(m),"Earths",f(m/ME),"Buchdahl m",f(8/9*m))
# Phobos/Deimos
mph=7.087e5*1e9/G; mde=9.62e4*1e9/G
print("Phobos",f(mph),"+-",f(0.0000006e9/G*1e0)); print("Deimos",f(mde))
mNS=4.12e17*V; mWD=2.77e9*V
print("NS/Phobos",f(mNS/mph),"WD/Nimitz",f(mWD/1.0394e8))
# self gravity
def grav(m):
    GM=G*m; return dict(GM=GM,gs=GM/R**2,gs_g=GM/R**2/g,vesc=min(c,math.sqrt(2*GM/R)),dbeat=math.sqrt(GM/g),rB=GM/340.29**2,
        Mdot=2*math.pi*GM**2*1.225/340.29**3,heat=GM/R,rs=2*GM/c**2)
for nm,m in [("default",180),("WD",mWD),("NS",mNS)]:
    d=grav(m); print(nm,{k:f(v,5) for k,v in d.items()})
d=grav(mNS); print("NS power",f(d['Mdot']*d['heat']))
# infall from 10 m
GM=G*mNS; d0=10; x=R/d0
t=math.sqrt(d0**3/(2*GM))*(math.sqrt(x*(1-x))+math.acos(math.sqrt(x))); v=math.sqrt(2*GM*(1/R-1/d0)); print("infall10",f(t),f(v))
# tidal
L=1.8
def da(dd): return GM*(1/(dd-L/2)**2-1/(dd+L/2)**2)
lo,hi=R+L/2,1e6
for i in range(200):
    mid=math.sqrt(lo*hi)
    if da(mid)>g: lo=mid
    else: hi=mid
print("tidal1g",f(lo),"farfield",f((2*GM*L/g)**(1/3)),"da10 in g",f(da(10)/g))
# thresholds
print("beat threshold m",f(g*R*R/G),"rho",f(g*R*R/G/V))
print("bondi threshold m",f(340.29**2*R/G))
vrms=math.sqrt(3*287.0528*288.15); print("vrms",f(vrms),"6vrms",f(6*vrms))
mh=(6*vrms)**2*R/(2*G); print("holds air m",f(mh),"rho",f(mh/V))
print("vesc=11186 m",f(11186**2*R/(2*G)))
print("rcrush=RE m",f(1.7e9*RE/(2700*G)))
print("rcrush NS",f(2700*GM/1.7e9),"unconf",f(2700*GM/2e8))
print("selfgrav move threshold G m/(0.5H)^2>=1e-3 g -> m",f(1e-3*g*1.0/G))
# ground
print("concrete max m",f(2.5e6*0.09/g),"granite feet",f(1.7e9*0.09/g),"fall thru",f(1.7e9*0.3/g),"rho",f(1.7e9*0.3/g/V))
print("kaiju fall thru m",f(1.7e9*0.3*625/g),"rho",f(1.7e9*0.3*625/g/(0.18*25**3)))
# Earth falls
for m in [2.3583e26,ME]:
    tff=math.pi/2*math.sqrt(RE**3/(2*G*(m+ME))); print("tff",f(m),f(tff),"Elow",f(G*m*ME/RE),"x bind",f(G*m*ME/RE/2.49e32))
# decomp
E=16.3*1.602176634e-13/1.67492750e-27; print("E_NM J/kg",f(E),"kt/kg",f(E/4.184e12),"NS decomp",f(E*mNS),"frac bind",f(E*mNS/2.49e32))
print("P_NM",f(1.4*1.602176634e32),f(2.1*1.602176634e32), "atm", f(2.8e32/101325))
# mutual
dc=2*R; F=G*mNS**2/dc**2; W=mNS*g
print("dc",f(dc),"F",f(F),"xW",f(F/W),"lift kg",f(F/g),"Ebind",f(G*mNS**2/dc),"eqW",f(math.sqrt(G*mNS/g)),"slip .6",f(math.sqrt(G*mNS/(0.6*g))))
Mt=2*mNS; d0=10; x=dc/d0
t=math.sqrt(d0**3/(2*G*Mt))*(math.sqrt(x*(1-x))+math.acos(math.sqrt(x))); v=math.sqrt(2*G*Mt*(1/dc-1/d0)); print("fall together",f(t),f(v),"E",f(G*mNS**2*(1/dc-1/d0)))
print("default pair F",f(G*180**2/dc**2),"mg",f(G*180**2/dc**2/g*1e6))
# catch
GMa=G*mNS; dd=10; r0=0.5
dphi=GMa*((1/r0+1/(dd-r0))-(1/5+1/5)); print("catch vmin",f(math.sqrt(2*dphi)))
# throw
print("escape 0.5",f(math.sqrt(2*GMa/0.5)),"vout",f(math.sqrt(11610**2-2*GMa/0.5)))
# Corolla
Lo=(1340/115)**(1/3); rl=1+Lo/2; gsl=GMa/rl**2; print("corolla Lo",f(Lo),"rl",f(rl),"gs",f(gsl),"g",f(gsl/g),"W",f(1340*(g+gsl)))
# energy
print("Phi drop 4.9164e7 *mNS",f(mNS*4.9164e7),"x chicxulub",f(mNS*4.9164e7/4.2e23))
print("first pass dE -> dh",f(2.373e18/(mNS*9.82)))
