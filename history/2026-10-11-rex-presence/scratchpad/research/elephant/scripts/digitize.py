# Digitize extreme values of the grey (102,102,102) trace inside a plot frame.
# usage: digitize.py img y_zero y_ref ref_value x0 x1 ytop ybot
import sys
from PIL import Image
img = sys.argv[1]
yz, yr, rv = float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
x0, x1, yt, yb = map(int, sys.argv[5:9])
im = Image.open(img).convert('RGB')
scale = rv / (yz - yr)
def is_trace(p):
    return abs(p[0]-p[1]) < 10 and abs(p[1]-p[2]) < 10 and 80 <= p[0] <= 130
peaks = []
top, bot = None, None
for x in range(x0, x1):
    ys = [y for y in range(yt, yb) if is_trace(im.getpixel((x, y)))]
    if ys:
        hi = (yz - min(ys)) * scale; lo = (yz - max(ys)) * scale
        peaks.append((x, hi, lo))
his = sorted([p[1] for p in peaks], reverse=True)
los = sorted([p[2] for p in peaks])
print('max +%.3g  min %.3g' % (his[0], los[0]))
# per-footfall local maxima of |u|: report top 12 column envelope values (distinct, >10 px apart)
env = [(x, max(abs(h), abs(l))) for x, h, l in peaks]
env.sort(key=lambda t: -t[1])
chosen = []
for x, v in env:
    if all(abs(x - c[0]) > 25 for c in chosen):
        chosen.append((x, v))
    if len(chosen) >= 12: break
print('top distinct |u| peaks:', ['%.2g' % v for x, v in chosen])
import statistics
print('median of top 12: %.3g' % statistics.median([v for x, v in chosen]))
