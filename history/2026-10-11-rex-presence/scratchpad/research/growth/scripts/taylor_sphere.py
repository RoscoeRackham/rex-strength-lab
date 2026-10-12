# Self-similar flow ahead of a sphere expanding at constant speed (Taylor 1946 problem),
# integrated from the shock inward until the fluid speed equals the similarity coordinate (piston).
import math
g=1.4
def solve(M):           # M = shock Mach number Xi/c0; units c0=1, p0=1, rho0=1/gamma? use ratios
    Xi=M
    # Rankine-Hugoniot (moving shock into still gas)
    p_s=(2*g*M*M-(g-1))/(g+1)           # p/p0
    rho_s=(g+1)*M*M/((g-1)*M*M+2)       # rho/rho0
    u_s=Xi*(1-1/rho_s)                  # lab-frame gas speed behind shock /c0
    c_s=math.sqrt(p_s/rho_s)            # c/c0
    # integrate du/deta, dc/deta from eta=Xi downward with RK4
    def f(eta,y):
        u,c=y
        d=(u-eta)**2-c*c
        du=2*c*c*u/(eta*d)
        dc=-(g-1)*(u-eta)*du/(2*c)
        return (du,dc)
    eta=Xi; y=(u_s,c_s); h=-Xi*1e-5
    while True:
        if y[0]>=eta: break
        k1=f(eta,y); k2=f(eta+h/2,(y[0]+h/2*k1[0],y[1]+h/2*k1[1]))
        k3=f(eta+h/2,(y[0]+h/2*k2[0],y[1]+h/2*k2[1])); k4=f(eta+h,(y[0]+h*k3[0],y[1]+h*k3[1]))
        yn=(y[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]), y[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]))
        if yn[0]>=eta+h:   # crossing u = eta between eta+h and eta: linear interp
            a=y[0]-eta; b=yn[0]-(eta+h); t=a/(a-b)
            xi0=eta+t*h; c=y[1]+t*(yn[1]-y[1]); y=(xi0,c); eta=xi0; break
        y=yn; eta+=h
        if eta<1e-6: return None
    xi0=eta; c_p=y[1]
    p_p=p_s*(c_p/c_s)**(2*g/(g-1))
    return dict(M=M,xi0=xi0,u_s=u_s,dp_shock=p_s-1,dp_piston=p_p-1)
def planar(u):          # piston speed u/c0 -> shock Mach and overpressure/p0
    M=(g+1)/4*u+math.sqrt(((g+1)/4*u)**2+1)
    return M,2*g/(g+1)*(M*M-1)
if __name__=="__main__": print("M_shock  xi0/c0  us/c0  dp_shock/p0  dp_surface/p0  planar_dp/p0  1.5*g*xi0^2(incomp)  acoustic 2g xi0^2(1-xi0)")
if __name__=="__main__":
 for M in [1.005,1.01,1.017,1.035,1.05,1.087,1.104,1.173,1.243,1.312,1.382,1.451,1.52,1.59,1.659,1.729,2.006,2.214,3,4,6,10]:
     r=solve(M)
     if r is None: print(M,'fail'); continue
     pm,pdp=planar(r['xi0'])
     x=r['xi0']
     print(f"{M:6.3f}  {x:6.3f}  {r['u_s']:6.3f}  {r['dp_shock']:8.4f}  {r['dp_piston']:8.4f}  {pdp:8.4f}  {1.5*g*x*x:8.4f}  {2*g*x*x*(1-x):8.4f}")
