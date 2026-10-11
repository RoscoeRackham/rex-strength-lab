import math
H0 = 1.8
S = lambda ffm, h: 1.8*ffm/h**3
ffmi = lambda ffm, h: ffm/h**2
# 1. identity at 1.80 m
for ffm in (61.2, 81.0, 120.0):
    print('H=1.8 ffm', ffm, 'FFMI', ffmi(ffm,1.8), 'S', S(ffm,1.8), 'diff', ffmi(ffm,1.8)-S(ffm,1.8))
# 2. same shape scaled to 3.048
k = 3.048/1.8
print('k', k, 'k^3', k**3)
ffm18 = 81.0  # FFMI 25 at 1.80
ffm3 = ffm18*k**3
print('scaled: FFM', ffm3, 'FFMI', ffmi(ffm3,3.048), 'ratio', ffmi(ffm3,3.048)/ffmi(ffm18,1.8), 'S', S(ffm3,3.048))
# Rex example from the brief: plain FFMI 269 at 3.048 m
print('Rex S from plain 269:', 269/k)
# Kouri correction at 3.048
for c in (6.1, 6.3):
    print('Kouri c',c,'correction at 3.048 m', c*(1.8-3.048), 'Rex Kouri-normalised', 269 + c*(1.8-3.048))
# implied exponent of Kouri's linear correction at FFMI 25 and the same-shape slope
for F in (20, 25, 30):
    print('FFMI',F,'same-shape slope per m', F/1.8, 'Kouri 6.3 fraction', 6.3/(F/1.8), 'implied p', 2+6.3*1.8/F)
# humans at FFMI 25, heights 1.6, 1.7, 1.9, 2.0, 2.05
for h in (1.55, 1.6, 1.7, 1.8, 1.9, 2.0, 2.05):
    ffm = 25*h*h
    print(f'H {h}: plain 25, Kouri6.1 {25+6.1*(1.8-h):.2f}, Kouri6.3 {25+6.3*(1.8-h):.2f}, S {S(ffm,h):.2f}')
# Heymsfield p = 1.86 implication
for p in (1.86, 1.86-0.10, 1.86+0.10):
    r = (1.95/1.65)**(p-3)
    print('p',p,'S ratio tall(1.95)/short(1.65) at typical build', r, 'FFMI ratio', (1.95/1.65)**(p-2))
# meatball
for rho in (1060, 1080.8, 1081):
    print('meatball rho',rho, 1.8*rho*math.pi/6*0.925, 'fat 5%', 1.8*rho*math.pi/6*0.95, 'fat 10%', 1.8*rho*math.pi/6*0.90)
# sensitivity: 1% height
print('1% height up -> S x', 1/1.01**3, '; 1% down ->', 1/0.99**3)
# plain FFMI of meatball at 3.048 vs 1.8
print('meatball plain FFMI at 1.8:', 1060*math.pi/6*0.925*1.8, 'at 3.048:', 1060*math.pi/6*0.925*3.048)
