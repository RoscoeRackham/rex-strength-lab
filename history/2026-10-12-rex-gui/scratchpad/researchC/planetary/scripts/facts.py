import json
NASA = 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/'
S = {
 'moon': {'title': 'NASA NSSDCA Moon Fact Sheet (last updated 11 Jan 2024)', 'url': NASA + 'moonfact.html'},
 'earth': {'title': 'NASA NSSDCA Earth Fact Sheet (last updated 15 Nov 2024)', 'url': NASA + 'earthfact.html'},
 'mars': {'title': 'NASA NSSDCA Mars Fact Sheet (last updated 19 May 2025)', 'url': NASA + 'marsfact.html'},
 'pluto': {'title': 'NASA NSSDCA Pluto Fact Sheet (last updated 11 Jan 2024)', 'url': NASA + 'plutofact.html'},
 'jup': {'title': 'NASA NSSDCA Jupiter Fact Sheet (last updated 2 Oct 2024)', 'url': NASA + 'jupiterfact.html'},
 'notes': {'title': 'NASA NSSDCA Notes on the fact sheets (parameter definitions)', 'url': NASA + 'fact_notes.html'},
 'G': {'title': 'NIST CODATA 2022: Newtonian constant of gravitation', 'url': 'https://physics.nist.gov/cgi-bin/cuu/Value?bg'},
 'iau': {'title': 'Prsa et al. (2016) Nominal values for selected solar and planetary quantities: IAU 2015 Resolution B2 and B3, arXiv:1510.07674 (PDF)', 'url': 'https://arxiv.org/pdf/1510.07674'},
 'nist811': {'title': 'NIST SP 811 Appendix B.9: conversion factors (time: hour, day, year)', 'url': 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9'},
 'vilcu': {'title': 'Vilcu (2009) On the elements of the Earth’s ellipsoid of inertia, An. Univ. Bucuresti Mat. 58(2):183-198, arXiv:1104.1033 (PDF)', 'url': 'https://arxiv.org/pdf/1104.1033'},
 'wikirot': {'title': 'Wikipedia: Rotational energy (cross-check only: 2.14 x 10^29 J)', 'url': 'https://en.wikipedia.org/wiki/Rotational_energy'},
 'carter': {'title': 'Carter, Lock & Stewart (2020) The energy budgets of giant impacts, JGR Planets 125, e2019JE006042, arXiv:1912.04936 (PDF, accepted version)', 'url': 'https://arxiv.org/pdf/1912.04936'},
 'carterpub': {'title': 'Caltech Authors record for Carter et al. 2020 (journal citation, DOI 10.1029/2019JE006042)', 'url': 'https://authors.library.caltech.edu/100357'},
 'stern': {'title': 'Stern et al. (2018) The Pluto System After New Horizons, Annu. Rev. Astron. Astrophys. 56 (DOI 10.1146/annurev-astro-081817-051935), arXiv:1712.05669 (PDF)', 'url': 'https://arxiv.org/pdf/1712.05669'},
 'ritter': {'title': 'Lynden-Bell & O’Dwyer (2001) One mass-radius relation for planets, white dwarfs and neutron stars, arXiv:astro-ph/0104450 (PDF; preprint, states Ritter’s formula)', 'url': 'https://arxiv.org/pdf/astro-ph/0104450'},
}
DER = 'derived 13 Oct 2026'
facts = []
def F(**k):
    k.setdefault('unit_si', 'J'); facts.append(k)

# ---------------- inputs
F(key='moon_mean_radius', category='space', label='Moon: volumetric mean radius', status='verified', value_si=1737.4e3, unit_si='m',
  display='1,737.4 km', sources=[S['moon']],
  notes='Fact sheet row "Volumetric mean radius (km) 1737.4" (equatorial 1738.1, polar 1736.0). The notes page defines it as "Radius of a sphere with the same volume as the body". Input for energy_moon_gravitational_binding. Mass reuses the existing verified moon_mass (7.346e22 kg, same sheet).',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='moon_moment_of_inertia_factor', category='space', label='Moon: moment of inertia factor', status='verified', value_si=0.394, unit_si='1',
  display='I/MR² = 0.394 (a uniform ball is 0.4)', sources=[S['moon'], S['notes']],
  notes='Fact sheet row "Moment of inertia (I/MR2) 0.394". The notes page: "A hollow spherical shell has a moment of inertia of 2/3, a homogeneous sphere 0.4". So the Moon is close to uniform, with a small dense core. Used only to size the correction to the uniform-ball binding energy.',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='moon_mean_orbital_speed', category='space', label='Moon: mean orbital speed around Earth', status='verified', value_si=1022.0, unit_si='m/s',
  low_si=970.0, high_si=1082.0,
  display='1.022 km/s mean (0.970 at apogee to 1.082 at perigee)', sources=[S['moon'], S['notes']],
  notes='Fact sheet, "Orbital parameters (for orbit about the Earth)": "Mean orbital velocity (km/s) 1.022", "Max. orbital velocity (km/s) 1.082", "Min. orbital velocity (km/s) 0.970" (the max and min use mean perigee and apogee, per the sheet’s footnote). The notes page defines mean orbital velocity as "The average speed of the body in elliptical orbit". Speed relative to Earth’s centre.',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='earth_mean_orbital_speed', category='space', label='Earth: mean orbital speed around the Sun', status='verified', value_si=29780.0, unit_si='m/s',
  low_si=29290.0, high_si=30290.0,
  display='29.78 km/s mean (29.29 at aphelion to 30.29 at perihelion)', sources=[S['earth']],
  notes='Fact sheet, Orbital parameters: "Mean orbital velocity (km/s) 29.78", "Max. orbital velocity (km/s) 30.29", "Min. orbital velocity (km/s) 29.29". Mass reuses the existing verified earth_mass (5.9722e24 kg, same sheet).',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='earth_sidereal_year', category='space', label='Earth: sidereal orbit period (one year)', status='verified', value_si=31558118.4, unit_si='s',
  display='365.256 days = 3.1558 x 10^7 s (NIST: year, sidereal = 3.155 815 x 10^7 s)', sources=[S['earth'], S['nist811']],
  notes='Earth fact sheet: "Sidereal orbit period (days) 365.256" (tropical 365.242). 365.256 x 86,400 s = 31,558,118 s. NIST SP 811 B.9 lists "year (sidereal) second (s) 3.155 815 E+07", "day (d) 8.64 E+04", "hour (h) 3.6 E+03", "minute (min) 6.0 E+01". Which year is used (365, 365.242, 365.25 or 365.256 days) changes a year of sunlight by under 0.1%.',
  who_when='NASA NSSDCA; NIST SP 811')
F(key='earth_polar_moment_of_inertia', category='space', label='Earth: moment of inertia about its spin axis (C)', status='verified', value_si=8.0373e37, unit_si='kg m^2',
  low_si=8.019e37, high_si=8.0374e37,
  display='C = 8.037 x 10^37 kg m² (EGM96 gravity model); NASA’s I/MR² = 0.3308 gives 8.019 x 10^37',
  sources=[S['vilcu'], S['earth'], S['notes']],
  notes='Vilcu, Table 4.a, EGM96 row: "C′ · 10^-37 [kg · m2] 8.037308375"; mean over nine gravity models "C = 8.037333747 · 10^37 kg · m2". NASA Earth sheet: "Moment of inertia (I/MR2) 0.3308", with radius^2 = (2a^2 + c^2)/3 per the notes page (a = 6378.137, c = 6356.752 km), giving 8.019e37. The two differ by 0.2%. Vilcu is a modest venue (Romanian university journal), so the NASA value is the low end. The existing collide_earth_inertia_rotation fact already holds NASA’s 0.3308.',
  who_when='Vilcu 2009 (EGM96); NASA NSSDCA')
F(key='mars_mass', category='space', label='Mars: mass', status='verified', value_si=6.4169e23, unit_si='kg',
  display='0.64169 x 10^24 kg', sources=[S['mars'], S['notes']],
  notes='Fact sheet row "Mass (10^24 kg) 0.64169". The notes page: mass is "GM(measured)/G(CODATA 2018)". Fact sheet GM 0.042828 x 10^6 km^3/s^2.',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='mars_mean_radius', category='space', label='Mars: volumetric mean radius', status='verified', value_si=3389.5e3, unit_si='m',
  display='3,389.5 km (equatorial 3,396.2, polar 3,376.2)', sources=[S['mars']],
  notes='Fact sheet row "Volumetric mean radius (km) 3389.5". Mean density 3,934 kg/m^3.',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='mars_moment_of_inertia_factor', category='space', label='Mars: moment of inertia factor', status='verified', value_si=0.366, unit_si='1',
  display='I/MR² = 0.366 (uniform ball 0.4)', sources=[S['mars']],
  notes='Fact sheet row "Moment of inertia (I/MR2) 0.366". Used to fit a core-and-mantle Mars for energy_mars_gravitational_binding.',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='pluto_mass', category='space', label='Pluto: mass', status='verified', value_si=1.303e22, unit_si='kg',
  display='0.01303 x 10^24 kg = (1.303 ± 0.003) x 10^22 kg', sources=[S['pluto'], S['stern']],
  notes='NASA sheet "Mass (10^24 kg) 0.01303". Stern et al. 2018, Table 1 (New Horizons): "Mass (kg) (1.303 ± 0.003) × 10^22", "Density (kg m–3) 1854 ± 6". The two agree.',
  who_when='NASA NSSDCA; Stern et al. 2018')
F(key='pluto_mean_radius', category='space', label='Pluto: radius', status='verified', value_si=1188.3e3, unit_si='m',
  display='1,188 km (New Horizons: 1,188.3 ± 0.8 km)', sources=[S['pluto'], S['stern']],
  notes='NASA sheet "Volumetric mean radius (km) 1188"; Stern et al. 2018 Table 1 "Radius (km) 1188.3 ± 0.8". Oblateness "<6%".',
  who_when='NASA NSSDCA; Stern et al. 2018')
F(key='pluto_rock_mass_fraction', category='space', label='Pluto: share of rock by mass (rock core under an ice mantle)', status='verified', value_si=0.655, unit_si='1',
  low_si=0.65, high_si=0.66,
  display='65.5 ± 0.5% rock by mass (anhydrous basis)', sources=[S['stern']],
  notes='Stern et al. 2018 Table 1: "Percent rock(b) by mass 65.5 ± 0.5", footnote "Calculated on an anhydrous basis". Text: Pluto and Charon would be "about 2/3 and 3/5 rock by mass" and these estimates hold "as long as both bodies are differentiated (have rock cores and ice mantles)"; the review cites evidence that Pluto is differentiated. A model-based figure (water ice plus rock), not a direct measurement.',
  who_when='Stern et al. 2018 (McKinnon et al. 2017)')
F(key='jupiter_mass', category='space', label='Jupiter: mass', status='verified', value_si=1.89813e27, unit_si='kg',
  display='1,898.13 x 10^24 kg', sources=[S['jup']],
  notes='Fact sheet row "Mass (10^24 kg) 1,898.13" (317.83 Earths). GM 126.687 x 10^6 km^3/s^2.',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='jupiter_mean_radius', category='space', label='Jupiter: volumetric mean radius', status='verified', value_si=69911e3, unit_si='m',
  display='69,911 km (to the 1-bar level; equatorial 71,492, polar 66,854)', sources=[S['jup'], S['notes']],
  notes='Fact sheet row "Volumetric mean radius (km) 69,911"; equatorial radius is given at the "(1 bar level)". The notes page: for Jupiter the diameter is "approximately to the visible cloud tops". Mean density 1,326 kg/m^3.',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='jupiter_moment_of_inertia_factor', category='space', label='Jupiter: moment of inertia factor', status='verified', value_si=0.254, unit_si='1',
  display='I/MR² = 0.254 (uniform ball 0.4)', sources=[S['jup']],
  notes='Fact sheet row "Moment of inertia (I/MR2) 0.254". Much less than 0.4: Jupiter’s mass is strongly concentrated toward its centre. Used to pick the polytrope for energy_jupiter_gravitational_binding.',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='jupiter_mean_orbital_speed', category='space', label='Jupiter: mean orbital speed around the Sun', status='verified', value_si=13060.0, unit_si='m/s',
  low_si=12440.0, high_si=13720.0,
  display='13.06 km/s mean (12.44 to 13.72)', sources=[S['jup']],
  notes='Fact sheet: "Mean orbital velocity (km/s) 13.06", "Max. orbital velocity (km/s) 13.72", "Min. orbital velocity (km/s) 12.44".',
  who_when='NASA NSSDCA, fetched 13 Oct 2026')
F(key='polytrope_binding_energy_formula', category='space', label='Ritter’s formula: binding energy of a polytrope', status='verified', value_si=0.75, unit_si='1',
  display='U = 3/(5 − n) × GM²/R; n = 0 (uniform) gives 0.6, n = 1 gives 0.75',
  sources=[S['ritter']],
  notes='Lynden-Bell & O’Dwyer, section 3: "The gravitational potential energy is −αGM^2/R where Ritter’s formula tells us that for polytropes α = 3/(5−n)", with "n = 0 corresponding to the homogeneous case". A classical textbook result (Ritter 1880; Chandrasekhar 1939); the source fetched is an arXiv preprint with no journal reference. Checked by our own Lane-Emden integration: n = 1 gives 0.7500 GM^2/R and I/MR^2 = 0.2614; n = 1.1 gives 0.7693 and 0.2494.',
  who_when='Ritter 1880, via Lynden-Bell & O’Dwyer 2001')

# ---------------- rungs: the Sun's output
def sun(key, label, secs, disp, short, extra):
    F(key=key, category='energy_reference', label=label, status='derived', value_si=3.828e26 * secs,
      display=disp, sources=[S['iau'], S['nist811']] + extra, page_short=short,
      notes='E = L x t with L = 3.828e26 W (IAU 2015 nominal solar luminosity; PDF: "1 L N⊙ = 3.828 × 10^26 W"; existing verified key energy_sun_luminosity) and t = %s s. The IAU’s best estimate is 3.8275 ± 0.0014 e26 W, so the value is good to about 0.1%%; the Sun’s output also varies about 0.1%% over its 11-year cycle. Counts light and heat only, not the roughly 2%% carried off by neutrinos. Firm: the page can give a plain multiple.' % (format(secs, ',')),
      who_when=DER)
sun('energy_sun_output_minute', 'The Sun’s output for one minute', 60, '2.3 x 10^28 J (3.828 x 10^26 W for 60 s)', 'the Sun’s output for one minute', [])
sun('energy_sun_output_hour', 'The Sun’s output for one hour', 3600, '1.4 x 10^30 J (3.828 x 10^26 W for 3,600 s)', 'the Sun’s output for one hour', [])
sun('energy_sun_output_day', 'The Sun’s output for one day', 86400, '3.3 x 10^31 J (3.828 x 10^26 W for 86,400 s)', 'the Sun’s output for one day', [])
sun('energy_sun_output_year', 'The Sun’s output for one year', 31558118.4, '1.2 x 10^34 J (3.828 x 10^26 W for one sidereal year, 365.256 days)', 'the Sun’s output for one year', [S['earth']])

# ---------------- rungs: blow it apart
F(key='energy_pluto_gravitational_binding', category='energy_reference', label='Pluto’s gravitational binding energy (the energy to blow Pluto apart)', status='estimate',
  value_si=6.6e27, low_si=5.72e27, high_si=6.74e27,
  display='about 6.6 x 10^27 J (5.7 x 10^27 J if Pluto were uniform)', page_short='the energy to blow Pluto apart',
  sources=[S['pluto'], S['stern'], S['G']],
  notes='Energy to scatter all of Pluto to infinity. Uniform ball: 3GM^2/(5R), G = 6.6743e-11 (CODATA 2022), M = 1.303e22 kg, R = 1,188.3 km: 5.72e27 J, a lower bound for any body denser at the centre. Pluto has a rock core under an ice mantle, 65.5% rock by mass (pluto_rock_mass_fraction). Our two-layer model, ice at 950-1,000 kg/m^3 (an assumption, not sourced) and rock filling the rest to match the mass, puts the core at 820-850 km radius and 3,400-3,700 kg/m^3 and gives 6.56-6.71e27 J. Value 6.6e27 J. Ignores porosity, an ocean and compression; spread under 20%, so firm enough for a plain multiple.',
  who_when=DER)
F(key='energy_moon_gravitational_binding', category='energy_reference', label='The Moon’s gravitational binding energy (the energy to blow the Moon apart)', status='derived',
  value_si=1.25e29, low_si=1.244e29, high_si=1.255e29,
  display='1.25 x 10^29 J (1.24 x 10^29 J for a uniform Moon)', page_short='the energy to blow the Moon apart',
  sources=[S['moon'], S['G'], S['notes']],
  notes='Uniform ball: U = 3GM^2/(5R), G = 6.6743e-11, M = 7.346e22 kg (existing moon_mass), R = 1,737.4 km: 1.244e29 J (with the sheet’s GM = 0.00490 x 10^6 km^3/s^2 instead of G x M: 1.243e29). The Moon is nearly uniform (I/MR^2 = 0.394 vs 0.4). A two-layer Moon fitted to that value and its mass, for any core radius 300-500 km, gives 1.254e29 J. Value 1.25e29 J, good to about 1%. Ignores the Moon’s slight flattening and compression of its rock.',
  who_when=DER)
F(key='energy_mars_gravitational_binding', category='energy_reference', label='Mars’s gravitational binding energy (the energy to blow Mars apart)', status='derived',
  value_si=5.1e30, low_si=4.86e30, high_si=5.12e30,
  display='5.1 x 10^30 J (4.9 x 10^30 J for a uniform Mars)', page_short='the energy to blow Mars apart',
  sources=[S['mars'], S['G']],
  notes='Uniform ball: 3GM^2/(5R), G = 6.6743e-11, M = 6.4169e23 kg, R = 3,389.5 km: 4.865e30 J (a lower bound). Mars is denser at the centre (I/MR^2 = 0.366 vs 0.4 uniform). A two-layer Mars (iron core, rock mantle) fitted to the mass and that moment of inertia gives 5.10-5.12e30 J for any core radius 1,500-2,000 km (core 5,900-8,300, mantle 3,420-3,520 kg/m^3). Value 5.1e30 J, good to a few percent. Ignores Mars’s flattening and finer layering.',
  who_when=DER)
F(key='energy_jupiter_gravitational_binding', category='energy_reference', label='Jupiter’s gravitational binding energy (the energy to blow Jupiter apart)', status='derived',
  value_si=2.6e36, low_si=2.06e36, high_si=2.7e36,
  display='about 2.6 x 10^36 J (2.1 x 10^36 J if Jupiter were uniform)', page_short='the energy to blow Jupiter apart',
  sources=[S['jup'], S['G'], S['ritter']],
  notes='Ritter’s formula U = 3/(5-n) GM^2/R, M = 1.89813e27 kg, R = 69,911 km, G = 6.6743e-11. Uniform (n = 0): 2.06e36 J, a strict lower bound. Jupiter is far denser at the centre (I/MR^2 = 0.254). By our Lane-Emden integration a polytrope with n = 1.06 has that moment of inertia and gives 0.762 GM^2/R = 2.62e36 J; n = 1 (I/MR^2 = 0.261) gives 2.58e36. High end 2.7e36 is n = 1.2, more condensed than Jupiter (I/MR^2 = 0.238). Value 2.6e36 J. Ignores Jupiter’s rapid spin and flattening (6.5%) and real layering; within about 10%.',
  who_when=DER)

# ---------------- rungs: motion
F(key='energy_moon_orbital_kinetic', category='energy_reference', label='The Moon’s kinetic energy in its orbit around Earth', status='derived',
  value_si=3.84e28, low_si=3.46e28, high_si=4.30e28,
  display='3.8 x 10^28 J (7.346 x 10^22 kg at a mean 1.022 km/s)', page_short='the energy of the Moon’s motion around Earth',
  sources=[S['moon']],
  notes='KE = mv^2/2 with m = 7.346e22 kg (existing moon_mass) and v = 1.022 km/s mean speed relative to Earth (moon_mean_orbital_speed): 3.84e28 J. It swings from 3.46e28 J at apogee (0.970 km/s) to 4.30e28 J at perigee (1.082 km/s) each month. Measured from the Earth-Moon centre of mass (the two-body energy, reduced mass x v^2/2) it is 3.79e28 J, 1% less. Energy of motion only: stopping the Moon would release this much, not more; it is not the energy to remove the Moon from orbit. Firm.',
  who_when=DER)
F(key='energy_earth_rotational_kinetic', category='energy_reference', label='Earth’s rotational kinetic energy (the energy of its daily spin)', status='derived',
  value_si=2.14e29, low_si=2.13e29, high_si=2.14e29,
  display='2.1 x 10^29 J (C = 8.04 x 10^37 kg m², one turn per 23.9345 h)', page_short='the energy of Earth’s spin',
  sources=[S['vilcu'], S['earth']] + [S['wikirot']],
  notes='KE = CΩ^2/2. C = 8.0373e37 kg m^2 (earth_polar_moment_of_inertia, EGM96); Ω = 2π/(23.9345 h x 3,600) = 7.2921e-5 rad/s (existing earth_sidereal_rotation, NASA). Gives 2.137e29 J; NASA’s I/MR^2 = 0.3308 gives 2.132e29 J. Wikipedia’s Rotational energy page gives the same 2.14e29 J (cross-check only). Spin relative to the stars (sidereal day). Tidal friction slowly drains it (not quantified here). Firm.',
  who_when=DER)
F(key='energy_earth_orbital_kinetic', category='energy_reference', label='Earth’s kinetic energy in its orbit around the Sun', status='derived',
  value_si=2.65e33, low_si=2.56e33, high_si=2.74e33,
  display='2.6 x 10^33 J (5.9722 x 10^24 kg at a mean 29.78 km/s)', page_short='the energy of Earth’s motion around the Sun',
  sources=[S['earth']],
  notes='KE = mv^2/2 with m = 5.9722e24 kg (existing earth_mass) and v = 29.78 km/s (earth_mean_orbital_speed): 2.648e33 J. Over a year it runs from 2.56e33 J (29.29 km/s, aphelion) to 2.74e33 J (30.29 km/s, perihelion). Speed relative to the Sun; adding the Moon, which travels with Earth, gives 2.68e33 J (1% more). Energy of motion only, not the energy to free Earth from the Sun. Firm.',
  who_when=DER)
F(key='energy_jupiter_orbital_kinetic', category='energy_reference', label='Jupiter’s kinetic energy in its orbit around the Sun', status='derived',
  value_si=1.62e35, low_si=1.47e35, high_si=1.79e35,
  display='1.6 x 10^35 J (1.898 x 10^27 kg at a mean 13.06 km/s)', page_short='the energy of Jupiter’s motion around the Sun',
  sources=[S['jup']],
  notes='KE = mv^2/2 with m = 1.89813e27 kg (jupiter_mass) and v = 13.06 km/s (jupiter_mean_orbital_speed): 1.619e35 J. It runs from 1.47e35 J (12.44 km/s) to 1.79e35 J (13.72 km/s) over Jupiter’s 12-year orbit. Speed relative to the Sun; the Sun’s own wobble around the shared centre of mass (about 1/1,000 of Jupiter’s speed) is ignored. Energy of motion only. Firm.',
  who_when=DER)

# ---------------- alternative: Moon-forming impact
F(key='energy_moon_forming_impact', category='energy_reference', label='The giant impact that formed the Moon: collision energy', status='disputed',
  value_si=4.8e31, low_si=2.9e31, high_si=8.2e31,
  display='roughly 3 to 8 x 10^31 J, depending on which proposed impact made the Moon', page_short='the impact that made the Moon',
  sources=[S['carter'], S['carterpub']],
  notes='Collision energy in the centre-of-mass frame, 0.5 μ v^2 with μ = mM/(m+M) (the paper’s Q_R x total mass), from Carter et al. Table 1 (M, m in Earth masses of 5.9722e24 kg; v_i): canonical 0.90 + 0.13 at 9.2 km/s = 2.9e31 J; similar-mass 0.57 + 0.47 at 9.7 = 7.2e31; spinning proto-Earth 1.05 + 0.05 at 20 = 5.7e31; partial accretion 0.75 + 0.30 at 11.3 = 8.2e31. Heat left at 24 h (Table 1, ΔE_int): 2.3-6.3e31 J. Check: these inputs reproduce the paper’s Q_S column (4.6e5 and 5.7e6 J/kg for the first two). Abstract: "the specific impact parameters are under debate". Value 4.8e31 J is the geometric middle of the range, not a best estimate. Uncertain by about 1.7x either way and the scenario itself is unknown: use a rough multiple.',
  who_when='Carter, Lock & Stewart 2020; derived 13 Oct 2026')

for f in facts:
    assert len(f['notes']) < 900, (f['key'], len(f['notes']))
print(len(facts))
json.dump(facts, open('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/researchC/planetary/facts.json', 'w'), indent=1, ensure_ascii=False)
for f in facts: print(f['key'], len(f['notes']), f.get('value_si'))
