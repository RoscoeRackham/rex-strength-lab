import sys
from PIL import Image, ImageDraw
S = sys.argv[1]
def mont(names, out, scale=2):
    ims = [Image.open(S + '/shots/' + n).convert('RGB') for n in names]
    ims = [im.resize((im.width * scale, im.height * scale), Image.NEAREST) for im in ims]
    W = sum(i.width for i in ims) + 10 * (len(ims) - 1); H = max(i.height for i in ims) + 20
    m = Image.new('RGB', (W, H), (255, 255, 255)); d = ImageDraw.Draw(m); x = 0
    for n, i in zip(names, ims):
        m.paste(i, (x, 20)); d.text((x + 2, 4), n.replace('.png', ''), fill=(0, 0, 0)); x += i.width + 10
    m.save(S + '/work/' + out)
for w, sc in [('1280', 2), ('390', 3)]:
    mont(['%s-hero-%s-light.png' % (n, w) for n in ['none', 'carleast', 'stomp9', 'sun']], 'hero-%s.png' % w, sc)
    mont(['%s-col-%s-light.png' % (n, w) for n in ['none', 'carleast', 'charge', 'full']], 'col-%s.png' % w, 1 if w == '1280' else 1)
mont(['%s-hero-1280-dark.png' % n for n in ['none', 'stomp9', 'sun']], 'hero-1280-dark.png', 2)
mont(['%s-col-390-dark.png' % n for n in ['none', 'charge', 'full']], 'col-390-dark.png', 1)
print('ok')
