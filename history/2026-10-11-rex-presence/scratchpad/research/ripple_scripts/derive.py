import math
g=9.80665; sigma=0.07275; rho=998.2; nu=1.0e-6  # 20 C
lc=math.sqrt(sigma/(rho*g))
print("capillary length lc = %.2f mm"%(lc*1e3))
def k_of_f(f):
    w=2*math.pi*f; lo,hi=1e-3,1e6
    for _ in range(200):
        m=math.sqrt(lo*hi)
        if g*m+sigma/rho*m**3 < w*w: lo=m
        else: hi=m
    return m
arcmin=math.pi/180/60
for theta_c in [0,20,40,60,80]:
    hm=lc*math.sqrt(2*(1-math.sin(math.radians(theta_c))))
    print("contact angle %2d deg: meniscus height %.2f mm"%(theta_c,hm*1e3))
print()
for f in [5,10,11.2,20,40]:
    k=k_of_f(f); w=2*math.pi*f; lam=2*math.pi/k
    cp=w/k; cg=(g+3*sigma/rho*k*k)/(2*w)
    gam=2*nu*k*k; Ld=cg/gam
    print(f"f={f:5.1f} Hz  k={k:7.1f} 1/m  lambda={lam*1e3:5.1f} mm  c_phase={cp*100:5.1f} cm/s  c_group={cg*100:5.1f} cm/s  visc decay rate={gam:.3f}/s  decay length={Ld:.2f} m")
print()
def ppv_horizontal(f, defl_arcmin, ratio):  # ratio = wave amp / wall displacement amp
    k=k_of_f(f); s=defl_arcmin*arcmin/2; a=s/k; X=a/ratio; return 2*math.pi*f*X*1e3, a
def ppv_vertical(f, defl_arcmin, hm, eff=1.0):
    k=k_of_f(f); s=defl_arcmin*arcmin/2; a=s/k
    A = a*2*g/(hm*eff); return A/(2*math.pi*f)*1e3, a, A
for defl in [1,5,10]:
    print(f"--- reflected-ray deflection threshold {defl} arcmin (slope {defl/2} arcmin = {defl/2*arcmin:.2e} rad)")
    for f in [10,20,40]:
        v2,a=ppv_horizontal(f,defl,2.0); v1,_=ppv_horizontal(f,defl,1.0)
        hm3=lc*math.sqrt(2*(1-math.sin(math.radians(20))))
        hm1=1.0e-3
        vv3,_,A3=ppv_vertical(f,defl,hm3); vv1,_,A1=ppv_vertical(f,defl,hm1)
        print(f"  f={f} Hz: wave amp needed {a*1e6:.2f} um; horizontal PPV {v2:.3f}-{v1:.3f} mm/s (a=2X..X); vertical PPV {vv3:.3f} (meniscus {hm3*1e3:.1f} mm) .. {vv1:.3f} mm/s (meniscus 1 mm)")
# Shao 2021 anchor
A=0.5; f=11.2
print("\nShao 2021 anchor: A=0.5 m/s2 at 11.2 Hz -> PPV %.1f mm/s, displacement %.1f um"%(A/(2*math.pi*f)*1e3, A/(2*math.pi*f)**2*1e6))
k=k_of_f(f); hm=1e-3*1.0
a_est=A/(2*g)*hm
print("  quasi-static meniscus estimate with 1 mm meniscus: a=%.1f um, slope=%.2e rad = %.1f arcmin"%(a_est*1e6, a_est*k, a_est*k/arcmin))
# Faraday anchors
for A in [0.3,0.5,2.5]:
    for f in [10,20]:
        print(f"  Faraday A={A} m/s2 at fd={f} Hz -> PPV {A/(2*math.pi*f)*1e3:.1f} mm/s")
# MMI IV
v=14.1e-3
for f in [1,2,5]:
    print(f"MMI IV PGV 1.41 cm/s at {f} Hz: accel {v*2*math.pi*f:.3f} m/s2 = {v*2*math.pi*f/g*100:.2f}% g, quasi-static surface tilt {v*2*math.pi*f/g*180/math.pi:.2f} deg")
