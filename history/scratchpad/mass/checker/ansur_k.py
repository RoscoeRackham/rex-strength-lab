"""Checker: what cross-section area does ANSUR II imply, relative to (caliper breadth)^2?
k_eff = area / (pi/4 * breadth^2) is the ellipse depth ratio that reproduces the true area from breadth alone."""
import csv, math, numpy as np
from scipy.special import gamma
from scipy.optimize import brentq
rows=list(csv.DictReader(open('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/ansur_dl/male.csv',encoding='latin-1')))
def col(n): return np.array([float(r[n]) for r in rows])
def se_perim(a,b,n,N=2000):
    t=np.linspace(0,math.pi/2,N+1); c=np.cos(t); s=np.sin(t)
    x=a*np.sign(c)*np.abs(c)**(2/n); y=b*np.sign(s)*np.abs(s)**(2/n)
    return 4*np.sum(np.hypot(np.diff(x),np.diff(y)))
def se_area(a,b,n): return 4*a*b*gamma(1+1/n)**2/gamma(1+2/n)
def fit(B,D,C):
    """superellipse with half-axes B/2, D/2 whose perimeter = C; returns n, area. n capped at 6"""
    a,b=B/2,D/2
    f=lambda n: se_perim(a,b,n)-C
    if f(6)<0: n=6
    elif f(1.6)>0: n=1.6
    else: n=brentq(f,1.6,6)
    return n, se_area(a,b,n)
out={}
for name,(bn,dn,cn) in {'chest':('chestbreadth','chestdepth','chestcircumference'),
                        'waist':('waistbreadth','waistdepth','waistcircumference'),
                        'hip':('hipbreadth','buttockdepth','buttockcircumference')}.items():
    B,D,C=col(bn),col(dn),col(cn)
    idx=np.random.default_rng(0).choice(len(B),400,replace=False)
    ns=[];ke=[];ke_ell=[]
    for i in idx:
        n,A=fit(B[i],D[i],C[i]); ns.append(n); ke.append(A/(math.pi/4*B[i]**2))
        # alternative: ellipse with depth D and perimeter C (breadth solved) -> area
        g=lambda bb: se_perim(bb/2,D[i]/2,2)-C[i]
        bb=brentq(g,D[i]*0.3,D[i]*5); ke_ell.append((math.pi/4*bb*D[i])/(math.pi/4*B[i]**2))
    out[name]=dict(B=B.mean(),D=D.mean(),C=C.mean(),D_over_B=float(np.mean(D/B)),
                   n_superellipse=float(np.median(ns)),k_eff_superellipse=float(np.mean(ke)),
                   k_eff_wide_ellipse=float(np.mean(ke_ell)),frac_n_capped=float(np.mean(np.array(ns)>=5.99)))
for k,v in out.items(): print(k,{a:round(b,3) for a,b in v.items()})
st=col('stature'); bd=col('bideltoidbreadth'); cb=col('chestbreadth'); print('bideltoid/stature',round((bd/st).mean(),3),'chestbreadth/bideltoid',round((cb/bd).mean(),3))
import json; json.dump(out,open('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/checker/ansur_k.json','w'),indent=1)
