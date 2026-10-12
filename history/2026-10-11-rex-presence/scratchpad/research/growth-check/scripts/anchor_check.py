import math
c=299792458.0; c2=c*c
m0=3007.0; V0=m0/1060; R0=(3*V0/(4*math.pi))**(1/3); H0=3.048; g=9.80665
# energy factor sum(u_n^3 dA)/(Vdot*u_sph^2) for isometric growth anchored at a ground point
Rh=R0/H0
w2=(4/3)*Rh**3          # (w/H)^2 for an upright cylinder with the same volume
cyl=(1+2*w2)/(3*Rh**2)
print(f"R_eq/H={Rh:.4f} cylinder half-width/H={math.sqrt(w2):.3f}  energy factor cylinder={cyl:.2f}  ball anchored at base=2.00")
# numeric check ball anchored at bottom
N=200000; s=0
for i in range(N):
    mu=-1+(i+0.5)*2/N; s+=(1+mu)**3*2/N
print("ball integral check (expect 4):", s)
# instant Chicxulub pure size: CoM momentum and sole stress
E=4.2e23; k=1+E/c2/m0; Hf=H0*k**(1/3); tx=Hf/1540; Hd=(Hf-H0)/tx; Mf=m0*k
vcm=0.5*Hd
P=Mf*vcm; Mdot_end=3*Mf*Hd/Hf; F_end=vcm*Mdot_end
sole=2*0.31*k**(2/3)
print(f"Chx size instant: Hdot={Hd:.0f} m/s v_cm={vcm:.0f} m/s P={P:.3g} kg m/s rise if free={vcm**2/(2*g)/1e3:.1f} km F_end={F_end:.3g} N sole={sole:.1f} m2 stress={F_end/sole/1e9:.2f} GPa")
# gradual: lift-off limit T so that peak CoM accel <= g  (small-k approx, column CoM=H/2): 0.5*dH*2pi/T^2 <= g
for name,E in [('Chx size',4.2e23),('Sun size',3.828e26)]:
    k=1+E/c2/m0; dH=H0*(k**(1/3)-1); T=math.sqrt(0.5*dH*2*math.pi/g); print(name,'lift-off T_min ~', round(T,1),'s')
# Krakatoa spread mass at 1.5 Gt and 12 Gt
for Gt in [1.09,1.5,5.5,12]:
    E=Gt*1e3*4.184e15; dm=E/c2; k=1+dm/m0
    print(f"Krakatoa {Gt} Gt = {E:.3g} J -> dm={dm:.0f} kg ({100*(k-1):.1f}%), size H +{100*(H0*k**(1/3)-H0):.1f} cm, mix H +{100*(H0*k**(1/6)-H0):.1f} cm")
# USBM conversions
for dB in [134,129,125,120]: print(dB,'dB ->',round(20e-6*10**(dB/20),1),'Pa')
print('0.0145 psi ->',0.0145*6894.757)
# incompressible limit surface pressure for constant-speed sphere
print('incompressible k -> 2 - 1/2 =',2-0.5)
