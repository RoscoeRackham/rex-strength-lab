import math
G=6.6743e-11
def two_layer_U(M,R,rc,rho_m):
    # mantle density given; core density fills the mass
    Vc=4/3*math.pi*rc**3; Vt=4/3*math.pi*R**3
    Mm=rho_m*(Vt-Vc); Mc=M-Mm; rho_c=Mc/Vc
    # U = integral G m(r) dm / r
    N=20000; U=0; m=0
    for i in range(N):
        r0=R*i/N; r1=R*(i+1)/N; r=(r0+r1)/2
        rho=rho_c if r<rc else rho_m
        dm=rho*4*math.pi*r*r*(r1-r0)
        U+=G*(m+dm/2)*dm/r; m+=dm
    return U, rho_c, m
# Pluto
M=1.303e22; R=1188.3e3
print('pluto uniform', 3*G*M*M/(5*R))
for rc in (850e3,870e3,888e3,900e3):
    for rm in (950,1000,1100):
        U,rc_d,m=two_layer_U(M,R,rc,rm)
        print('pluto rc %.0f km rho_m %d -> rho_c %.0f U %.4e'%(rc/1e3,rm,rc_d,U))
# Jupiter Ritter
Mj=1.89813e27; Rj=69911e3
GM2R=G*Mj*Mj/Rj
print('GM2/R',GM2R,'uniform',0.6*GM2R)
for n in (0.95,0.98,1.0,1.06):
    print('n',n,3/(5-n)*GM2R)
# Earth C rescale
C=8.037308375e37
print('C rescaled',C*6.672e-11/G)
for f in (0.3307,0.3308):
    print('f a^2',f*5.9722e24*6378137**2)
Om=2*math.pi/86164.2
print('Om',Om,'KE rot', 0.5*C*6.672e-11/G*Om**2, 0.5*C*Om**2)
# Moon orbital
mm=7.346e22
for v in (966,970,1022,1082,1100): print('moon v',v,0.5*mm*v*v)
print('moon GMm/2a', 3.986004e14*mm/(2*3.844e8), (3.986004e14+4.9028e12)*mm/(2*3.844e8))
me=5.9722e24
print('earth GMm/2a',1.3271244e20*me/(2*149.598e9), 'KE',0.5*me*29780**2)
print('jup GMm/2a',1.3271244e20*Mj/(2*778.479e9),'KE',0.5*Mj*13060**2)
L=3.828e26
print('sun year', L*365.256*86400, 'century', L*100*365.256*86400, 'julian century', L*3.15576e9)
