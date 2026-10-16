import sys, colorsys, math
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); W,H = im.size; px = im.load()
cur = [[0.319, 0.029], [0.354, 0.007], [0.396, 0.002], [0.435, 0.018], [0.470, 0.029], [0.509, 0.075], [0.535, 0.125], [0.560, 0.170], [0.590, 0.215], [0.620, 0.255], [0.650, 0.300]]
new = [[0.322, 0.045], [0.356, 0.023], [0.396, 0.013], [0.435, 0.029], [0.475, 0.054], [0.493, 0.081]] + cur[6:]
def kind(c):
    h,s,v = colorsys.rgb_to_hsv(*[x/255 for x in c])
    if s < 0.16 and 0.40 < v < 0.62: return 'bg'
    if 15/360 <= h <= 50/360 and s >= 0.25 and v >= 0.55: return 'tan'
    return 'other'
# glow alpha profile (closest-side radial gradient): stops 0:0.95, .4:0.8, .72:0.35, 1:0
def alpha(r):
    st=[(0,0.95),(0.4,0.8),(0.72,0.35),(1,0)]
    if r>=1: return 0
    for (a,va),(b,vb) in zip(st,st[1:]):
        if a<=r<=b: return va+(vb-va)*(r-a)/(b-a)
grow=float(sys.argv[2]) if len(sys.argv)>2 else 1.2
rx,ry=0.019*W*grow,0.015*H*grow
for name,pts in (('current',cur),('proposed',new)):
    print('---',name,'grow',grow)
    for i,(x,y) in enumerate(pts,1):
        cx,cy=x*W,y*H; tot={'bg':0,'tan':0,'other':0}; T=0
        for yy in range(int(cy-ry)-1,int(cy+ry)+2):
            for xx in range(int(cx-rx)-1,int(cx+rx)+2):
                if not (0<=xx<W and 0<=yy<H): continue
                r=math.hypot((xx+0.5-cx)/rx,(yy+0.5-cy)/ry); a=alpha(r)
                if a<=0: continue
                tot[kind(px[xx,yy])]+=a; T+=a
        c=px[min(W-1,int(cx)),min(H-1,int(cy))]
        print('tip %2d (%5.3f,%5.3f) px(%3d,%3d)=%s %-5s  bg %3.0f%%  tan %3.0f%%  other %3.0f%%'%(i,x,y,int(cx),int(cy),c,kind(c),100*tot['bg']/T,100*tot['tan']/T,100*tot['other']/T))
