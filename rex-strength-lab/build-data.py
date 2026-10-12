#!/usr/bin/env python3
"""Build src/data.js from the verified research datasets in research/final-*.json.

Every number the page shows is either pulled from a research fact (with its status and
sources) or marked as an estimate made for the sim, with the reasoning in the source table.
"""
import json
import math
import os
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
FACTS = {}
for topic in ['humans', 'fiction', 'objects', 'environment', 'density', 'duo', 'presence']:
    for f in json.load(open(os.path.join(HERE, 'research', f'final-{topic}.json'), encoding='utf-8'))['facts']:
        FACTS[f['key']] = f

ST = 907.18474  # US short ton, kg (Marvel handbook tons read as short tons)
G = 9.80665
RANK = {'verified': 0, 'canon_stated': 1, 'derived': 2, 'reported': 3, 'estimate': 4, 'claimed': 5, 'disputed': 6, 'not_quantified': 7}
# Canon only per press accounts or reviews; the page itself was not seen (see research notes).
REPORTED = {'secret_wars_4_hulk_mountain', 'all_star_superman_200_quintillion', 'superman_v3_13_earth_bench'}



# Lowercase a label's first letter after "Area: ", unless the first word is an acronym, a code (BS 5228-2, RI 8507)
# or a name (Rex's, Krakatoa, Caltrans).
NAMES = {'Rex', "Rex's", 'Ollie', "Ollie's", 'Krakatoa', 'Chicxulub', 'Caltrans', 'Eiband', 'Baines', 'Keller', 'Carden', 'Schanz', 'Steinmann',
         'Wood', 'Panagiotopoulou', 'Larramendi', 'Alexander', 'Kram', 'Yoon', 'Rawcliffe', 'Bohannon', 'Nilsson', 'Tudor-Locke', 'Fukuchi',
         'Harkrider', 'Morgan', 'Taylor', 'Siskind', 'Murray', 'Wald', 'Fraser', 'Cochran', 'Stapp', 'Kinney', 'Lamb', 'Lamb’s', "Lamb's",
         'Mortimer', 'Wijayaraja', 'Hiller', 'Whiffen', 'Reiher', 'Wiss', 'Takahashi', 'Pisa', 'Etosha', 'Africa', 'African', 'Asian', 'Sri',
         'Cauchy', "Cauchy's", 'Mayne', 'Bornitz', 'Sutton', 'Woods', 'Whiffin', 'Irish', 'Atherton', 'Sirius', 'Newtonian', 'Schwarzschild', 'Buchdahl', 'Stevenson', 'World', 'Taylor', 'Newton', "Newton's", 'Faraday', 'Rayleigh', 'Bondi', 'Jurassic', 'Earth', "Earth's", 'Mach', 'Froude', 'OSHA', 'ASTM', 'NASA'}


def lower_first(t):
    w = t.split(' ')[0].rstrip(':,;')
    w = w[:-2] if w.endswith("'s") or w.endswith('’s') else w
    if w in NAMES or w.split('/')[0] in NAMES or w.split('–')[0] in NAMES or '/' in w or (len(w) > 1 and (w[1].isupper() or w[1].isdigit())) or any(ch.isdigit() for ch in w) or w[0] in '“"(':
        return t
    return t[0].lower() + t[1:]


def fact(key):
    if key not in FACTS:
        raise KeyError(key)
    return FACTS[key]


def src(*keys, limit=2):
    out = []
    for k in keys:
        for s in fact(k)['sources'][:limit]:
            if s['url'] not in [o['url'] for o in out]:
                out.append({'url': s['url'], 'title': s.get('title') or ''})
    return out


def status(*keys):
    return max(('reported' if k in REPORTED else fact(k)['status'] for k in keys), key=lambda s: RANK.get(s, 9))


rows = []


def row(label, value, keys=(), st=None, extra_sources=None, note=None):
    rows.append({
        'label': label,
        'value': value,
        'status': st or (status(*keys) if keys else 'estimate'),
        'sources': (src(*keys) if keys else []) + (extra_sources or []),
        'note': note,
    })


WIKI_RR = {'url': 'https://en.wikipedia.org/wiki/Rolling_resistance', 'title': 'Wikipedia: Rolling resistance'}

# ----------------------------------------------------------------------------- tiers
tiers = [
    dict(id='cap', chip=None, lift='press', label='Captain America', who='Official Handbook (1986): presses 800 lb', liftKg=fact('captain_america_handbook_strength')['value_si'],
         note='Marvel handbook figures are overhead presses. 800 lb is 1.6× the heaviest log press on record (231 kg).', keys=['captain_america_handbook_strength']),
    dict(id='human', chip='Strongest human', lift='deadlift', label='Strongest human', who='Raúl Flores, 511 kg deadlift, Sept 2026', liftKg=511,
         note='Suit and straps allowed. Without a suit: 492.5 kg in raw powerlifting (Engelbrecht, 2026, sumo, no straps); 474.5 kg in strongman (Björnsson, 2019).', keys=['strongman_deadlift_wr']),
    dict(id='backlift', chip=None, lift='back lift', label='Back-lift record', who='Gregg Ernst, 2,422 kg, 1993', liftKg=fact('back_lift_record_ernst')['value_si'],
         note='Raised a platform with two cars just clear of its supports. Huge force, almost no distance.', keys=['back_lift_record_ernst']),
    dict(id='spidey', chip='Spider-Man', lift='press', label='Spider-Man', who='Official Handbook (1986): ~10 tons', liftKg=10 * ST,
         note='Raised to 20 tons in a 2007 profile.', keys=['spider_man_handbook_1986']),
    dict(id='hulk', chip='Hulk & Thor', lift='press', label='Hulk & Thor (Class 100)', who='Official Handbook (1986): “in excess of 100 tons”', liftKg=100 * ST,
         note='A floor, not a ceiling: Class 100 has no upper limit. Thor doubles it with his belt.', keys=['hulk_handbook_1986_enraged', 'thor_handbook_1986']),
    dict(id='secretwars', chip='Hulk, Secret Wars', label='Hulk holds a mountain range', who='Secret Wars #4 (1984): 150 billion tons, per press accounts', liftKg=150e9 * ST,
         note='Quoted from Reed Richards; the panel itself was not seen.', keys=['secret_wars_4_hulk_mountain']),
    dict(id='allstar', chip='All-Star Superman', label='All-Star Superman', who='All-Star Superman #1 (2005): 200 quintillion tons, per reviews', liftKg=200e18 * ST,
         note='The issue and exact wording are unconfirmed; it may be a force rather than a literal object.', keys=['all_star_superman_200_quintillion']),
    dict(id='earth', chip='Superman benches Earth', label='Superman benches Earth', who='Superman vol. 3 #13 (2012): Earth’s weight, per a review', liftKg=fact('earth_mass_reference')['value_si'],
         note='“Weight of a planet” has no real meaning; read here as Earth’s mass at 1 g.', keys=['superman_v3_13_earth_bench', 'earth_mass_reference']),
    dict(id='inf', chip='∞', label='Infinite', who='No limit at all', liftKg=float('inf'), note='', keys=[]),
]
for t in tiers:
    if t['keys']:
        row('Strength: ' + t['label'], t['who'].split(': ')[-1] if ': ' in t['who'] else t['who'], t['keys'])
