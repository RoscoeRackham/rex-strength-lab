ME=5.9722e24
rows=[("canon",0.90,6160,0.13,3390,9.2e3,0.74,4.61e5),("similar",0.57,5350,0.47,5040,9.7e3,0.55,5.66e6),
      ("spin",1.05,7980,0.05,2380,20e3,-0.3,6.42e6),("partial",0.75,5800,0.30,4400,11.3e3,0.3,1.20e7)]
import math
for name,M,R,m,r,v,b,QS_tab in rows:
    Mk=M*ME; mk=m*ME; Mt=Mk+mk; mu=Mk*mk/Mt
    E=0.5*mu*v*v; QR=E/Mt
    bb=abs(b)
    if (R+r)*bb + r > R: l=(1-bb)*(R+r)
    else: l=2*r
    alpha=min(1.0,(3*r*l*l-l**3)/(4*r**3))
    mua=alpha*mk*Mk/(alpha*mk+Mk)
    QS=(mua/mu)*QR*(1+mk/Mk)*(1-bb)
    QSneg=(mua/mu)*QR*(1+mk/Mk)*(1-b)
    print(name,"E=%.3e QR=%.3e alpha=%.3f QS(|b|)=%.3e QS(b)=%.3e table=%.3e"%(E,QR,alpha,QS,QSneg,QS_tab))
import math
print("geo mid %.3e"%math.sqrt(2.871e31*8.171e31), "ratio", math.sqrt(8.171e31/2.871e31))
# virial: energy to free
print("Moon free GM(E+M)m/2a %.4e"%((3.986004e14+4.9028e12)*7.346e22/(2*3.844e8)))
print("Moon free GM_E m/2a %.4e"%((3.986004e14)*7.346e22/(2*3.844e8)))
print("Earth free %.4e"%(1.32712440e20*5.9722e24/(2*1.49598e11)))
print("Jupiter free %.4e"%(1.32712440e20*1.89813e27/(2*7.78479e11)))
