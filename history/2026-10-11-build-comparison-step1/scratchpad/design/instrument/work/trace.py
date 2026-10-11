# Mock-grade tracer: turnaround -> flat silhouette paths (front + side), tails split off.
import json, sys, numpy as np
from PIL import Image, ImageDraw

def load_mask(path):
    im = np.asarray(Image.open(path).convert('RGB')).astype(float)/255
    mx = im.max(2); mn = im.min(2)
    sat = np.where(mx > 0, (mx-mn)/np.maximum(mx, 1e-6), 0)
    warm = im[..., 0] - im[..., 2]
    return (sat > 0.22) | (mx < 0.30) | (warm > 0.06)

def shift(m, dy, dx):
    out = np.zeros_like(m)
    H, W = m.shape
    ys = slice(max(dy,0), H+min(dy,0)); yd = slice(max(-dy,0), H+min(-dy,0))
    xs = slice(max(dx,0), W+min(dx,0)); xd = slice(max(-dx,0), W+min(-dx,0))
    out[ys, xs] = m[yd, xd]
    return out

def dilate(m, r):
    out = m.copy()
    for dy in range(-r, r+1):
        for dx in range(-r, r+1):
            if dy*dy+dx*dx <= r*r: out |= shift(m, dy, dx)
    return out

def erode(m, r): return ~dilate(~m, r)

def fill_holes(m):
    img = Image.fromarray((m*255).astype(np.uint8))
    img = Image.fromarray(np.pad(np.asarray(img), 1)).copy()
    ImageDraw.floodfill(img, (0, 0), 128)
    a = np.asarray(img)[1:-1, 1:-1]
    return a != 128

def largest_component(m):
    # keep the biggest 4-connected blob via repeated floodfill labelling on a PIL image
    img = Image.fromarray((m*255).astype(np.uint8))
    a = np.asarray(img).copy()
    best = None; bestn = 0
    ys, xs = np.nonzero(a == 255)
    seen = np.zeros_like(a, bool)
    lab = 10
    work = Image.fromarray(a).copy()
    for y, x in zip(ys[::500], xs[::500]):
        if np.asarray(work)[y, x] != 255: continue
        ImageDraw.floodfill(work, (int(x), int(y)), lab)
        n = (np.asarray(work) == lab).sum()
        if n > bestn: bestn = n; best = lab
        lab += 1
        if lab > 250: break
    return np.asarray(work) == best

DIRS = [(0,1),(1,1),(1,0),(1,-1),(0,-1),(-1,-1),(-1,0),(-1,1)]  # (dy,dx) clockwise from east
def trace(m):
    H, W = m.shape
    ys, xs = np.nonzero(m)
    i = np.argmin(ys*W + xs); y0, x0 = int(ys[i]), int(xs[i])
    pts = [(x0, y0)]
    y, x = y0, x0; d = 6  # came from north
    for _ in range(200000):
        found = False
        for k in range(8):
            nd = (d + 6 + k) % 8   # start looking back-left
            dy, dx = DIRS[nd]
            ny, nx = y+dy, x+dx
            if 0 <= ny < H and 0 <= nx < W and m[ny, nx]:
                y, x, d = ny, nx, nd; found = True; break
        if not found: break
        if (x, y) == (x0, y0) and len(pts) > 2: break
        pts.append((x, y))
    return pts

def rdp(pts, eps):
    n = len(pts); h = n//2
    a = rdp1(pts[:h+1], eps); b = rdp1(pts[h:], eps)
    return np.vstack([a[:-1], b])

def rdp1(pts, eps):
    pts = np.asarray(pts, float)
    def rec(a, b):
        if b <= a+1: return [a]
        p, q = pts[a], pts[b]; v = q-p; L = np.hypot(*v) or 1e-9
        w = pts[a+1:b]-p; d = np.abs(v[0]*w[:,1]-v[1]*w[:,0])/L
        i = int(np.argmax(d))
        if d[i] > eps: return rec(a, a+1+i) + rec(a+1+i, b)
        return [a]
    idx = rec(0, len(pts)-1) + [len(pts)-1]
    return pts[idx]

