LB=0.45359237; IN=0.0254
def h(ft,inch): return (ft*12+inch)*IN
def ffmi(kg,hm,bf): return kg*(1-bf)/hm**2
def norm(f,hm,k=6.1): return f+k*(1.8-hm)
cases={
 'Ronnie1998_249_5-11':(249*LB,h(5,11)),'Ronnie2003_286':(286*LB,h(5,11)),'Ronnie2004_296':(296*LB,h(5,11)),
 'Dorian1993_116.57_5-10':(116.57,h(5,10)),'Dorian1993_5-9':(116.57,h(5,9)),
 'Jay2009_271_5-9':(271*LB,h(5,9)),'Jay2009_5-10':(271*LB,h(5,10)),
 'Phil2011_248_5-9':(248*LB,h(5,9)),
 'Ramy2015_307.5_5-9':(307.5*LB,h(5,9)),'Ramy2015_5-10':(307.5*LB,h(5,10)),'Ramy2015_5-11':(307.5*LB,h(5,11)),
 'Ramy2014_285_5-11':(285*LB,h(5,11)),
 'Arnold1971_246_6-1.5':(246*LB,h(6,1.5)),'Arnold1975_235':(235*LB,h(6,1.5)),'Arnold_book_235_6-2':(235*LB,h(6,2)),
 'Sergio1967_225_5-10':(225*LB,h(5,10)),'Reeves_213_6-1':(213*LB,h(6,1)),
}
for k,(m,hm) in cases.items():
    f5=ffmi(m,hm,.05); f107=ffmi(m,hm,.107)
    print(f"{k:28s} kg={m:6.1f} h={hm:.3f} FFMI5={f5:5.2f} norm={norm(f5,hm):5.2f} FFMI10.7={f107:5.2f} diff={f5-f107:4.2f}")
print('Shaw', 174.5*(1-.176), ffmi(174.5,2.032,.176), ffmi(174.5,h(6,6.75),.176), h(6,6.75))
print('Chappell PRO end 5%', ffmi(82.3,1.77,.05))
# constants 6.1 vs 6.3
for hm in (1.55,1.65,1.75,1.9,2.05): print('k diff at',hm, 0.2*abs(1.8-hm))
# Mr America table, 5% fat, normalized
rows=[(1939,5,10.5,170),(1940,5,8.5,195),(1942,5,11.5,209),(1943,5,7,175),(1944,5,11.5,223),(1945,5,9.5,185),(1946,5,11.5,205),(1947,6,1,213),(1948,5,7.5,195),(1949,5,6,195),(1950,5,9,195),(1951,5,6,178),(1952,5,7.5,190),(1953,5,9,201),(1954,6,1,220),(1959,5,9,186)]
vals=[]
for y,ft,i,lb in rows:
    hm=h(ft,i); f=ffmi(lb*LB,hm,.05); n=norm(f,hm); vals.append(n); print(y, round(hm,3), round(f,2), round(n,2))
import statistics as s
print('n',len(vals),'mean norm',round(s.mean(vals),2),'sd',round(s.stdev(vals),2),'max',round(max(vals),2))
# Withers
import math
print('withers h',math.sqrt(99.70/31.6),math.sqrt(92.79/29.2))
