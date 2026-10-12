import math
def brentq(fn,lo,hi):
    for _ in range(300):
        m=math.sqrt(lo*hi)
        if fn(m)<0: lo=m
        else: hi=m
    return m
g=9.80665; sig=0.07274; rho=998.0; nu=0.96e-3/997; h=0.08
lc=math.sqrt(sig/(rho*g)); AM=math.pi/180/60
print("l_c mm", lc*1e3, "nu", nu)
def k_of(f):
    w=2*math.pi*f
    return brentq(lambda k:(g*k+sig/rho*k**3)*math.tanh(k*h)-w*w,1e-6,1e6)
def cg(k):
    w=math.sqrt((g*k+sig/rho*k**3)*math.tanh(k*h))
    dk=k*1e-6
    w2=math.sqrt((g*(k+dk)+sig/rho*(k+dk)**3)*math.tanh((k+dk)*h))
    return (w2-w)/dk
def zm(th): return lc*math.sqrt(2*(1-math.sin(math.radians(th))))
for th in [0,20,45,50,87.4,102.1]: print("theta",th,"zm mm",round(zm(th)*1e3,3))
print()
for f in [10,20,40]:
    k=k_of(f); w=2*math.pi*f; c=cg(k)
    G=2*nu*k*k
    print(f"f={f}: k={k:.1f} lam={2*math.pi/k*1e3:.2f}mm cp={w/k*100:.2f}cm/s cg={c*100:.2f}cm/s Gamma={G:.4f}/s decay_len={c/G:.3f}m klc={k*lc:.3f} cross35mm={0.035/c:.3f}s")
print()
res={}
for crit in [1,10]:
  for f in [10,20,40]:
    k=k_of(f); w=2*math.pi*f; c=cg(k)
    s=crit*AM/2; a=s/k
    ph=(w*a/2*1e3, w*a*1e3)
    eta=1/math.sqrt(1+(k*lc)**2)
    pv_res=[a*2*g/(zm(th)*eta*w)*1e3 for th in (20,50)]
    # my Green's-function pressure-forcing model: a = A zm k lc/((1+k^2 lc^2) w cg)  (free contact angle)
    # => A = a (1+k^2lc^2) w cg/(zm k lc); PPV = A/w
    pv_g=[a*(1+(k*lc)**2)*w*c/(zm(th)*k*lc)/w*1e3 for th in (20,50)]
    # pinned contact line: extra factor k lc
    pv_gp=[v/(k*lc) for v in pv_g]
    print(f"crit {crit}' f={f}: a={a*1e6:.3f}um horiz PPV {ph[0]:.3f}-{ph[1]:.3f} mm/s | vert(researcher) {pv_res[0]:.3f}-{pv_res[1]:.3f} | vert(Green free) {pv_g[0]:.3f}-{pv_g[1]:.3f} | vert(Green pinned) {pv_gp[0]:.3f}-{pv_gp[1]:.3f} | min(res) {min(ph[0],pv_res[0]):.3f} min(Green) {min(ph[0],pv_g[0]):.3f}")
print()
# Shao anchor: A=0.5 m/s2 at 11.2 Hz
f=11.2; w=2*math.pi*f; k=k_of(f); c=cg(k); A=0.5
print("Shao anchor: PPV mm/s", A/w*1e3, "disp mm", A/w**2*1e3, "k",k)
for th in (20,50):
    eta=1/math.sqrt(1+(k*lc)**2)
    a_res=A/(2*g)*zm(th)*eta
    a_g=A*zm(th)*k*lc/((1+(k*lc)**2)*w*c)
    print(" theta",th,"researcher a um",a_res*1e6,"defl arcmin",2*a_res*k/AM," | Green a um",a_g*1e6,"defl arcmin",2*a_g*k/AM)
print("source angular size arcmin", 2/300/AM)
print("if A were peak-to-peak: PPV", A/2/w*1e3)
# Faraday PPV
for A,f in [(0.3,20),(0.3,10.8),(2.5,10),(0.4,11.7)]:
    print("Faraday",A,f,"PPV mm/s",A/(2*math.pi*f)*1e3)
# visual: 1 arcmin
print("1 arcmin rad", AM)
# ShakeMap Worden 2012 GMICE check
for mmi in [2.5,3.5,4.0,4.5,5.0]:
    pgv=10**((mmi-3.78)/1.47); pga=10**((mmi-1.78)/1.55)
    print("MMI",mmi,"PGV cm/s %.3f"%pgv,"PGA %%g %.3f"%(pga/980.665*100))
# tilt at 1 Hz with PGV 1.41 cm/s: A = 2 pi f v
for f in (0.5,1,2,5):
    A=2*math.pi*f*0.0141; print("f",f,"A",A,"tilt deg",math.degrees(math.atan(A/g)))
