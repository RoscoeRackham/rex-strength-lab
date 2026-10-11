import sys; sys.path.insert(0,'/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/f7refute')
from stag import Tstag, ideal, rho0, p0atm
for v in [10000, 11000, 11200]:
    p_sl = rho0*v*v
    print(f"v={v}: sea-level p_stag={p_sl/p0atm:.0f} atm -> T_eq={Tstag(v,p_sl):.0f} K ; 1 atm -> T_eq={Tstag(v,p0atm):.0f} K ; ideal={ideal(v):.0f} K")
# Anderson's case: 52 km standard altitude, rho ~ 7.5e-4? compute p2 ~ rho*v^2
for rho in [7.0e-4, 8.0e-4]:
    v=11000; p=rho*v*v
    print(f"52 km-ish rho={rho}: p2~{p/p0atm:.2f} atm, T_eq(v=11 km/s)={Tstag(v,p):.0f} K")
