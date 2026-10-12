import math
g=9.80665; sigma=0.07274; rho=998.0
lc=math.sqrt(sigma/(rho*g)); arcmin=math.pi/180/60
def k_of_f(f,h=0.08):
    w=2*math.pi*f; lo,hi=1e-3,1e6
    for _ in range(200):
        m=math.sqrt(lo*hi)
        if (g*m+sigma/rho*m**3)*math.tanh(m*h) < w*w: lo=m
        else: hi=m
    return m
def hm(th): return lc*math.sqrt(2*(1-math.sin(math.radians(th))))
for f in [10,20,40]:
    k=k_of_f(f); w=2*math.pi*f
    cp=w/k; cg=(g+3*sigma*k*k/rho)/(2*w)
    for crit in [1,10]:
        s=crit*arcmin/2; a=s/k
        h=[s*cp/2*1e3, s*cp/1*1e3, s*cp/3*1e3]
        v=[a*cg*(1+(k*lc)**2)/(hm(th)*k*lc)*1e3 for th in (20,50)]
        # pinned: multiply amplitude by ~k lc -> ppv divided by k lc
        vp=[x/(k*lc) for x in v]
        print(f,crit,"klc=%.2f"%(k*lc),"h r=2,1,3:",[round(x,3) for x in h],"v free:",[round(x,3) for x in v],"v pinned:",[round(x,3) for x in vp])
# Shao anchor deflection with corrected model, peak 0.5 and 0.25
f=11.2; k=k_of_f(f); w=2*math.pi*f; cg=(g+3*sigma*k*k/rho)/(2*w)
for A in (0.5,0.25):
    for th in (20,50):
        a=A*hm(th)*k*lc/((1+(k*lc)**2)*w*cg)
        print("shao A",A,"th",th,"defl arcmin corrected", round(2*a*k/arcmin,1))
    eff=1/math.sqrt(1+(k*lc)**2)
    for th in (20,50):
        a=A/(2*g)*hm(th)*eff
        print("shao A",A,"th",th,"defl arcmin researcher eta", round(2*a*k/arcmin,1))
print("PPV shao", 0.5/(2*math.pi*11.2)*1e3, 0.25/(2*math.pi*11.2)*1e3)
for A in (0.3,0.8):
  for f in (10,20): print("faraday",A,f, round(A/(2*math.pi*f)*1e3,2))
# Worden 2012 PGV conversion band IV 3.5-4.5: MMI=c1+c2 log10(PGV) for MMI<=t; use 3.78,1.47 and 2.89,3.16
def pgv(mmi):
    # segment 1: MMI = 3.78 + 1.47 log PGV, valid up to MMI 4.56 ; segment 2: 2.89+3.16 log PGV
    lp=(mmi-3.78)/1.47
    if mmi>4.56: lp=(mmi-2.89)/3.16
    return 10**lp
print("PGV MMI 3.5,4,4.5:", [round(pgv(m),2) for m in (3.5,4.0,4.5)])
