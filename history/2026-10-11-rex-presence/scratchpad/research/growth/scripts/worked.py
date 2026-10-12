import math
c=299792458.0; G=6.6743e-11
M0=3007.0; H0=3.048; rho0=1060.0; V0=M0/rho0
R0=(3*V0/(4*math.pi))**(1/3)
print("V0",V0,"R0",R0)
cases={'Krakatoa 8.4e17':8.4e17,'Krakatoa 8.368e17':8.368e17,'Chicxulub 4.2e23':4.2e23,'Chic 1e23':1e23,'Chic 1e24':1e24,'Sun 1 s 3.828e26':3.828e26}
for k,E in cases.items():
    dm=E/c**2; r=(M0+dm)/M0
    mix_H=H0*r**(1/6); mix_rho=rho0*r**0.5
    size_H=H0*r**(1/3)
    dens_rho=rho0*r
    print(f"{k}: dm={dm:.4g} kg ({dm/1000:.3g} t) ratio={r:.4g}  mix H={mix_H:.3g} m rho={mix_rho:.3g}; size H={size_H:.3g} m; dens rho={dens_rho:.3g}")
    # schwarzschild check
    M=M0+dm
    rs=2*G*M/c**2
    print("   rs",rs, "R mix", R0*r**(1/6), "R size",R0*r**(1/3))
