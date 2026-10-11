import sys
from PIL import Image
for n in sys.argv[1:]:
  im=Image.open(n+'.png'); W,H=im.size
  step=1100 if W>1000 else 2000
  i=0
  for y in range(0,H,step):
    im.crop((0,y,W,min(H,y+step))).save(f'work/{n}-p{i}.png'); i+=1
  print(n, W, H, i)