row('Log press world record (Captain America comparison)', fact('log_press_wr')['display'], ['log_press_wr'])
row('Deadlift without a suit: raw powerlifting', fact('powerlifting_deadlift_raw_wr')['display'], ['powerlifting_deadlift_raw_wr'])
row('Deadlift without a suit: strongman (elephant bar)', fact('strongman_deadlift_no_suit_elephant_bar')['display'], ['strongman_deadlift_no_suit_elephant_bar'])
row('Strength: Spider-Man, later profile', fact('spider_man_profile_2007_20_tons')['display'], ['spider_man_profile_2007_20_tons'])

# ----------------------------------------------------------------------------- surfaces
surfaces = [
    dict(id='sand', name='Loose dry sand', short='loose sand', qult=37e3, granular=True, Bref=0.316, mu=0.58, shear=1e3, rho=1600,
         k_q='ground_loose_sand_ultimate_bearing_small_footing', k_mu='ground_loose_sand_claw_traction_coefficient'),
    dict(id='gravel', name='Dense sand and gravel', short='dense gravel', qult=240e3, granular=True, Bref=0.316, mu=0.84, shear=3e3, rho=2000,
         k_q='ground_dense_sand_gravel_ultimate_bearing_small_footing', k_mu='ground_dense_sand_gravel_claw_traction_coefficient'),
    dict(id='softclay', name='Soft clay', short='soft clay', qult=129e3, mu=0.25, shear=20e3, rho=1700,
         k_q='ground_soft_clay_ultimate_bearing_small_footing', k_mu='ground_soft_clay_traction'),
    dict(id='stiffclay', name='Stiff clay', short='stiff clay', qult=480e3, mu=0.45, shear=75e3, rho=1900,
         k_q='ground_stiff_clay_ultimate_bearing_small_footing', k_mu='ground_stiff_clay_traction'),
    dict(id='asphalt', name='Asphalt road', short='asphalt', qult=2.5e6, mu=0.7, shear=0.7e6, rho=2300,
         k_q='ground_asphalt_ultimate_bearing_small_punch', k_mu='ground_asphalt_claw_traction_coefficient'),
    dict(id='concrete', name='Concrete slab (10 cm garage floor)', short='the concrete slab', qult=2.5e6, mu=0.6, shear=1.5e6, rho=2400,
         k_q='ground_concrete_slab_on_grade_punch_through_estimate', k_mu='ground_concrete_claw_traction_coefficient'),
    dict(id='ice', name='Thick lake ice', short='the ice', qult=5e6, mu=0.1, shear=1e6, rho=917,
         k_q='ground_freshwater_ice_compressive_strength', k_mu='ground_ice_claw_traction_coefficient'),
    dict(id='steel', name='Steel deck plate', short='the steel deck', qult=0.75e9, mu=0.3, shear=144e6, rho=7850,
         k_q='ground_steel_indentation_pressure', k_mu='ground_steel_claw_traction_coefficient'),
    dict(id='granite', name='Granite bedrock', short='granite', qult=1.7e9, mu=0.5, shear=36e6, rho=2700,
         k_q='ground_granite_ultimate_bearing_small_punch', k_mu='ground_granite_claw_traction_coefficient'),
]
for s in surfaces:
    row('Ground limit: ' + s['name'], fact(s['k_q'])['display'], [s['k_q']])
    row('Grip (friction): ' + s['name'], 'μ ≈ ' + str(s['mu']) + ' (' + fact(s['k_mu'])['display'] + ')', [s['k_mu']])
row('Ground shear strength (where the ground tears out around bolted feet)', 'sand 1 kPa · gravel 3 kPa (no cohesion: passive resistance only) · clays = undrained strength · asphalt 0.7 MPa · concrete 1.5 MPa · ice 1 MPa · steel 144 MPa · granite 36 MPa',
    ['ground_soft_clay_undrained_shear_strength', 'ground_granite_intact_cohesion_estimate', 'ground_steel_shear_yield', 'ground_concrete_punching_shear_stress_aci'], st='estimate')

# ----------------------------------------------------------------------------- objects
TUMBLE = (1.15, 1.75)  # subsonic, supersonic Cd for a tumbling bluff body
SPHERE = (0.46, 0.92)


def obj(id, name, short, group, m, area, cd, crush=None, rho=None, L=None, crr=None, keys=(), extra=None, **kw):
    d = dict(id=id, name=name, short=short, group=group, m=m, area=area, Cd=cd[0], CdSup=cd[1])
    if crush:
        d['crush'] = crush
    if rho:
        d['rho'] = rho
    if L:
        d['L'] = L
    if crr is not None:
        d['crr'] = crr
    d.update(kw)
    d['_keys'] = list(keys)
    return d


