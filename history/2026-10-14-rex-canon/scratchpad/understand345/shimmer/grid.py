import sys
from PIL import Image, ImageDraw
M, S, f, x0, y0, x1, y1, sc, step = sys.argv[1], sys.argv[2], sys.argv[3], *map(int, sys.argv[4:10])
im = Image.open(M + '/assets/' + f).convert('RGB')
W, H = im.size
c = im.crop((x0, y0, x1, y1)).resize(((x1 - x0) * sc, (y1 - y0) * sc), Image.NEAREST)
d = ImageDraw.Draw(c)
for x in range((x0 // step) * step, x1, step):
    if x < x0: continue
    X = (x - x0) * sc; d.line([(X, 0), (X, c.size[1])], fill=(0, 255, 255), width=1); d.text((X + 2, 2), str(x), fill=(0, 255, 255))
for y in range((y0 // step) * step, y1, step):
    if y < y0: continue
    Y = (y - y0) * sc; d.line([(0, Y), (c.size[0], Y)], fill=(255, 0, 255), width=1); d.text((2, Y + 2), str(y), fill=(255, 0, 255))
out = S + '/' + f.replace('.jpg', '') + '-crop-%d-%d.png' % (x0, y0)
c.save(out); print(out, c.size)
