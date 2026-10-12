import math
ins=25.4
print("== in/s -> mm/s")
for v in [0.006,0.01,0.012,0.019,0.02,0.035,0.04,0.08,0.1,0.12,0.2,0.24,0.25,0.3,0.4,0.5,0.6,0.75,0.9,1.0,2.0]:
    print(v, round(v*ins,3))
print("== VdB re 1 uin/s -> rms mm/s, PPV (CF 4)")
for L in [65,72,75,78,80,85,90,94,98,100,102]:
    rms_in=10**(L/20)*1e-6; rms=rms_in*ins
    print(L, 'rms in/s %.4f'%rms_in, 'rms mm/s %.3f'%rms, 'PPV CF4 %.2f mm/s'%(4*rms), 'CF5 %.2f'%(5*rms))
print("== Wald PGV cm/s -> mm/s and PGA %g -> m/s2 and equivalent PPV at f")
g=9.80665
rows=[("I",None,0.17,None,0.1),("II-III",0.17,1.4,0.1,1.1),("IV",1.4,3.9,1.1,3.4),("V",3.9,9.2,3.4,8.1),("VI",9.2,18,8.1,16),("VII",18,34,16,31),("VIII",34,65,31,60)]
for name,alo,ahi,vlo,vhi in rows:
    s=f"{name}: PGV {vlo}-{vhi} cm/s = {None if vlo is None else vlo*10}-{vhi*10} mm/s; PGA {alo}-{ahi} %g = "
    s+=f"{None if alo is None else round(alo/100*g,4)}-{round(ahi/100*g,4)} m/s2"
    for f in [10,20,30]:
        lo=None if alo is None else alo/100*g/(2*math.pi*f)*1000
        hi=ahi/100*g/(2*math.pi*f)*1000
        s+=f" | @{f}Hz PPV {None if lo is None else round(lo,2)}-{round(hi,2)} mm/s"
    print(s)
print("== implied freq PGV/PGA: f = a/(2 pi v) at band edges")
for name,alo,ahi,vlo,vhi in rows[1:]:
    print(name, 'f_lo %.2f Hz'%((alo/100*g)/(2*math.pi*vlo/100)), 'f_hi %.2f Hz'%((ahi/100*g)/(2*math.pi*vhi/100)))
print("== PPV at which vertical accel = 1 g, sinusoid")
for f in [5,10,15,20,30,40]:
    print(f, round(g/(2*math.pi*f)*1000,1),'mm/s')
print("== USBM Fig B-1 corner freqs")
d=0.008
for v in [0.5,0.75,2.0]:
    print('0.008 in: v=%.2f in/s at f=%.2f Hz'%(v, v/(2*math.pi*d)))
d=0.030
for v in [0.5,0.75]:
    print('0.030 in: v=%.2f in/s at f=%.2f Hz'%(v, v/(2*math.pi*d)))
print("BS7385 0.6mm at 4 Hz ->", round(2*math.pi*4*0.6,2),"mm/s")
print("== RI 8507 Table 15 in/s -> mm/s")
for v in [0.130,0.095,0.033,0.020,0.011,0.700,0.500,0.280,0.060,0.300,0.230,0.100,1.4,1.15,0.63,0.17,0.91,0.81,0.39,0.102,0.55,1.13,0.301,0.415]:
    print(v, round(v*ins,2))
print("== Takahashi: displacement amplitude at tested points v/(2 pi f)")
for f,v in [(5,0.477),(2.5,0.318),(1.0,0.318),(0.3,0.265)]:
    print(f,v,'disp %.1f mm'%(v/(2*math.pi*f)*1000), 'acc %.2f m/s2'%(v*2*math.pi*f))
print("== displacement at 20 Hz for 160 mm/s:", round(160/(2*math.pi*20),2),"mm; accel", round(0.16*2*math.pi*20,1),"m/s2")