objects = [
    obj('baseball', 'Baseball', 'baseball', 'Everyday', 0.1453, 0.00427, (0.35, 0.92), rho=680, keys=['baseball_mass', 'baseball_cross_section_area', 'cd_baseball_subsonic']),
    obj('shot', 'Shot put (men’s, 7.26 kg)', 'shot', 'Everyday', 7.26, 0.0113, SPHERE, crush=750e6, crushWhole=True, rho=8000, keys=['shot_put_men_mass', 'shot_put_cross_section_area', 'mat_grey_cast_iron']),
    obj('person', 'A person (average US man, 90 kg)', 'person', 'People', fact('human_us_adult_male_mass')['value_si'], fact('human_projected_area')['value_si'], TUMBLE, rho=985, passenger=True,
        keys=['human_us_adult_male_mass', 'human_projected_area']),
    obj('bowling', 'Bowling ball (16 lb)', 'bowling ball', 'Everyday', 7.257, 0.037, SPHERE, rho=1340, keys=['bowling_ball_max_mass', 'bowling_ball_cross_section_area']),
    obj('piano', 'Steinway Model D grand piano', 'piano', 'Everyday', 480, 4.3, TUMBLE, crush=10e6, rho=110, keys=['steinway_model_d_mass', 'steinway_model_d_projected_area', 'mat_hard_maple']),
    obj('motorcycle', 'Motorcycle', 'motorcycle', 'Vehicles', 183, 2.4, TUMBLE, crush=3e6, rho=100, crr=0.012, keys=['motorcycle_typical_mass', 'motorcycle_projected_area']),
    obj('car', 'Toyota Corolla', 'car', 'Vehicles', 1340, 8.7, TUMBLE, crush=3e6, rho=115, crr=0.012, keys=['toyota_corolla_curb_mass', 'toyota_corolla_projected_area', 'mat_dc04_mild_steel']),
    obj('pickup', 'Ford F-150 pickup', 'pickup', 'Vehicles', 2241, 13.7, TUMBLE, crush=3e6, rho=95, crr=0.012, keys=['ford_f150_curb_mass', 'ford_f150_projected_area']),
    obj('bus', 'School bus (Type C)', 'bus', 'Vehicles', 9525, 35, TUMBLE, crush=3e6, rho=125, crr=0.008, keys=['school_bus_type_c_curb_mass', 'school_bus_projected_area']),
    obj('semi', 'Semi truck, fully loaded', 'semi', 'Vehicles', 36287, 79, TUMBLE, crush=5e6, rho=155, crr=0.007, keys=['semi_truck_80000lb_mass', 'semi_truck_projected_area', 'mat_truck_frame_rail']),
    obj('tank', 'M1A2 Abrams tank', 'tank', 'Vehicles', 66769, 28.7, TUMBLE, crush=1e9, rho=770, noPull=True, keys=['abrams_m1a2_sepv3_mass', 'abrams_projected_area', 'mat_rha']),
    obj('loco', 'Freight locomotive (EMD SD70ACe)', 'locomotive', 'Vehicles', 185066, 98, TUMBLE, crush=20e6, rho=560, crr=0.0015, keys=['emd_sd70ace_mass', 'emd_sd70ace_projected_area']),
    obj('cc177', 'C-17 Globemaster (Kevin Fast’s pull)', 'C-17', 'Vehicles', 188830, 300, TUMBLE, crush=2e6, rho=60, crr=0.0005, crrStatus='estimate',
        crrNote='No measured rolling resistance for a loaded C-17 was found. Kevin Fast moved 188.83 t by 8.8 m in 76 s. With any harness pull a person can manage (about 1–2 kN), rolling resistance had to be under about 0.05% of the weight, so the sim uses 0.0005. Treat it as an estimate.',
        keys=['aircraft_pull_wr', 'mat_al_2024_t3']),
    obj('b777', 'Boeing 777-200 at max takeoff', '777', 'Vehicles', 247200, 300, TUMBLE, crush=2e6, rho=60, crr=0.0005, crrStatus='estimate', keys=['boeing_777_200_mass_reference', 'mat_al_2024_t3']),
    obj('shuttle', 'Space Shuttle, full stack at liftoff', 'shuttle stack', 'Vehicles', 2041166, 400, TUMBLE, crush=1e6, rho=60, noPull=True, keys=['space_shuttle_stack_liftoff_mass', 'space_shuttle_stack_frontal_area']),
    obj('liberty', 'Statue of Liberty (statue only)', 'statue', 'Landmarks', 204117, 490, TUMBLE, crush=0.5e6, rho=40, noPull=True, keys=['statue_of_liberty_total_mass', 'statue_of_liberty_projected_area', 'mat_copper_annealed']),
    obj('eiffel', 'Eiffel Tower', 'tower', 'Landmarks', 10.1e6, 8000, TUMBLE, crush=20e6, rho=2, noPull=True, keys=['eiffel_tower_total_mass', 'mat_puddled_iron'],
        liftNote='The Eiffel Tower stands on four concrete foundations; lifting it means tearing it out of them first.'),
    obj('titanic', 'RMS Titanic', 'ship', 'Landmarks', 53.149e6, 8100, TUMBLE, crush=50e6, rho=220, noPull=True, keys=['rms_titanic_displacement_mass', 'rms_titanic_projected_area', 'mat_titanic_hull_steel']),
    obj('nimitz', 'Nimitz-class aircraft carrier', 'carrier', 'Landmarks', 103.94e6, 15000, TUMBLE, crush=100e6, rho=250, noPull=True, keys=['nimitz_full_load_displacement_mass', 'nimitz_projected_area', 'mat_hy80']),
    obj('esb', 'Empire State Building', 'building', 'Landmarks', 331.1e6, 18000, TUMBLE, crush=30e6, rho=316, noPull=True, keys=['empire_state_building_mass', 'mat_indiana_limestone'],
        liftNote='It is anchored to bedrock by its foundations; lifting it means tearing them out first.'),
    obj('pyramid', 'Great Pyramid of Giza', 'pyramid', 'Landmarks', 6e9, 34700, TUMBLE, crush=30e6, rho=2300, noPull=True, keys=['great_pyramid_mass', 'great_pyramid_projected_area', 'mat_limestone_generic'],
        liftNote='Its core is natural bedrock, so part of the “pyramid” is the ground itself. Stacked blocks have almost no tensile strength: lifted from below, it would come apart.'),
    obj('everest', 'Mount Everest', 'mountain', 'Nature', 3.7e14, 2.2e7, TUMBLE, crush=100e6, rho=2700, noPull=True, noThrow=True, keys=['mount_everest_mass', 'mount_everest_projected_area', 'mat_granite_ucs'],
        liftNote='Everest isn’t a loose object. It’s part of the Earth’s crust, and its mass depends on where you decide the mountain ends (1.6 × 10¹⁴ to 1.4 × 10¹⁵ kg). Rock is weak in tension, so lifted from one spot it would break apart under its own weight.'),
    obj('cloud', 'A cumulus cloud', 'cloud', 'Nature', 5e5, 1e6, TUMBLE, rho=0.5, noPull=True, noThrow=True, keys=['cumulus_cloud_water_mass'],
        liftNote='A cumulus cloud is about 500 t of droplets spread through a cubic kilometre of air. There is nothing to grab.'),
    obj('moon', 'The Moon', 'Moon', 'Space', fact('moon_mass')['value_si'], 9.48e12, SPHERE, rho=3344, noPull=True, noThrow=True, keys=['moon_mass'],
        liftNote='There is no “up” for a moon. Lifting it at 1 g is a thought experiment: Rex would need something to stand on that isn’t the thing he’s lifting.'),
    obj('earth', 'Earth', 'planet', 'Space', fact('earth_mass')['value_si'], 1.275e14, SPHERE, rho=5514, noPull=True, noThrow=True, keys=['earth_mass'],
        liftNote='Rex stands on Earth, so pushing on it is pushing on his own floor. Treated as if it sat on a scale in 1 g.'),
    obj('sun', 'The Sun', 'Sun', 'Space', fact('sun_mass')['value_si'], 1.52e18, SPHERE, rho=1408, noPull=True, noThrow=True, keys=['sun_mass'],
        liftNote='A ball of plasma with no surface to grip. Treated as if it sat on a scale in 1 g.'),
    # feat-specific
    obj('bar511', 'Record deadlift bar (511 kg)', 'bar', 'From the feats', 511, 0.5, TUMBLE, crush=250e6, crushWhole=True, rho=1000, keys=['strongman_deadlift_wr', 'mat_astm_a36']),
    obj('backlift', 'Back-lift platform with two cars (2,422 kg)', 'platform', 'From the feats', 2422.18, 10, TUMBLE, crush=3e6, rho=100, noThrow=True, noPull=True, keys=['back_lift_record_ernst']),
    obj('desoto', '1937 DeSoto (Action Comics #1 cover car)', 'car', 'From the feats', 1429, 8.5, TUMBLE, crush=3e6, rho=110, crr=0.012, keys=['action_comics_1_cover_car_mass']),
    obj('ruyi', 'Ruyi Jingu Bang, Sun Wukong’s staff', 'staff', 'From the feats', 7965, 1.5, TUMBLE, crush=250e6, crushWhole=True, rho=7800, keys=['ruyi_jingu_bang_mass', 'ruyi_jingu_bang_length']),
    obj('range150', 'Secret Wars mountain range (150 billion tons)', 'mountain range', 'From the feats', 150e9 * ST, 1e7, TUMBLE, crush=100e6, rho=2700, noThrow=True, noPull=True, keys=['secret_wars_4_hulk_mountain'],
        liftNote='Like Everest, a real mountain range is part of the crust, not a loose object. The comic gives the number; physics gives the problem below.'),
    obj('sky', 'The sky, as Atlas holds it (our reading: the whole atmosphere)', 'sky', 'From the feats', fact('atm_total_mass')['value_si'], 5.1e14, TUMBLE, noThrow=True, noPull=True, keys=['atm_total_mass', 'atlas_holds_heavens'],
        liftNote='Our reading of Atlas’s “heavens”: the whole atmosphere, 5.1 × 10¹⁸ kg. The ground already carries that weight every day, as air pressure.'),
    obj('allstar', 'All-Star Superman’s load (200 quintillion tons)', 'load', 'From the feats', 200e18 * ST, 1e8, TUMBLE, crush=100e6, rho=3000, noThrow=True, noPull=True, keys=['all_star_superman_200_quintillion'],
        liftNote='None of the accounts we found say what the load is. It is about 2.5 times the Moon’s mass (3% of Earth’s), so treat it as a force equivalent.'),
]
for o in objects:
    k = o.pop('_keys')
    mass_key = k[0]
    row('Mass: ' + o['name'], fact(mass_key)['display'], [mass_key])
    if o.get('crush'):
        mk = [x for x in k if x.startswith('mat_')]
        row('Grip limit (estimate): ' + o['name'], '%s MPa' % ('{:g}'.format(o['crush'] / 1e6)), mk or [], st='estimate',
            note='Contact pressure a hand-sized grip can apply before the structure gives way locally. Engineering estimate from the material strength and wall thickness; thin skins give far below the material’s yield strength.'
            + (' Solid metal all through, so the Game of catch also uses it as the strength of the whole object.' if o.get('crushWhole') else
               ' The Game of catch also checks it against air pressure and stopping force spread over the whole object; the whole structure gives way well below this local value, so those checks err toward it surviving.'))
