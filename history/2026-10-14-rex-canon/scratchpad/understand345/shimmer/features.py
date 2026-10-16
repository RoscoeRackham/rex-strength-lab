import sys, colorsys
from PIL import Image
M = sys.argv[1]
def load(f):
    im = Image.open(M + '/assets/' + f).convert('RGB'); return im, im.load(), im.size
def hsv(p):
    h, s, v = colorsys.rgb_to_hsv(*(c / 255 for c in p)); return h * 360, s, v
def centroid(px, box, test):
    x0, y0, x1, y1 = box; n = sx = sy = 0; xs = []; ys = []
    for y in range(y0, y1):
        for x in range(x0, x1):
            if test(px[x, y]): n += 1; sx += x; sy += y; xs.append(x); ys.append(y)
    if not n: return None
    return dict(n=n, cx=sx / n, cy=sy / n, x=(min(xs), max(xs)), y=(min(ys), max(ys)))
fr = lambda W, H, x, y: '(%.3f, %.3f)' % (x / W, y / H)

# ---------------- dino.jpg
im, px, (W, H) = load('dino.jpg')
iris = lambda p: (lambda h, s, v: 20 <= h <= 50 and s > 0.45 and v > 0.45)(*hsv(p))
for name, box in [('eye, viewer right (his left)', (160, 80, 210, 130)), ('eye, viewer left (his right)', (85, 88, 120, 128))]:
    c = centroid(px, box, iris)
    print('dino', name, 'px centre (%.0f, %.0f)' % (c['cx'], c['cy']), 'frac', fr(W, H, c['cx'], c['cy']), 'x', c['x'], 'y', c['y'], 'n', c['n'])
teeth = lambda p: (lambda h, s, v: 20 <= h <= 50 and 0.12 < s < 0.5 and v > 0.7)(*hsv(p))
c = centroid(px, (80, 140, 200, 185), teeth)
print('dino teeth', 'px centre (%.0f, %.0f)' % (c['cx'], c['cy']), 'frac', fr(W, H, c['cx'], c['cy']), 'x', c['x'], 'y', c['y'], 'n', c['n'], ' -> box frac x %.3f-%.3f y %.3f-%.3f' % (c['x'][0]/W, c['x'][1]/W, c['y'][0]/H, c['y'][1]/H))
# silhouette top: background gray (low sat, v 0.4-0.65). crest tips: local minima of the top edge, x 110-300
bg = lambda p: (lambda h, s, v: s < 0.12 and 0.35 < v < 0.7)(*hsv(p))
top = {}
for x in range(100, 300):
    for y in range(0, 220):
        if not bg(px[x, y]):
            # require 3 consecutive non-bg pixels
            if all(not bg(px[x, yy]) for yy in range(y, min(y + 3, H))): top[x] = y; break
xs = sorted(top)
tips = []
for i in range(4, len(xs) - 4):
    x = xs[i]; y = top[x]
    win = [top[xs[j]] for j in range(i - 4, i + 5)]
    if y == min(win) and (not tips or x - tips[-1][0] > 6): tips.append((x, y))
print('dino crest top-edge minima (px):', tips)
print('dino crest tips frac:', ['(%.3f,%.3f)' % (x / W, y / H) for x, y in tips])
# the orange-tipped crest: tan pixels (hue 25-45, sat 0.3-0.75, v>0.6) above y 200, outside the face boxes
tan = lambda p: (lambda h, s, v: 22 <= h <= 48 and 0.3 < s and v > 0.6)(*hsv(p))
pts = [(x, y) for y in range(0, 200) for x in range(100, 300) if tan(px[x, y]) and not (85 <= x <= 210 and 80 <= y <= 185)]
print('dino tan crest pixels', len(pts), 'x range', min(p[0] for p in pts), max(p[0] for p in pts), 'y range', min(p[1] for p in pts), max(p[1] for p in pts))
# bucket by y bands of 20
for y0 in range(0, 200, 20):
    b = [p for p in pts if y0 <= p[1] < y0 + 20]
    if b: print('   y %3d-%3d: n %4d x %3d-%3d mean x %.0f' % (y0, y0 + 19, len(b), min(p[0] for p in b), max(p[0] for p in b), sum(p[0] for p in b) / len(b)))

# ---------------- art-unstoppable.jpg
im, px, (W, H) = load('art-unstoppable.jpg')
eye = lambda p: (lambda h, s, v: 30 <= h <= 55 and s > 0.6 and v > 0.6)(*hsv(p))
for name, box in [('eye, viewer right (his left)', (235, 135, 310, 175)), ('eye, viewer left (his right)', (65, 205, 115, 250))]:
    c = centroid(px, box, eye)
    print('unstoppable', name, 'px centre (%.0f, %.0f)' % (c['cx'], c['cy']), 'frac', fr(W, H, c['cx'], c['cy']), 'x', c['x'], 'y', c['y'], 'n', c['n'])
# teeth: bright yellow-orange in a band along the mouth
tooth = lambda p: (lambda h, s, v: 25 <= h <= 55 and s > 0.4 and v > 0.65)(*hsv(p))
pts = [(x, y) for y in range(220, 340) for x in range(100, 340) if tooth(px[x, y])]
print('unstoppable teeth pixels', len(pts))
for x0 in range(100, 340, 20):
    b = [p for p in pts if x0 <= p[0] < x0 + 20]
    if b: print('   x %3d-%3d: n %4d y %3d-%3d mean y %.0f' % (x0, x0 + 19, len(b), min(p[1] for p in b), max(p[1] for p in b), sum(p[1] for p in b) / len(b)))
# crest tips: top edge of the dark mass against the sky (sky: v > 0.55 and (b > r or s < 0.35))
sky = lambda p: (lambda h, s, v: v > 0.55 and (p[2] >= p[0] - 10 or s < 0.3))(*hsv(p))
top = {}
for x in range(90, 360):
    for y in range(0, 200):
        if not sky(px[x, y]) and all(not sky(px[x, yy]) for yy in range(y, y + 4)): top[x] = y; break
xs = sorted(top); tips = []
for i in range(5, len(xs) - 5):
    x = xs[i]; y = top[x]; win = [top[xs[j]] for j in range(i - 5, i + 6)]
    if y == min(win) and (not tips or x - tips[-1][0] > 8): tips.append((x, y))
print('unstoppable crest top-edge minima (px):', tips)
print('unstoppable crest tips frac:', ['(%.3f,%.3f)' % (x / W, y / H) for x, y in tips])
