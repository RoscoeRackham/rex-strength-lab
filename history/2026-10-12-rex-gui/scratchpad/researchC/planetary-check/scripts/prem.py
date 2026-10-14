import numpy as np, math
G=6.6743e-11; RE=6371.0
def rho(rk):
    x=rk/RE
    if rk<=1221.5: return 13.0885-8.8381*x*x
    if rk<=3480: return 12.5815-1.2638*x-3.6426*x*x-5.5281*x**3
    if rk<=5701: return 7.9565-6.4761*x+5.5283*x*x-3.0807*x**3
    if rk<=5771: return 5.3197-1.4836*x
    if rk<=5971: return 11.2494-8.0298*x
    if rk<=6151: return 7.1089-3.8045*x
    if rk<=6346.6: return 2.691+0.6924*x
    if rk<=6356: return 2.90
    if rk<=6368: return 2.60
    return 1.02
r=np.linspace(0,RE,2_000_001)
d=np.array([rho(v) for v in r])*1000.0
rm=r*1000
dm=4*math.pi*d*rm**2
m=np.concatenate([[0],np.cumsum(0.5*(dm[1:]+dm[:-1])*np.diff(rm))])
M=m[-1]
I=(8*math.pi/3)*np.trapezoid(d*rm**4,rm)
U=np.trapezoid(np.where(rm>0,G*m*dm/np.where(rm>0,rm,1),0),rm)
print("M=%.5e I/MR2=%.4f U=%.4e uniform(M)=%.4e uniform(NASA M)=%.4e"%(M,I/(M*(RE*1e3)**2),U,0.6*G*M*M/(RE*1e3),0.6*G*5.9722e24**2/(RE*1e3)))
print("U scaled to NASA mass^2: %.4e"%(U*(5.9722e24/M)**2))
