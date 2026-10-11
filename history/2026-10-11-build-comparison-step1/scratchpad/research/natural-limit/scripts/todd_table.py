# Recompute Jan Todd (2008, Iron Game History 10(3)) table of Mr America normalized FFMI.
rows = [
 (1939,'Bert Goodrich',1.79,88.5,0.11,24.64356609),
 (1939,'Roland Essmaker',1.8,82,0.10,22.77777778),
 (1940,'John Grimek',1.73,87.5,0.07,27.61634812),
 (1941,'John Grimek',1.73,100.5,0.07,31.99170313),
 (1942,'Frank Leight',1.8,94.8,0.09,26.62592593),
 (1943,'Jules Bacon',1.7,76.2,0.07,25.13110727),
 (1944,'Steve Stanko',1.82,101.25,0.09,27.69393407),
 (1945,'Clancy Ross',1.75,87.09,0.09,26.18317143),
 (1946,'Alan Stephan',1.8,93,0.09,26.12037037),
 (1947,'Steve Reeves',1.85,87,0.08,23.08141344),
 (1948,'George Eiferman',1.7,88,0.09,28.31934256),
 (1949,'Jack Delinger',1.68,88,0.09,29.10501587),
 (1950,'John Farbotnik',1.75,88,0.10,26.16622449),
 (1951,'Roy Hilligenn',1.68,81,0.07,27.42205102),
 (1952,'Jim Park',1.77,84,0.08,24.85024121),
 (1953,'Bill Pearl',1.77,91.17,0.08,26.95576645),
 (1954,'Dick Dubois',1.85,98,0.08,26.03831629),
 (1955,'Steve Klisanin',1.77,83.9,0.09,24.55307246),
 (1956,'Ray Schaeffer',1.78,95.25,0.08,27.77949274),
 (1957,'Ron Lacy',1.73,84,0.09,26.06744572),
 (1958,'Tom Sansone',1.8,96.25,0.08,27.33024691),
 (1959,'Harry Johnson',1.75,84.5,0.09,25.41357143),
]
import statistics as st
calc = []
for y,n,h,w,bf,todd in rows:
    ffm = w*(1-bf)
    f = ffm/h**2
    n61 = f + 6.1*(1.8-h)
    S = 1.8*ffm/h**3
    calc.append((y,n,h,w,bf,todd,round(n61,2),round(S,2)))
    flag = '' if abs(n61-todd) < 0.02 else '  <-- mismatch'
    print(y, n.ljust(16), h, w, bf, 'Todd', round(todd,2), 'recalc(6.1)', round(n61,2), 'S@1.8', round(S,2), flag)
t = [r[5] for r in rows]
print('n', len(t), 'mean', round(st.mean(t),2), 'sd', round(st.stdev(t),2), 'max', round(max(t),2), '>26:', sum(x>26 for x in t), '>25:', sum(x>25 for x in t))
t20 = [r[5] for r in rows if r[1] not in ('Jim Park','Ray Schaeffer')]
print('excl Park & Schaeffer: n', len(t20), 'mean', round(st.mean(t20),2))
S = [c[7] for c in calc]
print('rescaled S: mean', round(st.mean(S),2), 'max', max(S), 'min', min(S))
print('bf range', min(r[4] for r in rows), max(r[4] for r in rows))
