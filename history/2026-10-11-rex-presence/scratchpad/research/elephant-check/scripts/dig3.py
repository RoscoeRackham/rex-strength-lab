import sys
from PIL import Image
import numpy as np
# dig3.py png page_xa page_xb box_top box_bot [g_hi_val g_lo_val] ; finds frame, gridlines, measures trace
f=sys.argv[1]; xa,xb,bt,bb=map(int,sys.argv[2:6])
im=np.asarray(Image.open(f).convert('RGB')).astype(int)
band=im[bt+4:bb-3]
blk=(band.sum(2)<150)
cols=np.where(blk[:,xa:xb].sum(0)>0.8*band.shape[0])[0]+xa
L=cols.min()+3; R=cols.max()-3
sub=im[bt+4:bb-3, L:R]
r,g,b=sub[...,0],sub[...,1],sub[...,2]
gray=(abs(r-g)<15)&(abs(g-b)<15)
lg=gray&(r>150)&(r<235)
lrows=np.where(lg.sum(1)>0.2*(R-L))[0]+bt+4
grp=[]
for x in lrows:
    if grp and x-grp[-1][-1]<=2: grp[-1].append(x)
    else: grp.append([x])
gl=[np.mean(gg) for gg in grp]
print('frame cols',L-3,R+3,'gridlines',gl)
if len(sys.argv)>6:
    vals=list(map(float,sys.argv[6:]))
    # map: linear fit row->value using gridlines in order (top first) with provided values
    p=np.polyfit(gl[:len(vals)],vals,1)
    tr=gray&(r>60)&(r<140)
    cc=np.where(tr.any(0))[0]
    tops=np.array([np.where(tr[:,j])[0].min() for j in cc])+bt+4
    bots=np.array([np.where(tr[:,j])[0].max() for j in cc])+bt+4
    up=np.polyval(p,tops); dn=np.polyval(p,bots)
    sep=int(0.15*(R-L)/10)  # 0.15 s
    order=np.argsort(-up); taken=[]
    for i in order:
        if all(abs(cc[i]-cc[k])>sep for k in taken): taken.append(i)
        if len(taken)>=12: break
    print('max %.3g min %.3g median-top12 %.3g ; top12 %s'%(up.max(),dn.min(),np.median(up[taken]),np.round(up[taken]/abs(vals[0]),2)))
    print('px per unit %.2f, half-line ~2px = %.2g'%(abs(1/p[0]), 2*abs(p[0])))
