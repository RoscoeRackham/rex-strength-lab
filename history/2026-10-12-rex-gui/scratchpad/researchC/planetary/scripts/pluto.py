import math
G=6.67430e-11
M=1.303e22; R=1188.3e3
V=4/3*math.pi*R**3
for f_rock, rho_ice in [(0.655,950),(0.655,1000),(0.65,950),(0.66,950)]:
    Mm=(1-f_rock)*M; Vm=Mm/rho_ice; Vc=V-Vm; rc=(3*Vc/(4*math.pi))**(1/3); rhoc=f_rock*M/Vc
    # analytic two-layer U
    N=20000; dr=R/N; Mi=0; U=0
    for i in range(N):
        r=(i+.5)*dr; rho=rhoc if r<rc else rho_ice; dm=4*math.pi*r*r*rho*dr; U+=G*(Mi+dm/2)*dm/r; Mi+=dm
    print(f'rock {f_rock} ice {rho_ice}: rc={rc/1e3:.0f} km rho_c={rhoc:.0f} U={U:.4e} ratio_to_uniform={U/(3*G*M*M/(5*R)):.3f}')
print('uniform R=1188.3 km', 3*G*M*M/(5*R))
