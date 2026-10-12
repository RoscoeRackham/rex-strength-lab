import math, json
g=9.80665; sigma=0.07274; rho=998.0; nu=0.96e-3/997  # IAPWS 20C; Wilson 2022 Table I water mu, rho
lc=math.sqrt(sigma/(rho*g)); arcmin=math.pi/180/60
def k_of_f(f,h=0.08):
    w=2*math.pi*f; lo,hi=1e-3,1e6
    for _ in range(200):
        m=math.sqrt(lo*hi)
        if (g*m+sigma/rho*m**3)*math.tanh(m*h) < w*w: lo=m
        else: hi=m
    return m
def hm(theta): return lc*math.sqrt(2*(1-math.sin(math.radians(theta))))
print("lc=%.3f mm nu=%.3e"%(lc*1e3,nu))
for th in [0,20,50,87.4,102.1]: print("theta %.1f: meniscus %.2f mm"%(th,hm(th)*1e3))
rows={}
for f in [10,20,40]:
    k=k_of_f(f); w=2*math.pi*f
    eff=1/math.sqrt(1+(k*lc)**2)
    r={"k_per_m":round(k),"wavelength_mm":round(2*math.pi/k*1e3,1),"meniscus_source_factor":round(eff,2)}
    for crit in [1,10]:
        s=crit*arcmin/2; a=s/k
        h_lo=w*a/2*1e3; h_hi=w*a/1*1e3   # horizontal: a=2X .. a=X
        v20=a*2*g/(hm(20)*eff)/w*1e3; v50=a*2*g/(hm(50)*eff)/w*1e3
        r[f"defl_{crit}arcmin"]={"wave_amp_um":round(a*1e6,2),"horiz_ppv_mm_s":[round(h_lo,3),round(h_hi,3)],"vert_ppv_mm_s_glass_theta20_50":[round(v20,3),round(v50,3)],"lower_of_two_mm_s":round(min(h_lo,v20),3)}
    rows[f]=r
print(json.dumps(rows,indent=1))
# horizontal-only scaling check
for f in [10,20,40]:
    k=k_of_f(f); print(f, "slope per (mm/s) horizontal a=2X:", (2*(1e-3/(2*math.pi*f)))*k/arcmin, "arcmin")
