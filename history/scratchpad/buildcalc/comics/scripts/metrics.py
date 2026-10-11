# Derived metrics for stated comic heights/weights.
# BMI = kg/m^2 ; PI (Rohrer/ponderal index) = kg/m^3 ;
# FFMI_norm_upper = BMI + 6.3*(1.80 - h)  -> Kouri et al. 1995 height-normalised FFMI, assuming 0% body fat (upper bound)
# ratio_bmi25 = stated mass / mass of a BMI-25 human of same height (25*h^2)
import json
LB=0.45359237; IN=0.0254
def m(ft,inch=0): return round((ft*12+inch)*IN,4)
rows=[
 ('superman','Superman (DK DC Enc.)',m(6,3),235),
 ('batman','Batman (DK)',m(6,2),210),
 ('captain_america','Captain America (Marvel.com/DK 2019)',m(6,2),240),
 ('captain_america_alt220','Captain America alt 220 (fan-reported)',m(6,2),220),
 ('thor','Thor',m(6,6),640),
 ('thor_blake','Donald Blake',m(5,9),150),
 ('hulk_banner','Bruce Banner',m(5,9),128),
 ('hulk_savage_low','Savage Hulk 7ft/1040',m(7,0),1040),
 ('hulk_savage_high','Savage Hulk 8ft/1400 (reported)',m(8,0),1400),
 ('hulk_grey','Grey Hulk/Joe Fixit (reported)',m(6,6),900),
 ('hulk_marvelcom','Hulk (Marvel.com) 7ft6/1150',m(7,6),1150),
 ('thing','Thing 6ft/500',m(6,0),500),
 ('thing_2022','Thing 6ft6/430 (reported)',m(6,6),430),
 ('juggernaut_6_10','Juggernaut 6ft10/900',m(6,10),900),
 ('juggernaut_9_5','Juggernaut 9ft5/1900',m(9,5),1900),
 ('colossus_human','Piotr Rasputin 6ft6/250',m(6,6),250),
 ('colossus_armored','Colossus armored 7ft5/500',m(7,5),500),
 ('wolverine_adam','Wolverine 5ft3/300 (with adamantium)',m(5,3),300),
 ('wolverine_noadam','Wolverine 5ft3/195 (without)',m(5,3),195),
 ('kingpin','Kingpin 6ft7/450',m(6,7),450),
 ('luke_cage','Luke Cage 6ft6/425',m(6,6),425),
 ('black_panther','Black Panther 6ft/200',m(6,0),200),
 ('bane','Bane 6ft8/350',m(6,8),350),
 ('bane_venom','Bane on Venom 6ft8/425',m(6,8),425),
 ('doomsday_2008','Doomsday 7ft/615 (DK 2008)',m(7,0),615),
 ('doomsday_2021','Doomsday 7ft6/915 (DK 2021)',m(7,6),915),
 ('doomsday_ucg2019','Doomsday 8ft10/915 (DK UCG 2019)',m(8,10),915),
 ('darkseid','Darkseid 8ft9/1815',m(8,9),1815),
 ('she_hulk_650','She-Hulk 6ft7/650 (DK 2019)',m(6,7),650),
 ('she_hulk_700','She-Hulk 6ft7/700 (Marvel.com)',m(6,7),700),
 ('abomination','Abomination 6ft8/980',m(6,8),980),
]
out=[]
print(f"{'key':22s} {'h_m':>6s} {'kg':>7s} {'BMI':>6s} {'PI':>6s} {'FFMIn0%':>8s} {'xBMI25':>6s}")
for k,lab,h,lb in rows:
    kg=lb*LB; bmi=kg/h**2; pi=kg/h**3; ffmi=bmi+6.3*(1.80-h); r=kg/(25*h*h)
    out.append(dict(key=k,label=lab,height_m=round(h,3),mass_kg=round(kg,1),orig_lb=lb,bmi=round(bmi,1),pi_kg_m3=round(pi,1),ffmi_norm_upper=round(ffmi,1),x_bmi25=round(r,2)))
    print(f"{k:22s} {h:6.3f} {kg:7.1f} {bmi:6.1f} {pi:6.1f} {ffmi:8.1f} {r:6.2f}")
# human reference points derived from WHO BMI cut-offs at 1.80 m and Kouri 1995 FFMI 25 limit
h=1.80
print('\nHuman refs at 1.80 m: BMI18.5 PI=%.1f, BMI25 PI=%.1f, BMI30 PI=%.1f'%(18.5/h,25/h,30/h))
# Kouri natural limit FFMI 25 at 1.80 m with 10% fat -> mass
ffm=25*h*h; mass=ffm/0.9
print('Kouri FFMI25 @1.80m, 10%% fat: mass %.1f kg, BMI %.1f, PI %.1f'%(mass,mass/h/h,mass/h**3))
ffm=30*h*h; mass=ffm/0.9
print('FFMI30 @1.80m, 10%% fat: mass %.1f kg, BMI %.1f, PI %.1f'%(mass,mass/h/h,mass/h**3))
# isometric scalings
def scale(lb,h0,h1): return lb*(h1/h0)**3
print('\nIsometric: Banner 128lb 5ft9 -> 7ft: %.0f lb; -> 7ft6: %.0f lb; -> 8ft: %.0f lb'%(scale(128,m(5,9),m(7,0)),scale(128,m(5,9),m(7,6)),scale(128,m(5,9),m(8,0))))
print('Isometric: Cap 240lb 6ft2 -> 7ft: %.0f; -> 7ft6: %.0f; -> 6ft10: %.0f; -> 9ft5: %.0f; -> 8ft9: %.0f; -> 7ft5: %.0f'%(scale(240,m(6,2),m(7,0)),scale(240,m(6,2),m(7,6)),scale(240,m(6,2),m(6,10)),scale(240,m(6,2),m(9,5)),scale(240,m(6,2),m(8,9)),scale(240,m(6,2),m(7,5))))
print('Isometric: Blake 150lb 5ft9 -> 6ft6: %.0f'%scale(150,m(5,9),m(6,6)))
print('Isometric: Piotr 250lb 6ft6 -> 7ft5: %.0f'%scale(250,m(6,6),m(7,5)))
# Colossus volume check (assumed body density 1000-1100 kg/m3; steel 7850 kg/m3 standard value)
kg=250*LB; f=(m(7,5)/m(6,6))**3
for rho in (1000,1100):
    V=kg/rho*f
    print('Colossus: rho_h=%d -> armored volume %.3f m3; steel-density mass %.0f kg (%.0f lb); implied density at 500lb %.0f kg/m3'%(rho,V,V*7850,V*7850/LB,500*LB/V))
# Wolverine adamantium
print('Wolverine adamantium 105 lb = %.1f kg; = %.0f%% of 195 lb'%(105*LB,105/195*100))
json.dump(out,open('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/comics/out/metrics.json','w'),indent=1)
