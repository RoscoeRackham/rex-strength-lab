import math
lb=0.45359237; gal=3.785411784e-3; btu=1055.05585262; kwh=3.6e6
# semi truck
m=80000*lb; v=100/3.6
print('semi mass',m,'KE',0.5*m*v*v)
for mph in (55,65,75):
    vv=mph*0.44704; print(' semi at',mph,'mph',0.5*m*vv*vv)
# food
print('food 2000 kcal_th',2000*4184,' IT',2000*4186.8, ' range 1600-3000', 1600*4184, 3000*4184)
# home electricity
yr=10791*kwh; print('home yr',yr,'day',yr/365,'week',yr/52.18, 'month', 899*kwh)
# lightning
print('lightning geo mean 2e8..7e9',math.sqrt(2e8*7e9), 'geo of 0.4 and 5.3 GJ', math.sqrt(0.4e9*5.3e9))
# train
mt=454e3; vt=320/3.6; print('train KE',0.5*mt*vt*vt, ' with 460 pax at 80 kg', 0.5*(mt+460*80)*vt*vt, ' at 300 km/h', 0.5*mt*(300/3.6)**2)
# A380
T=273.15-56.46; a=math.sqrt(1.4*287.05*T); print('a strat',a)
T2=273.15+15.04-0.00649*10668; a2=math.sqrt(1.4*287.05*T2); print('a FL350',a2, T2)
v=0.85*a; print('M0.85 v',v, v*3.6)
for mass in (575e3,560e3,394e3,386e3,369e3,361e3):
    print(' A380',mass, 0.5*mass*v*v)
# tank
for b in (120214,112114,116090,120388,124340):
    print(' tank 13.2 gal at',b, 13.2*b*btu)
print(' tank litres',13.2*gal*1000)
# grenade
mg=0.18427
print('grenade CompB heat det gas',mg*4.69e6,' liq',mg*5.02e6,' TNT-eq ratio', 1.20/1.09, 1.12/1.02, ' TNT eq', mg*1.10*4.184e6, ' kcal basis', mg*1.12*4184e3, mg*1.20*4184e3)
# MOAB
mh=18700*lb; print('MOAB H6 kg',mh,' x1.35 t TNT', mh*1.35/1000, ' J', mh*1.35*4.184e6, ' 11 t', 11*4.184e9)
# tonne TNT
print('tonne TNT',4.184e9)
# corolla
print('corolla', 0.5*1340*(100/3.6)**2)
