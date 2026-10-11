import sys, pickle, numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
D='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/'
IMG='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
rex_r, ol_r = pickle.load(open(D+'regions.pkl','rb'))
fig,regs=sys.argv[1],sys.argv[2].split(',')
x0,y0,x1,y1,sc,step,out=int(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5]),int(sys.argv[6]),float(sys.argv[7]),int(sys.argv[8]),sys.argv[9]
R=rex_r if fig=='rex' else ol_r
im=np.asarray(Image.open(IMG).convert('RGB')).copy()
cols=[(255,0,0),(0,255,0),(0,128,255),(255,0,255),(255,255,0)]
for i,r in enumerate(regs):
    m=R[r]; edge=m&~ndi.binary_erosion(m)
    im[edge]=cols[i%len(cols)]
img=Image.fromarray(im).crop((x0,y0,x1,y1)); img=img.resize((int((x1-x0)*sc),int((y1-y0)*sc)),Image.NEAREST)
d=ImageDraw.Draw(img)
for y in range((y0//step+1)*step,y1,step):
    yy=(y-y0)*sc; d.line([(0,yy),(img.width,yy)],fill=(255,255,0),width=1); d.text((2,yy-11),str(y),fill=(255,255,0))
for x in range((x0//step+1)*step,x1,step):
    xx=(x-x0)*sc; d.line([(xx,0),(xx,img.height)],fill=(0,255,255),width=1); d.text((xx+2,2),str(x),fill=(0,255,255))
img.save(out)
