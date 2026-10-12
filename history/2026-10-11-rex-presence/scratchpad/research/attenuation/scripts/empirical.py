import math
def bs5228_dc(W,x): return 0.037*(math.sqrt(W)/x)**1.7     # mm/s, W in J, x in m
def mayne84(W,x):   # 70 (sqrt(WH)/d)^1.4 ; WH in tonne-metres
    tm=W/9806.65
    return 70*(math.sqrt(tm)/x)**1.4
print('check 92 vs 0.037: 0.037*(9806.65**0.5)**1.7 =', 0.037*(9806.65**0.5)**1.7)
print('E[J]   x[m]  BS5228/Mayne85 mm/s   Mayne84 mm/s')
for E in [10,100,1000,1e4,1e6,12e6]:
    for x in [1,3,5,10,30,100,200]:
        print(f"{E:9.0f} {x:5.0f}  {bs5228_dc(E,x):12.4g}  {mayne84(E,x):12.4g}")
# Allen 1996 high speed compactor (TRL Fig 44): 7 t from 1.2 m
W=7000*9.80665*1.2
print('HSDC W=',W)
for x,meas in [(5.6,(120,150)),(10.5,(22,30)),(16,(8,10)),(21,(7,10)),(35,(4,8)),(57,(1.8,4)),(75,(2.8,4.3)),(120,(1.3,1.5))]:
    p=bs5228_dc(W,x); print(f" x={x:6.1f} Mayne85={p:7.3f} mm/s  measured {meas}  ratio meas/pred {meas[0]/p:5.1f}-{meas[1]/p:5.1f}")
