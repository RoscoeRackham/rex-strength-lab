# Derivations for the "disaster" band (1e11-1e17 J). Inputs from fetched sources (see notes in facts).
import math
KT = 4.184e12          # J per kt TNT (NIST SP 811)
LB = 0.45359237        # kg per lb
MPH = 0.44704          # m/s per mph
GM = 3.986004418e14    # m^3/s^2, Earth
rows = {}
# Hubble: NASA 27,000 lb, ~17,000 mph
m = 27000*LB; v = 17000*MPH
rows['hubble'] = 0.5*m*v*v
rows['hubble_check_circ547km'] = 0.5*m*GM/(6.371e6+547e3)
# ISS: NASA 419,725 kg; 'orbiting Earth about every 90 minutes'; 'five miles per second'
m = 419725; T = 90*60
v90 = (2*math.pi*GM/T)**(1/3)
rows['iss_v_from_90min'] = v90
rows['iss'] = 0.5*m*v90**2
rows['iss_5mps'] = 0.5*m*(5*1609.344)**2
rows['beirut_0.50/0.75/1.12'] = (0.50*KT, 0.75*KT, 1.12*KT)
rows['tianjin_450t'] = 0.450*KT
rows['halifax_2.9kt'] = 2.9*KT
rows['hiroshima_15kt_12_18'] = (15*KT, 12*KT, 18*KT)
rows['sedan_104kt'] = 104*KT
rows['chelyabinsk_500_400_600_441'] = (500*KT, 400*KT, 600*KT, 441*KT)
rows['hoover_4.0_4.2e9kWh'] = (4.0e9*3.6e6, 4.2e9*3.6e6)
rows['bravo_15Mt'] = 15000*KT
rows['msh_24Mt_7Mt'] = (24000*KT, 7000*KT)
M = 7
rows['M7_GR_USGS_Me'] = (10**(1.5*M+4.8), 10**(5.24+1.44*M), 10**(1.5*(M+2.9)))
for k, val in rows.items(): print(k, val)
