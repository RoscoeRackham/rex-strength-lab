mph=0.44704; oz=0.028349523125; lb=0.45359237; kcal_per_g_to_J_per_kg=4.184e6; TNT_t=4.184e9
v=105.8*mph
m=[5*oz,5.125*oz,5.25*oz]
print('pitch v',v,'m',m)
print('pitch KE', [0.5*x*v*v for x in m])
# spin check: ~2,400 rpm, I=(2/5) m r^2 approx (wound ball ~0.4)
import math
r=0.0738/2; w=2400*2*math.pi/60; I=0.4*m[1]*r*r
print('spin KE ~', 0.5*I*w*w)
u=100/3.6
for name,l in [('LE',2955),('SE',3110),('XSE',3150),('HybLE',2850),('HybSE',3140)]:
    kg=l*lb; print('corolla',name,kg, 0.5*kg*u*u)
fill=6.5*oz; print('m67 fill',fill)
for name,q in [('LLNL CompB exp H2O(l) 1.20',1.20),('LLNL CompB exp H2O(g) 1.12',1.12),('AMCP CompB explosion 1240',1.240),('LLNL calc max H2O(l) 1.54',1.54)]:
    print('grenade',name,fill*q*kcal_per_g_to_J_per_kg)
print('CompB/TNT LLNL exp', 1.20/1.09, 1.12/1.02, 'AMCP', 1240/1080)
moab_fill=18700*lb; print('moab fill kg',moab_fill)
print('moab H6 923 cal/g', moab_fill*0.923*kcal_per_g_to_J_per_kg)
print('moab H6 combustion 3972 cal/g', moab_fill*3.972*kcal_per_g_to_J_per_kg)
print('moab museum 1.35xTNT', moab_fill*1.35*4.184e6, moab_fill*1.35/1000,'t')
print('moab 11 t', 11*TNT_t)
for kt in [12,14,15,16,18]: print('hiro',kt, kt*1e3*TNT_t)
print('bravo', 15e6*TNT_t)
for mt in [50,57,58]: print('tsar',mt, mt*1e6*TNT_t)
for mt in [24,100,125,150,200]: print('krak',mt, mt*1e6*TNT_t)
rho=2630; d=17e3; vv=12e3; mass=rho*math.pi/6*d**3; print('collins60 mass',mass,'KE',0.5*mass*vv*vv)
for dd in [12.2e3,14.4e3]:
    for rr in [2630]:
        mm=rr*math.pi/6*dd**3; print('morgan check',dd,0.5*mm*18e3**2)
print('sharpton', 4e8*1e6*TNT_t/1e6, 4e8*4.184e15, 4e9*4.184e15)
print('1e8 Mt', 1e8*4.184e15)
