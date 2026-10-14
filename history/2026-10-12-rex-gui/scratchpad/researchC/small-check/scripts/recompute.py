g=9.80665; gr=64.79891e-6; ft=0.3048; lb=0.45359237; oz=lb/16; ftlbf=1.3558179483
ke=lambda m,v:0.5*m*v*v
print('apple', 0.182*g, 0.149*g, 0.223*g, 0.101*g)
print('air rifle', 12*ftlbf, 6*ftlbf)
v=565/3.6; print('badm v',v, 'KE', ke(0.00512,v), ke(0.00474,v), ke(0.0055,v), 'mid', (4.74+5.5)/2)
vp=105.8*0.44704; print('pitch v',vp, ke(0.1453,vp), ke(5*oz,vp), ke(5.25*oz,vp), 5*oz, 5.25*oz)
m9=112*gr; v9=1263*ft; print('9mm', m9, v9, ke(m9,v9), ke(m9,1258*ft), ke(m9,1268*ft), 1258*ft,1268*ft)
m5=62*gr; v5=3025*ft; print('5.56', m5, v5, ke(m5,v5))
m7=146*gr; v7=2750*ft; print('7.62', m7, v7, ke(m7,v7), '149gr', ke(149*gr,v7))
print('bolt', ke(95,12.42), ke(95,12.14), 3932/(4.2*g), ke(95.5,12.42))
m50=661*gr; v50=2910*ft; print('.50', m50, v50, ke(m50,v50), ke(m50,876), ke(m50,894), ke(m50,885))
print('sugar', 4.2*16.2, 4.2*3.87, 4.2*3.87*4.184, 2.3*16.2, 387*4.184/100, 5643.4/342.2965, 5643.4/342.2965/16.2-1)
mc=2955*lb; print('corolla', mc, ke(mc,50/3.6), ke(mc,100/3.6), ke(3150*lb,100/3.6), ke(1340,100/3.6))
# ladder steps
r=[('apple',1.785),('air',16.27),('badm',63.06),('pitch',162.5),('9mm',537.8),('5.56',1707.7),('bolt',7327),('.50',16848),('sugar',68040),('c50',129280),('c100',517130),('grenade',1.0e6)]
for a,b in zip(r,r[1:]): print(f'{a[0]:>7} -> {b[0]:<7} {b[1]/a[1]:.2f}x')
r2=[x for x in r if x[0] not in ('9mm','c50')]
print('without optional')
for a,b in zip(r2,r2[1:]): print(f'{a[0]:>7} -> {b[0]:<7} {b[1]/a[1]:.2f}x')
