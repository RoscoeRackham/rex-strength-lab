import sys; from PIL import Image, ImageDraw; import numpy as np
from scipy import ndimage as ndi
IMG='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
im=np.asarray(Image.open(IMG).convert('RGB')).copy()
mfile=sys.argv[1]; x0,y0,x1,y1,scale=map(int,sys.argv[2:7]); out=sys.argv[7]
m=np.load(mfile)
if m.dtype!=bool:
    cols={1:(0,255,0),2:(255,0,255)}
    for k,col in cols.items():
        mk=m==k; edge=mk&~ndi.binary_erosion(mk); im[edge]=col
else:
    edge=m&~ndi.binary_erosion(m); im[edge]=(0,255,0)
c=Image.fromarray(im).crop((x0,y0,x1,y1)); c=c.resize(((x1-x0)*scale,(y1-y0)*scale),Image.NEAREST)
d=ImageDraw.Draw(c)
step=10 if (x1-x0)<=200 else 20
for x in range((x0//step+1)*step,x1,step):
    d.line([((x-x0)*scale,0),((x-x0)*scale,5)],fill=(255,0,0))
    if x%(step*2)==0: d.text(((x-x0)*scale+1,6),str(x),fill=(255,255,0))
for y in range((y0//step+1)*step,y1,step):
    d.line([(0,(y-y0)*scale),(5,(y-y0)*scale)],fill=(255,0,0))
    if y%(step*2)==0: d.text((7,(y-y0)*scale-5),str(y),fill=(255,255,0))
c.save(out)
