import statistics as st
years=[1939,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1953,1954,1955,1957,1958,1959]
kn=[24.3,22.6,24.0,26.9,25.5,23.9,27.3,26.1,25.9,23.0,27.7,28.0,26.5,26.0,25.8,25.4,23.5,25.2,26.8,24.6]
print("Kouri T2 mean",round(st.mean(kn),3),"sd",round(st.stdev(kn),3),"max",max(kn),"min",min(kn))
print(">27",sum(v>27 for v in kn),">25",sum(v>25 for v in kn),">=26",sum(v>=26 for v in kn))
# slope
mx=st.mean(years); my=st.mean(kn)
b=sum((x-mx)*(y-my) for x,y in zip(years,kn))/sum((x-mx)**2 for x in years)
print("slope",round(b,4))
# correlation p approx
import math
n=len(kn); r=b*st.stdev(years)/st.stdev(kn); t=r*math.sqrt((n-2)/(1-r*r)); print("r",round(r,3),"t",round(t,3))
s44=[v for y,v in zip(years,kn) if y<=1944]; s53=[v for y,v in zip(years,kn) if y<=1953]
print("<=1944 mean",round(st.mean(s44),2),max(s44),"<=1953 mean",round(st.mean(s53),2),max(s53))
# Todd
names=["Goodrich","Essmaker","Grimek40","Grimek41","Leight","Bacon","Stanko","Ross","Stephan","Reeves","Eiferman","Delinger","Farbotnik","Hilligenn","Park","Pearl","Dubois","Klisanin","Schaeffer","Lacy","Sansone","Johnson"]
H=[1.79,1.8,1.73,1.73,1.8,1.7,1.82,1.75,1.8,1.85,1.7,1.68,1.75,1.68,1.77,1.77,1.85,1.77,1.78,1.73,1.8,1.75]
W=[88.5,82,87.5,100.5,94.8,76.2,101.25,87.09,93,87,88,88,88,81,84,91.17,98,83.9,95.25,84,96.25,84.5]
BF=[0.11,0.10,0.07,0.07,0.09,0.07,0.09,0.09,0.09,0.08,0.09,0.09,0.10,0.07,0.08,0.08,0.08,0.09,0.08,0.09,0.08,0.09]
TN=[24.64356609,22.77777778,27.61634812,31.99170313,26.62592593,25.13110727,27.69393407,26.18317143,26.12037037,23.08141344,28.31934256,29.10501587,26.16622449,27.42205102,24.85024121,26.95576645,26.03831629,24.55307246,27.77949274,26.06744572,27.33024691,25.41357143]
calc=[]; S=[]
for nm,h,w,bf,tn in zip(names,H,W,BF,TN):
    ffm=w*(1-bf); F=ffm/h**2; N=F+6.1*(1.8-h); calc.append(N); S.append(1.8*ffm/h**3)
    if abs(N-tn)>0.02: print("mismatch",nm,round(N,3),tn, "bf needed", round(1-(tn-6.1*(1.8-h))*h*h/w,4))
print("Todd printed mean",round(st.mean(TN),3),"recalc",round(st.mean(calc),3))
print(">26 printed",sum(v>26 for v in TN),">25 printed",sum(v>25 for v in TN), ">=25", sum(v>=25 for v in TN))
ex=[v for nm,v in zip(names,TN) if nm not in("Park","Schaeffer")]
print("excl P/S mean",round(st.mean(ex),3), len(ex))
print("Todd S mean",round(st.mean(S),2),"max",round(max(S),2),names[S.index(max(S))])
# Kouri T2 -> S with Todd heights (drop Park & Schaeffer)
Hk=[h for nm,h in zip(names,H) if nm not in("Park","Schaeffer")]
Sk=[1.8*(N-6.1*(1.8-h))/h for N,h in zip(kn,Hk)]
print("Kouri S mean",round(st.mean(Sk),2),"max",round(max(Sk),2), "argmax", kn[Sk.index(max(Sk))], Hk[Sk.index(max(Sk))])
# Kouri implied fat per man using Todd heights/weights
Wk=[w for nm,w in zip(names,W) if nm not in("Park","Schaeffer")]
nm2=[nm for nm in names if nm not in("Park","Schaeffer")]
for nm,N,h,w in zip(nm2,kn,Hk,Wk):
    F=N-6.1*(1.8-h); bf=1-F*h*h/w
    print(f"  {nm:10s} implied Kouri fat using Todd H/W: {bf*100:5.1f}%")
