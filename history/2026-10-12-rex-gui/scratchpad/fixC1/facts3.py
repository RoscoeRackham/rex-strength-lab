"""Round 1 fixes (srchigh and copy lenses): plain displays for every rung's sources-table row, page phrases."""
import json
p = '/home/user/rex-strength-lab/rex-strength-lab/research/final-energy.json'
raw = open(p, encoding='utf-8').read(); d = json.loads(raw)
F = {f['key']: f for f in d['facts']}
DISPLAY = {
 'energy_apple_small_lift_one_metre': 'about 1 J (0.101 kg × 9.81 m/s² × 1 m)',
 'energy_sugar_teaspoon_food_energy': 'about 68 kJ (16 food Calories) per level teaspoon',
 'energy_m67_tnt_equivalent_estimate': "about 0.9 MJ (0.184 kg of Composition B, its explosive filler, × 5.02 MJ/kg); 1.0 MJ by the Army's TNT equivalence from a ballistic-mortar test (the work a charge does, compared with TNT)",
 'energy_month_of_food_2000_calories': 'about 0.25 GJ (30 days × 2,000 Calories)',
 'energy_tnt_equivalent_per_tonne': '1 ton of TNT = 4.184 × 10⁹ J by definition; 1 kt = 4.184 × 10¹² J; 1 Mt = 4.184 × 10¹⁵ J',
 'energy_beirut_explosion_2020': "about 0.3–1.1 kt of TNT in published estimates (0.13–2 kt at the extremes); 0.5 kt (2.1 TJ) used, Rigby et al.'s best estimate",
 'energy_hiroshima_yield': "15 kilotons of TNT (6.3 × 10¹³ J), the US Department of Energy's figure; a 2002 study of the radiation doses gives 16 ± 2 kt",
 'energy_chelyabinsk_meteor_2013': "about 500 ± 100 kt of TNT (1.7–2.5 PJ); NASA's fireball table: 441 kt",
 'energy_castle_bravo_yield': '15 megatons of TNT (6.3 × 10¹⁶ J); the highest-yield US nuclear test',
 'energy_tsar_bomba_yield': '50 megatons of TNT (2.1 × 10¹⁷ J) per its Soviet designers; US 1961 estimate 57 Mt',
 'energy_krakatoa_1883': "about 100–150 megatons of TNT (4.2–6.3 × 10¹⁷ J) judged from its air wave (Harkrider & Press); 125 Mt used. A tsunami paper gives 200 Mt (8.4 × 10¹⁷ J) for the third blast's total energy, with no source; other published figures run from about 10¹⁷ to 6.3 × 10¹⁸ J",
 'energy_hurricane_heat_per_day': "about 5.2 × 10¹⁹ J per day (6.0 × 10¹⁴ W), NOAA's worked figure for an average hurricane. NOAA gives no range; the lab treats it as rough (our estimate: real storms differ in size and rain rate by a factor of a few)",
 'energy_world_energy_use_year': "637.8 quadrillion Btu (British thermal units) in 2022 = 6.7 × 10²⁰ J (US EIA); the Energy Institute's figure for 2025, reported second-hand, is just over 600 EJ (6.0 × 10²⁰ J)",
 'energy_chicxulub_impact': 'about 5 × 10²³ J (2022 review); an older estimate from a larger crater goes up to 1.7 × 10²⁵ J',
 'energy_sun_luminosity': '3.828 × 10²⁶ W, so 3.8 × 10²⁶ J each second',
 'energy_pluto_gravitational_binding': 'about 6.5 × 10²⁷ J (layered models 6.3–6.7 × 10²⁷ J; 5.7 × 10²⁷ J if Pluto were uniform)',
 'energy_moon_orbital_kinetic': '3.8 × 10²⁸ J (7.346 × 10²² kg at a mean 1.022 km/s; 3.4–4.4 × 10²⁸ J between the slowest and fastest points of its orbit)',
 'energy_earth_rotational_kinetic': '2.1 × 10²⁹ J (its moment of inertia, 8.04 × 10³⁷ kg m², turning once every 23.9345 h)',
 'energy_sun_output_hour': '1.4 × 10³⁰ J (3.828 × 10²⁶ W for 3,600 s)',
 'energy_mars_gravitational_binding': '5.1 × 10³⁰ J (4.9 × 10³⁰ J for a uniform Mars)',
 'energy_sun_output_day': '3.3 × 10³¹ J (3.828 × 10²⁶ W for 86,400 s)',
 'energy_earth_gravitational_binding': 'about 2.49 × 10³² J (2.24 × 10³² J if Earth had uniform density)',
 'energy_earth_orbital_kinetic': '2.6 × 10³³ J (5.9722 × 10²⁴ kg at a mean 29.78 km/s)',
 'energy_sun_output_year': '1.2 × 10³⁴ J (3.828 × 10²⁶ W for one year, 365.256 days)',
 'energy_jupiter_orbital_kinetic': '1.6 × 10³⁵ J (1.898 × 10²⁷ kg at a mean 13.06 km/s)',
 'energy_sun_output_century': '1.2 × 10³⁶ J (3.828 × 10²⁶ W for 100 years)',
 'energy_sun_output_millennium': 'about 1.2 × 10³⁷ J (1,000 years at 3.828 × 10²⁶ W)',
 'energy_classical_nova': "about 10³⁸ J (Hernanz & José 2000); models give a few times 10³⁸ J of nuclear energy (Hillman & Gerbi 2022); NASA outreach: 'up to 100,000 times the annual energy output of our sun' (about 1.2 × 10³⁹ J)",
 'energy_magnetar_flare_2004': 'about 2 × 10³⁹ J in a fraction of a second; 0.5–7 × 10³⁹ J depending on its distance, which is still disputed (about 28,000 light-years, Bibby 2008; 31,000–61,000 light-years, Svirski 2011)',
 'energy_moon_mass_energy': 'about 6.6 × 10³⁹ J (7.346 × 10²² kg × c²)',
 'energy_sun_galactic_orbit_kinetic': 'about 6 × 10⁴⁰ J (½ × 1.9884 × 10³⁰ kg × (247 km/s)²)',
 'energy_earth_mass_energy': 'about 5.4 × 10⁴¹ J (5.9722 × 10²⁴ kg × c²)',
 'energy_supernova_light': 'about 10⁴² J for a core-collapse supernova; 10⁴²–10⁴³ J across such events; Type Ia about 6 × 10⁴² J',
 'energy_sun_output_billion_years': 'about 1.2 × 10⁴³ J (10⁹ years at 3.828 × 10²⁶ W)',
 'energy_supernova_blast': 'about 10⁴⁴ J; typically (0.5–2) × 10⁴⁴ J, and single events from about 10⁴³ J to a few times 10⁴⁴ J',
 'energy_jupiter_mass_energy': 'about 1.7 × 10⁴⁴ J (1.89813 × 10²⁷ kg × c²)',
 'energy_hypernova_sn1998bw': 'about 3 × 10⁴⁵ J in one spherical model (2–5 × 10⁴⁵ J); an aspherical model gives 2 × 10⁴⁴ J',
 'energy_supernova_total_neutrinos': "about 3 × 10⁴⁶ J, almost all of it in neutrinos ((3–5) × 10⁴⁶ J depending on the core's mass)",
 'energy_sun_mass_energy': 'about 1.8 × 10⁴⁷ J (1.9884 × 10³⁰ kg × c²)',
 'energy_gw150914': '3.0 ± 0.5 solar masses × c², about 5.4 × 10⁴⁷ J, given off in a fraction of a second',
}
for k, v in DISPLAY.items():
    F[k]['display'] = v
