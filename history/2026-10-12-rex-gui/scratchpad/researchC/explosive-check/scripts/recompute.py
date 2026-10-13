import math
LB=0.45359237; OZ=0.028349523125; GAL=3.785411784e-3; BTU=1055.056; KWH=3.6e6; TNT_T=4.184e9
print("food", 2000*4184, 2000*4186.8, (4186.8/4184-1)*100)
m=80000*LB; v=100/3.6
print("truck m", m, "KE", 0.5*m*v*v)
for mph in (55,65,75):
    vv=mph*0.44704; print(" ",mph,"mph",0.5*m*vv*vv)
for k in (10791,6178,14774):
    print("home yr",k,k*KWH,"day",k/365*KWH,"week",k/365*7*KWH)
print("MOAB/home-yr", 4.6024e10/(10791*KWH))
mt=454000; vt=320/3.6
print("train",0.5*mt*vt**2, "loaded", 0.5*(mt+460*80)*vt**2, "loaded444", 0.5*(mt+444*80)*vt**2, "axle-load cap", 32*17e3)
a=lambda T: math.sqrt(1.4*287.05*T)
T_strat=-56.46+273.15; h=35000*0.3048; T35=15.04-0.00649*h+273.15
print("a strat",a(T_strat),"a35k",a(T35),T35-273.15)
v380=0.85*a(T_strat)
print("v380",v380, v380*3.6, "KE575", 0.5*575000*v380**2, "KE386",0.5*386000*v380**2, "KE560",0.5*560000*v380**2, "KE394",0.5*394000*v380**2)
print("tank L",13.2*GAL*1000)
for b in (120214,112114,116090,120388,124340):
    print("gas",b, b*BTU/GAL, "tank", 13.2*b*BTU)
mg=6.5*OZ
print("grenade kg",mg, mg*4.69e6, mg*5.02e6, mg*1.10*4.184e6, mg*4.184e6, mg*1.33*4.184e6)
print("CompB/TNT", 5.02/4.56, 4.69/4.27, 1.20/1.09, 1.12/1.02)
mm=18700*LB
print("MOAB kg",mm, mm*1.35/1000,"t", mm*1.35/1000*TNT_T, (mm*1.35/1000*TNT_T)/(11*TNT_T)-1)
# ladder steps
r=[("Corolla",517000),("grenade",890000),("food",8368000),("truck",1.4e7),("home day",1.064e8),("lightning",1e9),("train",1.79e9),("t TNT",4.184e9),("A380",1.81e10),("MOAB",4.6024e10)]
for (a1,b1),(a2,b2) in zip(r,r[1:]): print(f"{a1}->{a2}: {b2/b1:.2f}x")
print("home day -> train", 1.79e9/1.064e8, "grenade1.0->food", 8.368e6/1.025e6, "truck->home day", 1.064e8/1.4e7)
print("lightning low/high ratio", 7e9/1e8, "geo mean", math.sqrt(1e8*7e9))
print("corolla", 0.5*1340.4*(100/3.6)**2, 0.5*1428.8*(100/3.6)**2)
