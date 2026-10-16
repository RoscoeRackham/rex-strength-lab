import sys
from PIL import Image, ImageDraw
M, S = sys.argv[1], sys.argv[2]
SPEC = {
 'dino.jpg': dict(eyes=[(0.421, 0.188, 0.034), (0.229, 0.196, 0.018)], mouth=(0.204, 0.251, 0.417, 0.319),
   tips=[(0.319, 0.029), (0.354, 0.007), (0.396, 0.002), (0.435, 0.018), (0.470, 0.029), (0.509, 0.075), (0.535, 0.125), (0.560, 0.170), (0.590, 0.215), (0.620, 0.255), (0.650, 0.300)]),
 'art-unstoppable.jpg': dict(eyes=[(0.557, 0.248, 0.034), (0.194, 0.355, 0.028)], mouth=None,
   mouthline=[(0.240, 0.488), (0.333, 0.452), (0.417, 0.433), (0.500, 0.418), (0.583, 0.400), (0.667, 0.375)],
   tips=[(0.304, 0.037), (0.331, 0.025), (0.362, 0.008), (0.394, 0.000), (0.431, 0.003), (0.452, 0.000), (0.494, 0.013), (0.527, 0.028), (0.560, 0.048), (0.619, 0.080)]),
}
for f, s in SPEC.items():
    im = Image.open(M + '/assets/' + f).convert('RGB'); W, H = im.size; d = ImageDraw.Draw(im)
    for (x, y, r) in s['eyes']:
        d.ellipse([(x - r) * W, y * H - r * W, (x + r) * W, y * H + r * W], outline=(0, 255, 255), width=2)
    if s.get('mouth'):
        x0, y0, x1, y1 = s['mouth']; d.rectangle([x0 * W, y0 * H, x1 * W, y1 * H], outline=(255, 0, 255), width=2)
    if s.get('mouthline'):
        d.line([(x * W, y * H) for x, y in s['mouthline']], fill=(255, 0, 255), width=3)
    for (x, y) in s['tips']:
        d.ellipse([x * W - 4, y * H - 4, x * W + 4, y * H + 4], outline=(0, 255, 0), width=2)
    im.save(S + '/marked-' + f.replace('.jpg', '.png'))
print('ok')
