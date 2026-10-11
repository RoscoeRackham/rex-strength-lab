# Count the circles in Kouri 1995 Fig. 2 and Fig. 3 (dot-plot histograms).
# Method: crop the plotting area (right of the y-axis), find text rows by horizontal
# projection, then count runs of dark columns in each row (one run per circle).
import sys
import numpy as np
from PIL import Image

def runs(mask):
    r = 0; prev = False; spans = []
    start = 0
    for i, v in enumerate(mask):
        if v and not prev: start = i
        if not v and prev: spans.append((start, i))
        prev = v
    if prev: spans.append((start, len(mask)))
    return spans

def count(path, box, label):
    im = Image.open(path).convert('L')
    w, h = im.size
    crop = np.array(im.crop((int(box[0]*w), int(box[1]*h), int(box[2]*w), int(box[3]*h))))
    dark = crop < 150
    rowproj = dark.sum(axis=1) > 0
    bands = [b for b in runs(rowproj) if 8 <= b[1]-b[0] <= 40]
    out = []
    for (y0, y1) in bands:
        colproj = dark[y0:y1].sum(axis=0) > 0
        spans = [s for s in runs(colproj) if (s[1]-s[0]) >= 6]
        # split into left/right groups by the biggest gap
        if not spans: continue
        mids = [(a+b)/2 for a, b in spans]
        out.append((y0+box[1]*h, [int(m) for m in mids]))
    return out, crop.shape[1]

for path, box, label in [(sys.argv[1], (0.17, 0.34, 0.62, 0.92), 'fig2'), (sys.argv[2], (0.40, 0.08, 0.86, 0.60), 'fig3')]:
    res, cw = count(path, box, label)
    for y, mids in res:
        left = [m for m in mids if m < cw*0.5]
        right = [m for m in mids if m >= cw*0.5]
        print(label, 'y=%d' % y, 'left', len(left), 'right', len(right))
