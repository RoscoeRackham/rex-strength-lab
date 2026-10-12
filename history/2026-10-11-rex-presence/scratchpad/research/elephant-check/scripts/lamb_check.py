import math
# Rayleigh pole residue coefficient for vertical point force on Poisson half-space
nu=0.25
ks=1.0
kp=ks*math.sqrt((1-2*nu)/(2*(1-nu)))
def Fk(k):
    a=math.sqrt(k*k-kp*kp); b=math.sqrt(k*k-ks*ks)
    return (2*k*k-ks*ks)**2-4*k*k*a*b
# find root > ks
lo,hi=1.0001,1.5
for _ in range(200):
    m=(lo+hi)/2
    if Fk(lo)*Fk(m)<=0: hi=m
    else: lo=m
kR=(lo+hi)/2
h=1e-7; dF=(Fk(kR+h)-Fk(kR-h))/(2*h)
aR=math.sqrt(kR*kR-kp*kp)
C=ks*ks*aR*kR/abs(dF)
print('cR/cs=%.4f kR=%.4f  C=%.4f'%(1/kR,kR,C))
# u_z = F ks/(2 mu) * C * sqrt(2/(pi kR r))  (|H0^(2)| far field)
def v(F,f,Vs,rho,r,alpha=0.0):
    ksv=2*math.pi*f/Vs; mu=rho*Vs*Vs; kRv=ksv*kR
    u=F*ksv/(2*mu)*C*math.sqrt(2/(math.pi*kRv*r))*math.exp(-alpha*r)
    return 2*math.pi*f*u, u
print('\nResearcher cases (f=20 Hz):')
for lab,rho,Vs in (('loose sand',1700,120),('firm soil',1900,250),('soft rock',2200,600)):
    for F in (946,125):
        out=[v(F,20,Vs,rho,r)[0]*1e3 for r in (2,10,20)]
        print('%-10s F=%4d N: v(2,10,20 m) = %s mm/s ; wavelength %.1f m'%(lab,F,['%.3g'%x for x in out],Vs/20))
print('\nFast walk at its dominant 5-10 Hz (Table S1), loose sand:')
for f in (7.5,10):
    out=[v(946,f,120,1700,r)[0]*1e3 for r in (2,10,20)]
    print('f=%.1f: v(2,10,20)= %s mm/s'%(f,['%.3g'%x for x in out]))
# Boussinesq static near field
mu=1700*120**2; F=946
for r in (2,5):
    w=F*(1-nu)/(2*math.pi*mu*r); print('Boussinesq r=%d: w=%.3g m, v at 7.5 Hz=%.3g mm/s, at 20 Hz=%.3g mm/s'%(r,w,2*math.pi*7.5*w*1e3,2*math.pi*20*w*1e3))
# What force reproduces Steinmann 4e-8 m at 20 m, 18.5 Hz?
for Vs,rho in ((150,1700),(200,1750),(250,1900),(300,1900)):
    u1=v(1,18.5,Vs,rho,20)[1]; print('Vs=%d: F for u=3.9e-8 m at 20 m: %.0f N'%(Vs,3.9e-8/u1))
# Mortimer modelled fast walk at 200 m (Fig 1F ~2e-7 m) vs half-space
for Vs in (120,150,200):
    print('Vs=%d, 946 N, 7.5 Hz, 200 m: u=%.2g m'%(Vs,v(946,7.5,Vs,1700,200)[1]))
