# glow-weighted share of each crest glow over the grey backdrop and over tan crest pixels (the review's overlap.py, for
# several candidate lists). python3 -I overlap2.py <dino.jpg> [grow]
import sys, colorsys, math, json
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); W, H = im.size; px = im.load()
L = json.load(open(sys.argv[2]))
grow = float(sys.argv[3]) if len(sys.argv) > 3 else 1.2
def kind(c):
    h, s, v = colorsys.rgb_to_hsv(*[x / 255 for x in c])
    if s < 0.16 and 0.40 < v < 0.62: return 'bg'
    if 15 / 360 <= h <= 50 / 360 and s >= 0.25 and v >= 0.55: return 'tan'
    return 'other'
def alpha(r):
    st = [(0, 0.95), (0.4, 0.8), (0.72, 0.35), (1, 0)]
    if r >= 1: return 0
    for (a, va), (b, vb) in zip(st, st[1:]):
        if a <= r <= b: return va + (vb - va) * (r - a) / (b - a)
rx, ry = 0.019 * W * grow, 0.015 * H * grow
for name, pts in L.items():
    row = []
    for i, (x, y) in enumerate(pts, 1):
        cx, cy = x * W, y * H; tot = {'bg': 0, 'tan': 0, 'other': 0}; T = 0
        for yy in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for xx in range(int(cx - rx) - 1, int(cx + rx) + 2):
                if not (0 <= xx < W and 0 <= yy < H): continue
                a = alpha(math.hypot((xx + 0.5 - cx) / rx, (yy + 0.5 - cy) / ry))
                if a > 0: tot[kind(px[xx, yy])] += a; T += a
        row.append('%2d bg %2.0f tan %2.0f' % (i, 100 * tot['bg'] / T, 100 * tot['tan'] / T))
    print('---', name, 'grow', grow); print('  ' + ' | '.join(row))
