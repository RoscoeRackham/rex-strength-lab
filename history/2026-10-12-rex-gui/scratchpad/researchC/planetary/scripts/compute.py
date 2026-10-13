import math
G = 6.67430e-11            # CODATA 2022
L = 3.828e26               # IAU 2015 nominal solar luminosity, W

# NASA NSSDCA fact sheets (fetched 2026-10-13)
moon = dict(M=0.07346e24, R=1737.4e3, GM=0.00490e6*1e9, v=1.022e3, moi=0.394)
earth = dict(M=5.9722e24, R=6371.0e3, v=29.78e3, moi=0.3308, Tsid_h=23.9345, Tyr_d=365.256, a=6378.137e3, c=6356.752e3)
mars = dict(M=0.64169e24, R=3389.5e3, moi=0.366)
pluto = dict(M=0.01303e24, R=1188e3, rho=1854)
jup = dict(M=1898.13e24, R=69911e3, v=13.06e3, moi=0.254)

def U_uniform(M, R): return 3*G*M*M/(5*R)
def U_poly(M, R, n): return 3/(5-n)*G*M*M/R

out = {}
# Sun for durations
for name, s in [('second',1),('minute',60),('hour',3600),('day',86400),('year_sidereal',earth['Tyr_d']*86400),('year_julian',365.25*86400)]:
    out['sun_'+name] = L*s
# Moon
out['moon_bind_uniform'] = U_uniform(moon['M'], moon['R'])
out['moon_bind_uniform_GM'] = 3*moon['GM']*moon['M']/(5*moon['R'])
out['moon_orbit_KE_earthframe'] = 0.5*moon['M']*moon['v']**2
mu = moon['M']*5.9724e24/(moon['M']+5.9724e24)
out['moon_orbit_KE_reduced'] = 0.5*mu*moon['v']**2
# Earth rotation
Om = 2*math.pi/(earth['Tsid_h']*3600)
R2 = (2*earth['a']**2 + earth['c']**2)/3   # NASA's radius^2 definition for C/MR^2
C_nasa = earth['moi']*earth['M']*R2
C_vilcu = 8.037308375e37   # EGM96, Vilcu 2009 table
out['Omega'] = Om
out['C_nasa'] = C_nasa
out['C_nasa_meanR'] = earth['moi']*earth['M']*earth['R']**2
out['earth_spin_KE_nasa'] = 0.5*C_nasa*Om**2
out['earth_spin_KE_vilcu'] = 0.5*C_vilcu*Om**2
# Earth orbit
out['earth_orbit_KE'] = 0.5*earth['M']*earth['v']**2
out['earthmoon_orbit_KE'] = 0.5*(earth['M']+moon['M'])*earth['v']**2
# Mars, Pluto, Jupiter binding
out['mars_bind_uniform'] = U_uniform(mars['M'], mars['R'])
out['pluto_bind_uniform'] = U_uniform(pluto['M'], pluto['R'])
out['pluto_density_check'] = pluto['M']/(4/3*math.pi*pluto['R']**3)
out['jup_bind_uniform'] = U_uniform(jup['M'], jup['R'])
out['jup_bind_n1'] = U_poly(jup['M'], jup['R'], 1)
out['jup_orbit_KE'] = 0.5*jup['M']*jup['v']**2
out['earth_bind_uniform'] = U_uniform(earth['M'], earth['R'])
out['n1_moi'] = 2/3 - 4/math.pi**2
for k, v in out.items(): print(f'{k:28s} {v:.4e}')
