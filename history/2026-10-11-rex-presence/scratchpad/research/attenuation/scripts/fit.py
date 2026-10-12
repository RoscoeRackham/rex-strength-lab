import json, numpy as np
d=json.load(open('ppv_table.json')); x=np.array(d['x'])
for kind,a,b in [('hann',0.375,0.6198),('ramp',0.1875,0.1808)]:
    y=np.array(d[kind])
    best=None
    for p in np.arange(0.5,8.01,0.25):
        f=((a/x)**p+(b/np.sqrt(x))**p)**(1/p)
        err=np.log(f/y)
        m=np.max(np.abs(err))
        if best is None or m<best[0]: best=(m,p,err)
    m,p,err=best
    print(kind,'best p',p,'max |ln err|',round(m,3),'-> factor',round(np.exp(m),3))
    fmax=np.maximum(a/x,b/np.sqrt(x)); e2=np.log(fmax/y); print('   max() form: max factor', round(np.exp(np.max(np.abs(e2))),3), 'worst at x=', x[np.argmax(np.abs(e2))])
    xc=(a/b)**2; print('   crossover x_c=(a/b)^2=',round(xc,3))
    for xi,yi,ei in zip(x,y,err):
        if 0.1<xi<10: print(f"     x={xi:7.3f} exact={yi:.4f} fit={yi*np.exp(ei):.4f} ratio={np.exp(ei):.3f}")
