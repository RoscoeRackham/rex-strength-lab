import math
base={"earth binding":2.49e32,"sun year":1.208e34,"jup orbit":1.6188e35,"century":1.208e36,"millennium":1.208e37,"nova":1e38,"magnetar":1e39,"moon mc2":6.6023e39,"sun gal":6.0655e40,"earth mc2":5.3675e41,"sn light":1e42,"Gyr":1.208e43,"sn blast":1e44,"hypernova":3e45,"sn nu":3e46,"sun mc2":1.7871e47,"gw150914":5.3613e47,"gw190521":1.3582e48}
opt={"earth orbit":2.6482e33,"jup mc2":1.706e44}
def scan(r,name):
    rs=sorted(r.items(),key=lambda x:x[1])
    print("==",name)
    for a,b in zip(rs,rs[1:]):
        R=b[1]/a[1]
        if R>10: print(f"  {a[0]} {a[1]:.2e} -> {b[0]} {b[1]:.2e}: {R:.1f}x; multiples >10x for E in ({10*a[1]:.2e}, {b[1]:.2e}); share of upper >=10% covers it: {R<=100}")
scan(base,"proposed 17 + earth binding")
scan({**base,**opt},"with optionals")
b2=dict(base); b2.pop("hypernova")
scan(b2,"hypernova dropped")
scan({**b2,"jup mc2":1.706e44},"hypernova dropped, jup mc2 added")
b3=dict(base); b3["magnetar"]=2e39
scan(b3,"magnetar at 2e39")
