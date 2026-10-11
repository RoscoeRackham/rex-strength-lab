import pickle, numpy as np, math
from scipy import ndimage as ndi
D='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/'
rex_r, ol_r = pickle.load(open(D+'regions.pkl','rb'))
def prof_rot(mask, angle_deg):
    ys,xs=np.nonzero(mask)
    a=math.radians(angle_deg)
    pts=[]
    for dx in (-0.25,0.25):
        for dy in (-0.25,0.25):
            pts.append(((xs+dx)*math.sin(a)+(ys+dy)*math.cos(a),(xs+dx)*math.cos(a)-(ys+dy)*math.sin(a)))
    U=np.concatenate([p[0] for p in pts]); V=np.concatenate([p[1] for p in pts])
    Ui=np.floor(U*2).astype(int); Vi=np.floor(V*2).astype(int)
    u0=Ui.min(); Ui-=u0; Vi-=Vi.min()
    g=np.zeros((Ui.max()+1,Vi.max()+1),bool); g[Ui,Vi]=True
    g=ndi.binary_closing(g,iterations=1)
    out=[]
    for i in range(g.shape[0]):
        lab,n=ndi.label(g[i])
        if n:
            w=np.array(ndi.sum(g[i],lab,range(1,n+1)))/2.0
            out.append(((i+u0)/2.0, float(w.max()), float(w.sum()), n))
    return out
ero=lambda m,d=2: ndi.binary_erosion(m,iterations=d)
cases=[('rex','arm_R_upper',16,0),('rex','arm_R_fore',8,0),('rex','arm_L_upper',-6,0),('rex','arm_L_fore',-16,0),
       ('ollie','arm_L_upper',-45,2),('ollie','arm_L_fore',60,2),('ollie','arm_R_upper',16,0),
       ('rex','leg_L',-3,0),('rex','leg_R',13,0),('ollie','leg_L',-22,0),('ollie','leg_R',6,0),('ollie','leg_L',-22,1),('ollie','leg_R',6,1)]
for fig,reg,ang,e in cases:
    R=rex_r if fig=='rex' else ol_r
    m=R[reg] if e==0 else ero(R[reg],e)
    p=prof_rot(m,ang)
    mx=max(p,key=lambda t:t[1])
    print('==',fig,reg,'ang',ang,'erode',e,'n',len(p),'max single-run width %.1f at u=%.1f'%(mx[1],mx[0]))
    # every 10 px along axis
    step=max(1,len(p)//25)
    print('  ',' '.join('%d:%.0f'%(t[0],t[1]) for t in p[::step]))