row('Thrown-object drag coefficient', 'Spheres 0.46 below Mach 0.8 → 0.92 above Mach 1.2; tumbling bluff bodies 1.15 → 1.75', ['cd_sphere_mach_fit', 'cd_bluff_body_tumbling_subsonic', 'cd_cube_mach_fit'])
row('Thrown-object area', 'Orientation-averaged projected area (a tumbling object shows all sides)', ['toyota_corolla_projected_area'], st='estimate')
row('Rolling resistance (cars, trucks, trains)', 'cars 0.012 · trucks/buses 0.007–0.008 · locomotive on rail 0.0015', [], st='estimate', extra_sources=[WIKI_RR])

# ----------------------------------------------------------------------------- energy references
energy = [
    dict(id='pitch', short='the fastest pitch on record', J=0.5 * 0.1453 * 47.297 ** 2, keys=['fastest_baseball_pitch', 'baseball_mass'], label='Fastest pitch (kinetic energy)'),
    dict(id='carcrash', short='a Corolla at 100 km/h', J=0.5 * 1340 * (100 / 3.6) ** 2, keys=['toyota_corolla_curb_mass'], label='Corolla at 100 km/h (kinetic energy)'),
    dict(id='grenade', short='a hand grenade', J=1.0e6, keys=['energy_m67_tnt_equivalent_estimate', 'energy_m67_grenade_explosive_mass'], label='M67 hand grenade'),
    dict(id='moab', short='the MOAB bomb', J=4.6024e10, keys=['energy_moab_yield'], label='GBU-43 MOAB'),
    dict(id='hiroshima', short='the Hiroshima bomb', J=6.276e13, keys=['energy_hiroshima_yield'], label='Hiroshima bomb'),
    dict(id='bravo', short='Castle Bravo', J=6.276e16, keys=['energy_castle_bravo_yield'], label='Castle Bravo (15 Mt)'),
    dict(id='tsar', short='the Tsar Bomba', J=2.092e17, keys=['energy_tsar_bomba_yield'], label='Tsar Bomba (50 Mt)'),
    dict(id='krakatoa', short='the 1883 Krakatoa eruption', J=8.4e17, keys=['energy_krakatoa_1883'], label='Krakatoa 1883'),
    dict(id='chicxulub', short='the dinosaur-killing asteroid', J=4.2e23, keys=['energy_chicxulub_impact'], label='Chicxulub impact (sim uses 4.2 × 10²³ J, inside the published 10²³–10²⁴ J)'),
    dict(id='sun', short='the Sun’s output for one second', J=3.828e26, keys=['energy_sun_luminosity'], label='Sun’s output in one second'),
    dict(id='earthbind', short='the energy to blow Earth apart', J=2.49e32, keys=['energy_earth_gravitational_binding'], label='Earth’s gravitational binding energy'),
]
for e in energy:
    row('Energy: ' + e.pop('label'), '%.3g J' % e['J'], e.pop('keys'))

