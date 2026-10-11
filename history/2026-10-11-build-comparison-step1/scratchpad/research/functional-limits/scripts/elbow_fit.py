import math
# Zwerus et al. (Shoulder Elbow 2019;11:215) men, dominant side, Table 4 by BMI group: (n, active, passive)
z = {'<18.5':(6,151,155),'18.5-25':(105,145,149),'25-30':(40,140,144),'>=30':(15,136,140)}
# ANSUR II men, median flexed biceps + flexed forearm girth (mm) in the same BMI groups (computed from the public CSV)
a = {'<18.5':555,'18.5-25':614,'25-30':666,'>=30':718}
ref = a['18.5-25']
def fit(which):
    idx = 1 if which=='active' else 2
    phi0 = z['18.5-25'][idx]; c = math.tan(math.radians((180-phi0)/2))
    # least squares on log tan(alpha/2) = log c + p log k, through the reference point, weighted by n
    num=den=0
    for gname,(n,act,pas) in z.items():
        if gname=='18.5-25': continue
        phi = act if which=='active' else pas
        k = a[gname]/ref; y = math.log(math.tan(math.radians((180-phi)/2))/c); x=math.log(k)
        num += n*x*y; den += n*x*x
        print(f"  {which} {gname}: k={k:.3f} phi={phi} -> local p={y/x:.2f}")
    p=num/den; print(f"  {which}: c={c:.4f} weighted p={p:.2f}")
    return c,p
for which in ('active','passive'):
    c,p = fit(which)
    for P in (1.0,p):
        out=[]
        for k in (1.086,1.25,1.5,1.75,2.0,2.5,3.0):
            phi=180-2*math.degrees(math.atan(c*k**P)); out.append(f"k={k}:{phi:.0f}")
        cross=[]
        for target in (130,120,110,100):
            k=(math.tan(math.radians((180-target)/2))/c)**(1/P); cross.append(f"{target}deg@k={k:.2f}")
        print(f"   p={P:.2f}: "+", ".join(out)); print("          crossings: "+", ".join(cross))
