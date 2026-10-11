IN=0.0254; LB=0.45359237
def h(ft,inch=0): return (ft*12+inch)*IN
rows = {
 'batman':(h(6,2),210),'black_panther':(h(6),200),'superman':(h(6,3),235),'captain_america_240':(h(6,2),240),
 'captain_america_220':(h(6,2),220),
 'colossus_human':(h(6,6),250),'wolverine_195':(h(5,3),195),'wolverine_300':(h(5,3),300),'bane':(h(6,8),350),
 'bane_venom':(h(6,8),425),'colossus_armored':(h(7,5),500),'luke_cage':(h(6,6),425),'kingpin':(h(6,7),450),
 'doomsday_2008':(h(7),615),'doomsday_2019_guide':(h(8,10),915),'doomsday_2021':(h(7,6),915),'thing':(h(6),500),
 'thing_wiki':(h(6,6),430),
 'she_hulk_650':(h(6,7),650),'she_hulk_700':(h(6,7),700),'thor':(h(6,6),640),'juggernaut_6_10':(h(6,10),900),
 'juggernaut_9_5':(h(9,5),1900),'hulk_marvelcom':(h(7,6),1150),'hulk_savage_7ft':(h(7),1040),'hulk_savage_8ft':(h(8),1400),
 'hulk_grey':(h(6,6),900),'abomination':(h(6,8),980),'darkseid':(h(8,9),1815),'banner':(h(5,9),128),'blake':(h(5,9),150),
 'jen_walters':(h(5,10),150),'blonsky':(h(5,10),180),
}
print('%-22s %6s %7s %6s %6s %7s %6s %6s %6s'%('key','h_m','kg','BMI','PI','FFMIu','xBMI25','FFMI10','FFMI15'))
for k,(hm,lb) in rows.items():
    kg=lb*LB; bmi=kg/hm**2; pi=kg/hm**3
    def ffmi(bf): return kg*(1-bf)/hm**2 + 6.3*(1.80-hm)
    print('%-22s %6.3f %7.1f %6.1f %6.1f %7.1f %6.2f %6.1f %6.1f'%(k,hm,kg,bmi,pi,ffmi(0),kg/(25*hm**2),ffmi(.10),ffmi(.15)))
# isometric scaling
def iso(lb,h0,h1): return lb*(h1/h0)**3
print('Banner 128 -> 7ft %.0f, 7ft6 %.0f, 8ft %.0f'%(iso(128,h(5,9),h(7)),iso(128,h(5,9),h(7,6)),iso(128,h(5,9),h(8))))
print('Blake 150 -> 6ft6 %.0f'%iso(150,h(5,9),h(6,6)))
for tgt in [(6,10),(9,5),(8,9),(7,6)]:
    print('Cap 240 -> %s %.0f'%(tgt,iso(240,h(6,2),h(*tgt))))
# PI at 1.80
for b in (18.5,25,30): print('BMI',b,'PI@1.8',round(b/1.8,1))
# Kouri derived at 1.80 10% fat
for f in (25,30): m=f*1.8**2/0.9; print('FFMI',f,'mass',round(m,1),'BMI',round(m/3.24,1),'PI',round(m/1.8**3,1))
# Colossus density
hm0=h(6,6); hm1=h(7,5); kg0=250*LB; s=(hm1/hm0)**3
print('scale factor',round(s,3))
for rho in (1000,1100):
    v0=kg0/rho; v1=v0*s; ms=v1*7850
    print('rho',rho,'V0',round(v0,4),'V1',round(v1,4),'steel kg',round(ms),'lb',round(ms/LB),'implied rho',round(500*LB/v1))
# Kingpin FFMI if 9 lb fat, and "mostly muscle" (e.g. 10-20% fat)
hm=h(6,7);kg=450*LB
for fatkg in (9*LB, kg*0.10, kg*0.2, kg*0.3):
    print('kingpin fat %.1f kg -> FFMInorm %.1f'%(fatkg,(kg-fatkg)/hm**2+6.3*(1.8-hm)))
# Black panther 10% fat FFMI
