import math, numpy as np
c=299792458.0; G=6.6743e-11; rho_air=1.225; p0=101325.0; a0=340.29; gam=1.4
M0=3007.0; H0=3.048; rhoB=1060.0; V0=M0/rhoB; R0=(3*V0/(4*math.pi))**(1/3)
c_t=1540.0
TNT=4.184e6
forms={'mix':0.5,'size':1.0,'density':0.0}     # V ~ (m/m0)^a
E={'Krakatoa 8.4e17 (200 Mt, reported)':8.4e17,'Krakatoa 100-150 Mt low':100*4.184e15,'Krakatoa 150 Mt':150*4.184e15,
   'Chicxulub 1e23':1e23,'Chicxulub 4.2e23 (brief)':4.2e23,'Chicxulub 5e23':5e23,'Sun 1 s 3.828e26':3.828e26}
def planar_dp(u):
    x=u/a0; M=(gam+1)/4*x+math.sqrt(((gam+1)/4*x)**2+1); return p0*2*gam/(gam+1)*(M*M-1)
def sphere_dp(u):
    # Taylor similarity solution fit: dp_surface/(rho u^2) from our integration (checked by hydro)
    x=u/a0
    tab=[(0.30,1.159),(0.45,1.083),(0.598,1.043),(0.8,1.020),(0.98,1.011),(1.222,1.005),(1.449,1.003),(1.95,1.001),(2.729,1.000),(9.4,1.000)]
    if x<=tab[0][0]: k=tab[0][1]
    elif x>=tab[-1][0]: k=1.0
    else:
        for (x1,k1),(x2,k2) in zip(tab,tab[1:]):
            if x1<=x<=x2: k=k1+(k2-k1)*(x-x1)/(x2-x1); break
    return k*rho_air*u*u
print(f"V0={V0:.4f} m3  R0_eq={R0:.4f} m  R0/H0={R0/H0:.4f}")
# --- worked examples
for name,En in E.items():
    dm=En/c**2; r=1+dm/M0
    print(f"\n== {name}: E={En:.3g} J  dm={dm:.3g} kg ({dm/1e3:.3g} t)  ratio={r:.4g}")
    for f,a in forms.items():
        V=V0*r**a; rho=M0*r/V; H=H0*(V/V0)**(1/3); R=R0*(V/V0)**(1/3); dV=V-V0; dH=H-H0; dR=R-R0
        line=f"  {f:8s} H={H:.3g} m rho={rho:.3g} kg/m3 dV={dV:.3g} m3 dH={dH:.3g} m Req={R:.3g} m"
        # slow growth: raised-cosine in mass fraction s(t)=t/T - sin(2 pi t/T)/(2 pi)
        if dV>0:
            n=20001; tt=np.linspace(0,1,n); s=tt-np.sin(2*np.pi*tt)/(2*np.pi)
            Vt=V0*(1+(r-1)*s)**a; Ht=H0*(Vt/V0)**(1/3); Rt=R0*(Vt/V0)**(1/3)
            dt=tt[1]-tt[0]; Vdd=np.gradient(np.gradient(Vt,dt),dt); Hd=np.gradient(Ht,dt); Rd=np.gradient(Rt,dt)
            Vdd_max=np.max(np.abs(Vdd)); Hd_max=Hd.max(); Rd_max=Rd.max()     # per unit T: Vdd/T^2, Hd/T
            for d in (5.0,):
                rr=R+d
                for ps,lab in ((100,'134dB'),(20,'120dB')):
                    Tp=math.sqrt(rho_air*Vdd_max/(2*math.pi*rr*ps))
                    line+=f"\n      T_min pressure ({lab}, {ps} Pa at {d} m from surface, r={rr:.3g} m, half-space): {Tp:.3g} s  [Vdd_max*T^2/dV={Vdd_max/dV:.3f}]"
            for us,lab in ((0.25,'OSHA 250 mm/s'),(1.4,'walking 1.4 m/s')):
                line+=f"\n      T_min shove ({lab}): head {Hd_max/us:.3g} s ; side(Req) {Rd_max/us:.3g} s   [Hd_max*T/dH={Hd_max/dH:.3f}]"
            # instant: crossing time of final height at c_t, constant speed
            tx=H/c_t; uH=dH/tx; uR=dR/tx
            dps=sphere_dp(uR); dpp=planar_dp(uR)
            Ex=dps*dV; Epl=dpp*dV; W0=p0*dV
            line+=(f"\n      INSTANT tx=H1/c_t={tx*1e3:.3g} ms  head {uH:.4g} m/s (M{uH/a0:.2f})  side(Req) {uR:.4g} m/s (M{uR/a0:.2f})"
                   f"\n        surface dp: sphere(Taylor) {dps/1e3:.3g} kPa, planar upper {dpp/1e3:.3g} kPa; p0*dV={W0:.3g} J"
                   f"\n        excess work into air {Ex:.3g} J ({Ex/TNT:.3g} kg TNT) [planar {Epl:.3g} J]; free-air equiv x2 = {2*Ex/TNT:.3g} kg TNT"
                   f"\n        loop ratio slow (p0 dV)/E = {W0/En:.3g}; instant ((dp+p0) dV)/E = {(Ex+W0)/En:.3g} [planar {(Epl+W0)/En:.3g}]")
        print(line)