# ----------------------------------------------------------------------------- blast thresholds
overpressure = [
    dict(id='windows', label='Windows shatter', Pa=6900, k='blast_window_breakage'),
    dict(id='houses', label='Houses collapse', Pa=26800, k='blast_residential_collapse'),
    dict(id='eardrums', label='Eardrums start to burst', Pa=34500, k='blast_eardrum_rupture_threshold'),
    dict(id='lungs', label='Lung damage', Pa=83000, k='blast_lung_damage_threshold'),
    dict(id='lethal', label='Pressure kills half', Pa=427000, k='blast_lethality_threshold'),
]
for o in overpressure:
    k = o.pop('k')
    # windows: the band where they usually shatter; the lab uses its top
    row('Blast: ' + o['label'], ('3.4–6.9 kPa (the lab uses 6.9)' if o['id'] == 'windows' else '%g kPa' % (o['Pa'] / 1000)), [k])

# ----------------------------------------------------------------------------- reference speeds / heights / calibration
speeds = [
    dict(label='Usain Bolt', v=12.42),
    dict(label='Speed of sound', v=340.29),
    dict(label='Orbital speed', v=7905),
    dict(label='Escape velocity', v=11186),
]
row('Usain Bolt peak speed', fact('bolt_peak_running_speed')['display'], ['bolt_peak_running_speed'])
row('Speed of sound, orbital speed, escape velocity', '340.29 m/s · 7.905 km/s · 11.186 km/s', ['atm_isa_speed_of_sound', 'earth_circular_orbit_velocity_surface', 'earth_escape_velocity_surface'])

calibration = [
    dict(label='Shot put', obj='shot', angle=37, recordText='23.56 m (Crouser, 2023)', metric='range'),
    dict(label='Fastest pitch', obj='baseball', angle=2, recordText='47.3 m/s (Chapman, 2010)', metric='speed'),
]
row('Shot put world record', fact('shot_put_wr')['display'], ['shot_put_wr'])
row('Fastest pitch', fact('fastest_baseball_pitch')['display'], ['fastest_baseball_pitch'])
row(fact('punch_fist_speed_elite_measured')['label'], fact('punch_fist_speed_elite_measured')['display'], ['punch_fist_speed_elite_measured'],
    extra_sources=fact('punch_fist_speed_elite_measured')['sources'][2:3])
row('Highest standing vertical jump (NFL Combine)', fact('standing_vertical_jump_nfl_record')['display'], ['standing_vertical_jump_nfl_record'])
row('Body segment masses', 'hand 0.6% · forearm 1.6% · foot 1.45% · shank 4.65% of body mass', ['segment_mass_fraction_hand', 'segment_mass_fraction_forearm', 'segment_mass_fraction_foot', 'segment_mass_fraction_shank'])
row('Hill force–velocity curve', '(F + a)(v + b) = (F₀ + a) b, a/F₀ = 0.25', ['hill_force_velocity_equation', 'hill_curvature_a_over_F0'])
row('Real-muscle top running speed', '17.9 m/s (40 mph): top of the “35 or even 40 mph” projection in SMU’s release on Weyand et al. 2010; the paper itself gives no speed', [], st='estimate',
    extra_sources=[{'url': 'https://blog.smu.edu/research/?p=1149', 'title': 'SMU Research News: Weyand et al. 2010 (“35 or even 40 mph”)'}])

