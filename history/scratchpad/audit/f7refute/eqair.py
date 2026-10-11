# Independent equilibrium-air solver (element-potential / Gibbs method), RRHO + truncated electronic sums.
# Species: N2 O2 NO N O N2+ O2+ NO+ N+ O+ N++ O++ ... up to He-like / bare ions, e-.
import math
import numpy as np
kB=1.380649e-23; h=6.62607015e-34; eV=1.602176634e-19; amu=1.66053906660e-27; me=9.1093837015e-31
cm=1.4387769  # K per cm^-1
mN=14.0067*amu; mO=15.9994*amu
# Each species: (name, nN, nO, z, mass, E0[eV], diatomic(thr,thv,sigma) or None, [(g, theta_el K), ...])
D0N2=9.7594; D0O2=5.1156
EN=D0N2/2; EO=D0O2/2; ENO=0.9305
IPN=[14.5341,29.6013,47.4492,77.4735,97.8902,552.0718,667.046]
IPO=[13.6181,35.1211,54.9355,77.4135,113.899,138.1189,739.3268,871.4098]
def lv(*pairs): return [(g, c*cm) for g,c in pairs]
S=[]
S.append(('N2',2,0,0,2*mN,0.0,(1.998*cm,2329.9*cm,2),lv((1,0),(3,50204),(6,59619))))
S.append(('O2',0,2,0,2*mO,0.0,(1.4456*cm,1556.2*cm,2),lv((3,0),(2,7918),(1,13195))))
S.append(('NO',1,1,0,mN+mO,ENO,(1.705*cm,1876.1*cm,1),lv((2,0),(2,121),(2,44200))))
S.append(('N2+',2,0,1,2*mN-me,15.581,(1.932*cm,2175*cm,2),lv((2,0),(4,9167))))
S.append(('O2+',0,2,1,2*mO-me,12.071,(1.69*cm,1876*cm,2),lv((4,0))))
S.append(('NO+',1,1,1,mN+mO-me,ENO+9.2642,(1.997*cm,2344*cm,1),lv((1,0))))
S.append(('N',1,0,0,mN,EN,None,lv((4,0),(10,19230),(6,28840),(12,83330))))
S.append(('O',0,1,0,mO,EO,None,lv((5,0),(3,158),(1,227),(5,15868),(1,33792),(5,73768),(3,76795))))
S.append(('N+',1,0,1,mN-me,EN+IPN[0],None,lv((1,0),(3,49),(5,131),(5,15316),(1,32689),(5,46785))))
S.append(('O+',0,1,1,mO-me,EO+IPO[0],None,lv((4,0),(10,26810),(6,40468))))
# higher ions: ground terms only (+ lowest excited where easy)
gN=[None,None,6,1,2,1,2,1]   # N2+ ... ground degeneracies for N^(z+): N++ 2P(6), N3+ 1S(1), N4+ 2S(2), N5+ 1S(1), N6+ 2S(2), N7+ (bare,1)
gO=[None,None,9,6,1,2,1,2,1] # O++ 3P(9), O3+ 2P(6), O4+ 1S(1), O5+ 2S(2), O6+ 1S(1), O7+ 2S(2), O8+ bare(1)
for z in range(2,8):
    S.append(('N%d+'%z,1,0,z,mN-z*me,EN+sum(IPN[:z]),None,[(gN[z],0.0)]))
for z in range(2,9):
    S.append(('O%d+'%z,0,1,z,mO-z*me,EO+sum(IPO[:z]),None,[(gO[z],0.0)]))
S.append(('e',0,0,-1,me,0.0,None,[(2,0.0)]))
names=[s[0] for s in S]
A=np.array([[s[1],s[2],-s[3]] for s in S],float)  # element matrix: N, O, electrons(e count = -charge... electron has +1)
# note: electron row: z=-1 -> a_e=+1; ion z=+1 -> a_e=-1
M=np.array([s[4] for s in S]); E0=np.array([s[5]*eV for s in S])
def lnq_e(s,T):
    # returns ln Q_int, e_int (J/particle, excluding E0, excluding translation)
    lvls=s[7]
    th=np.array([t for g,t in lvls]); g=np.array([g for g,t in lvls],float)
    w=g*np.exp(-th/T); Qe=w.sum(); ee=kB*(w*th).sum()/Qe
    lq=math.log(Qe); e=ee
    if s[6] is not None:
        thr,thv,sig=s[6]
        lq+=math.log(T/(sig*thr)) - math.log(1-math.exp(-thv/T))
        e+=kB*T + kB*thv/(math.exp(thv/T)-1)
    return lq,e
def species_T(T):
    L=np.zeros(len(S)); Ei=np.zeros(len(S))
    for i,s in enumerate(S):
        lq,e=lnq_e(s,T)
        L[i]=1.5*math.log(2*math.pi*s[4]*kB*T/h**2)+lq-s[5]*eV/(kB*T)
        Ei[i]=2.5*kB*T+s[5]*eV+e   # enthalpy per particle
    return L,Ei
RATIO=0.7905/0.2095   # N/O element ratio (Ar lumped out)
def lse(x):
    m=x.max(); return m+math.log(np.exp(x-m).sum())
def equil(T,p,lam=None):
    L,Ei=species_T(T)
    ntot=p/(kB*T)
    if lam is None:
        # start: molecular air
        nN2=0.7905*ntot; nO2=0.2095*ntot
        lN=(math.log(nN2)-L[0])/2; lO=(math.log(nO2)-L[1])/2
        le=(math.log(1e-30*ntot)-L[-1])
        lam=np.array([lN,lO,le])
    iN=A[:,0]>0; iO=A[:,1]>0; ipos=A[:,2]<0; iel=A[:,2]>0
    for it in range(400):
        ln=L+A@lam
        n=np.exp(ln - 0)  # may under/overflow handled via logs below
        def lsum(mask,c):
            x=ln[mask]+np.log(c[mask]); return lse(x)
        cN=A[:,0]; cO=A[:,1]; cz=-A[:,2]
        r1=lsum(iN,cN)-lsum(iO,cO)-math.log(RATIO)
        r2=ln[-1]-lsum(ipos,cz)
        r3=lse(ln)-math.log(ntot)
        R=np.array([r1,r2,r3])
        if np.abs(R).max()<1e-11: break
        def grad(mask,c):
            x=ln[mask]+np.log(c[mask]); w=np.exp(x-x.max()); w/=w.sum()
            return w@A[mask]
        J=np.array([grad(iN,cN)-grad(iO,cO), A[-1]-grad(ipos,cz), grad(np.ones(len(S),bool),np.ones(len(S)))])
        d=np.linalg.solve(J,-R)
        step=1.0
        mx=np.abs(d).max()
        if mx>5: step=5/mx
        lam=lam+step*d
    ln=L+A@lam; n=np.exp(ln)
    rho=(n*M).sum()
    hm=(n*Ei).sum()/rho
    return dict(n=n,rho=rho,h=hm,lam=lam,res=np.abs(R).max(),it=it)
def frac(eq,name): i=names.index(name); return eq['n'][i]/eq['n'].sum()
