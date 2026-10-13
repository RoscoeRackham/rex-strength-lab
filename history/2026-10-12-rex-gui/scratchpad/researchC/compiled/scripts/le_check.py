# Lane-Emden: moment of inertia factor and binding coefficient for polytrope n
import math
def le(n,h=1e-5):
    xi=1e-6; th=1-xi*xi/6; dth=-xi/3
    pts=[]
    while th>0:
        def f(x,t,d): return d, -max(t,0)**n - 2*d/x
        k1=f(xi,th,dth); k2=f(xi+h/2,th+h/2*k1[0],dth+h/2*k1[1]); k3=f(xi+h/2,th+h/2*k2[0],dth+h/2*k2[1]); k4=f(xi+h,th+h*k3[0],dth+h*k3[1])
        pts.append((xi,max(th,0)))
        th+=h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]); dth+=h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]); xi+=h
    X=xi
    # density ∝ th^n; integrate mass, I, U
    m=0;I=0;U=0;prev=None
    for x,t in pts:
        rho=t**n; dm=4*math.pi*x*x*rho*h
        I+=2/3*x*x*dm; U+=(m+dm/2)*dm/x if x>0 else 0; m+=dm
    return I/(m*X*X), U/(m*m/X)
for n in (0.95,0.98,1.0):
    print(n, le(n,2e-4))
