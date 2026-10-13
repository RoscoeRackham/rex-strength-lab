import math, sys, json
GM=398600441800000.0; R=6371000.0
def arc(v0, thdeg, h0):
    th=math.radians(thdeg); r0=R+h0
    vr=v0*math.sin(th); vt=v0*math.cos(th)
    h=r0*vt; eps=0.5*v0*v0-GM/r0
    if eps>=0: return {'escaped':True}
    p=h*h/GM; e=math.sqrt(max(0,1+2*eps*h*h/GM/GM)); a=-GM/(2*eps)
    rp=a*(1-e); ra=a*(1+e)
    if rp>=R: return {'orbit':True,'apex':ra-R}
    def f_of(r): return math.acos(max(-1,min(1,(p/r-1)/e)))
    f0=f_of(r0) if vr>=0 else 2*math.pi-f_of(r0)
    f1=2*math.pi-f_of(R)
    rng=R*(f1-f0)
    apex=ra-R if f0<math.pi<f1 else h0
    # time via eccentric anomaly
    def EofF(f):
        E=2*math.atan2(math.sqrt(1-e)*math.sin(f/2), math.sqrt(1+e)*math.cos(f/2))
        return E+2*math.pi if E<0 else E
    n=math.sqrt(GM/a**3)
    M0=EofF(f0)-e*math.sin(EofF(f0)); M1=EofF(f1)-e*math.sin(EofF(f1))
    dM=M1-M0
    if dM<0: dM+=2*math.pi
    vimp=math.sqrt(2*(eps+GM/R))
    return {'range':rng,'apex':apex,'time':dM/n,'vImpact':vimp}
for line in sys.stdin:
    v,th,h0=map(float,line.split())
    print(json.dumps(arc(v,th,h0)))