# ----------------------------------------------------------------------------- physics formulas
row('Atmosphere', 'ρ₀ 1.225 kg/m³, p₀ 101,325 Pa, scale height 8.43 km', ['atm_isa_sea_level_density', 'atm_pressure_scale_height_sea_level', 'atm_column_mass_per_m2'])
row('Earth', 'g 9.80665 m/s², radius 6,371 km, GM 3.986 × 10¹⁴ m³/s²', ['earth_standard_gravity', 'earth_mean_radius', 'earth_gm'])
row('TNT equivalent', '1 kg TNT = 4.184 MJ', ['energy_tnt_equivalent_per_tonne'])
row('Blast overpressure curve', 'Kinney & Graham (1985)', ['blast_kinney_graham_peak_overpressure'])
row('Quake magnitude', 'log₁₀ E = 1.5 M + 4.8, seismic efficiency 10⁻⁴', ['seismic_gutenberg_richter_energy_magnitude', 'seismic_efficiency_impact'])
row('Crater size', 'Collins, Melosh & Marcus (2005): final = 1.25 × transient below 3.2 km, complex-crater eq. 27 above (held at 3.2 km across the switch); above 20 km/s, a same-energy, same-density impactor at 20 km/s. Gravity-regime scaling: an upper bound for small craters in rock or concrete.', ['crater_collins_transient_diameter', 'crater_collins_simple_final_diameter'])
row('Air heating', 'Below 1 km/s: T₀ = T (1 + 0.2 M²). Above: equilibrium-air table computed for this sim at sea-level stagnation pressure (ρ₀v², about 1,500 atm at 11 km/s), dissociation and ionization included, radiation ignored, so an upper bound. Check: the same solver at ~0.9 atm gives ~11,700 K for Anderson’s Apollo case (11 km/s at 53 km; textbook ~11,600 K). At sea-level pressure dissociation is held back, so the table gives ~16,400 K at 11 km/s.', ['aero_stagnation_temperature_formula', 'aero_real_gas_validity_caution', 'aero_shuttle_shock_layer_air_temperature'], st='estimate',
    extra_sources=[{'url': 'https://doi.org/10.2514/4.861956', 'title': 'Anderson, Hypersonic and High-Temperature Gas Dynamics, 2nd ed. (AIAA, 2006)'}])
row('Muscle model (fitted, not measured)', 'Unloaded limb speed at the 2 m calibration size (scales with height, so 1.5× at the default 10 ft): shove throw 35 m/s, overarm whip 84.6, punch and clap 17, leg drive 12, stomp 16. Real muscle, share of full strength from a standstill: shove 52% per hand, whip/punch/clap 30%, stomp 50%, legs 140% (they also carry his body weight). Comic book, fixed shares fitted so both modes match record athletes: shove 17% per hand, whip 7%, punch 6%, clap 7%, stomp 13%, legs 66%.', [], st='estimate')
row('Body shape and air (assumed)', 'Areas scale with height², lengths with height. Drag Cd 1.0. Facing area from the build: 4.4 m² for the default 10 ft Rex (tail trailing), 4.5 m² for Ollie, 0.8 m² for the 2 m calibration body. Head-first when jumping or launched by a stomp: 0.3 m² at 2 m (0.7 m² at 10 ft). Ground gripped by bolted feet (where it tears out): 0.2 m² at 2 m, 0.46 m² at 10 ft. Release height 0.9 × height; each sprint stride puts about 2.5× his weight on one foot. Overarm whip: effective mass at the hand 0.3% of body mass, fitted with the whip speed to the 47.3 m/s pitch; that is smaller than Dempster’s hand alone (0.6%) and is not a measured segment.', [], st='estimate')
row('Ground resisting a fast foot', 'Bearing strength plus inertia: R = A (q + ρ v²) (Poncelet form; Forrestal & Luk 1992 cavity expansion)', [], st='estimate', extra_sources=[{'url': 'https://scholar.google.com/scholar?q=Forrestal+Luk+1992+%22Penetration+into+soil+targets%22', 'title': 'Forrestal & Luk (1992), Int. J. Impact Eng. 12(3):427–444'}])
row('Granular ground strength grows with foot width', 'q_ult ∝ B for sand and gravel (Terzaghi ½γBN_γ term); research value is for a 0.1 m² footing', ['ground_loose_sand_ultimate_bearing_small_footing'], st='estimate')

# ----------------------------------------------------------------------------- feats


def feat(group, title, who, claim, keys, run=None, st=None, src_title='Source', also=None):
    k = keys[0] if keys else None
    s = st or (status(*keys) if keys else 'estimate')
    first = fact(k)['sources'][0] if k else None
    return dict(group=group, title=title, who=who, claim=claim, status=s,
                source={'url': first['url'], 'title': src_title} if first else None, run=run,
                also=[{'url': fact(k2)['sources'][0]['url'], 'title': t} for k2, t in (also or [])])


