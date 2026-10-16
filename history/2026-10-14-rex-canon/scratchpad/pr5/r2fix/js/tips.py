# Review round 2 of pull request 5, design-crest-tips-off-feathers: measure the header picture's crest-feather tips from
# assets/dino.jpg. Crest-coloured (tan or orange) pixels; the top crest's tip ends (local tops of the tan mask's top edge)
# and the neck fringe's tip ends (local right ends of its right edge); each spot moved a little inside its tip: the
# centroid of the tan pixels within R px of the tip end. python3 -I tips.py <dino.jpg> [out.png]
import sys, colorsys, math
from PIL import Image, ImageDraw
im = Image.open(sys.argv[1]).convert('RGB'); W, H = im.size; px = im.load()
def hsv(p):
    h, s, v = colorsys.rgb_to_hsv(*(c / 255 for c in p)); return h * 360, s, v
# crest-coloured: warm hue, clearly saturated (the grey backdrop is s 0.10-0.18; the tan tips 0.35-0.55)
def tan(p):
    h, s, v = hsv(p); return 12 <= h <= 50 and s >= 0.28 and v >= 0.45
T = lambda x, y: 0 <= x < W and 0 <= y < H and tan(px[x, y])
# the top crest: x 125-212 (at x 213 the top edge drops 11 px to the neck fringe); a column's top is its first tan pixel
# with 3 tan pixels under it; a tip end is a top no higher than any within 5 columns. The leftmost feather's top meets the
# next feather's flank in the tan mask, so its tip end is the top of its own columns (x 130-142)
top = {}
for x in range(125, 213):
    for y in range(0, 50):
        if all(T(x, yy) for yy in range(y, y + 3)): top[x] = y; break
xs = sorted(top); ends = []
xl = min(range(130, 143), key=lambda x: (top.get(x, 99), x)); ends.append((xl, top[xl], 'top'))
for i in range(len(xs)):
    x = xs[i]; y = top[x]; win = [top[xs[j]] for j in range(max(0, i - 5), min(len(xs), i + 6))]
    if x > 142 and y == min(win) and (not ends or x - ends[-1][0] > 8): ends.append((x, y, 'top'))
# the neck fringe: rows y 36-180; a row's right end is the last tan pixel (3 tan pixels to its left), x 200-305
right = {}
for y in range(36, 181):
    for x in range(305, 200, -1):
        if all(T(xx, y) for xx in range(x - 2, x + 1)): right[y] = x; break
ys = sorted(right); fr = []
for i in range(len(ys)):
    y = ys[i]; x = right[y]; win = [right[ys[j]] for j in range(max(0, i - 6), min(len(ys), i + 7))]
    if x == max(win) and (not fr or y - fr[-1][1] > 10): fr.append((x, y, 'side'))
R = int(sys.argv[3]) if len(sys.argv) > 3 else 7
out = []
for (x, y, k) in ends + fr:
    pts = [(xx, yy) for yy in range(y - R, y + R + 1) for xx in range(x - R, x + R + 1) if (xx - x) ** 2 + (yy - y) ** 2 <= R * R and T(xx, yy)]
    cx = sum(p[0] for p in pts) / len(pts); cy = sum(p[1] for p in pts) / len(pts)
    c = px[round(cx), round(cy)]
    ok9 = sum(T(round(cx) + dx, round(cy) + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1))
    out.append((k, (x, y), (cx, cy), c, ok9))
    print('%-4s tip end (%3d, %3d)  spot px (%.1f, %.1f) = frac (%.3f, %.3f)  rgb %s  hsv %.0f %.2f %.2f  tan in 3x3: %d' % (k, x, y, cx, cy, cx / W, cy / H, c, *hsv(c), ok9))
if len(sys.argv) > 2 and sys.argv[2] != '-':
    x0, y0, x1, y1, S = 110, 0, 300, 190, 5
    crop = im.crop((x0, y0, x1, y1)).resize(((x1 - x0) * S, (y1 - y0) * S), Image.NEAREST); d = ImageDraw.Draw(crop)
    for i, (k, e, (cx, cy), c, ok9) in enumerate(out, 1):
        X, Y = (cx - x0 + 0.5) * S, (cy - y0 + 0.5) * S
        d.ellipse((X - 0.019 * W * S, Y - 0.015 * H * S, X + 0.019 * W * S, Y + 0.015 * H * S), outline=(0, 255, 255))
        d.ellipse((X - 4, Y - 4, X + 4, Y + 4), fill=(255, 0, 255))
        d.ellipse(((e[0] - x0 + 0.5) * S - 3, (e[1] - y0 + 0.5) * S - 3, (e[0] - x0 + 0.5) * S + 3, (e[1] - y0 + 0.5) * S + 3), fill=(255, 255, 0))
        d.text((X + 10, Y - 6), str(i), fill=(255, 0, 0))
    crop.save(sys.argv[2])
