import json,sys
d=json.load(open(sys.argv[1]))['response']['data']
yr={}
for r in d:
    if r['primeMover']!='ALL': continue
    yr.setdefault(int(r['period']),0); yr[int(r['period'])]+=float(r['generation'])
for y in sorted(yr): print(y, round(yr[y]/1e6,3),'TWh')
m=lambda a,b: sum(yr[y] for y in range(a,b+1))/(b-a+1)/1e6
print('2016-2025 mean',round(m(2016,2025),3)); print('2009-2025 mean',round(m(2009,2025),3))
print('1947-2025 mean', round((4.2*62+sum(yr[y] for y in range(2009,2026))/1e6)/79,3))
print('rows',len(d), set((r['plantCode'],r['plantName'],r['primeMover']) for r in d))
