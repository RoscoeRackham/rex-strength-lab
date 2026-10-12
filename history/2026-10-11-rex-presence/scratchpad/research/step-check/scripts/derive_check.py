import math
g=9.81
M=3007; W=M*g; H=3.048; h=0.45*H
print('h',h,'W',W)
# cadence fit
mph=[2.0,2.5,3.0,3.5,4.0]; cad=[96.1,105.8,113.6,121.5,129.0]
Hc=1.707; hc=0.5128*Hc
xs=[];ys=[]
for s,c in zip(mph,cad):
    v=s*0.44704; f=c/60
    Fr=v*v/(g*hc); fh=f*math.sqrt(hc/g)
    xs.append(math.log(Fr)); ys.append(math.log(fh))
    print('mph %.1f v %.3f Fr %.3f fhat %.3f'%(s,v,Fr,fh))
n=len(xs); mx=sum(xs)/n; my=sum(ys)/n
b=sum((x-mx)*(y-my) for x,y in zip(xs,ys))/sum((x-mx)**2 for x in xs); a=math.exp(my-b*mx)
print('fit fhat = %.3f Fr^%.3f'%(a,b))
# also full fit 0.5-4.5
for Fr in [0.05,0.1,0.18,0.209,0.25,0.3,0.5]:
    v=math.sqrt(Fr*g*h); f=a*Fr**b*math.sqrt(g/h)
    duty=0.7+(0.55-0.7)*min(1,max(0,(Fr-0.05)/(0.35)))
    print('Fr %.3f v %.2f f %.3f (%.0f/min) step %.2f stance@0.6 %.2f stance@duty(%.2f) %.2f'%(Fr,v,f,f*60,v/f,0.6*2/f,duty,duty*2/f))
# validity range of fit in Fr
print('fit Fr range', math.exp(min(xs)), math.exp(max(xs)))
# speeds
for hh in [1.28,1.37,1.46]:
    print('h',hh,'v(0.18)',math.sqrt(0.18*g*hh),'v(0.5)',math.sqrt(0.5*g*hh),'v(0.1)',math.sqrt(0.1*g*hh),'v(.29)',math.sqrt(.29*g*hh))
# human stance
f=113.6/60; print('human stride',2/f,'stance',0.55*2/f,0.6*2/f,0.7*2/f)
print('time scale', math.sqrt(h/hc), math.sqrt(1.37/0.875))
# loads
for k in [1.0,1.2,1.5]:
    F=k*W; print('k',k,'F',F,'Rex kPa',F/0.31/1e3,'Ollie kPa',F/0.15/1e3)
# floor 1/(2 duty)
for d in [0.55,0.6,0.7]: print('duty',d,'mean stance load BW',1/(2*d))
# heel strike
E_h=3.8; Ez=2.7; m=76.7; hh=0.90
for e in [3.8,2.7,1.4,6.9]:
    print('E',e,'ratio',e/(m*g*hh),'Rex',e/(m*g*hh)*M*g*h)
vh=0.57*math.sqrt(h/0.9); print('vh',vh, 0.39*math.sqrt(h/.9), 0.78*math.sqrt(h/.9))
for s in [0.041,0.11,0.176]:
    print('share',s,'me',s*M,'E',0.5*s*M*vh**2)
# human check of half m v^2
print('human 0.5 Me v^2', 0.5*0.111*76.7*0.57**2)
# stamp
for HH,lab in [(1.80,'man'),(H,'rex')]:
    d=0.233*HH; print(lab,'raise',d,'v',math.sqrt(2*g*d))
vs=math.sqrt(2*g*0.233*H)
for me,lab in [(0.061*M,'legEff'),(0.16*M,'leg'),(0.5*M,'half')]:
    print(lab,me,0.5*me*vs**2, 0.5*me*6.5**2)
print('driven scale', math.sqrt(H/1.80), 3*math.sqrt(H/1.80), 5*math.sqrt(H/1.80))
# impulse check: half-sine peak 6.5 BW over T=2*tp
for tp in [0.016,0.036]:
    T=2*tp; J=6.5*2*T/math.pi  # BW*s
    print('tp',tp,'impulse BW.s',J,'minus BW*T',J-T,'dv m/s', (J-T)*g)
# stamp loads
for k in [3.4,4.4,6.5]:
    F=k*W; print('stamp',k,F/1e3,'kN Rex',F/0.31/1e3,'Ollie',F/0.15/1e3)
print('loading rate MN/s', 300*W/1e6, 1000*W/1e6)
# elephant
print('eleph forefoot', 0.55*3000*g, 'ratio', 1.2/0.55)
for C in [1.06,1.21,1.27]: print('C',C,'A',C*C/(4*math.pi))
print('ellipse',math.pi*0.16*0.15)
print('eleph pressure', 0.55*3000*g/0.128/1e3, 0.55*3000*g/0.075/1e3)
# Schanz back calc
A=math.pi*0.16**2; m=0.32*2530; sd=2.5*0.32*2530*g/A
v1=math.sqrt(2*0.022*A*sd/m); print('Schanz A',A,'sig2',0.32*2530*g/A,'sdyn',sd,'v1',v1)
for f,lab in [(0.3,1),(0.32,2),(0.54,3),(0.6,4)]: print('step',lab, f*2530*g/A/1e3)
# engine sinking rule elephant
def Nq(phi): t=math.tan(math.radians(phi)); return math.exp(math.pi*t)*math.tan(math.radians(45+phi/2))**2
def Ng(phi): return 2*(Nq(phi)+1)*math.tan(math.radians(phi))
gam=1600*g; B=math.sqrt(0.075); p=0.55*2530*g/0.075
for phi in [30,35,40,42]:
    q0=0.5*gam*B*Ng(phi)*0.6; D=(p-q0)/(gam*Nq(phi)); print('phi',phi,'Nq',Nq(phi),'Ng',Ng(phi),'q0',q0/1e3,'p',p/1e3,'D',D)
p2=1.12*2530*g/0.075; q0=0.5*gam*B*Ng(35)*0.6; print('Schanz load D35',(p2-q0)/(gam*Nq(35)))
# engine loose sand person / Rex / Ollie
def sink(p,B): q0=37e3*B/0.316; return (p-q0)/(1600*g*18.40)
print('person',sink(1.2*80*g/0.0126,math.sqrt(0.0126)),'Rex',sink(1.2*W/0.31,math.sqrt(0.31)),'Ollie',sink(1.2*W/0.15,math.sqrt(0.15)))
# footprint scaling
for pe in [181e3,265e3,350e3]:
    for lab,p,Af in [('Rex',1.2*W/0.31,0.31),('Ollie',1.2*W/0.15,0.15)]:
        print('pe',pe/1e3,lab,0.022*(p/pe)*(math.sqrt(Af)/0.274))
# Schanz FEA nonlinearity exponents
print('exp 99->185',math.log(8/4)/math.log(185/99),'185->350',math.log(18/8)/math.log(350/185))
