import sys
from PIL import Image
import numpy as np
im=np.array(Image.open(sys.argv[1]).convert('L'))<140
x0=int(sys.argv[2]); x1=int(sys.argv[3]); xs=int(sys.argv[4])
sub=im[:,x0:x1]
rowsum=sub.sum(1)
# find text-row bands
bands=[];inb=False
for y,v in enumerate(rowsum):
    if v>0 and not inb: s=y; inb=True
    elif v==0 and inb:
        bands.append((s,y)); inb=False
for s,e in bands:
    if e-s<8: continue
    col=sub[s:e].sum(0)>0
    runs=[];inr=False
    for x,v in enumerate(col):
        if v and not inr: rs=x; inr=True
        elif not v and inr: runs.append((rs+x0,x+x0)); inr=False
    if inr: runs.append((rs+x0,len(col)+x0))
    runs=[r for r in runs if r[1]-r[0]>=8]
    L=[r for r in runs if r[0]<xs]; R=[r for r in runs if r[0]>=xs]
    print(f"y {s}-{e}: left {len(L)} right {len(R)}  widths {[r[1]-r[0] for r in runs][:4]}")
