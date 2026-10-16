import sys, colorsys, math
from PIL import Image, ImageDraw
im = Image.open(sys.argv[1]).convert('RGB'); W,H = im.size
tips = [[0.319, 0.029], [0.354, 0.007], [0.396, 0.002], [0.435, 0.018], [0.470, 0.029], [0.509, 0.075], [0.535, 0.125], [0.560, 0.170], [0.590, 0.215], [0.620, 0.255], [0.650, 0.300]]
rx, ry = 0.019, 0.015
px = im.load()
def cls(c):
    r,g,b = [v/255 for v in c]
    h,l,s = colorsys.rgb_to_hls(r,g,b)
    hh,ss,vv = colorsys.rgb_to_hsv(r,g,b)
    return hh*360, ss, vv
for i,(x,y) in enumerate(tips,1):
    cx, cy = x*W, y*H
    c = px[int(cx), int(cy)]
    h,s,v = cls(c)
    print(i, (round(cx,1), round(cy,1)), 'centre', c, 'hue %.0f sat %.2f val %.2f'%(h,s,v))
# upscale crop
x0,y0,x1,y1 = 100,0,320,190
crop = im.crop((x0,y0,x1,y1)).resize(((x1-x0)*4,(y1-y0)*4), Image.NEAREST)
d = ImageDraw.Draw(crop)
for i,(x,y) in enumerate(tips,1):
    cx, cy = (x*W-x0)*4, (y*H-y0)*4
    a, b = rx*W*4, ry*H*4
    d.ellipse((cx-a, cy-b, cx+a, cy+b), outline=(0,255,255))
    d.ellipse((cx-3,cy-3,cx+3,cy+3), fill=(255,0,255))
    d.text((cx+a+2, cy), str(i), fill=(255,0,0))
crop.save(sys.argv[2])
