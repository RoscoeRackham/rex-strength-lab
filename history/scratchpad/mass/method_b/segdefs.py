"""Hand-measured segment definitions (image pixels, 1280x853 picture).
All coordinates read off gridded zoom crops of the picture (see *_grid crops)."""

# ---------------- heights ----------------
REX_TOP_CREST=8.5      # tip of tallest crest spike (x~828)
REX_TOP_SKULL=42.0     # scaly skull surface under the crest (x~820-840), +-6 px
REX_GROUND=808.5       # mean of foot contact centres: far (image-left) foot ~798, near foot ~819
OLLIE_TOP_HORN=12.5    # tip of image-left horn (x~352)
OLLIE_TOP_HAIR=24.0    # top of hair tuft (x~405-415)
OLLIE_TOP_SKULL=35.0   # estimated scalp under ~11 px of hair, +-5 px
OLLIE_GROUND=812.0     # mean of boot contact centres: image-left boot ~815, image-right ~809

# ---------------- trunk edges (y, x_left, x_right) read by hand ----------------
REX_TRUNK=[(128,750,925),(150,725,945),(180,705,950),(210,695,960),(240,693,968),(270,695,972),
           (300,700,970),(330,712,965),(360,730,962),(395,728,965),(420,698,1000),(450,692,1003),
           (480,692,1003),(510,693,1002),(543,695,1000)]
REX_ZONES=dict(chest=(128,330),waist=(330,395),pelvis=(395,543))
OLLIE_TRUNK=[(108,280,505),(130,268,525),(160,262,545),(200,252,550),(240,245,552),(280,245,552),(310,250,550),
             (340,255,545),(365,262,532),(395,245,545),(420,225,563),(450,210,572),(480,205,576),
             (510,200,578),(540,203,577),(558,206,574)]
OLLIE_ZONES=dict(chest=(108,340),waist=(340,395),pelvis=(395,558))

# ---------------- legs: (y, width_left_leg, width_right_leg) from mask rows, pocket flaps/tail excluded ----------------
REX_THIGH=[(543,160,158),(550,159,155),(570,147,145),(590,148,144)]
REX_SHANK=[(590,148,144),(610,169,156),(630,174,165),(650,164,164),(670,141,150),(690,131,125),(700,124,115),(710,120,106),(720,116,110)]
OLLIE_THIGH=[(558,165,162),(570,167,159),(590,169,147),(600,168,160)]
OLLIE_SHANK=[(600,168,160),(610,168,169),(630,176,180),(650,170,174),(670,163,151),(690,138,139),(700,134,133),(710,128,128),(720,115,116),(725,112,113)]

# ---------------- arms: polygons + axes (perpendicular slicing of the silhouette) ----------------
# Rex image-right arm (his LEFT arm) - fully visible; used for both arms (bilateral symmetry)
REX_RA=dict(
  upper=dict(poly=[(935,100),(1090,100),(1140,180),(1165,280),(1165,292),(960,337),(963,300),(970,270),(968,240),(960,210),(950,180),(945,150)],
             axis=[(1010,112),(1068,318)]),
  fore=dict(poly=[(960,337),(1165,292),(1170,400),(1150,440),(1040,440),(1005,400),(985,365)],
             axis=[(1068,318),(1095,440)]),
  hand=dict(poly=[(1036,440),(1152,440),(1146,500),(1126,536),(1052,536),(1030,482)],
             axis=[(1095,440),(1085,535)]))
# Rex image-left arm (his RIGHT arm) - partly hidden behind Ollie's arm (x<600, y 250-440)
REX_LA=dict(
  upper=dict(poly=[(728,118),(640,118),(600,180),(586,250),(584,330),(712,330),(700,300),(695,270),(693,240),(695,210),(705,180),(725,150)],
             axis=[(668,125),(640,330)]),
  fore=dict(poly=[(584,330),(712,330),(722,360),(705,400),(668,440),(578,440),(578,380)],
             axis=[(640,330),(620,440)]),
  hand=dict(poly=[(576,440),(668,440),(664,540),(574,540)],
             axis=[(618,440),(614,535)]))
# Ollie image-left arm (his RIGHT arm) - fully visible, akimbo; used for both arms
OLLIE_LA=dict(
  upper=dict(poly=[(262,100),(150,103),(95,160),(48,250),(48,302),(120,298),(215,300),(240,275),(252,230),(256,180),(262,140)],
             axis=[(212,108),(88,306)]),
  fore=dict(poly=[(48,302),(120,298),(215,300),(240,340),(222,368),(212,400),(205,445),(170,430),(110,388),(52,345)],
             axis=[(70,318),(214,398)]))
OLLIE_LA_FIST=dict(w=95,h=90)   # x 205-300, y 347-437
# Ollie image-right arm (his LEFT arm) - foreshortened/partly hidden by the turned torso
OLLIE_RA=dict(
  upper=dict(poly=[(522,118),(582,122),(612,168),(626,240),(622,300),(606,338),(548,338),(545,300),(546,200),(541,150)],
             axis=[(568,125),(585,335)]),
  fore=dict(poly=[(548,338),(606,338),(592,368),(560,378),(536,360)],
             axis=[(585,335),(555,375)]))
OLLIE_RA_FIST=dict(w=76,h=80)   # x 502-578, y 362-442

# ---------------- heads, necks (px) ----------------
# Rex: 3/4 view, snout to image-left. Visible width at eye level ~120 px; skull top 42 -> jaw ~137
REX_HEAD=dict(height=95, breadth=104, length_ratio=1.40)   # breadth from 3/4 projection (yaw~40 deg)
REX_CREST=dict(arc=150, height=30, thick=20, fill=0.35)
REX_NECK=dict(diam=135, length=30)
OLLIE_HEAD=dict(height=118, breadth=97, length_ratio=1.32)  # height corrected for ~25 deg backward tilt
OLLIE_HORN=[dict(len=70,base=25),dict(len=65,base=22)]
OLLIE_EARS=dict(n=2,l=40,w=22,t=8,fill=0.5)
OLLIE_NECK=dict(diam=125, length=22)   # trunk now starts at y108 (traps)

# ---------------- feet ----------------
REX_FOOT=dict(breadth=155, height=86)   # near foot x 921-1076 at y 780; cuff->ground 78 (far) / 94 (near)
OLLIE_BOOT=dict(breadth=95, height=90, shaft=116)  # shaft width at ankle 108-124; sole breadth ~0.82*shaft

# ---------------- tail (Rex) ----------------
# Visible stations: (x, vertical chord px, local axis slope deg, perspective factor)
REX_TAIL_STATIONS=[(1060,175,50,1.07),(1100,138,40,1.10),(1140,103,26,1.13),(1180,82,13,1.13),(1210,66,5,1.13),
                   ('c1',50,0,1.13),('c2',36,0,1.13),('c3',22,0,1.13),('tip',0,0,1.13)]
# arc lengths (px, image) between successive visible stations, starting 1060->1100
REX_TAIL_ARCS=[58,48,42,30,28,41,30,17]