feats = [
    feat('human', '511 kg deadlift', 'Raúl “Tyzon” Flores · Birmingham, 5 Sep 2026', 'Heaviest deadlift ever, in a deadlift suit with straps. Without a suit: 492.5 kg in raw powerlifting (2026), 474.5 kg in strongman (2019).', ['strongman_deadlift_wr'],
         run=dict(liftKg=511, action='lift', obj='bar511')),
    feat('human', '2,422 kg back lift', 'Gregg Ernst · 1993', 'Two cars on a platform, lifted just clear of the supports with his back.', ['back_lift_record_ernst'],
         run=dict(liftKg=2422.18, action='lift', obj='backlift')),
    feat('human', 'Paul Anderson’s 1957 back lift', 'Claimed 2,844 kg', 'No photos, no video, no written witnesses. A historian’s generous reconstruction puts it at 1,846 kg at most.', ['back_lift_claim_anderson_1957']),
    feat('human', 'Pulled a 188.83 t C-17', 'Kevin Fast · CFB Trenton, 2009', 'Moved it 8.8 m in 1 min 16 s. Pulling needs grip on the ground more than strength.', ['aircraft_pull_wr'],
         run=dict(liftKg=511, action='pull', obj='cc177')),
    feat('human', 'Shot put, 23.56 m', 'Ryan Crouser · 2023', 'World record with the 7.26 kg men’s shot. Used to calibrate the throw model.', ['shot_put_wr'],
         run=dict(liftKg=511, action='throw', obj='shot', angle=37)),
    feat('human', 'Fastest pitch, 105.8 mph', 'Aroldis Chapman · 2010', '47.3 m/s as the ball leaves the hand.', ['fastest_baseball_pitch'],
         run=dict(liftKg=511, action='throw', obj='baseball', angle=2)),
    feat('human', 'Top speed 12.42 m/s', 'Usain Bolt · Berlin, 2009', 'Average over his fastest 20 m in the 9.58 s world record.', ['bolt_peak_running_speed'],
         run=dict(liftKg=511, action='sprint')),
    feat('comic', 'Hurdle a twenty-story building', 'Action Comics #1 · 1938', '“Leap 1/8th of a mile; hurdle a twenty-story building… raise tremendous weights.” Switches to Comic book mode and runs the jump at the strength it needs (20 stories ≈ 60 m). The default 10 ft Rex on real muscle tops out near 16 m (the 2 m calibration body near 7 m).', ['action_comics_1_leap'],
         run=dict(solve='jump60', mode='comic', action='jump')),
    feat('comic', 'The car on the cover', 'Action Comics #1 · 1938', 'Probably a 1937 DeSoto, about 1.43 t. The car’s identity is disputed and the comic gives no weight.', ['action_comics_1_cover_car_mass'],
         run=dict(liftKg=1429, action='lift', obj='desoto')),
    feat('comic', 'Captain America presses 800 lb', 'Official Handbook of the Marvel Universe · 1986', '“As strong as a human can be.” 800 lb overhead is 1.6× the real log-press record.', ['captain_america_handbook_strength'],
         run=dict(liftKg=fact('captain_america_handbook_strength')['value_si'], action='throw', obj='shot', angle=37)),
    feat('comic', 'Spider-Man lifts 10 tons', 'Official Handbook of the Marvel Universe · 1986', 'Raised to 20 tons in 2007. Handbook tons are read here as US short tons.', ['spider_man_handbook_1986'],
         run=dict(liftKg=10 * ST, action='throw', obj='car', angle=45)),
    feat('comic', 'Hulk and Thor: Class 100', 'Official Handbook of the Marvel Universe · 1986', '“In excess of 100 tons.” A floor with no ceiling.', ['hulk_handbook_1986_enraged', 'thor_handbook_1986'],
         run=dict(liftKg=100 * ST, action='throw', obj='tank', angle=30)),
    feat('comic', 'Superman catches a 777', 'Superman Returns · 2006', 'The film gives no numbers. A 777-200 weighs up to 247 t at takeoff. Watch what his hands do to the fuselage.', ['superman_returns_airliner_catch', 'boeing_777_200_mass_reference'],
         run=dict(liftKg=300e3, action='lift', obj='b777')),
    feat('comic', 'Hulk holds up a mountain range', 'Secret Wars #4 · 1984', '150 billion tons, per Reed Richards in press accounts of the issue.', ['secret_wars_4_hulk_mountain'],
         run=dict(liftKg=150e9 * ST, action='lift', obj='range150')),
    feat('comic', '200 quintillion tons', 'All-Star Superman #1 · 2005', 'Three times his earlier limit, per a review. Issue and exact wording come from reviews.', ['all_star_superman_200_quintillion'],
         run=dict(liftKg=200e18 * ST, action='lift', obj='allstar')),
    feat('comic', 'Bench-pressing the planet', 'Superman vol. 3 #13 · 2012', 'A machine lets him bench the weight of the planet, per a review (PopMatters); the comic’s exact wording is unverified.', ['superman_v3_13_earth_bench'],
         run=dict(liftKg=fact('earth_mass_reference')['value_si'], action='lift', obj='earth')),
    feat('comic', 'Saitama’s Serious Punch', 'One-Punch Man · 2015', 'Defeats Boros with one punch. No number is ever given; fan estimates are not canon.', ['saitama_serious_punch'],
         run=dict(liftKg=float('inf'), action='punch')),
    feat('comic', 'Hercules tows Manhattan', 'Marvel Team-Up #28 · 1974', 'No tonnage, and a later issue says Hercules exaggerated: the island was only shaken.', ['hercules_tows_manhattan']),
    feat('myth', 'Sun Wukong’s staff', 'Journey to the West, ch. 3', '13,500 jin: about 7.97 t at the Ming-era jin of 590 g. He swings it like a stick.', ['ruyi_jingu_bang_mass'],
         run=dict(liftKg=10 * ST, action='throw', obj='ruyi', angle=40)),
    feat('myth', 'Atlas holds up the heavens', 'Hesiod, Theogony', '“Upholds the wide heaven with unwearying head and arms.” No weight given; the sim reads it as the whole atmosphere.', ['atlas_holds_heavens'],
         run=dict(liftKg=fact('atm_total_mass')['value_si'], action='lift', obj='sky')),
    feat('myth', 'Thor and the giant’s cat', 'Prose Edda, Gylfaginning', 'He lifts it until one paw leaves the floor. The cat was the World Serpent, long enough to circle the Earth.', ['thor_utgarda_loki_cat']),
    feat('myth', 'Samson brings down the temple', 'Judges 16', '“He bowed himself with all his might.” About 3,000 people were on the roof. No forces are given.', ['samson_temple_pillars', 'samson_temple_roof_occupants']),
    feat('myth', 'Milo of Croton carries a bull', 'Quintilian, Institutio Oratoria 1.9.5 · c. AD 95', 'He carried a calf every day until it was a grown bull. Athenaeus instead has him shoulder a four-year-old bull round the course at Olympia, then eat it in a day. No weight is recorded.', ['milo_of_croton_calf_training', 'milo_of_croton_bull'],
         src_title='Quintilian', also=[('milo_of_croton_bull', 'Athenaeus')]),
]

# Feats by human-sized people run on the 2 m, 180 kg calibration body: at those strengths the default
# 10 ft, 3,007 kg Rex is too heavy to get up, so the result would say nothing about the feat.
HUMAN_SIZED = {'511 kg deadlift', '2,422 kg back lift', 'Pulled a 188.83 t C-17', 'Shot put, 23.56 m', 'Fastest pitch, 105.8 mph',
               'Top speed 12.42 m/s', 'The car on the cover', 'Captain America presses 800 lb'}
for f in feats:
    if f['title'] in HUMAN_SIZED:
        assert f['run'], f['title']
        f['run']['cal'] = True
assert sum(1 for f in feats if f['run'] and f['run'].get('cal')) == len(HUMAN_SIZED)

static = json.loads(subprocess.check_output(['node', '-e', 'process.stdout.write(JSON.stringify(require("./src/static-data.js")))'], cwd=HERE))
heights = [{'label': h.get('short', h['label']), 'm': h['m']} for h in static['heights']]
for h in static['heights']:
    rows.append({'label': 'Height: ' + h['label'], 'value': '{:,} m'.format(h['m']) if h['m'] < 1e6 else '{:,} km'.format(int(h['m'] / 1000)), 'status': 'verified', 'sources': [h['src']], 'note': None})

