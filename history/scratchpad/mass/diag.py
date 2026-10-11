from PIL import Image; import numpy as np
IMG='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
im=np.asarray(Image.open(IMG).convert('RGB')).astype(float)
R,G,B=im[...,0],im[...,1],im[...,2]
L=(R+G+B)/3
c=R-B
# row profile of background at left edge and right edge
for y in range(0,853,25):
    print(y, 'L', L[y,0:20].mean().round(1), L[y,1260:].mean().round(1), L[y,620:660].mean().round(1),' c', c[y,0:20].mean().round(1), c[y,1260:].mean().round(1))
Image.fromarray(np.clip((c+20)*4,0,255).astype(np.uint8)).save('diag_chroma.png')
