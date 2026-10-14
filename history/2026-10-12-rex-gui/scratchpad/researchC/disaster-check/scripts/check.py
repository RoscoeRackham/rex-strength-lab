import math
T=4.184e9; kt=T*1e3; Mt=T*1e6
GM=3.986004418e14; R=6.371e6
print('Hubble mass 27000 lb ->', 27000*0.45359237)
print('Hubble 17000 mph ->', 17000*0.44704, ' 27300 kph ->', 27300/3.6)
for h in (547e3, 535e3, 515e3):
    print('  circ v at',h/1e3,'km', math.sqrt(GM/(R+h)), 'period min', 2*math.pi*math.sqrt((R+h)**3/GM)/60)
KE=0.5*12247*7600**2; print('Hubble KE', KE, 't TNT', KE/T)
print('Hubble KE at 7591', 0.5*12247*7591**2)
# ground-relative: Earth rotation at 28.5 deg incl, max eastward component of ground speed 465 m/s
print('Hubble KE rel ground (v-409 for prograde at equator crossing, cos28.5*465)', 0.5*12247*(7600-465*math.cos(math.radians(28.5)))**2)
print('Tianjin 450 t', 450*T, ' 430', 430*T)
for k in (0.13,0.3,0.5,0.75,0.8,1.1,1.12,2.0): print('Beirut',k,'kt',k*kt)
print('geo mid 0.5-1.12', math.sqrt(0.5*1.12), ' 0.3-1.12', math.sqrt(0.3*1.12))
print('Halifax 2.9 kt', 2.9*kt)
print('ISS lb->kg', 925335*0.45359237)
T5400=5400; v=(2*math.pi*GM/T5400)**(1/3); print('ISS v from 90 min', v, 'alt', (GM*(T5400/2/math.pi)**2)**(1/3)/1e3-6371)
print('ISS 5 mi/s', 5*1609.344)
for h in (400e3,410e3,420e3): print(' ISS circ v at',h/1e3, math.sqrt(GM/(R+h)), 'period', 2*math.pi*math.sqrt((R+h)**3/GM)/60)
for vv in (7741,8046.72,7660): print(' ISS KE at',vv, 0.5*419725*vv**2)
print('Hiroshima 12/15/16/18 kt', [x*kt for x in (12,15,16,18)])
print('Sedan', 104*kt)
print('EQ M7: 5.24+1.44M ->', 10**(5.24+1.44*7), ' GR erg->J', 10**(11.8+1.5*7)/1e7, ' Me=7 J', 10**(1.5*(7+2.9)))
print('EQ M6.5 GR', 10**(11.8+1.5*6.5)/1e7, ' M6', 10**(11.8+1.5*6)/1e7)
print('Chelyabinsk 400/500/600/441 kt', [x*kt for x in (400,500,600,441)], ' 4.185e12 x500', 500*4.185e12)
print('Hoover 4.0/4.2 billion kWh', 4.0e9*3.6e6, 4.2e9*3.6e6, ' min/max', 2648224700*3.6e6, 10348020500*3.6e6)
print('Bravo 15 Mt', 15*Mt, ' MSH 24 Mt', 24*Mt, ' 7 Mt', 7*Mt, ' 1e24 erg', 1e24/1e7)
# ladder steps
L=[('MOAB',4.6024e10),('Hubble',3.54e11),('Beirut',3.138e12),('Halifax',1.21336e13),('Hiroshima',6.276e13),('Sedan',4.35136e14),('Chelyabinsk',2.092e15),('Hoover',1.44e16),('Bravo',6.276e16),('MSH',1.00416e17),('Tsar',2.092e17)]
for (a,x),(b,y) in zip(L,L[1:]): print(f'{a}->{b}: {y/x:.2f}x')
print('Beirut alt at 1.12kt over Hubble', 1.12*kt/3.54e11, ' 0.3 kt', 0.3*kt/3.54e11, ' Halifax/Beirut0.3', 2.9/0.3, ' Halifax/Beirut0.5',2.9/0.5)
print('ISS/Beirut', 1.257e13/3.138e12, 'Hiroshima/ISS', 6.276e13/1.257e13)
