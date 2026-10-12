import numpy as np
exec(open('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/attenuation-check/scripts/model.py').read().split('p=997.4')[0])
p=997.4; T=0.03; F=2*p/T
rs=[2.5,5,10,20,35,60,100,150,200]
m=[ppv(F,T,r,1850,150,0.03,'hann')*1000 for r in rs]
fit=[8.7*(r/2.5)**-1.282 for r in rs]
for r,a,b in zip(rs,m,fit): print(r, round(a,3), 'measured-fit r^-1.28 from 8.7@2.5:', round(b,3), 'ratio', round(a/b,2))
print('model local slope 35-60', np.log(m[4]/m[5])/np.log(60/35), '60-100', np.log(m[5]/m[6])/np.log(100/60), '100-200', np.log(m[6]/m[8])/np.log(2))