# self-gravity
print("\n== self-gravity at canon:")
beta=G*M0/(R0*c*c); print(f" beta=GM/Rc^2={beta:.3g}; rs={2*G*M0/c**2:.3g} m; BE=3GM^2/5R={0.6*G*M0**2/R0:.3g} J")
for f,a in forms.items():
    alpha=a/3      # R ~ M^alpha
    print(f"  {f}: R~M^{alpha:.3f}; Newtonian f=(2-alpha)(3/5)beta={(2-alpha)*0.6*beta:.3g}; f=1 at R={(2-alpha)*0.3:.3f} r_s")
# GR uniform density (Lattimer & Prakash 2001 eq 34)
def gBE(b):
    x=math.sqrt(2*b); return 3/(4*b)*(math.asin(x)/x-math.sqrt(1-2*b))-1
def fGR(b,alpha,h=1e-7):
    # M_p = M(1+g(beta)), beta ~ M^(1-alpha); dMp/dM = 1+g+(1-alpha) b g'(b)
    gp=(gBE(b+h)-gBE(b-h))/(2*h); d=1+gBE(b)+(1-alpha)*b*gp; return 1-1/d
print("  GR uniform-density loop ratio f=1-dM/dMp (LP2001 eq 34):")
for b in (1e-6,0.01,0.1,0.2,0.3,0.4,4/9,0.49,0.499,0.4999):
    print(f"   beta={b:.4g} R/rs={1/(2*b):.4g}  BE/M={gBE(b):.4g}  f_density={fGR(b,0):.4f} f_mix={fGR(b,1/6):.4f} f_size={fGR(b,1/3):.4f}  Newtonian dens {1.2*b:.4f}")
# where black hole reached
Mbh_dens=R0*c*c/(2*G); print(f"\n pure density: BH at M={Mbh_dens:.3g} kg rho={Mbh_dens/V0:.3g} kg/m3; energy={(Mbh_dens-M0)*c*c:.3g} J = {(Mbh_dens-M0)*c*c/3.828e26/3.156e7:.3g} years of solar output")
# mix: R=R0 (M/M0)^(1/6), rs=2GM/c^2 -> M^(5/6)=R0 c^2/(2G) M0^(-1/6)
Mbh_mix=(R0*c*c/(2*G)*M0**(-1/6))**(6/5); print(f" mix: BH at M={Mbh_mix:.3g} kg, R={R0*(Mbh_mix/M0)**(1/6):.3g} m, H={H0*(Mbh_mix/M0)**(1/6):.3g} m, rho={rhoB*(Mbh_mix/M0)**0.5:.3g}; E={(Mbh_mix-M0)*c*c:.3g} J = {(Mbh_mix-M0)*c*c/3.828e26/3.156e7:.3g} yr of Sun")
Mbh_size=math.sqrt(3*c**6/(32*math.pi*G**3*rhoB)); Rs=(3*Mbh_size/(4*math.pi*rhoB))**(1/3); print(f" size: BH at M={Mbh_size:.3g} kg ({Mbh_size/1.989e30:.3g} Msun) R={Rs:.3g} m ({Rs/1.496e11:.3g} au), H={H0*Rs/R0:.3g} m")
# Bondi onset and infall
cs=a0; lam=0.625
Mon=R0*cs*cs/G; Md=4*math.pi*lam*G*G*Mon**2*rho_air/cs**3; b_on=G*Mon/(R0*c*c)
print(f"\n Bondi onset (r_B=R0) at M={Mon:.3g} kg (rho={Mon/V0:.3g}); Mdot={Md:.3g} kg/s; infall power={Md*G*Mon/R0:.3g} W; beta={b_on:.3g}; mass-growth rate from infall energy {Md*b_on:.3g} kg/s; e-fold time M/(Mdot beta) = {Mon/(Md*b_on):.3g} s")
Mb=Mbh_dens*0.5; Md2=4*math.pi*lam*G*G*Mb**2*rho_air/cs**3; print(f" at half BH mass, pure density: Mdot={Md2:.3g} kg/s, atmosphere (5.1e18 kg) gone in {5.1e18/Md2:.3g} s; infall energy per kg = beta c^2 with beta={G*Mb/(R0*c*c):.3g}")
# bound for ordinary matter
print(f"\n ordinary-matter bound: (36.1 km/s / c)^2 = {(36100/c)**2:.3g}")
print(f" p/(rho_B c^2): p0 -> {p0/(rhoB*c*c):.3g}; 4.1 GPa rock -> {4.1e9/(rhoB*c*c):.3g}; rho_rock u^2 (2700*1540^2) -> {2700*1540**2/(rhoB*c*c):.3g}")
