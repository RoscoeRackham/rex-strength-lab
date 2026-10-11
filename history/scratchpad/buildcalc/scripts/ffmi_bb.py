# Derived FFMI for reported athlete heights/weights. Body-fat values are ASSUMPTIONS unless noted.
IN=0.0254; LB=0.45359237
def ffmi(m,h,bf):
    ffm=m*(1-bf); f=ffm/h**2
    return round(f,1), round(f+6.1*(1.8-h),1), round(f+6.3*(1.8-h),1)
rows=[
 ("Ronnie Coleman 2004 Olympia",296*LB,71*IN,0.05),
 ("Ronnie Coleman 2003 Olympia",286*LB,71*IN,0.05),
 ("Dorian Yates 1993 Olympia (Guinness)",116.57,70*IN,0.05),
 ("Jay Cutler 2009 Olympia",271*LB,69*IN,0.05),
 ("Phil Heath 2011 Olympia",248*LB,69*IN,0.05),
 ("Big Ramy 2015 Olympia est 305-310",307.5*LB,69*IN,0.05),
 ("Big Ramy 2015 at 5'11",307.5*LB,71*IN,0.05),
 ("Arnold 1975 Olympia",235*LB,73.5*IN,0.05),
 ("Arnold 1971 Olympia",246*LB,73.5*IN,0.05),
 ("Sergio Oliva 1967",225*LB,70*IN,0.05),
 ("Steve Reeves 1947 program",213*LB,73*IN,0.05),
 ("Brian Shaw 2024 hydrostatic 17.6% @6'8",174.5,80*IN,0.176),
 ("Brian Shaw 2024 hydrostatic 17.6% @6'6.75",174.5,78.75*IN,0.176),
 ("Withers 1997 elite BB final (FFM 88.14 kg)",92.79,(99.70/31.6)**0.5,1-88.14/92.79),
 ("McInnis 1999 BB (FFM 91 kg)",99,1.80,1-91/99),
 ("Kraemer 2020 strongmen lean+BMC",152.9,1.874,1-(118.0+5.23)/152.9),
 ("Chappell 2019 natural PRO stage 82.3kg @5%",82.3,1.77,0.05),
 ("Talakhadze Tokyo 177kg @1.95, bf 20% assumed",177.0,1.95,0.20),
 ("Talakhadze Tokyo 177kg @1.95, bf 25% assumed",177.0,1.95,0.25),
 ("Eddie Hall 172kg @1.90, bf 20% assumed",172.0,1.90,0.20),
]
for n,m,h,bf in rows:
    a,b,c=ffmi(m,h,bf); print(f"{n:50s} m={m:6.1f}kg h={h:.3f}m bf={bf*100:4.1f}% FFMI={a} norm6.1={b} norm6.3={c}")
