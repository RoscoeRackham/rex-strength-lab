"""Round 1 research-data fixes (source lenses srclow, srcmid). Run once."""
import json
p = '/home/user/rex-strength-lab/rex-strength-lab/research/final-energy.json'
d = json.loads(open(p, encoding='utf-8').read())
F = {f['key']: f for f in d['facts']}
def rep(k, field, old, new):
    f = F[k]; assert old in f[field], (k, field, old); f[field] = f[field].replace(old, new)

# srclow-1: lightning spread up to 10 GJ (Rakov & Uman via the arXiv review; Salinas et al. 2021's modelled top)
f = F['energy_lightning_flash']
f['high_si'] = 1e10
f['display'] = 'about 1 GJ per flash (published estimates 0.1 to 10 GJ)'
rep('energy_lightning_flash', 'notes', 'Sources differ on which kind is larger and span 70x.',
    "A 2024 review (arXiv:2404.10020, citing Rakov & Uman, Lightning: Physics and Effects, 2003): a flash bears '10^9 to 10^10 J in total'. Salinas et al. 2021 (capacitor model): flashes 'most frequently <1 GJ', estimates spanning 10^4 to 10^10 J, the low end biased by their single adjustment factor (their words), so not used as the low bound. Sources differ on which kind is larger and span about 100x (0.1 to 10 GJ). Review round 1: high_si raised from 7 GJ to 10 GJ.")
f['sources'].append({'title': 'Review: Physics and technology of Laser Lightning Control (2024), arXiv:2404.10020, citing Rakov & Uman (2003)', 'url': 'https://arxiv.org/pdf/2404.10020'})
f['sources'].append({'title': 'Salinas, Bruning, Mansell & Brothers (2021) Modeling the electrical energy discharged by lightning flashes using capacitors, J. Atmos. Sci. 78:3909-3924, section 6a', 'url': 'https://journals.ametsoc.org/view/journals/atsc/78/12/JAS-D-21-0073.1.pdf'})

# srclow-2: the fuel tank (a spare, not a rung) is on toyota.com's embedded spec data
f = F['toyota_corolla_fuel_tank']
f['status'] = 'verified'
f['display'] = '13.2 US gallons (50.0 L), gasoline LE, SE and XSE (Toyota); hybrids 11.3 gal'
f['sources'].insert(0, {'title': 'Toyota USA, 2026 Corolla features and specs (spec table embedded in the page)', 'url': 'https://www.toyota.com/corolla/2026/features/'})
rep('toyota_corolla_fuel_tank', 'notes', 'KBB is a trade guide, not Toyota; toyota.com renders by script and gave no readable spec, and a search found the same figure only on secondary sites.',
    "Toyota's own spec data, embedded in the page (fetched with curl, as for toyota_corolla_curb_mass): 'Fuel tank (gal.)' 13.2 for codes 1852 (LE), 1864 (SE) and 1866 (XSE); 11.3 for the hybrid codes. Review round 1: status reported -> verified, Toyota added as the first source.")
if F.get('energy_car_fuel_tank_petrol') and F['energy_car_fuel_tank_petrol']['status'] == 'reported':
    F['energy_car_fuel_tank_petrol']['status'] = 'derived'
    F['energy_car_fuel_tank_petrol']['notes'] += ' Review round 1: status back to derived, its tank input now verified from Toyota.'

# srcmid-hoover (refuted as a defect; the reviewer's long-run check added to the notes)
rep('energy_hoover_dam_year', 'notes', "The page's data run only to 2008; drought-era output since was not checked.",
    "USBR's averages run to 2008. EIA-923 (plants 154 and 8902) gives about 3.2 billion kWh a year for 2016-2025 (2.7 billion in 2023, a drought year); with USBR's 1947-2008 average the long-run 1947-2025 average is still about 4.0 billion kWh (review round 1).")
F['energy_hoover_dam_year']['sources'].append({'title': 'US EIA, Form EIA-923 plant generation, Hoover Dam (plants 154 and 8902), API query', 'url': 'https://api.eia.gov/v2/electricity/facility-fuel/data/?frequency=annual&data[0]=generation&facets[plantCode][]=154&facets[plantCode][]=8902&facets[fuel2002][]=ALL'})

# srcmid-beirut-status: two refereed central estimates differ by about 2x: disputed
f = F['energy_beirut_explosion_2020']
f['status'] = 'disputed'
rep('energy_beirut_explosion_2020', 'notes', "Value 0.50 kt, Rigby's published best estimate (Pilger's infrasound figure agrees).",
    "Value 0.50 kt, Rigby's published best estimate. Pilger's retained infrasound averages are 0.86-1.06 kt and its damage fit 0.8-1.1 kt; it gives a 0.5 kt LANL+ECMWF variant only for comparison and sets it aside. So the central estimates differ by about 2x: disputed (review round 1; was verified).")

# srcmid-krakatoa-display-airwave and -popular-book
f = F['energy_krakatoa_1883']
f['display'] = 'about 100-150 megatons (4.2-6.3 x 10^17 J) judged from its air wave (Harkrider & Press); 125 Mt used. A tsunami paper gives 200 Mt (8.4 x 10^17 J) for the third blast\'s total energy, with no source; other published figures run from about 10^17 to 6.3 x 10^18 J'
f['notes'] += " Review round 1: the top of this fact's range (200 Mt) is Choi et al.'s unsourced total, not an air-wave figure; the display says so. The 10^17 J low of the wider spread is from Jones & Kodis in a 1982 Geological Society of America volume (Special Paper 190), not a popular book; 'the one refereed estimate' means the one with a stated method."

# srcmid-sun-citation: arXiv:1510.07674 is Mamajek, Prša, Torres et al. (2015), the resolution text
T = 'Mamajek, Prša, Torres et al. (2015) IAU 2015 Resolution B3 on recommended nominal conversion constants for selected solar and planetary properties, arXiv:1510.07674 (nominal solar luminosity 3.828 x 10^26 W)'
n = 0
for f in d['facts']:
    for s in f['sources']:
        if '1510.07674' in s['url'] and s['title'] != T:
            s['title'] = T; n += 1
print('sun titles fixed:', n)
open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(d, ensure_ascii=False, indent=1) + '\n')
