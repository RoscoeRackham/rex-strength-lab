import json,sys
d=json.load(open(sys.argv[1]))['response']['data']
by={}
for r in d:
    if r['generation'] is None: continue
    by.setdefault(int(r['period']),{})[r['plantCode']]=float(r['generation'])
tot={y:sum(v.values())/1e6 for y,v in by.items() if len(v)==2}  # TWh
for y in sorted(by): print(y, {k:round(v/1e6,3) for k,v in by[y].items()}, 'total TWh', round(tot.get(y,float('nan')),3))
def mean(a,b):
    ys=[y for y in tot if a<=y<=b]; return sum(tot[y] for y in ys)/len(ys), len(ys)
for a,b in [(2001,2008),(2001,2025),(2016,2025),(2021,2025)]:
    m,n=mean(a,b); print(f'{a}-{b}: mean {m:.2f} TWh over {n} yrs = {m*3.6e15:.3g} J; vs 1.44e16 -> {m*3.6e15/1.44e16*100:.0f}%')
print('years >=4.0 TWh since 2002:', [y for y in tot if y>=2002 and tot[y]>=4.0])
