import sys
from PIL import Image, ImageDraw
A='/home/user/rex-strength-lab/rex-strength-lab/assets/'
f, x0, y0, x1, y1, sc = sys.argv[1], *map(int, sys.argv[2:7])
im = Image.open(A+f).convert('RGB')
c = im.crop((x0,y0,x1,y1)).resize(((x1-x0)*sc,(y1-y0)*sc), Image.NEAREST)
d = ImageDraw.Draw(c)
step = 10
for x in range((x0//step)*step, x1, step):
    if x < x0: continue
    X=(x-x0)*sc; d.line([(X,0),(X,c.size[1])], fill=(0,255,255) if x%50 else (255,255,0), width=1)
    if x%50==0: d.text((X+2,2), str(x), fill=(255,255,0))
for y in range((y0//step)*step, y1, step):
    if y < y0: continue
    Y=(y-y0)*sc; d.line([(0,Y),(c.size[0],Y)], fill=(255,0,255) if y%50 else (255,255,0), width=1)
    if y%50==0: d.text((2,Y+2), str(y), fill=(255,255,0))
out = sys.argv[7]
c.save(out); print(out, c.size)
