import math
GC=6.6743e-11*7.416e16; D=10.0; x0=0.5; x1=10-0.980155
m=0.1453; A=0.00427; rho=1.225; a0=340.29
def cd(v):
    M=v/a0
    if M<=0.8: return 0.35
    if M>=1.2: return 0.92
    return 0.35+(0.92-0.35)*(M-0.8)/0.4
# RK4 in x for y=v^2 ; also time
def f(x,y):
    v=math.sqrt(max(y,0))
    dphidx = -GC/(D-x)**2   # phi=-GC/(D-x); dphi/dx = -GC/(D-x)^2
    return -2*dphidx - rho*cd(v)*A/m*y
n=200000; h=(x1-x0)/n; x=x0; y=0.0; t=0.0
for i in range(n):
    k1=f(x,y); k2=f(x+h/2,y+h/2*k1); k3=f(x+h/2,y+h/2*k2); k4=f(x+h,y+h*k3)
    yn=y+h/6*(k1+2*k2+2*k3+k4)
    vm=0.5*(math.sqrt(max(y,0))+math.sqrt(max(yn,0)))
    if vm>0: t+=h/vm
    y=yn; x+=h
print('arrive v',math.sqrt(y),'time',t)
gain=GC*(1/(D-x1)-1/(D-x0))
print('gain',gain,'Edrag',m*(gain-0.5*y))
