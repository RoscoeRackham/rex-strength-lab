import math
G=6.67430e-11
def U2(R,a,rc,rm,n=20000):
    U=0; 
    for i in range(n):
        r=(i+0.5)/n*R; dr=R/n
        rho = rc if r<a else rm
        M = 4/3*math.pi*(rc*min(r,a)**3 + (rm*(r**3-a**3) if r>a else 0))
        U += G*M*4*math.pi*r*r*rho*dr/r
    return U
def I2(R,a,rc,rm):
    return 8/15*math.pi*(rc*a**5 + rm*(R**5-a**5))
# Pluto
M=1.303e22; R=1188.3e3
print('Pluto mean density', M/(4/3*math.pi*R**3))
for a_km in (820,850,888,900):
  for rm in (950,1000,1100):
    a=a_km*1e3
    Mm=4/3*math.pi*(R**3-a**3)*rm; rc=(M-Mm)/(4/3*math.pi*a**3)
    rockfrac=(M-Mm)/M
    print(f'  core {a_km} km mantle {rm}: core rho {rc:.0f}, core mass frac {rockfrac:.3f}, U {U2(R,a,rc,rm):.4e}')
# Mars fit to M and I/MR2=0.366
M=6.4169e23; R=3389.5e3
for a_km in (1500,1700,1830,2000):
    a=a_km*1e3
    # solve: rc*a^3 + rm*(R^3-a^3) = 3M/(4pi);  rc a^5 + rm (R^5-a^5) = 0.366 M R^2 *15/(8pi)
    A=[[a**3,R**3-a**3],[a**5,R**5-a**5]]; b=[3*M/(4*math.pi), 0.366*M*R*R*15/(8*math.pi)]
    det=A[0][0]*A[1][1]-A[0][1]*A[1][0]
    rc=(b[0]*A[1][1]-A[0][1]*b[1])/det; rm=(A[0][0]*b[1]-A[1][0]*b[0])/det
    print(f'Mars core {a_km}: rc {rc:.0f} rm {rm:.0f} U {U2(R,a,rc,rm):.4e}')
print('Mars uniform', 3*G*M*M/(5*R))