def poly_mask(shape, poly):
    img = Image.new('L', (shape[1], shape[0]), 0)
    ImageDraw.Draw(img).polygon(poly, fill=255)
    return np.asarray(img) > 0

def to_path(pts, ox, top, sole):
    s = 1000.0/(sole-top)
    out = []
    for i, (x, y) in enumerate(pts):
        out.append(('M' if i == 0 else 'L') + f"{(x-ox)*s:.0f},{(y-top)*s:.0f}")
    return ''.join(out) + 'Z'

def view(mask, x0, x1, tail_poly=None, eps=2.4):
    m = np.zeros_like(mask); m[:, x0:x1] = mask[:, x0:x1]
    m = erode(dilate(m, 2), 2)
    m = fill_holes(m)
    m = largest_component(m)
    tail = None
    if tail_poly:
        pm = poly_mask(m.shape, tail_poly)
        tail = m & pm
        body = largest_component(m & ~pm)
        tail = largest_component(tail) if tail.any() else None
    else:
        body = m
    return body, tail

def run(path, spec):
    mask = load_mask(path)
    H = mask.shape[0]
    mask[spec.get('crop_bottom', H):, :] = False
    out = {}
    for name, v in spec['views'].items():
        body, tail = view(mask, v['x0'], v['x1'], v.get('tail'))
        ys, xs = np.nonzero(body)
        sole = ys.max(); top = ys.min()
        skull = v['skull']
        ox = v.get('cx', (xs.min()+xs.max())/2)
        s = 1000.0/(sole-skull)
        rec = {'top_px': int(top), 'skull_px': skull, 'sole_px': int(sole),
               'body': to_path(rdp(trace(body), 2.4), ox, skull, sole),
               'xmin': round((xs.min()-ox)*s), 'xmax': round((xs.max()-ox)*s), 'ytop': round((top-skull)*s)}
        if tail is not None:
            ty, tx = np.nonzero(tail)
            rec['tail'] = to_path(rdp(trace(tail), 2.4), ox, skull, sole)
            rec['xmin'] = min(rec['xmin'], round((tx.min()-ox)*s)); rec['xmax'] = max(rec['xmax'], round((tx.max()-ox)*s))
        out[name] = rec
        Image.fromarray(((body*1 + (tail if tail is not None else 0)*2)*120).astype(np.uint8)).save(f"{spec['id']}-{name}-split.png")
    return out

REX = {'id': 'rex', 'views': {
    'front': {'x0': 0, 'x1': 660, 'skull': 42, 'tail': [(296,612),(322,600),(346,597),(370,600),(394,612),(394,640),(376,712),(318,712),(296,668)]},
    'side':  {'x0': 1320, 'x1': 1941, 'skull': 40, 'cx': 1460, 'tail': [(1548,300),(1941,300),(1941,810),(1575,810),(1552,640),(1560,470)]},
}}
OLLIE = {'id': 'ollie', 'crop_bottom': 790, 'views': {
    'front': {'x0': 0, 'x1': 690, 'skull': 38},
    'side':  {'x0': 1280, 'x1': 1860, 'skull': 36, 'cx': 1580, 'tail': [(1290,330),(1468,330),(1458,470),(1452,720),(1290,720)]},
}}
res = {'rex': run('/home/user/rex-strength-lab/build-comparison/assets/rex-turnaround.png', REX),
       'ollie': run('/home/user/rex-strength-lab/build-comparison/assets/ollie-turnaround.png', OLLIE)}
json.dump(res, open('duo-paths.json', 'w'))
for k, v in res.items():
    for n, r in v.items(): print(k, n, {kk: vv for kk, vv in r.items() if kk not in ('body', 'tail')}, len(r['body']), len(r.get('tail', '')))
