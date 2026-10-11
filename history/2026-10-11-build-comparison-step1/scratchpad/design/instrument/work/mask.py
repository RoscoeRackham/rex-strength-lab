import sys, numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(float)/255
mx = im.max(2); mn = im.min(2)
sat = np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0)
# background: low saturation, mid-to-high value
r,g,b = im[...,0],im[...,1],im[...,2]
warm = (r-b)           # figures are warm (brown/tan); background is cool grey
mask = (sat>0.22) | (mx<0.30) | (warm>0.06)
Image.fromarray((mask*255).astype(np.uint8)).save(out)
print(im.shape, mask.mean())
