# Review round 2 of pull request 5: the Collide picture's last spike tip (0.619, 0.090) sits on the sky beside its spike.
# Its spike points right: the tip end is the spike's rightmost crest-coloured pixel (rows 52-61, x 270-310: the spike the spot was put on; the next one down ends at about (302, 64)), and the spot
# goes a little inside it, the centroid of the crest-coloured pixels within R px (as for the header's tips).
# Also prints the crest-colour test at each of the ten spots. python3 -I coltip.py <art-unstoppable.jpg> [R]
import sys, colorsys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); W, H = im.size; px = im.load()
R = int(sys.argv[2]) if len(sys.argv) > 2 else 9
def hsv(p):
    h, s, v = colorsys.rgb_to_hsv(*(c / 255 for c in p)); return h * 360, s, v
def crest(p):
    h, s, v = hsv(p); return 12 <= h <= 50 and s >= 0.28 and v >= 0.45
T = lambda x, y: 0 <= x < W and 0 <= y < H and crest(px[x, y])
best = None
for y in range(52, 62):
    for x in range(310, 270, -1):
        if all(T(xx, y) for xx in range(x - 2, x + 1)):
            if not best or x > best[0]: best = (x, y)
            break
x, y = best
pts = [(xx, yy) for yy in range(y - R, y + R + 1) for xx in range(x - R, x + R + 1) if (xx - x) ** 2 + (yy - y) ** 2 <= R * R and T(xx, yy)]
cx = sum(p[0] for p in pts) / len(pts); cy = sum(p[1] for p in pts) / len(pts)
print('tip end', best, 'spot px (%.1f, %.1f) = frac (%.3f, %.3f)' % (cx, cy, cx / W, cy / H), 'rgb', px[round(cx), round(cy)])
tips = [[0.304, 0.047], [0.331, 0.035], [0.362, 0.018], [0.394, 0.010], [0.431, 0.013], [0.452, 0.010], [0.494, 0.023], [0.527, 0.038], [0.560, 0.058], [0.619, 0.090], [round(cx / W, 3), round(cy / H, 3)]]
for fx, fy in tips:
    X, Y = round(fx * W), round(fy * H)
    m = [sum(px[X + dx, Y + dy][i] for dx in (-1, 0, 1) for dy in (-1, 0, 1)) / 9 for i in range(3)]
    print((fx, fy), (X, Y), [round(c) for c in m], 'crest' if crest(m) else 'NOT crest')
