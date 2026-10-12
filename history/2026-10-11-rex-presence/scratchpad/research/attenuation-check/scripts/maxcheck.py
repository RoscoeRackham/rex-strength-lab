import sys, numpy as np
sys.argv=['x']
exec(open('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/attenuation-check/scripts/pekeris.py').read().split("xs=[")[0])
for shape,(a,b) in {'hann':(0.375,0.620),'ramp':(0.1875,0.181)}.items():
    worst=(0,0); worstpm=(0,0)
    for x in np.geomspace(0.2,8,25):
        e=ppv(x,shape,ns=2000)
        m=max(a/x,b/np.sqrt(x))
        pm=((a/x)**3.75+(b/np.sqrt(x))**3.75)**(1/3.75)
        if abs(m/e-1)>abs(worst[1]): worst=(x,m/e-1)
        if abs(pm/e-1)>abs(worstpm[1]): worstpm=(x,pm/e-1)
    print(shape,'max(near,far) worst', worst, 'powermean worst', worstpm)
