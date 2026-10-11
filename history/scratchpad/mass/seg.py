"""Segment the two figures from the grey studio background.
Background model: push-pull (pyramid) inpainting of pixels classified as background,
iterated. Foreground = colour distance from local background model above threshold."""
from PIL import Image; import numpy as np
from scipy import ndimage as ndi
IMG='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
im=np.asarray(Image.open(IMG).convert('RGB')).astype(float)
H,W,_=im.shape
R,G,B=im[...,0],im[...,1],im[...,2]
L=im.mean(2); c=R-B

def pushpull(img, w):
    """fill where w==0 by pyramid push-pull; img HxWxC"""
    levels=[]
    I=img*w[...,None]; Wt=w.astype(float)
    while min(Wt.shape)>2:
        levels.append((I,Wt))
        h2,w2=(Wt.shape[0]+1)//2,(Wt.shape[1]+1)//2
        Ip=np.zeros((h2*2,w2*2,img.shape[2])); Wp=np.zeros((h2*2,w2*2))
        Ip[:I.shape[0],:I.shape[1]]=I; Wp[:Wt.shape[0],:Wt.shape[1]]=Wt
        I=Ip.reshape(h2,2,w2,2,-1).sum((1,3)); Wt=Wp.reshape(h2,2,w2,2).sum((1,3))
    levels.append((I,Wt))
    # pull
    I,Wt=levels[-1]; est=I/np.maximum(Wt,1e-9)[...,None]
    for I,Wt in reversed(levels[:-1]):
        up=np.repeat(np.repeat(est,2,0),2,1)[:Wt.shape[0],:Wt.shape[1]]
        up=ndi.uniform_filter(up,size=(3,3,1))
        a=np.clip(Wt,0,1)[...,None]
        est=a*(I/np.maximum(Wt,1e-9)[...,None])+(1-a)*up
    return est

# initial background guess: bluish-neutral and not too dark
bgw=((c<-1.5)&(L>62)).astype(float)
bgw=ndi.binary_erosion(bgw,iterations=3).astype(float)
for it in range(4):
    bg=pushpull(im,bgw)
    bg=ndi.gaussian_filter(bg,(2,6,0))
    d=im-bg
    dist=np.sqrt((d**2).sum(2))
    dc=c-(bg[...,0]-bg[...,2])
    fg=(dist>22)|(dc>7)|(L<bg.mean(2)-18)
    bgw=(~ndi.binary_dilation(fg,iterations=4)).astype(float)
np.save('bg.npy',bg)
fg=ndi.binary_opening(fg,iterations=1)
fg=ndi.binary_closing(fg,iterations=3)
holes=ndi.binary_fill_holes(fg)&~fg
hl,hn=ndi.label(holes); hs=ndi.sum(holes,hl,range(1,hn+1))
small=np.isin(hl,1+np.nonzero(hs<150)[0])
print('holes',hn,'big holes kept as bg:',sorted(hs[hs>=4000].astype(int)))
cm=ndi.center_of_mass(holes,hl,range(1,hn+1))
for i in np.argsort(hs)[::-1][:20]:
    print('  hole',int(hs[i]),'at x,y=',int(cm[i][1]),int(cm[i][0]))
fg=fg|small
lab,n=ndi.label(fg)
sizes=ndi.sum(fg,lab,range(1,n+1))
order=np.argsort(sizes)[::-1]
print('components',n,'largest',sizes[order[:8]])
keep=np.zeros_like(fg)
for k in order:
    if sizes[k]>2000: keep|=lab==(k+1)
np.save('fg_raw.npy',keep)
ov=im.copy(); ov[keep]=ov[keep]*0.4+np.array([255,0,255])*0.6
Image.fromarray(ov.astype(np.uint8)).save('ov_raw.png')
Image.fromarray((dist*3).clip(0,255).astype(np.uint8)).save('dist.png')
