LB=0.45359237; IN=0.0254
def S(ffm,h): return 1.8*ffm/h**3
def F(ffm,h): return ffm/h**2
rows = {
 'thor_listed': (78*IN, 640*LB),
 'thor_human_equiv_div3': (78*IN, 640*LB/3),
 'blake_scaled_to_6ft6': (78*IN, 150*LB*(78/69)**3),
 'wolverine_with_adam': (63*IN, 300*LB),
 'wolverine_without_adam': (63*IN, 195*LB),
 'colossus_human': (78*IN, 250*LB),
 'colossus_armored': (89*IN, 500*LB),
 'kingpin_listed': (79*IN, 450*LB),
 'thing_listed': (72*IN, 500*LB),
 'luke_cage_listed': (78*IN, 425*LB),
 'hulk_dk2019': (84*IN, 1040*LB),
 'abomination': (80*IN, 980*LB),
}
for k,(h,m) in rows.items():
    out=[f"{k}: h={h:.3f} m, m={m:.1f} kg ({m/LB:.0f} lb)"]
    for fat in (0,0.10,0.15):
        ffm=m*(1-fat); out.append(f"fat{int(fat*100)}%: FFMI={F(ffm,h):.1f} S={S(ffm,h):.1f}")
    print(' | '.join(out))
print('thor ratio listed/div3 =', 3.0)
print('wolverine overstatement factor 300/195 =', round(300/195,3), ' adamantium share of 300 lb =', round(105/300,3))
print('kingpin 9 lb fat share =', round(9/450*100,2), '%; FFM =', round((450-9)*LB,1), 'kg; FFMI=', round(F((450-9)*LB,79*IN),1), 'S=', round(S((450-9)*LB,79*IN),1))
print('hulk added mass (DK) 1040-128 =', 1040-128, 'lb; Marvel.com 1150-128 =', 1150-128, '; abomination 980-180 =', 980-180)
print('colossus added mass 500-250 =', 250, 'lb =', round(250*LB,1),'kg')
