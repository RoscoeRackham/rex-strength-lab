# Kouri 1995 Table 2 normalized FFMI (k = 6.1) converted to S = 1.8*F/H, using each winner's
# height from Jan Todd 2008 (Iron Game History 10(3) p.15). Kouri's own heights (Willoughby 1970) were not published.
import statistics as st
t2 = [(1939,'Goodrich',24.3,1.79),(1939,'Essmaker',22.6,1.80),(1940,'Grimek',24.0,1.73),(1941,'Grimek',26.9,1.73),
      (1942,'Leight',25.5,1.80),(1943,'Bacon',23.9,1.70),(1944,'Stanko',27.3,1.82),(1945,'Ross',26.1,1.75),
      (1946,'Stephan',25.9,1.80),(1947,'Reeves',23.0,1.85),(1948,'Eiferman',27.7,1.70),(1949,'Delinger',28.0,1.68),
      (1950,'Farbotnik',26.5,1.75),(1951,'Hilligenn',26.0,1.68),(1953,'Pearl',25.8,1.77),(1954,'Dubois',25.4,1.85),
      (1955,'Klisanin',23.5,1.77),(1957,'Lacy',25.2,1.73),(1958,'Sansone',26.8,1.80),(1959,'Johnson',24.6,1.75)]
S = []
for y,n,N,H in t2:
    F = N - 6.1*(1.8-H); s = 1.8*F/H; S.append(s)
    print(y, n.ljust(10), 'N', N, 'H', H, 'plain F %.2f' % F, 'S %.2f' % s)
print('S mean %.2f sd %.2f max %.2f min %.2f; N mean %.2f' % (st.mean(S), st.stdev(S), max(S), min(S), st.mean([r[2] for r in t2])))
print('mean height', round(st.mean([r[3] for r in t2]),3))
