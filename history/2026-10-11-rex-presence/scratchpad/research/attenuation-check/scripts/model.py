import numpy as np
def D(z,shape): 
    return (1+(z/0.224)**1.4)**(-2.5/1.4) if shape=='hann' else (1+(z/0.195)**2.05)**(-1.5/2.05)
def ppv(F,T,r,rho,cs,xi,shape):
    if shape=='hann': near=0.375*F/(rho*cs**2*T*r); far=0.620*F/(rho*cs**2.5*T**1.5*np.sqrt(r))
    else: near=0.1875*F/(rho*cs**2*T*r); far=0.181*F/(rho*cs**2.5*T**1.5*np.sqrt(r))
    z=xi*r/(0.919*cs*T)
    return max(near,far)*D(z,shape)
p=997.4
print("Pisa best guess cs150 rho1850 xi.03 T.03")
for r,m in [(2.5,8.7),(5,4.7),(35,0.4),(60,0.19)]:
    v=ppv(2*p/0.03,0.03,r,1850,150,0.03,'hann')*1000
    print(f" r={r} model {v:.2f} mm/s measured~{m} ratio {v/m:.2f}")
print("spread")
for r in [2.5,5,35,60]:
    vals=[ppv(2*p/T,T,r,rho,cs,0.03,'hann')*1000 for T in (0.025,0.03,0.04) for cs in (150,160,170) for rho in (1850,)]
    print(r, round(min(vals),2), round(max(vals),2))
# Rex examples
W=3007*9.80665
grounds={'sand':(1600,120,0.04),'gravel':(2000,300,0.03),'softclay':(1700,120,0.05),'stiffclay':(1900,250,0.03),'asphalt':(2000,250,0.03),'granite':(2700,3000,0.01)}
cases={'walk_1.2BW_ramp_0.1s':(1.2*W,0.1,'ramp'),'walk_1.2BW_ramp_0.2s':(1.2*W,0.2,'ramp'),'heavy_3BW_hann_0.05s':(3*W,0.05,'hann'),'stamp_10BW_hann_0.03s':(10*W,0.03,'hann')}
for cn,(F,T,sh) in cases.items():
    print(cn)
    for g,(rho,cs,xi) in grounds.items():
        print('  ',g,[float('%.2g'%(ppv(F,T,r,rho,cs,xi,sh)*1000)) for r in (1,3,10,30,100,200)])
print("elephant ramp 10kN, cs 280, rho 1800, xi .03")
for tau in (0.05,0.1):
    print(tau,[round(ppv(1e4,tau,r,1800,280,0.03,'ramp')*1e6,1) for r in (3,7.5,12,40)])
print("elephant hann 10-20 kN T .05")
for F in (1e4,2e4):
    print(F,[round(ppv(F,0.05,r,1800,280,0.03,'hann')*1e6,1) for r in (3,7.5,12,40)])
# seismic energy
W=3007*9.80665; F=1.2*W
for g,(rho,cs) in {'sand':(1600,120),'stiffclay':(1900,250),'granite':(2700,3000)}.items():
    I=np.pi**2*F**2/(4*0.1)
    print('E step',g, 0.148*I/(rho*cs**3))
# static strain at 1 m walking loose sand vs PPV/cs
mu=1600*120**2
print('static strain 1m', 0.75*F/(2*np.pi*mu*1**2), 'PPV/cs', ppv(F,0.1,1,1600,120,0.04,'ramp')/120)
for r in (1,2,3,5):
    print(r,'static strain',0.75*F/(2*np.pi*mu*r**2))
