# Find plot frame and dashed gridlines in a seismogram crop.
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); w, h = im.size
dark_rows = [y for y in range(h) if sum(1 for x in range(w) if sum(im.getpixel((x, y))) < 150) > 0.6 * w]
dark_cols = [x for x in range(w) if sum(1 for y in range(h) if sum(im.getpixel((x, y))) < 150) > 0.4 * h]
print('dark rows', dark_rows); print('dark cols', dark_cols)
x0 = min(c for c in dark_cols if c > w * 0.1) + 3 if dark_cols else 0
x1 = max(dark_cols) - 3
grid = [y for y in range(h) if sum(1 for x in range(x0, x1) if (lambda p: 170 < p[0] < 240 and abs(p[0]-p[1]) < 8)(im.getpixel((x, y)))) > 0.35 * (x1 - x0)]
print('grid rows', grid, 'x0', x0, 'x1', x1)
