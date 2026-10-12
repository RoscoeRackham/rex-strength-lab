import math
pi=math.pi; g=9.80665
print("== unit conversions (in/s -> mm/s)")
for v in [0.04,0.01,0.25,0.9,2.0,0.4,0.035,0.24,0.012,0.10,0.5,0.75,0.3,0.2,0.12,0.08,1.0,0.03,0.9,1.2,3.0,0.130,0.095,0.033,0.020,0.011,0.006,0.019,0.08,0.008,0.004,0.016,0.032]:
    print(f"{v} in/s = {v*25.4:.3f} mm/s")
print("== VdB")
for L in [50,65,72,75,78,84,85,90,94,98,100,102]:
    rms_in=1e-6*10**(L/20); rms_mm=rms_in*25.4
    print(f"{L} VdB: {rms_in:.5f} in/s rms = {rms_mm:.4f} mm/s rms; x4 {4*rms_mm:.3f}, x5 {5*rms_mm:.3f}")
print("FTA Table 7-5 check (PPV/4 -> VdB):")
for p in [0.5,0.3,0.2,0.12]:
    print(p, round(20*math.log10(p/4/1e-6),1))
print("== ISO base curve")
print(0.004*25.4*math.sqrt(2), 0.008*25.4*math.sqrt(2), 0.004*25.4*2*math.sqrt(2), 0.004*25.4*4*math.sqrt(2))
print("== BS 7385-2 line 2 exponents")
a=math.log(20/15)/math.log(15/4); b=math.log(50/20)/math.log(40/15)
print("a",a,"b",b, "0.6mm at 4Hz", 2*pi*4*0.6, "mm/s")
def bs(f):
    if f<4: return 2*pi*f*0.6e-3
    if f<15: return 15e-3*(f/4)**a
    if f<40: return 20e-3*(f/15)**b
    return 50e-3
for f in [2,4,10,15,20,30,40,60]: print(f, round(bs(f)*1e3,2),"mm/s")
print("linear interp alt at 10 Hz:", 15+(10-4)*(5/11), "at 20 Hz:", 20+(20-15)*30/25, "at 30 Hz:", 20+15*30/25)
print("== USBM corner freqs")
for v,d in [(0.5,0.008),(0.75,0.008),(2.0,0.008),(0.5,0.030),(0.75,0.030)]:
    print(v,d, round(v/(2*pi*d),2),"Hz")
print("== Wald 1999 edges")
for I in [1.5,2.5,3.5,4.5]:
    pgv=10**((I-3.40)/2.10); pga=10**((I-1.00)/2.20)
    print(f"I={I}: PGV(eq1.4)={pgv:.3f} cm/s  PGA(eq1.3)={pga:.2f} cm/s2 = {pga/980.665*100:.2f} %g")
for I in [4.5,5.5,6.5,7.5,8.5,9.5]:
    pgv=10**((I-2.35)/3.47); pga=10**((I+1.66)/3.66)
    print(f"I={I}: PGV(eq1.2)={pgv:.2f} cm/s  PGA(eq1.1)={pga:.1f} cm/s2 = {pga/980.665*100:.1f} %g")
print("== equivalent sine freq from figure bands a/(2 pi v)")
bands={'II-III':(0.17,1.4,0.1,1.1),'IV':(1.4,3.9,1.1,3.4),'V':(3.9,9.2,3.4,8.1),'VI':(9.2,18,8.1,16),'VII':(18,34,16,31),'VIII':(34,65,31,60)}
for k,(a1,a2,v1,v2) in bands.items():
    f1=a1/100*980.665/(2*pi*v1); f2=a2/100*980.665/(2*pi*v2)
    print(k, round(f1,2), round(f2,2))
print("== rattle conversion")
for f in [10,20,30]:
    for a_pct in [0.17,1.4,3.9]:
        a=a_pct/100*g
        print(f, a_pct, round(a/(2*pi*f)*1e3,3),"mm/s")
print("== 1 g")
for f in [2,10,20,30,40]: print(f, round(g/(2*pi*f)*1e3,1),"mm/s")
print("== Takahashi kinematics (disp mm, accel m/s2)")
for f,v in [(0.3,0.265),(0.6,0.265),(1.0,0.159),(1.0,0.318),(2.5,0.127),(2.5,0.318),(5.0,0.312),(5.0,0.477)]:
    print(f,v, round(v/(2*pi*f)*1e3,1),"mm", round(2*pi*f*v,2),"m/s2", round(2*pi*f*v/g,2),"g")
print("== Murray: 0.415 tau^1.29")
for t in [0.2,0.5,1,2,4]: print(t, round(0.415*t**1.29,3),"in/s", round(0.415*t**1.29*25.4,2),"mm/s")
print("== mm/s vs in/s Whiffin", 0.15/25.4, 0.30/25.4, 0.006*25.4, 0.019*25.4)
print("== footing at 20 Hz: displacement & accel for 0.3 m/s", 0.3/(2*pi*20)*1e3, "mm", 2*pi*20*0.3/g, "g")
