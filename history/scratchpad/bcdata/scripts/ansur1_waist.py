import csv, sys, numpy as np
for fn in sys.argv[1:]:
    rows=list(csv.DictReader(open(fn,encoding='utf-8-sig')))
    keys=[k for k in rows[0] if 'WAIST' in k.upper()]
    nat=np.array([float(r['WAIST_CIRC_NATURAL']) for r in rows]); om=np.array([float(r['WAIST_CIRC-OMPHALION']) for r in rows])
    ok=(nat>0)&(om>0); r=nat[ok]/om[ok]; d=om[ok]-nat[ok]
    print(fn.split('/')[-1], 'n',ok.sum(), 'waist keys',keys)
    print('  ratio natural/omphalion median %.3f p5 %.3f p95 %.3f mean %.3f'%(np.median(r),np.percentile(r,5),np.percentile(r,95),r.mean()))
    print('  diff (omph-nat) median %.1f mm'%np.median(d), ' natural median %.1f omph median %.1f mm'%(np.median(nat[ok]),np.median(om[ok])))
