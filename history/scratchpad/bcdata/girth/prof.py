import pickle, numpy as np, math, sys
from scipy import ndimage as ndi
D='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/'
rex_r, ol_r = pickle.load(open(D+'regions.pkl','rb'))
rex_body=np.load(D+'rex_body.npy'); ol_body=np.load(D+'ol_body.npy')
S=3.048/790.0
def rowruns(m,y):
    lab,n=ndi.label(m[y]); 
    out=[]
    for i in range(1,n+1):
        xs=np.nonzero(lab==i)[0]; out.append((int(xs.min()),int(xs.max()),int(len(xs))))
    return out
for fig,R in (('rex',rex_r),('ollie',ol_r)):
    print('=====',fig,'torso rows (x0,x1,w)')
    for y in range(90,560,10):
        r=rowruns(R['torso'],y)
        if r: print(y, r)
