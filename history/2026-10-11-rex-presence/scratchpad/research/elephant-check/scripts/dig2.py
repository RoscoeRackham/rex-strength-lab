import sys
from PIL import Image
import numpy as np
# usage: dig2.py png X0 Y0 X1 Y1 grid_top_row grid_bot_row grid_value  (rows relative to page)
f=sys.argv[1]; x0,y0,x1,y1=map(int,sys.argv[2:6]); gt,gb=map(float,sys.argv[6:8]); gv=float(sys.argv[8])
im=np.asarray(Image.open(f).convert('RGB')).astype(int)[y0:y1,x0:x1]
r,g,b=im[...,0],im[...,1],im[...,2]
gray=(abs(r-g)<15)&(abs(g-b)<15)
trace=gray&(r>60)&(r<140)
zero=(gt+gb)/2-y0; scale=gv/((gb-gt)/2)
cols=np.where(trace.any(0))[0]
tops=np.array([np.where(trace[:,j])[0].min() for j in cols])
bots=np.array([np.where(trace[:,j])[0].max() for j in cols])
up=(zero-tops)*scale; dn=(zero-bots)*scale
print('max %.3g  min %.3g'%(up.max(),dn.min()))
# separate peaks: local maxima of up with min separation ~ 0.15 s
W=len(cols)
order=np.argsort(-up); taken=[]; sep=int(sys.argv[9]) if len(sys.argv)>9 else 30
for i in order:
    if all(abs(cols[i]-cols[k])>sep for k in taken): taken.append(i)
    if len(taken)>=12: break
pk=up[taken]; print('top12 peaks',np.round(pk/ (10**np.floor(np.log10(gv))),2)); print('median top12 %.3g'%np.median(pk))
# line half-thickness estimate: typical vertical run at flat region
