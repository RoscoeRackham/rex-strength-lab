import numpy as np
exec(open('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/attenuation-check/scripts/pekeris.py').read().split("xs=[")[0])
for shape,(a,b) in {'hann':(0.375,0.620),'ramp':(0.1875,0.181)}.items():
    rows=[]
    for x in np.geomspace(0.2,8,25):
        e=ppv(x,shape,ns=2000)
        m=max(a/x,b/np.sqrt(x))
        rows.append((round(x,3),round(e,4),round(m/e-1,3)))
    print(shape,rows)
