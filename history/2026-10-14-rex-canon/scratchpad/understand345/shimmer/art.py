import sys, colorsys
from PIL import Image
M = sys.argv[1]; S = sys.argv[2]
def mask(f, test, out):
    im = Image.open(M + '/assets/' + f).convert('RGB'); W, H = im.size
    px = im.load(); m = Image.new('L', im.size, 0); mp = m.load()
    for y in range(H):
        for x in range(W):
            r, g, b = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
            if test(h*360, s, v, r, g, b): mp[x, y] = 255
    m.save(S + '/' + out)
    return im, m
# warm saturated bright: hue 20-55, s>0.5, v>0.55 (eyes, crest tips, orange)
warm = lambda h, s, v, r, g, b: 18 <= h <= 55 and s > 0.5 and v > 0.55
for f in ['dino.jpg', 'art-unstoppable.jpg']:
    im, m = mask(f, warm, f.replace('.jpg', '-warm.png'))
    W, H = im.size
    # print a coarse grid (16 px cells) of warm counts
    cell = 16
    print(f, W, H)
    for cy in range(0, H, cell):
        row = ''
        for cx in range(0, W, cell):
            c = sum(1 for y in range(cy, min(cy+cell, H)) for x in range(cx, min(cx+cell, W)) if m.getpixel((x, y)))
            row += ' ' if c == 0 else ('.' if c < 10 else ('o' if c < 60 else '#'))
        print('%4d |%s|' % (cy, row))
