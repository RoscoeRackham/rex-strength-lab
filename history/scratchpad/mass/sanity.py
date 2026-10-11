import numpy as np, pickle, math
S=3.048/790
rex=np.load('rex_body.npy'); ol=np.load('ol_body.npy')
rex_r, ol_r = pickle.load(open('regions.pkl','rb'))
def maxw(m,y0,y1):
    best=0
    for y in range(y0,y1):
        xs=np.nonzero(m[y])[0]
        if len(xs): best=max(best,xs.max()-xs.min()+1)
    return best
rex_nt=rex&~rex_r['tail']
bd_rex=maxw(rex_nt,120,330)*S; bd_ol=maxw(ol,110,330)*S
print('bideltoid-like max width: rex %.2f m, ollie %.2f m'%(bd_rex,bd_ol))
# ANSUR II male means: bideltoid/stature 0.291; weight 85.5 kg at 1.756 m
for name,bd,H in [('rex',bd_rex,3.048),('ollie',bd_ol,3.071)]:
    hum_bd=0.291*H; m_h=85.5*(H/1.756)**3
    print(name,'scaled ANSUR man %.0f kg, bideltoid %.2f m; ratio %.2f; isotropic-thickening mass %.0f kg'%(m_h,hum_bd,bd/hum_bd,m_h*(bd/hum_bd)**2))
print('avg man 75 kg 1.75 m scaled to 3.048: %.0f kg'%(75*(3.048/1.75)**3))
print('ANSUR heaviest 10%% (113.0 kg @1.815 m) scaled: %.0f kg'%(113.0*(3.048/1.815)**3))
for m,h in [(125,1.78),(136,1.78),(150,1.80)]:
    print('bodybuilder %d kg %.2f m scaled: %.0f kg'%(m,h,m*(3.048/h)**3))
print('frontal area rex %.2f (tail %.2f), ollie %.2f m2'%(rex.sum()*S*S, rex_r['tail'].sum()*S*S, ol.sum()*S*S))
