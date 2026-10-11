import sys
from PIL import Image, ImageDraw
im=Image.open('/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg').convert('RGB')
x0,y0,x1,y1,sc,step,out=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]),float(sys.argv[5]),int(sys.argv[6]),sys.argv[7]
c=im.crop((x0,y0,x1,y1)).resize((int((x1-x0)*sc),int((y1-y0)*sc)),Image.LANCZOS)
d=ImageDraw.Draw(c)
for x in range((x0//step+1)*step,x1,step):
    X=(x-x0)*sc; d.line([(X,0),(X,c.size[1])],fill=(0,255,0) if x%(step*5)==0 else (255,255,0),width=1)
    d.text((X+2,2),str(x),fill=(0,255,0))
for y in range((y0//step+1)*step,y1,step):
    Y=(y-y0)*sc; d.line([(0,Y),(c.size[0],Y)],fill=(0,255,0) if y%(step*5)==0 else (255,255,0),width=1)
    d.text((2,Y+2),str(y),fill=(0,255,0))
c.save(out)
