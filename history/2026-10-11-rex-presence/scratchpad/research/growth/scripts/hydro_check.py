import piston_hydro as P, numpy as np, sys, taylor_sphere as T
def shockpos(o):
    rc,dp=o['p_profile']
    # front: outermost point where dp exceeds half of the max dp in the outer half of the disturbed region
    i=np.argmax(dp); # peak near shock (just behind front) for spherical piston dp rises toward piston; use gradient
    g=np.gradient(dp,rc); j=np.argmin(g)   # steepest drop = shock
    return rc[j]
for v in [float(a) for a in sys.argv[1:]]:
    N=2400
    oa=P.run(v,N=N,tend=0.6/v); ob=P.run(v,N=N,tend=1.2/v)
    sa,sb=shockpos(oa),shockpos(ob)
    S=(sb-sa)/(ob['t']-oa['t'])
    print(f"hydro v={v}: shock speed {S:.3f} c0; surface dp/p0 at t1 {oa['p_surface']:.3f}, t2 {ob['p_surface']:.3f}")
