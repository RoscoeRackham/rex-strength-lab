import csv,sys,statistics as st
rows=list(csv.DictReader(open(sys.argv[1],encoding='latin-1')))
W=[float(r['weightkg'])/10 for r in rows]; A=[float(r['waistcircumference'])/10 for r in rows]; H=[float(r['stature'])/1000 for r in rows]
print('ANSUR mean weight %.1f kg, height %.3f m, waist %.1f cm (%.2f in), BMI %.1f'%(st.mean(W),st.mean(H),st.mean(A),st.mean(A)/2.54,st.mean([w/h**2 for w,h in zip(W,H)])))
# Taylor cohort1 men: weight 85.9 kg, DXA 24.3, 1-site manual bias -0.387 (pred - DXA)
wl=85.9*2.2046226
pred=24.3-0.387
Ain=(pred+27.05+0.12*wl)/2.06
print('Implied Taylor mean abdomen from his equation and bias: %.2f in = %.1f cm'%(Ain,Ain*2.54))
offAD=-26.97-0.12*wl+1.99*Ain
print('Official AD2023-11 equation at that mean: %.1f%% -> bias vs DXA %.1f points'%(offAD,offAD-24.3))
for a in (32,36,40): print('eq diff (Taylor - AD) at %d in: %.2f'%(a,-0.08+0.07*a))
