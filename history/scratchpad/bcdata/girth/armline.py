import pickle, numpy as np, math, sys
from scipy import ndimage as ndi
from PIL import Image, ImageDraw
D='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/'
IMG='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
rex_r, ol_r = pickle.load(open(D+'regions.pkl','rb'))
fig,reg,ang,ero,out=sys.argv[1],sys.argv[2],float(sys.argv[3]),int(sys.argv[4]),sys.argv[5]
crop=[int(v) for v in sys.argv[6].split(',')]
R=rex_r if fig=='rex' else ol_r
m=R[reg]
if ero: m=ndi.binary_erosion(m,iterations=ero)
a=math.radians(ang); ax=np.array([math.sin(a),math.cos(a)]); pp=np.array([math.cos(a),-math.sin(a)])
ys,xs=np.nonzero(m); P=np.stack([xs,ys],1).astype(float)
u=P@ax; v=P@pp
res=[]
for uu in np.arange(u.min(),u.max(),2.0):
    sel=np.abs(u-uu)<0.75
    if sel.sum()<3: continue
    vv=np.sort(v[sel]); 
    # largest contiguous run (gap>1.5 breaks)
    br=np.where(np.diff(vv)>1.6)[0]
    segs=np.split(vv,br+1); s=max(segs,key=len)
    res.append((uu,s.max()-s.min()+1,s.min(),s.max()))
im=Image.open(IMG).convert('RGB'); d=ImageDraw.Draw(im)
for i,(uu,w,v0,v1) in enumerate(res):
    if i%5==0:
        p0=uu*ax+v0*pp; p1=uu*ax+v1*pp
        d.line([tuple(p0),tuple(p1)],fill=(255,255,0) if i%25 else (255,0,0),width=1)
best=max(res,key=lambda t:t[1]); p0=best[0]*ax+best[2]*pp; p1=best[0]*ax+best[3]*pp
d.line([tuple(p0),tuple(p1)],fill=(0,255,0),width=2)
im=im.crop(crop); im=im.resize((im.width*2,im.height*2)); im.save(out)
print('max width %.1f at u=%.0f, from (%.0f,%.0f) to (%.0f,%.0f)'%(best[1],best[0],*p0,*p1))
print(' '.join('%.0f:%.0f'%(t[0],t[1]) for t in res[::3]))
