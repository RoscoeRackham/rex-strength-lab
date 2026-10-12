import numpy as np
exec(open('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/attenuation-check/scripts/model.py').read().split('p=997.4')[0])
# field circles read from Colombero Fig. 6 (our reading, +/-10%)
meas=[(2.5,8.7),(5.0,4.7),(7.4,3.8),(9.9,1.8),(12.4,1.4),(14.9,1.1),(19.7,0.77),(22.3,0.73),(24.8,0.70),(27.1,0.57),(29.2,0.45),(31.9,0.385),(34.2,0.37),(37,0.41),(39.5,0.34),(44,0.24),(46.4,0.205),(49,0.18),(57,0.205),(59.5,0.19)]
p=997.4
for T in (0.03,0.04):
  for cs in (150,170):
    rat=[ppv(2*p/T,T,r,1850,cs,0.03,'hann')*1000/m for r,m in meas]
    print('T',T,'cs',cs,'ratio model/measured min %.2f max %.2f'%(min(rat),max(rat)), ['%.1f'%x for x in rat])
r=np.array([a for a,b in meas]); m=np.array([b for a,b in meas])
print('fit slope', np.polyfit(np.log(r),np.log(m),1)[0])
