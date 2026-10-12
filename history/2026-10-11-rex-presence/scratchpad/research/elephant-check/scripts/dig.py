import sys
from PIL import Image
import numpy as np
# usage: dig.py png x0 y0 x1 y1  (crop box containing one seismogram axes)
f=sys.argv[1]; x0,y0,x1,y1=map(int,sys.argv[2:6])
im=np.asarray(Image.open(f).convert('RGB')).astype(int)[y0:y1,x0:x1]
r,g,b=im[...,0],im[...,1],im[...,2]
gray=(abs(r-g)<12)&(abs(g-b)<12)
# trace gray ~ (100,100,100); gridlines light gray ~ (176..200)
trace=gray&(r>70)&(r<130)
black=(r<40)&(g<40)&(b<40)
# axes box: find rows/cols with many black pixels
rows=black.sum(1); cols=black.sum(0)
H,W=black.shape
top=[i for i in range(H) if rows[i]>0.6*W]; left=[j for j in range(W) if cols[j]>0.5*H]
print('box rows',top[:3],top[-3:],'box cols',left[:3],left[-3:])
# gridlines: light gray dashed rows
lg=gray&(r>150)&(r<225)
lrows=lg.sum(1)
cand=[i for i in range(H) if lrows[i]>0.15*W]
print('gridline rows',cand)
# trace extents
tr_rows=[i for i in range(H) if trace[i].sum()>0]
print('trace top row',min(tr_rows),'bottom row',max(tr_rows))
# per-column extremes
colsT=np.where(trace.any(0))[0]
tops=np.array([np.where(trace[:,j])[0].min() for j in colsT])
bots=np.array([np.where(trace[:,j])[0].max() for j in colsT])
np.save('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/elephant-check/dl/_cols.npy',np.vstack([colsT,tops,bots]))
