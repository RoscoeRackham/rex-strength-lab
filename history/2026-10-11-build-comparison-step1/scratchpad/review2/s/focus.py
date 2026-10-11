import json, sys
from PIL import Image, ImageChops
R='/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2/focus/'
meta=json.load(open(R+'meta.json'))
for m in meta:
    a=Image.open(R+m['f']+'-a.png').convert('RGB'); b=Image.open(R+m['f']+'-b.png').convert('RGB')
    if a.size!=b.size: print(m['f'],'size differs'); continue
    d=ImageChops.difference(a,b).convert('L').point(lambda v: 255 if v>40 else 0)
    W,H=d.size; x0,y0,w,h=m['rect']['x'],m['rect']['y'],m['rect']['w'],m['rect']['h']
    px=d.load()
    def frac(points):
        pts=[(int(x),int(y)) for x,y in points if 0<=x<W and 0<=y<H]
        if not pts: return None
        return sum(1 for x,y in pts if px[x,y])/len(pts)
    # ring band: from 6px inside to 5px outside the border; side covered if any pixel in the band row/col changed
    res={}
    for side in ['top','bottom','left','right']:
        hits=0; n=0
        if side in ('top','bottom'):
            ys=[y0+o for o in range(-5,7)] if side=='top' else [y0+h-o for o in range(-5,7)]
            for x in range(int(x0+6), int(x0+w-6)):
                n+=1
                if any(0<=int(y)<H and 0<=x<W and px[x,int(y)] for y in ys): hits+=1
        else:
            xs=[x0+o for o in range(-5,7)] if side=='left' else [x0+w-o for o in range(-5,7)]
            for y in range(int(y0+6), int(y0+h-6)):
                n+=1
                if any(0<=int(x)<W and 0<=y<H and px[int(x),y] for x in xs): hits+=1
        res[side]=round(hits/max(n,1),2)
    flag='' if min(res.values())>0.9 else '  <-- partial'
    print(m['f'], 'fv' if m['fv'] else 'NO-fv', res, flag)