F['energy_earth_gravitational_binding']['label'] = "Earth's gravitational binding energy (from PREM, a standard model of Earth's interior)"
F['energy_hypernova_sn1998bw']['label'] = "SN 1998bw, an unusually energetic supernova linked to a gamma-ray burst; one model gives 3 × 10⁴⁵ J (a 'hypernova'), an aspherical model about 15 times less"
# page phrases
F['energy_pluto_gravitational_binding']['page_short'] = 'the energy to blow Pluto apart for good'
F['energy_mars_gravitational_binding']['page_short'] = 'the energy to blow Mars apart for good'
F['energy_air_rifle_england_wales_limit']['page_short'] = 'an air-rifle pellet at the licence-free limit in England and Wales'
F['energy_supernova_total_neutrinos']['page_short'] = 'the total energy of a massive star’s supernova (nearly all in neutrinos)'
# srchigh-1: the models' spread too
F['energy_supernova_blast']['notes'] += " Burrows & Vartanyan's models range from 0.09 to 2.3 Bethes (review round 1)."
for k in ['energy_pluto_gravitational_binding', 'energy_mars_gravitational_binding', 'energy_air_rifle_england_wales_limit', 'energy_supernova_total_neutrinos']:
    F[k]['notes'] += ' Page phrase reworded in review round 1.'
open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(d, ensure_ascii=False, indent=1) + '\n')
# the same IAU title slip in the presence facts (predates this branch)
pp = '/home/user/rex-strength-lab/rex-strength-lab/research/final-presence.json'
raw = open(pp, encoding='utf-8').read(); dp = json.loads(raw); n = 0
T = 'Mamajek, Prša, Torres et al. (2015) IAU 2015 Resolution B3 on recommended nominal conversion constants for selected solar and planetary properties, arXiv:1510.07674'
for f in dp['facts']:
    for s in f['sources']:
        if '1510.07674' in s['url'] and ('Prša et al. (2016)' in s['title'] or 'Prsa et al. (2016)' in s['title'] or 'AJ 152' in s['title']):
            s['title'] = T + ' (' + s['title'].split('(', 1)[-1] if '(existing' in s['title'] else T; n += 1
open(pp, 'w', encoding='utf-8', newline='\n').write(json.dumps(dp, ensure_ascii=False, indent=1) + ('\n' if raw.endswith('\n') else ''))
print('displays', len(DISPLAY), 'presence titles', n)