for t in tiers:
    t.pop('keys')

# ----------------------------------------------------------------------------- density and mass references
densities = [
    dict(id='plush', chip='Plush', short='plush stuffing', rho=30, keys=['density_plush_stuffing_estimate'],
         note='Our estimate for a stuffed toy: no measured value found. Loose fibrefill batts are 6–21 kg/m³.'),
    dict(id='water', chip='Water', short='water', rho=1000, keys=['density_water_4c'], note='Fresh water at 4 °C: 1,000 kg/m³. The 2 m, 180 kg calibration body has this density.'),
    dict(id='build', chip='His build (default)', short='his build', rho=1060, keys=['rex_ollie_picture_build', 'density_bodybuilders_fry1987'],
         note='The default Rex and Ollie: 10 ft and 3,007 kg each, by ruling (Rex: 2,700 kg without his tail). 1,060 kg/m³: lean bodybuilders (1,081 kg/m³ with lung air removed; Fry, Cisar & Housh 1987) less some air in the lungs.'),
    dict(id='human', chip=None, short='a human body', rho=fact('density_human_body_measured')['value_si'], keys=['density_human_body_measured'], note=None),
    dict(id='steel', chip='Steel', short='steel', rho=fact('density_structural_steel')['value_si'], keys=['density_structural_steel'], note=None),
    dict(id='osmium', chip='Osmium', short='osmium', rho=fact('density_osmium')['value_si'], keys=['density_osmium'], note='The densest element at everyday pressure.'),
    dict(id='whitedwarf', chip='White dwarf', short='white-dwarf matter', rho=fact('density_white_dwarf_sirius_b_mean')['value_si'], keys=['density_white_dwarf_sirius_b_mean'], note='Sirius B’s average density.'),
    dict(id='nucleus', chip=None, short='an atomic nucleus', rho=fact('nuclear_saturation_density')['value_si'], keys=['nuclear_saturation_density'], note=None),
    dict(id='neutronstar', chip='Neutron star', short='a neutron star', rho=fact('density_neutron_star_mean')['value_si'], keys=['density_neutron_star_mean'], note='A typical neutron star’s average density.'),
]
# the default build's density is the engine's (BUILDS.rex.rho and BUILDS.ollie.rho in src/engine.js)
assert subprocess.check_output(['node', '-e', 'const P=require("./src/engine.js");process.stdout.write(String([P.BUILDS.rex.rho,P.BUILDS.ollie.rho]))'], cwd=HERE).decode() == '1060,1060'
for d in densities:
    row('Density: ' + (d['short'] + ' (the default Rex and Ollie)' if d['id'] == 'build' else d['short']), '{:,.0f} kg/m³'.format(d['rho']) if d['rho'] < 1e6 else '{:.3g} kg/m³'.format(d['rho']).replace('e+', ' × 10^'), d['keys'])
    d.pop('keys')
massRefs = [
    dict(label='Deimos (moon of Mars)', short='Deimos', m=fact('deimos_mass')['value_si']),
    dict(label='Phobos (moon of Mars)', short='Phobos', m=fact('phobos_mass')['value_si']),
]
row('Mass: Phobos and Deimos', '1.06 × 10^16 kg and 1.44 × 10^15 kg', ['phobos_mass', 'deimos_mass'])

# Every other fact behind the Weight tab and the two-player tests gets its own row, labelled by area.
USED_ABOVE = {d for d in ['density_plush_stuffing_estimate', 'density_water_4c', 'density_bodybuilders_fry1987', 'density_human_body_measured', 'density_structural_steel', 'density_osmium',
                          'density_white_dwarf_sirius_b_mean', 'nuclear_saturation_density', 'density_neutron_star_mean', 'phobos_mass', 'deimos_mass']}
# the presence brief's facts (effort, the Walk tab, comic switches, growth), each in its own row, labelled by area
PRESENCE_AREA = {'presence_step': 'Walking', 'presence_attenuation': 'Ground shaking', 'presence_elephant': 'Elephants', 'presence_thresholds': 'Thresholds',
                 'presence_ripple': 'Water glass', 'presence_comic': 'Comic switches', 'presence_growth': 'Growth'}
for topic, prefix in [('density', 'Weight'), ('duo', None), ('presence', None)]:
    for f in json.load(open(os.path.join(HERE, 'research', f'final-{topic}.json'), encoding='utf-8'))['facts']:
        if f['key'] in USED_ABOVE:
            continue
        area = PRESENCE_AREA.get(f.get('category'), f.get('category', 'Rex and Ollie')) if topic == 'presence' else f.get('category', 'Rex and Ollie')
        label = (prefix or area) + ': ' + lower_first(f['label']) if f['label'] else f['key']
        # rows that draw on more than two sources (the vaporisation row, one per material; the presence facts, which
        # show numbers from each): show them all
        row(label, f['display'], [f['key']], note=None, extra_sources=[{'url': x['url'], 'title': x.get('title') or ''} for x in f['sources'][2:]] if f['key'] in ('heat_to_vaporise_per_kg',) or topic == 'presence' else None)

data = dict(tiers=tiers, surfaces=[{k: v for k, v in s.items() if not k.startswith('k_')} for s in surfaces], objects=objects,
            energyRefs=energy, overpressure=overpressure, heights=heights, speeds=speeds, calibration=calibration,
            feats=feats, assumptions=static['assumptions'], sourceRows=rows, densities=densities, massRefs=massRefs)


def js(v):
    return json.dumps(v, ensure_ascii=False, indent=1).replace('Infinity', 'Infinity')


text = json.dumps(data, ensure_ascii=False, indent=1, allow_nan=True)
out = '/* Generated by build-data.py from research/final-*.json. Do not edit by hand. */\nwindow.DINO_DATA = ' + text + ';\n'
open(os.path.join(HERE, 'src', 'data.js'), 'w', encoding='utf-8', newline='\n').write(out)
print('objects', len(objects), 'feats', len(feats), 'source rows', len(rows), 'bytes', len(out))
