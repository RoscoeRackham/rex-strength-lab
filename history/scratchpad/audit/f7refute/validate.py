import sys; sys.path.insert(0,'.')
from eqair import *
p=101325.0
print('--- 1 atm composition checks')
for T in [300,2000,3000,3500,4000,5000,6000,7000,8000,10000,15000,20000]:
    e=equil(T,p)
    # O2 dissociation fraction: atoms O / total O
    nO_atoms=sum(e['n'][i]*A[i,1] for i in range(len(S)))
    nN_atoms=sum(e['n'][i]*A[i,0] for i in range(len(S)))
    dO=1-2*e['n'][names.index('O2')]/nO_atoms - e['n'][names.index('NO')]/nO_atoms
    dN=1-2*e['n'][names.index('N2')]/nN_atoms - e['n'][names.index('NO')]/nN_atoms
    xe=frac(e,'e')
    print(f"T={T:6d} h={e['h']/1e6:8.3f} MJ/kg  O2 diss={dO:.3f} N2 diss={dN:.3f} x_e={xe:.3e} NO={frac(e,'NO'):.3e} res={e['res']:.1e}")
# cp check at 300K
e1=equil(299,p); e2=equil(301,p); print('cp(300K) J/kg/K', (e2['h']-e1['h'])/2, ' (expect ~1005)')
e=equil(288.15,p); print('h(288K)', e['h'], 'rho', e['rho'], '(expect 1.225)')
