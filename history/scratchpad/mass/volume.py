import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from scipy.signal import fftconvolve
from regions import DIVIDER, REX, OL
IMG='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
im=np.asarray(Image.open(IMG).convert('RGB'))
H,W=im.shape[:2]
fg=np.load('fg_raw.npy')

def poly_mask(pts):
    m=Image.new('L',(W,H),0); ImageDraw.Draw(m).polygon([tuple(p) for p in pts],fill=1)
    return np.asarray(m).astype(bool)

# Rex vs Ollie split by divider: Rex side = right of divider polyline
right=Image.new('L',(W,H),0)
ImageDraw.Draw(right).polygon(DIVIDER+[(W,H),(W,0)],fill=1)
right=np.asarray(right).astype(bool)

def build(figpolys, side):
    figmask=fg&side
    regs={k:(poly_mask(p)&figmask) for k,p in figpolys.items()}
    return figmask, regs

rex_fig, rex_r = build(REX, right)
ol_fig, ol_r  = build(OL, ~right)
# exclusivity fixes
rex_r['head_neck']&=~rex_r['crest']
rex_r['pouch_L']&=rex_r['torso']; rex_r['pouch_R']&=rex_r['torso']
rex_r['torso']&=~(rex_r['pouch_L']|rex_r['pouch_R'])
ol_r['head']&=~(ol_r['horn_L']|ol_r['horn_R']|ol_r['ear_L']|ol_r['ear_R'])
ol_r['ear_L']&=~ol_r['horn_L']; ol_r['ear_R']&=~ol_r['horn_R']
ol_r['arm_L_fore']&=~ol_r['arm_L_fist']
ol_r['arm_R_fore']&=~ol_r['arm_R_fist']
ol_r['tail']&=~(ol_r['arm_L_fist']|ol_r['arm_L_fore'])
ol_r['leg_L']&=~ol_r['tail']
# body silhouette = union of regions (drops floor shadow and junk outside polygons)
rex_body=np.zeros_like(fg); [rex_body.__ior__(m) for m in rex_r.values()]
ol_body=np.zeros_like(fg); [ol_body.__ior__(m) for m in ol_r.values()]
np.save('rex_body.npy',rex_body); np.save('ol_body.npy',ol_body)
np.save('rex_fig.npy',rex_fig); np.save('ol_fig.npy',ol_fig)
print('unassigned rex px', int((rex_fig&~rex_body).sum()), 'ollie', int((ol_fig&~ol_body).sum()))

# overlay
cols=[(255,60,60),(60,200,60),(60,120,255),(255,200,0),(200,0,255),(0,220,220),(255,120,0),(150,255,100),(255,0,150),(120,120,255),(255,255,255),(0,150,80),(180,90,40),(90,40,180),(220,220,120),(40,180,180)]
ov=im.astype(float).copy()
for regs in (rex_r,ol_r):
    for i,(k,m) in enumerate(regs.items()):
        c=np.array(cols[i%len(cols)])
        ov[m]=ov[m]*0.45+c*0.55
        e=m&~ndi.binary_erosion(m); ov[e]=c
Image.fromarray(ov.astype(np.uint8)).save('overlay_regions.png')
json.dump({'rex':{k:int(v.sum()) for k,v in rex_r.items()},'ollie':{k:int(v.sum()) for k,v in ol_r.items()}},open('region_px.json','w'),indent=1)
import pickle; pickle.dump((rex_r,ol_r),open('regions.pkl','wb'))
