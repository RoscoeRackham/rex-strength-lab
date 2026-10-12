import numpy as np
exec(open('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/attenuation-check/scripts/model.py').read().split('p=997.4')[0])
F=10*3007*9.80665
for r in (10,30,100,200):
    print('hann sand r',r,[ '%.3g'%(ppv(F,T,r,1600,120,0.04,'hann')*1000) for T in (0.02,0.03,0.05,0.1,0.2)])
for r in (30,100,200):
    print('ramp sand r',r,[ '%.3g'%(ppv(F,T,r,1600,120,0.04,'ramp')*1000) for T in (0.05,0.1,0.2,0.4)])
for r in (100,200):
    print('hann softclay r',r,[ '%.3g'%(ppv(F,T,r,1700,120,0.05,'hann')*1000) for T in (0.02,0.03,0.05,0.1)])
# also monotone in cs? far*D with zeta ~ 1/cs
for r in (200,):
    print('hann cs dependence r=200 T=.03',[ '%.3g'%(ppv(F,0.03,r,1600,cs,0.04,'hann')*1000) for cs in (80,100,120,150,200)])
