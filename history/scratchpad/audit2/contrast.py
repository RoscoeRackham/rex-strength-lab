def lin(c):
    c=c/255
    return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def L(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16) for i in (0,2,4)]
    return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)
def mix(fg,bg,a):
    f=[int(fg.lstrip('#')[i:i+2],16) for i in (0,2,4)]; b=[int(bg.lstrip('#')[i:i+2],16) for i in (0,2,4)]
    return '#'+''.join('%02x'%round(a*x+(1-a)*y) for x,y in zip(f,b))
def cr(a,b):
    la,lb=L(a),L(b); return (max(la,lb)+0.05)/(min(la,lb)+0.05)
T={'light':dict(bg='#e9ece2',surface='#f6f7f1',surface2='#dfe3d5',ink='#161911',ink2='#444a3a',ink3='#686f5b',line='#c9cebd',accent='#b5650a',accentink='#7d4303',olive='#4f5e22',good='#0ca30c',warn='#c98500',serious='#ec835a',bad='#d03b3b'),
   'dark':dict(bg='#11130d',surface='#1a1d14',surface2='#252a1d',ink='#eef0e6',ink2='#c0c6b0',ink3='#939a80',line='#363c2b',accent='#f0a23a',accentink='#f7c27a',olive='#a9be6b',good='#3fbf4f',warn='#fab219',serious='#ec835a',bad='#e66767')}
for th,t in T.items():
    print('=====',th)
    aw = mix(t['accent'], t['surface'], 0.12 if th=='light' else 0.14)
    rows=[
     ('text ink3 on bg (.eyebrow, .start steps, footer)', t['ink3'], t['bg'], 4.5),
     ('text ink3 on surface (tile .k, labels, hints, .feat .w)', t['ink3'], t['surface'], 4.5),
     ('text ink2 on bg (intros, ladder sub-labels)', t['ink2'], t['bg'], 4.5),
     ('text ink2 on surface', t['ink2'], t['surface'], 4.5),
     ('text accent-ink link on surface', t['accentink'], t['surface'], 4.5),
     ('text accent-ink link on bg', t['accentink'], t['bg'], 4.5),
     ('badge Verified --good on surface (0.7rem)', t['good'], t['surface'], 4.5),
     ('badge Claimed/Disputed --warn on surface (0.7rem)', t['warn'], t['surface'], 4.5),
     ('badge Canon --olive on surface', t['olive'], t['surface'], 4.5),
     ('selected tab #1b1306 on accent (18.4px/800, not "large")', '#1b1306', t['accent'], 4.5),
     ('Run button hover #1b1306 on accent', '#1b1306', t['accent'], 4.5),
     ('chip pressed surface on ink', t['surface'], t['ink'], 4.5),
     ('callout text ink on accent-wash', t['ink'], aw, 4.5),
     ('MARK leader lines --line on bg (ladder)', t['line'], t['bg'], 3),
     ('MARK chart gridline --line on surface', t['line'], t['surface'], 3),
     ('MARK ladder tick --ink-3 on bg', t['ink3'], t['bg'], 3),
     ('MARK ladder axis --line on bg', t['line'], t['bg'], 3),
     ('MARK accent dot/path on bg', t['accent'], t['bg'], 3),
     ('MARK accent path on surface', t['accent'], t['surface'], 3),
     ('MARK olive dot on bg', t['olive'], t['bg'], 3),
     ('MARK olive bar 0.75 on surface', mix(t['olive'],t['surface'],0.75), t['surface'], 3),
     ('MARK ghost path ink3@0.55 on surface', mix(t['ink3'],t['surface'],0.55), t['surface'], 3),
     ('MARK meter --good bar on track surface-2', t['good'], t['surface2'], 3),
     ('MARK meter --bad bar on track surface-2', t['bad'], t['surface2'], 3),
     ('MARK meter track surface-2 on surface', t['surface2'], t['surface'], 3),
     ('MARK icon --good on surface', t['good'], t['surface'], 3),
     ('MARK icon --warn on surface', t['warn'], t['surface'], 3),
     ('MARK icon --bad on surface', t['bad'], t['surface'], 3),
     ('MARK icon info --ink-3 on surface', t['ink3'], t['surface'], 3),
     ('icon glyph #fff on --good', '#ffffff', t['good'], 3),
     ('icon glyph #fff on --bad', '#ffffff', t['bad'], 3),
     ('MARK "now" line ink@0.55 on bg', mix(t['ink'],t['bg'],0.55), t['bg'], 3),
     ('focus ring --accent on surface', t['accent'], t['surface'], 3),
     ('focus ring --accent on bg', t['accent'], t['bg'], 3),
     ('control borders --line on surface (inputs/select)', t['line'], t['surface'], 3),
     ('slider accent-color on surface', t['accent'], t['surface'], 3),
     ('focus ring --accent vs selected tab fill (same colour)', t['accent'], t['accent'], 3),
    ]
    for n,a,b,need in rows:
        r=cr(a,b); print(('FAIL ' if r<need else 'ok   ')+'%5.2f (need %s) %s  [%s on %s]'%(r,need,n,a,b))
