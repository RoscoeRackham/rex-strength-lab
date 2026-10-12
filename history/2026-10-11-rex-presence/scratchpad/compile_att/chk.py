import math,sys
sys.path.insert(0,'/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/attenuation/scripts')
from engine_formula import ppv
p=997.4
for T in [0.03,0.04]:
  Fp=2*p/T
  print(T,[round(1000*ppv(Fp,T,r,1850,150,'hann',0.03),3) for r in [2.5,5,10,15,20,30,35,60]])
meas=[8.7,4.7,1.8,1.1,0.77,0.45,0.4,0.19]
Fp=2*p/0.03
mod=[1000*ppv(Fp,0.03,r,1850,150,'hann',0.03) for r in [2.5,5,10,15,20,30,35,60]]
print([round(a/b,2) for a,b in zip(mod,meas)])
Fp=2*p/0.04
mod=[1000*ppv(Fp,0.04,r,1850,150,'hann',0.03) for r in [2.5,5,10,15,20,30,35,60]]
print('T.04',[round(a/b,2) for a,b in zip(mod,meas)])
g=9.80665;m=3007;F=1.2*m*g
print('F',F)
for r in [1,1.4,2]:
  print(r,'qs strain',0.75*F/(2*math.pi*1600*120**2*r**2), 'ppv/cs', ppv(F,0.1,r,1600,120,'ramp',0.04)/120)
# Mayne
for x in [5,10,15,20,30,50,70,100]:
  print(x, round(92*(math.sqrt(7*1.2)/x)**1.7,3))
# stamp T dependence at 200 m sand
F=10*m*g
print([ (T,round(1000*ppv(F,T,200,1600,120,'hann',0.04),4)) for T in [0.02,0.05,0.1,0.2]])
