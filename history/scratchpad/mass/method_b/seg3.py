from PIL import Image
import numpy as np
from scipy import ndimage as ndi
IMG='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
a=np.asarray(Image.open(IMG).convert('RGB')).astype(float)
H,W,_=a.shape
yy,xx=np.mgrid[0:H,0:W]
gray=a.mean(2)
def lstd(g,r=2):
    m=ndi.uniform_filter(g,2*r+1); m2=ndi.uniform_filter(g*g,2*r+1)
    return np.sqrt(np.maximum(m2-m*m,0))
sd=lstd(gray,2)
sat=a.max(2)-a.min(2)
# initial: textured or saturated or dark relative to local
m=(sd>6)|(sat>18)
def fillsel(mm,smallmax=600):
    fh=ndi.binary_fill_holes(mm); holes=fh&~mm
    hl,hn=ndi.label(holes)
    if hn==0: return mm
    idx=range(1,hn+1)
    hs=np.asarray(ndi.sum(holes,hl,idx)); hg=np.asarray(ndi.mean(gray,hl,idx))
    sel=np.zeros(hn+1,bool); sel[1:]=(hs<smallmax)|(hg<65)
    return mm|sel[hl]
m=ndi.binary_closing(m,iterations=4); m=fillsel(m)
m=ndi.binary_opening(m,iterations=2)
FL=714  # floor line approx
for it in range(4):
    w=(~ndi.binary_dilation(m,iterations=6)).astype(float)
    bg=np.zeros_like(a)
    for region in [yy<FL, yy>=FL]:
        wr=w*region
        den=ndi.gaussian_filter(wr,25)+1e-6
        for c in range(3):
            num=ndi.gaussian_filter(a[...,c]*wr,25)
            bg[...,c]=np.where(region,num/den,bg[...,c])
    d=np.sqrt(((a-bg)**2).sum(2))
    dark=bg.mean(2)-gray
    new=(d>20)|(sd>9)
    new[yy>=FL]=((dark>45)|(sd>14))[yy>=FL]
    new=ndi.binary_opening(new,iterations=1)
    new=ndi.binary_closing(new,iterations=3)
    new=fillsel(new)
    lab,n=ndi.label(new); sizes=ndi.sum(new,lab,range(1,n+1))
    keep=np.zeros(n+1,bool); keep[1:]=sizes>3000
    m=keep[lab]
    print(it,m.sum())
OD='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/method_b/'
np.save(OD+'mask.npy',m); np.save(OD+'bg_seg3.npy',bg)
vis=a.copy(); vis[m]=vis[m]*0.45+np.array([255,0,0])*0.55
Image.fromarray(vis.astype(np.uint8)).save(OD+'mask_vis.png')
