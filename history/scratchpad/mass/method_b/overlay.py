import sys; sys.path.insert(0,'/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/method_b')
from PIL import Image, ImageDraw
import numpy as np, geom, segdefs as S
im=Image.open(geom.IMG).convert('RGB')
a=np.asarray(im).astype(float)
vis=a.copy()
vis[geom.OLLIE]=vis[geom.OLLIE]*0.6+np.array([255,140,0])*0.4
vis[geom.REX]=vis[geom.REX]*0.6+np.array([0,160,255])*0.4
im2=Image.fromarray(vis.astype(np.uint8)); d=ImageDraw.Draw(im2)
cols={'upper':(255,0,0),'fore':(0,255,0),'hand':(255,255,0)}
for arm in [S.REX_RA,S.REX_LA,S.OLLIE_LA,S.OLLIE_RA]:
    for k,v in arm.items():
        d.polygon([tuple(p) for p in v['poly']],outline=cols[k])
        d.line([tuple(p) for p in v['axis']],fill=cols[k],width=2)
for tr in [S.REX_TRUNK,S.OLLIE_TRUNK]:
    for y,xl,xr in tr: d.line([(xl,y),(xr,y)],fill=(255,0,255),width=1)
for y,_,_ in S.REX_THIGH+S.REX_SHANK: d.line([(670,y),(1050,y)],fill=(0,255,255))
for y,_,_ in S.OLLIE_THIGH+S.OLLIE_SHANK: d.line([(165,y),(585,y)],fill=(0,255,255))
for y in [S.REX_TOP_CREST,S.REX_TOP_SKULL,S.REX_GROUND]: d.line([(700,y),(1000,y)],fill=(255,255,255))
for y in [S.OLLIE_TOP_HORN,S.OLLIE_TOP_SKULL,S.OLLIE_GROUND]: d.line([(250,y),(520,y)],fill=(255,255,255))
im2.save('overlay_segments.png')
