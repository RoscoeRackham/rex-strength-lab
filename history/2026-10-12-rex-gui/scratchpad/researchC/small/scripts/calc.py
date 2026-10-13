g=9.80665
gr=64.79891e-6  # kg per grain (exact)
fps=0.3048
mph=0.44704
ke=lambda m,v:0.5*m*v*v
print("apple medium", 0.182*g, "small",0.149*g,"xsmall",0.101*g,"large",0.223*g)
print("air rifle 12 ftlb", 12*1.355818, "pistol 6", 6*1.355818)
v=565/3.6; print("badminton v",v, "KE 4.74g",ke(4.74e-3,v),"5.50g",ke(5.50e-3,v),"mid 5.12",ke(5.12e-3,v))
print("pitch", ke(0.14529,105.8*mph), ke(0.14175,105.8*mph), ke(0.14883,105.8*mph))
m=112*gr; v=1263*fps; print("9mm M882 m",m,"v",v,"KE",ke(m,v), ke(m,1258*fps), ke(m,1268*fps))
m=62*gr; v=3025*fps; print("5.56 M855 m",m,"v",v,"KE",ke(m,v))
m=146*gr; v=2750*fps; print("7.62 M80 m",m,"v",v,"KE",ke(m,v))
m=661*gr; v=2910*fps; print(".50 M33 m",m,"v",v,"KE",ke(m,v),"NSWC 885+-9", ke(m,876),ke(m,885),ke(m,894))
print("Bolt",ke(95,12.42),ke(95,12.14),ke(95,12.20), "Coh2018 implied mass", 3932/4.2/g)
print("sugar tsp", 4.2*16.20*1000, "cube", 2.3*16.20*1000, "kcal tsp", 4.2*3.87)
print("Corolla 50", ke(1340.4,50/3.6), "30",ke(1340.4,30/3.6), "100", ke(1340.4,100/3.6), ke(1340,100/3.6))
print("lift 1 kg 1 m", g)
