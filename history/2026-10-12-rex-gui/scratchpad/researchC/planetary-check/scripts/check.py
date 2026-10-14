import math
G=6.6743e-11
L=3.828e26
print("Sun outputs")
for name,t in [("min",60),("hour",3600),("day",86400),("year",365.256*86400)]:
    print(name, t, "%.6e"%(L*t))
print("NIST sidereal year", 3.155815e7, "ratio", 365.256*86400/3.155815e7)

def two_layer(M,R,a,rho_m=None,rho_c=None):
    # given M, R, core radius a, and either rho_m or rho_c -> fill other by mass
    V=4/3*math.pi
    if rho_m is not None:
        rho_c=(M - V*rho_m*(R**3-a**3))/(V*a**3)
    else:
        rho_m=(M - V*rho_c*a**3)/(V*(R**3-a**3))
    U1=G*(16*math.pi**2/15)*rho_c**2*a**5
    D=rho_c-rho_m
    U2=G*(16*math.pi**2/3)*rho_m*(rho_m*(R**5-a**5)/5 + D*a**3*(R**2-a**2)/2)
    I=(8*math.pi/15)*(rho_m*(R**5-a**5)+rho_c*a**5)
    return U1+U2, rho_c, rho_m, I/(M*R**2)

def fit_moi(M,R,a,target):
    # solve rho_m s.t. I/MR2=target
    lo,hi=1.0, 3*M/(4*math.pi*R**3)*1.0  # rho_m less than mean
    lo=1.0
    for _ in range(200):
        mid=(lo+hi)/2
        U,rc,rm,k=two_layer(M,R,a,rho_m=mid)
        # higher rho_m -> less concentrated -> k larger
        if k>target: hi=mid
        else: lo=mid
    return two_layer(M,R,a,rho_m=(lo+hi)/2)

def uniform(M,R): return 0.6*G*M*M/R

print("\nMoon")
M=7.346e22; R=1737.4e3
print("uniform %.4e"%uniform(M,R), "with GM sheet %.4e"%(0.6*(0.00490e6*1e9)*M/R))
for a in [200e3,300e3,350e3,400e3,500e3]:
    U,rc,rm,k=fit_moi(M,R,a,0.394)
    print(a/1e3,"U=%.4e rc=%.0f rm=%.0f k=%.4f"%(U,rc,rm,k))

print("\nMars")
M=6.4169e23; R=3389.5e3
print("uniform %.4e"%uniform(M,R))
for a in [1500e3,1650e3,1675e3,1830e3,2000e3]:
    U,rc,rm,k=fit_moi(M,R,a,0.366)
    print(a/1e3,"U=%.4e rc=%.0f rm=%.0f k=%.4f"%(U,rc,rm,k))
# NASA normalisation radius
a_e=3396.2; c=3376.2; RI=math.sqrt((2*a_e**2+c**2)/3); print("Mars R_I",RI)

print("\nPluto")
M=1.303e22; R=1188.3e3
print("uniform %.4e"%uniform(M,R), "mean dens", M/(4/3*math.pi*R**3))
for rho_m in [920,950,1000,1100,1150]:
    # rock fraction 0.655 by mass in core: core mass
    Mc=0.655*M
    Mm=M-Mc
    a=(R**3 - Mm/(4/3*math.pi*rho_m))**(1/3)
    rc=Mc/(4/3*math.pi*a**3)
    U,rc2,rm,k=two_layer(M,R,a,rho_m=rho_m)
    print("rho_ice",rho_m,"core r %.0f km rho_c %.0f U=%.4e k=%.4f"%(a/1e3,rc,U,k))
# Stern: ice mantle ~300 km thick -> core radius ~888 km
for a in [850e3,888e3,900e3,950e3]:
    for rho_m in [950,1000,1050]:
        U,rc,rm,k=two_layer(M,R,a,rho_m=rho_m)
        Mc=4/3*math.pi*rc*a**3
        print("core r",a/1e3,"rho_m",rho_m,"rho_c %.0f core mass frac %.3f U=%.4e k=%.4f"%(rc,Mc/M,U,k))

print("\nOrbital KE")
for name,m,v in [("Moon",7.346e22,1022),("Moon apo",7.346e22,970),("Moon peri",7.346e22,1082),("Moon 0.966",7.346e22,966),("Moon 1.100",7.346e22,1100),
                 ("Earth",5.9722e24,29780),("Earth aph",5.9722e24,29290),("Earth per",5.9722e24,30290),("Earth+Moon",5.9722e24+7.346e22,29780),
                 ("Jup",1.89813e27,13060),("Jup min",1.89813e27,12440),("Jup max",1.89813e27,13720)]:
    print(name,"%.4e"%(0.5*m*v*v))
mu=7.346e22*5.9722e24/(7.346e22+5.9722e24); print("Moon reduced %.4e"%(0.5*mu*1022**2))

print("\nEarth spin")
Om=2*math.pi/(23.9345*3600); print("Omega %.5e"%Om)
for C in [8.0373e37,8.037308375e37]:
    print("C %.5e KE %.4e"%(C,0.5*C*Om**2))
a=6378.137e3; c=6356.752e3; R2=(2*a*a+c*c)/3
Cn=0.3308*5.9722e24*R2; print("NASA C %.4e KE %.4e"%(Cn,0.5*Cn*Om**2))
Cm=0.3308*5.9722e24*(6371e3)**2; print("NASA C with R=6371 %.4e"%Cm)
# Vilcu used G=6.672e-11: implied M
print("Vilcu implied M", 3.986004415e14/6.672e-11, "ratio to NASA", 3.986004415e14/6.672e-11/5.9722e24)
print("C rescaled to CODATA G %.5e"%(8.037308375e37*6.672e-11/6.6743e-11))
# Yoder-like C/Ma^2=0.3307 equatorial
print("C 0.3307 Ma^2 %.4e"%(0.3307*5.9722e24*a*a))

print("\nMoon-forming impact")
ME=5.9722e24
for name,Mt,m,v,QS in [("canon",0.90,0.13,9.2e3,4.61e5),("similar",0.57,0.47,9.7e3,5.66e6),("spin",1.05,0.05,20e3,6.42e6),("partial",0.75,0.30,11.3e3,1.20e7)]:
    Mk=Mt*ME; mk=m*ME; Mtot=Mk+mk; mu=Mk*mk/Mtot
    E=0.5*mu*v*v; QR=E/Mtot
    print(name,"E=%.3e QR=%.3e QS(table)=%.3e"%(E,QR,QS))
