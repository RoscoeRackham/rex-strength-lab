import math
def ppv(Fp,T,r,rho,cs,kind='hann',xi=0.0):
    zeta=xi*r/(0.9194*cs*T)
    if kind=='hann':
        near=0.375*Fp/(rho*cs**2*T*r)
        far=0.620*Fp/(rho*cs**2.5*T**1.5*math.sqrt(r))
        D=(1+(zeta/0.224)**1.4)**(-2.5/1.4)
    else:
        near=0.1875*Fp/(rho*cs**2*T*r)
        far=0.181*Fp/(rho*cs**2.5*T**1.5*math.sqrt(r))
        D=(1+(zeta/0.195)**2.05)**(-1.5/2.05)
    return max(near,far)*D
if __name__=='__main__':
    p=997.4
    meas={2.5:9,5:5,35:0.5,60:0.2}
    print('Pisa drop (130 kg x 3 m), Hann pulse, impulse = Fp*T/2 = 997 N s')
    for cs in [150,170]:
        for T in [0.025,0.03,0.04]:
            for xi in [0.02,0.03,0.05]:
                Fp=2*p/T
                s='  '.join(f"{r}m {1000*ppv(Fp,T,r,1850,cs,'hann',xi):.3g}" for r in meas)
                print(f"  cs={cs} T={T} xi={xi}: {s}")
    print('  measured:',meas)
    g=9.80665; m=3007
    grounds={'loose sand':(1600,120,0.04),'dense sand/gravel':(2000,300,0.03),'soft clay':(1700,110,0.05),'stiff clay':(1900,250,0.03),'road/slab subgrade':(1950,250,0.03),'granite':(2700,3000,0.01)}
    cases={'walk 1.2 BW ramp 0.1 s':('ramp',1.2*m*g,0.1),'walk 1.2 BW ramp 0.2 s':('ramp',1.2*m*g,0.2),'heavy step 3 BW Hann 0.05 s':('hann',3*m*g,0.05),'stamp 10 BW Hann 0.03 s':('hann',10*m*g,0.03)}
    rs=[1,3,10,30,100,200]
    for cname,(kind,F,T) in cases.items():
        print('==',cname)
        for gname,(rho,cs,xi) in grounds.items():
            print(f"   {gname:20s} "+'  '.join(f"{r}m:{1000*ppv(F,T,r,rho,cs,kind,xi):.3g}" for r in rs))
