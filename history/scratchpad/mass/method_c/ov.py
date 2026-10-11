import numpy as np, sys
from PIL import Image, ImageDraw
im=Image.open('/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg').convert('RGB')
a=np.array(im).astype(float)
R=np.load('../rex_fig.npy'); O=np.load('../ol_fig.npy')
ov=a.copy()
ov[R]=ov[R]*0.5+np.array([0,0,255])*0.5
ov[O]=ov[O]*0.5+np.array([255,0,0])*0.5
Image.fromarray(ov.astype(np.uint8)).save('ov_masks.png')
