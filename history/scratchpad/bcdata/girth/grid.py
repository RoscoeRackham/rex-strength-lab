import sys, numpy as np
from PIL import Image, ImageDraw
IMG='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
x0,y0,x1,y1,sc,step,out=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]),float(sys.argv[5]),int(sys.argv[6]),sys.argv[7]
im=Image.open(IMG).convert('RGB').crop((x0,y0,x1,y1))
im=im.resize((int((x1-x0)*sc),int((y1-y0)*sc)))
d=ImageDraw.Draw(im)
for y in range((y0//step+1)*step,y1,step):
    yy=(y-y0)*sc; d.line([(0,yy),(im.width,yy)],fill=(255,255,0) if y%100 else (255,0,0),width=1); d.text((2,yy-11),str(y),fill=(255,255,0))
for x in range((x0//step+1)*step,x1,step):
    xx=(x-x0)*sc; d.line([(xx,0),(xx,im.height)],fill=(0,255,255) if x%100 else (255,0,0),width=1); d.text((xx+2,2),str(x),fill=(0,255,255))
im.save(out)
