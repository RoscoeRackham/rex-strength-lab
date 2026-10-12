import math
tp=2*math.pi
print('Steinmann velocities (my readings: disp, energy-weighted median f, quartiles):')
for lab,u,f,q1,q3 in (('3f walk 20 m',3.9e-8,18.3,13.5,23.7),('3f typical',1.85e-8,18.3,13.5,23.7),('3g run 38 m',2.45e-8,26.5,18.3,35.0),('3h group 20 m',5.2e-9,22.3,17.7,29.8),('3e giraffe 20 m',2.5e-7,23.5,18.9,27.9)):
    print('  %-16s v=%.2g m/s (%.2g-%.2g)'%(lab,tp*f*u,tp*q1*u,tp*q3*u))
print('  single/group ratio: disp %.1f, vel %.1f'%(3.9e-8/5.2e-9,(tp*18.3*3.9e-8)/(tp*22.3*5.2e-9)))
print('  researcher ratio vel: %.1f'%(4.7e-6/7.5e-7))
print('Running 38 m scaled to 20 m with n=1: %.4f mm/s (%.4f-%.4f)'%(0.0044*38/20,0.0030*38/20,0.0058*38/20))
print('Force/weight:')
for F in (125,279,946,1190):
    print('  %4d N: %.2f%%-%.2f%%'%(F,100*F/(3500*9.81),100*F/(2500*9.81)))
print('  1.2BW over 0.5%%..4%%: x%.0f..x%.0f; over 0.4%%: x%.0f'%(1.2/0.04,1.2/0.005,1.2/0.004))
print('Decay exponents:')
for D1 in (3,6,12): print('  OCR D1=%d: n=%.2f'%(D1,math.log(24.35/8.5)/math.log(40/D1)))
for r0 in (0.5,1,2): print('  Wood r0=%.1f: n=%.2f'%(r0,math.log(10)/math.log(20/r0)))
print('  Steinmann 26->103: n=%.2f'%(math.log(3.5e-9/2.2e-10)/math.log(103/26)))
# OCR 2006 fits: effective n between 10 and 90 m
for a,lab in ((0.05,'shaker 45 Hz'),(0.018,'background 40-60 Hz'),(0.05*20/45,'shaker scaled to 20 Hz'),(0.018*20/45,'bg scaled to 20 Hz')):
    ratio=math.sqrt(90/10)*math.exp(a*80)
    print('  OCR2006 %s alpha=%.3f: L(10)/L(90)=%.1f -> n_eff=%.2f; 20->100 m n_eff=%.2f'%(lab,a,ratio,math.log(ratio)/math.log(9),(math.log(math.sqrt(5)*math.exp(a*80)))/math.log(5)))
# check OCR2006 levels
L=lambda L0,a,r: L0*math.exp(-a*r)/math.sqrt(r)
for r in (10,90): print('  shaker L(%d)=%.3g m/s = %.1f dB re 1um/s'%(r,L(25.5e-6,0.05,r),20*math.log10(L(25.5e-6,0.05,r)/1e-6)))
print('  bg L(5)=%.3g = %.1f dB; -12 dB = %.3g um/s'%(L(4e-7,0.018,5),20*math.log10(L(4e-7,0.018,5)/1e-6),10**(-12/20)))
# Mayne check
E=(( (0.005/70)**(1/1.4))*20)**2
print('Mayne 70(sqrt(WH)/d)^1.4: WH for 0.005 mm/s at 20 m = %.2g Mg.m = %.1f J; scaled distance %.4f'%(E,E*9810,math.sqrt(E)/20))
WH=3.0*0.1; print('  3 t dropped 0.1 m (0.3 Mg.m) at 20 m: scaled dist %.3f -> %.2f mm/s'%(math.sqrt(WH)/20,70*(math.sqrt(WH)/20)**1.4))
# Wijayaraja ADC conversions
k=4.88e-3/85.8
for lab,c,g in (('Fig21/18a S0',(38,45),580),('Fig18b S1',(280,280),940),('Fig20 E1 S1',(190,190),940),('Fig18c S2 ~156 m',(380,380),25911)):
    print('  %-18s %s counts -> %.2g-%.2g m/s'%(lab,c,c[0]*k/g,c[1]*k/g))
print('  S2 ADC half-scale saturation (512 counts) -> %.2g m/s'%(512*k/25911))
# Anchor at 156 m
print('Anchor 1/D at 156 m: %.5f mm/s'%(0.005*20/156))
# Rayleigh H/V and vector peak
print('pseudo-vector sum factor sqrt(1+0.68^2)=%.2f; true vector peak with 90deg phase = max(1,0.68)=1.00'%math.sqrt(1+0.68**2))
# Mortimer modelled 200 m disp -> velocity
for f in (7.5,10): print('Mortimer Fig1F ~2e-7 m at 200 m, f=%.1f: v=%.3g mm/s; anchor extrapolated to 200 m central %.4f high %.4f'%(f,tp*f*2e-7*1e3,0.005*20/200,0.04*20/200))
