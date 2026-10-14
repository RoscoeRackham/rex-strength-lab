import math
TNT=4.184e9
# hurricane
r=665e3; rain=0.015
m=math.pi*r*r*rain*1000
print('rain kg/day %.3e  vol cm3 %.3e  heat(2.5MJ/kg) %.3e J  power %.3e W'%(m, m*1e3, m*2.5e6, m*2.5e6/86400))
print('wind power %.3e W'%(1.3e17/86400))
# Emanuel style check: rho*Cd*V^3*pi r^2
for cd in (1e-3,2e-3):
    P=1.2*cd*40**3*math.pi*(60e3)**2; print(' Cd',cd,'P %.2e W, day %.2e J'%(P,P*86400))
# world energy
btu=1055.056
Y=637.8e15*btu; print('EIA 2022 %.4e J'%Y, 'day %.3e week %.3e'%(Y/365,Y*7/365), 'avg TW %.2f'%(Y/3.15576e7/1e12))
print('EI 600 EJ day %.3e week %.3e'%(6e20/365,6e20*7/365))
# heat flow
yr=365.25*86400
for P in (45,47,49): print('heat %d TW year %.4e'%(P,P*1e12*yr))
# sunlight
S=1361; R=6.371e6; Re=6.378137e6
Pw=S*math.pi*R*R; print('sun on Earth W %.4e  day %.4e  hour %.4e  year %.4e'%(Pw,Pw*86400,Pw*3600,Pw*yr))
au=149.5978707; peri=147.095; aph=152.100
print('perihelion factor %.4f aphelion %.4f'%((au/peri)**2,(au/aph)**2))
print('day low %.4e high %.4e'%(Pw*86400*(au/aph)**2, Pw*86400*(au/peri)**2))
e=0.0167086; print('orbit-avg factor %.5f'%(1/math.sqrt(1-e*e)))
print('year range S 1360-1362, R mean..equatorial: %.4e .. %.4e'%(1360*math.pi*R*R*yr, 1362*math.pi*Re*Re*yr))
print('year/human-year %.0f'%(Pw*yr/Y))
# flare
for v in (626,600,362): print('flare %d e30 erg = %.3e J'%(v,v*1e30*1e-7))
print('Woods +-39%%: %.2e..%.2e ; Emslie 362 +-70%%: %.2e..%.2e'%(600*0.61e23,600*1.39e23,362*0.3e23,362*1.7e23))
# quakes
for v in (1.4e17,1.2e17,1.38e17,2.98e17,4.2e17,1.9e17): print('%.2e J = %.1f Mt'%(v,v/TNT/1e6))
print('Me 8.9 -> Es %.2e J (Me=2/3 log Es -2.9)'%10**(1.5*(8.9+2.9)))
print('Me 8.5 -> Es %.2e J'%10**(1.5*(8.5+2.9)))
# St Helens
print('1e24 erg = %.3e J = %.2f Mt'%(1e17,1e17/TNT/1e6))
# Tambora
for V in (30e9,33e9):
  for q in (1.2e6,1.4e6): print('Tambora V %.0f km3 q %.1f MJ/kg: %.2e J'%(V/1e9,q/1e6,V*2600*q))
print('Klemetti 1.4e20 J in TNT %.1f Gt'%(1.4e20/TNT/1e9))
# Vredefort
def ke(d,rho,v): return math.pi/6*d**3*rho*v*v/2
for d,v in ((25e3,15e3),(20e3,25e3),(15e3,15e3),(20e3,20e3),(25e3,20e3),(20e3,15e3)):
  print('Vred d %.0f km v %.0f km/s: %.2e..%.2e J'%(d/1e3,v/1e3,ke(d,2600,v),ke(d,3300,v)))
# ladder
rungs=[('Tsar',2.092e17),('Krakatoa',8.368e17),('week',1.29e19),('hurricane day',5.2e19),('human year',6.729e20),('internal heat yr',1.483e21),('sun day',1.4995e22),('Chicxulub',4.2e23),('sun year',5.477e24),('flare',6e25),('Sun-second',3.828e26)]
for (a,x),(b,y) in zip(rungs,rungs[1:]): print('%-18s -> %-18s %.1fx'%(a,b,y/x))
print('week of sunlight %.3e'%(Pw*86400*7))
# Antarctica melt alternative
