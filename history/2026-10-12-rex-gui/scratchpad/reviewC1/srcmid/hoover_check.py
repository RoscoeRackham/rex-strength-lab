# Hoover Dam annual net generation (EIA-923 via EIA API v2), plants 154 (NV) + 8902 (AZ)
import json, sys
d = json.load(open(sys.argv[1]))
from collections import defaultdict
tot = defaultdict(float)
for r in d['response']['data']:
    if r.get('generation') is not None:
        tot[int(r['period'])] += float(r['generation'])
for y in sorted(tot): print(y, '%.2f TWh' % (tot[y] / 1e6))
avg = lambda a, b: sum(tot[y] for y in range(a, b + 1)) / (b - a + 1)
for a, b in [(2001, 2008), (2016, 2025), (2021, 2025)]:
    m = avg(a, b); print('%d-%d mean %.2f TWh = %.3g J (%+.0f%% vs the rung 4.0 TWh)' % (a, b, m / 1e6, m * 3.6e9, 100 * (m / 4e6 - 1)))
print('years >= 4.0 TWh since 2003:', [y for y in tot if y >= 2003 and tot[y] >= 4e6])
