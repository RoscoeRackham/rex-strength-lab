import sys
from PIL import Image, ImageDraw, ImageFont
IMG='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
def zoom(x0,y0,x1,y1,s,out,step=10):
    im=Image.open(IMG).convert('RGB').crop((x0,y0,x1,y1))
    im=im.resize(((x1-x0)*s,(y1-y0)*s),Image.NEAREST)
    d=ImageDraw.Draw(im)
    for y in range(y0 - y0%step, y1, step):
        if y<y0: continue
        yy=(y-y0)*s
        d.line([(0,yy),(im.width,yy)],fill=(0,255,255) if y%50 else (255,0,0),width=1)
        d.text((2,yy+1),str(y),fill=(255,255,0))
    for x in range(x0 - x0%step, x1, step):
        if x<x0: continue
        xx=(x-x0)*s
        d.line([(xx,0),(xx,im.height)],fill=(0,255,255) if x%50 else (255,0,0),width=1)
        d.text((xx+1,2),str(x),fill=(255,255,0))
    im.save(out)
if __name__=='__main__':
    a=list(map(int,sys.argv[1:6])); zoom(*a,sys.argv[6],int(sys.argv[7]) if len(sys.argv)>7 else 10)
