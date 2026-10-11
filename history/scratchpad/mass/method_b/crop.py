import sys
from PIL import Image, ImageDraw
im=Image.open('/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg').convert('RGB')
x0,y0,x1,y1=map(int,sys.argv[1:5]); scale=float(sys.argv[5]); out=sys.argv[6]
grid=int(sys.argv[7]) if len(sys.argv)>7 else 50
c=im.crop((x0,y0,x1,y1))
c=c.resize((int((x1-x0)*scale),int((y1-y0)*scale)),Image.LANCZOS)
d=ImageDraw.Draw(c)
for gx in range((x0//grid+1)*grid,x1,grid):
    X=(gx-x0)*scale; d.line([(X,0),(X,c.height)],fill=(255,0,0) if gx%100==0 else (0,200,255),width=1)
    d.text((X+2,2),str(gx),fill=(255,255,0))
for gy in range((y0//grid+1)*grid,y1,grid):
    Y=(gy-y0)*scale; d.line([(0,Y),(c.width,Y)],fill=(255,0,0) if gy%100==0 else (0,200,255),width=1)
    d.text((2,Y+2),str(gy),fill=(255,255,0))
c.save(out)
