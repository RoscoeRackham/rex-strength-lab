# Brightness-weighted dominant frequency of a scalogram crop (log y axis).
# usage: scal.py img y10 y100 x0 x1 ytop ybot
import sys, math
from PIL import Image
img = sys.argv[1]; y10, y100 = float(sys.argv[2]), float(sys.argv[3])
x0, x1, yt, yb = map(int, sys.argv[4:8])
im = Image.open(img).convert('RGB')
rows = {}
for y in range(yt, yb):
    s = 0
    for x in range(x0, x1):
        r, g, b = im.getpixel((x, y))
        s += (0.3*r + 0.59*g + 0.11*b) ** 2  # emphasise bright (energy ~ amplitude^2)
    rows[y] = s
def f(y): return 10 ** (1 + (y10 - y) / (y10 - y100))
tot = sum(rows.values())
mean_logf = sum(math.log10(f(y)) * v for y, v in rows.items()) / tot
ypk = max(rows, key=rows.get)
print('peak row freq %.1f Hz; weighted geometric-mean freq %.1f Hz' % (f(ypk), 10 ** mean_logf))
# quartiles
acc = 0; qs = {}
for y in sorted(rows, reverse=True):  # low freq to high
    acc += rows[y] / tot
    for q in (0.25, 0.5, 0.75):
        if q not in qs and acc >= q: qs[q] = f(y)
print('energy quartiles (Hz):', {k: round(v, 1) for k, v in qs.items()})
