import math
c=299792458.0; c2=c*c; G=6.67430e-11
m0=3007.0; V0=m0/1060; R0=(3*V0/(4*math.pi))**(1/3)
def g(b):
    x=math.sqrt(2*b); return 3/(4*b)*(math.asin(x)/x-math.sqrt(1-2*b))-1
def gp(b,h=1e-9):
    h=min(h,(0.5-b)/10)
    return (g(b+h)-g(b-h))/(2*h)
print("series check b=0.01:", g(0.01), 3*0.01/5+9*1e-4/14+5*1e-6/6)
print(" beta  R/rs  f_dens f_mix f_size BE/M")
for b in [0.01,0.1,0.2,0.3,4/9,0.49,0.499,0.4999]:
    out=[]
    for al in [0,1/6,1/3]:
        dMp=1+g(b)+(1-al)*b*gp(b)
        out.append(1-1/dMp)
    print(f"{b:.4f} {1/(2*b):7.4f} {out[0]:.3f} {out[1]:.3f} {out[2]:.3f} {g(b):.4f}")
# Newtonian check small beta: f ~ (3/5)(2-al) beta ... 1.2b,1.1b,1.0b
b=1e-4
for al in [0,1/6,1/3]:
    print('newt',al,(1-1/(1+g(b)+(1-al)*b*gp(b)))/b)
# black hole thresholds
Mbh_d=R0*c2/(2*G); print("pure density M=%.4g rho=%.4g E=%.4g J years of sun=%.3g"%(Mbh_d,Mbh_d/V0,(Mbh_d-m0)*c2,(Mbh_d-m0)*c2/3.828e26/3.15576e7))
# mix: R=R0*(M/m0)^(1/6) = 2GM/c^2
M=(R0*c2/(2*G)/m0**(1/6))**(6/5); R=2*G*M/c2; H=3.048*R/R0
print("mix M=%.4g (%.3g Msun) R=%.4g H=%.4g rho=%.4g E=%.4g yrs=%.3g"%(M,M/1.98841e30,R,H,M/(4/3*math.pi*R**3),M*c2,M*c2/3.828e26/3.15576e7))
rho=1060; M=math.sqrt(3*c**6/(32*math.pi*G**3*rho)); R=2*G*M/c2
print("size M=%.4g (%.3g Msun) R=%.4g m (%.3g au)"%(M,M/1.98841e30,R,R/1.495978707e11))
# old-volume check
for V in [2.54,2.547,V0]:
    R=(3*V/(4*math.pi))**(1/3); print("V=%.4f R=%.4f rhoBH=%.4g M=%.4g"%(V,R,3*c2/(8*math.pi*G*R*R),R*c2/(2*G)))
# hoop-conjecture alternative: horizon when 2GM/c^2 >= H/2 ?
print("hoop-ish M for r_s=H/2:", 1.524*c2/(2*G))
