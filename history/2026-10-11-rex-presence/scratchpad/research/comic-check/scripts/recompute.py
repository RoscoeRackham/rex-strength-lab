import math
g=9.80665; GM=3.986004e14; R=6.371e6; ME=5.9722e24
# tidal
k=2*GM/R**3; m=1340.4; L=4
print('grad 2GM/R^3',k, 'end-to-end dA',k*L, k*L/g,'g')
T=m*L*GM/(4*R**3); W=m*g; print('mid tension',T,'weight',W,'ratio',T/W, 1/(T/W))
# also Corolla 4.63 m
print('4.63 m tension', m*4.63*GM/(4*R**3))
print('10 g grip', m*10*g)
# felt g horizontal
for n in (2,4,6): print('n',n,'horiz a/g',math.sqrt(n*n-1))
# gentlest throw
H=3.048; d=1.6*H/2; print('throw stroke',d)
for n in (6,4,2):
    a=g*math.sqrt(n*n-1); v=math.sqrt(2*a*d); t=2*d/v; print('horiz n',n,'v',round(v,2),'t',round(t,3),'range',round(v*v/g,1))
    # consistent 45-deg push: |a(cos45,sin45)+(0,g)| = n g
    s=math.sin(math.pi/4); A=(-2*s+math.sqrt(4*s*s-4*(1-n*n)))/2*g
    v2=math.sqrt(2*A*d); print('   45deg push a/g',round(A/g,3),'v',round(v2,2),'t',round(2*d/v2,3),'range',round(v2*v2/g,1),'landing fall-equiv height',round(v2*v2/(2*g),1))
# drag
mm=90.26; rho=1.225; Cd=1.1
for A_ in (0.67,0.11,0.79):
    for n in (1,2,4,6):
        v=math.sqrt(2*n*g*mm/(rho*Cd*A_)); print('A',A_,'n',n,'v',round(v,1), 'q kPa',round(0.5*rho*v*v/1000,2))
# acoustic
p0=20e-6
for dB in (120,129,133,134,140,141,145,151,154,168): print(dB,'dB ->',round(p0*10**(dB/20),1),'Pa')
psi=6894.757; psf=47.880
for x in (0.03,0.05,0.10,0.75,0.88,1.10,0.62,0.72,0.032,0.0320): print(x,'psi',round(x*psi,1))
for x in (1,1.5,2,2.5,6,11,6.5,10,10.3,7.6,20,4.0): print(x,'psf',round(x*psf,1),'Pa', round(20*math.log10(x*psf/p0),1),'dB')
print('0.0625 psi in psf', 0.0625*144)
# landing
M=3007; W=M*g; dleg=0.5*H/2; print('W',W,'dleg',dleg)
for v in (5,20,100):
    J=M*v; print('v',v,'J',J,[round((J/T_+W)/1e3,1) for T_ in (0.1,0.5,2)],'travel2s',v,'Fleg kN',round((M*v*v/(2*dleg)+W)/1e3,1),
      'Pa paws',round((M*v*v/(2*dleg)+W)/0.62/1e6,2),'boots',round((M*v*v/(2*dleg)+W)/0.30/1e6,2),'T for 1.2W',round(v/(0.2*g),2),'E_earth',J*J/(2*ME))
print('F20/W',(M*400/(2*dleg)+W)/W)
# thresholds in g
for x in (81.4,62.8,39.2,186,157,73.5,19.62,49.05,68.67,88.29,52.96,40.21): print(x, round(x/g,2))
print(4.1*g,5.4*g,3.5*g,6*g,2*g, 45*g,40*g,10*g,83*g,25*g)
