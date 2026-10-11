import sys; from PIL import Image, ImageDraw
im=Image.open('/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg').convert('RGB')
x0,y0,x1,y1,sc=map(int,sys.argv[1:6]); out=sys.argv[6]; step=int(sys.argv[7]) if len(sys.argv)>7 else 50
c=im.crop((x0,y0,x1,y1)).resize(((x1-x0)*sc,(y1-y0)*sc))
d=ImageDraw.Draw(c)
for x in range((x0//step+1)*step,x1,step):
    d.line([((x-x0)*sc,0),((x-x0)*sc,(y1-y0)*sc)],fill=(0,255,255) if x%100==0 else (0,120,120))
    d.text(((x-x0)*sc+2,2),str(x),fill=(255,255,0))
for y in range((y0//step+1)*step,y1,step):
    d.line([(0,(y-y0)*sc),((x1-x0)*sc,(y-y0)*sc)],fill=(0,255,255) if y%100==0 else (0,120,120))
    d.text((2,(y-y0)*sc+2),str(y),fill=(255,255,0))
c.save(out)
