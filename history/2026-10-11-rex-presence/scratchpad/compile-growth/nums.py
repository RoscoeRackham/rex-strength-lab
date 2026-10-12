import math
c=299792458.0; c2=c*c
m0=3007.0; H0=3.048; V0=m0/1060; R0=(3*V0/(4*math.pi))**(1/3)
rho_a=1.225; p0=101325.0; a0=340.29; gam=1.4
def kgR(Z): return 808*(1+(Z/4.5)**2)/(math.sqrt(1+(Z/0.048)**2)*math.sqrt(1+(Z/0.32)**2)*math.sqrt(1+(Z/1.35)**2))
def reach(W,dp):
    lo,hi=1e-3,1e6
    for _ in range(200):
        mid=math.sqrt(lo*hi)
        if p0*kgR(mid/W**(1/3))>dp: lo=mid
        else: hi=mid
    return lo
# anchored instant blast: Chicxulub pure size and mix
for name,Ex_lo,Ex_hi in [('Chx size',8.93e8,1.45e9),('Chx mix',1.33e7,2.41e7),('Sun size',9.56e11,1.5e12),('Sun mix',6.71e8,1.09e9)]:
    for fac in (1,2,4.27):
        lo=Ex_lo*fac; hi=Ex_hi*fac
        Wl=2*lo/4.184e6; Wh=2*hi/4.184e6
        print(f"{name} x{fac}: Ex {lo:.3g}-{hi:.3g} J TNT {lo/4.184e6:.3g}-{hi/4.184e6:.3g} kg Wfree {Wl:.3g}-{Wh:.3g} win6.9 {reach(Wl,6895):.0f}-{reach(Wh,6895):.0f} win3.4 {reach(Wl,3447):.0f}-{reach(Wh,3447):.0f}")
# head pressure at 1407 m/s
u=1407; x=(gam+1)*u/(4*a0); M=x+math.sqrt(x*x+1); print('flat 1407', p0*(2*gam/(gam+1))*(M*M-1)/1e6,'MPa; rho u^2',rho_a*u*u/1e6)
# T_p at 35.6 Pa from T_100
f=math.sqrt(100/35.6); print('factor',f)
T100={'Krak mix':0.003,'Krak size':0.0043,'Chx1e23 mix':0.44,'Chx1e23 size':1.1,'Chx mix':0.69,'Chx size':1.887,'Sun mix':5.0,'Sun size':21.8}
for k,v in T100.items(): print(k, round(v*f,4))
# Krakatoa 1e17
print('1e17 J ->',1e17/c2,'kg')
print('1.5 Gt J', 1.5e3*4.184e15, '12 Gt', 12e3*4.184e15)
# chicxulub impactor check
for d in (12.2e3,14.4e3):
    m=math.pi/6*d**3*2630; print(d, m*18e3**2/2)
# Bondi cap
print('cap', 5.1e18*0.5*c2, 5.1e18*0.5)
# mix small-k loop ratio
print('mix small', p0/(2*1060*c2), 'rock bound', 2700*(36100)**2/(1060*c2), 'same-density', (36100/c)**2)
# side factor durations: Chicxulub size side at 0.8
print('Chx size side at 0.8:', 1.925*0.8*(H0*(1+4.2e23/c2/m0)**(1/3)-H0)/0.25)
