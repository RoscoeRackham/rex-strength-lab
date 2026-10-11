def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
themes={
'light':dict(paper='#ECEDF1',sheet='#F8F8FA',wall='#DADCE4',floor='#F1F1F4',ink='#15181F',ink2='#464C5A',ink3='#5C6270',chalk='#1F4FA6',alarm='#B0321D',alarmbg='#F6E2DC',tape='#EDBE2E',tapeink='#231D07',chalkbg='#E3E9F5'),
'dark':dict(paper='#14151A',sheet='#1B1D23',wall='#262833',floor='#30323D',ink='#E8E9EE',ink2='#B4B8C3',ink3='#9CA1AF',chalk='#94B5FF',alarm='#FF8C75',alarmbg='#3A1C16',tape='#DDB02C',tapeink='#1B1604',chalkbg='#22304F'),
}
for t,c in themes.items():
    print(t)
    for fg in ('ink','ink2','ink3','chalk','alarm'):
        print('  ',fg, ' '.join('%s %.1f'%(bg,cr(c[fg],c[bg])) for bg in ('paper','sheet','wall','floor')))
    print('   alarm/alarmbg %.1f  tapeink/tape %.1f  chalk/chalkbg %.1f ink/tape %.1f'%(cr(c['alarm'],c['alarmbg']),cr(c['tapeink'],c['tape']),cr(c['chalk'],c['chalkbg']),cr(c['ink'],c['tape'])))
