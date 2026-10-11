from PIL import Image
import numpy as np, json, sys
from collections import deque

def largest_component(m):
    H,W = m.shape
    lab = np.zeros((H,W), np.int32); best=(0,0); cur=0
    for y0 in range(H):
        row = m[y0]
        for x0 in np.nonzero(row & (lab[y0]==0))[0]:
            if lab[y0,x0]: continue
            cur+=1; q=deque([(y0,x0)]); lab[y0,x0]=cur; n=0
            while q:
                y,x=q.popleft(); n+=1
                for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
                    yy,xx=y+dy,x+dx
                    if 0<=yy<H and 0<=xx<W and m[yy,xx] and not lab[yy,xx]:
                        lab[yy,xx]=cur; q.append((yy,xx))
            if n>best[0]: best=(n,cur)
    return lab==best[1]

def fill_holes(m):
    H,W=m.shape; bg=np.zeros_like(m); q=deque()
    for x in range(W):
        for y in (0,H-1):
            if not m[y,x] and not bg[y,x]: bg[y,x]=1; q.append((y,x))
    for y in range(H):
        for x in (0,W-1):
            if not m[y,x] and not bg[y,x]: bg[y,x]=1; q.append((y,x))
    while q:
        y,x=q.popleft()
        for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
            yy,xx=y+dy,x+dx
            if 0<=yy<H and 0<=xx<W and not m[yy,xx] and not bg[yy,xx]:
                bg[yy,xx]=1; q.append((yy,xx))
    return ~bg

def moore(m):
    H,W=m.shape
    ys,xs=np.nonzero(m); i=np.lexsort((xs,ys))[0]; start=(ys[i],xs[i])
    nb=[(-1,0),(-1,1),(0,1),(1,1),(1,0),(1,-1),(0,-1),(-1,-1)]
    pts=[start]; cur=start; d=6  # came from west
    for _ in range(200000):
        found=False
        for k in range(8):
            dd=(d+1+k)%8  # search clockwise starting after backtrack
            y=cur[0]+nb[dd][0]; x=cur[1]+nb[dd][1]
            if 0<=y<H and 0<=x<W and m[y,x]:
                cur=(y,x); d=(dd+4)%8; found=True; break
        if not found: break
        if cur==start: break
        pts.append(cur)
    return pts

def rdp(p, eps):
    p=np.array(p,float)
    def rec(a,b):
        if b<=a+1: return [a]
        A=p[a];B=p[b];AB=B-A;L=np.hypot(*AB)
        seg=p[a+1:b]
        if L==0: d=np.hypot(*(seg-A).T)
        else: d=np.abs(AB[0]*(seg[:,1]-A[1])-AB[1]*(seg[:,0]-A[0]))/L
        i=int(np.argmax(d))
        if d[i]>eps: return rec(a,a+1+i)+rec(a+1+i,b)
        return [a]
    idx=rec(0,len(p)-1)+[len(p)-1]
    return p[idx]

name, x0,x1,y0,y1 = sys.argv[1], *map(int, sys.argv[2:6])
im=Image.open(f'/home/user/rex-strength-lab/build-comparison/assets/{name}-turnaround.png').convert('RGB').crop((x0,y0,x1,y1))
hsv=np.array(im.convert('HSV')).astype(int)
S,V=hsv[...,1],hsv[...,2]
m=(S>int(sys.argv[6]))|(V<int(sys.argv[7]))
m=largest_component(m); m=fill_holes(m)
from PIL import ImageFilter
mi=Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(float(sys.argv[8]) if len(sys.argv)>8 else 3))
m=np.array(mi)>127
m=largest_component(m); m=fill_holes(m)
Image.fromarray((m*255).astype(np.uint8)).save(f'mask-{name}.png')
ys,xs=np.nonzero(m); print(name,'bbox y',ys.min(),ys.max(),'x',xs.min(),xs.max())
# width profile
for y in range(ys.min(), ys.max()+1, 10):
    r=np.nonzero(m[y])[0]; print(y, r.min() if len(r) else '-', r.max() if len(r) else '-', len(r))
pts=moore(m)
s=rdp([(x,y) for y,x in pts], float(sys.argv[9]) if len(sys.argv)>9 else 1.6)
json.dump({'name':name,'crop':[x0,y0,x1,y1],'bbox':[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())],'pts':[[round(a,1),round(b,1)] for a,b in s]}, open(f'trace-{name}.json','w'))
print('points',len(pts),'->',len(s))
