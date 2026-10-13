"""Round 2 fixes (code and copy lenses): plain source titles for every rung; SN 1998bw is its blast; Earth binding check row."""
import json, re, subprocess
R = '/home/user/rex-strength-lab/rex-strength-lab/research/'
SUP = str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻')
def load(n):
    raw = open(R + n, encoding='utf-8').read(); return raw, json.loads(raw)
def save(n, raw, d):
    open(R + n, 'w', encoding='utf-8', newline='\n').write(json.dumps(d, ensure_ascii=False, indent=1) + ('\n' if raw.endswith('\n') else ''))
# the rung keys, from build-data.py's LADDER
src = open('/home/user/rex-strength-lab/rex-strength-lab/build-data.py', encoding='utf-8').read()
lad = src[src.index('LADDER = ['):src.index(']\n', src.index('LADDER = ['))]
RUNGS = set(re.findall(r"'(energy_[a-z0-9_]+)'", lad))
EXACT = {
 'NIST CODATA: standard acceleration of gravity, 9.806 65 m/s^2 exact (fact earth_standard_gravity; re-fetched Oct 2026)': 'NIST CODATA: standard acceleration of gravity, 9.806 65 m/s² (exact)',
 "Palmer et al. (2005), arXiv PDF ('2 × 10^46 d15^2 erg in the spike')": 'Palmer et al. (2005), a giant gamma-ray flare from the magnetar SGR 1806-20 (Nature); arXiv PDF',
 'NASA NSSDCA Moon Fact Sheet (mass 0.07346e24 kg; existing fact moon_mass)': 'NASA NSSDCA Moon Fact Sheet (mass 7.346 × 10²² kg)',
 'NIST CODATA 2022: speed of light in vacuum, 299 792 458 m/s exact (existing fact growth_c_exact)': 'NIST CODATA 2022: speed of light in vacuum, 299 792 458 m/s (exact)',
 'NASA NSSDCA Sun Fact Sheet (mass 1,988,400e24 kg; existing fact sun_mass)': 'NASA NSSDCA Sun Fact Sheet (mass 1.9884 × 10³⁰ kg)',
 'NASA NSSDCA Earth Fact Sheet (mass 5.9722e24 kg; existing fact earth_mass)': 'NASA NSSDCA Earth Fact Sheet (mass 5.9722 × 10²⁴ kg)',
 "NASA NSSDCA Sun Fact Sheet (mass 1,988,400e24 kg; 'Mass conversion rate (10^6 kg/s) 4260.')": 'NASA NSSDCA Sun Fact Sheet (mass 1.9884 × 10³⁰ kg; mass turned into energy, 4.26 × 10⁹ kg each second)',
 "Janka (2012) Annu. Rev. Nucl. Part. Sci.; arXiv PDF ('up to several 10^52 erg for HNe')": 'Janka (2012) Annu. Rev. Nucl. Part. Sci.; arXiv PDF',
}
BAD = re.compile(r"\^|\d x \d|\de\d|\b[a-z]+_[a-z0-9_]+\b|\berg\b|\bkpc\b|~|\+/-|≈")
def clean(t):
    if t in EXACT: return EXACT[t]
    t = re.sub(r' x 10\^(-?\d+)', lambda m: ' × 10' + m.group(1).translate(SUP), t)
    t = re.sub(r'10\^(-?\d+)', lambda m: '10' + m.group(1).translate(SUP), t)
    return t
raw, d = load('final-energy.json'); F = {f['key']: f for f in d['facts']}
left = []
for k in sorted(RUNGS):
    for s in F[k]['sources']:
        s['title'] = clean(s['title'])
        if BAD.search(s['title']): left.append((k, s['title']))
# copy-1: SN 1998bw's 3e45 J is the kinetic energy of its blast
f = F['energy_hypernova_sn1998bw']
f['page_short'] = 'the blast of SN 1998bw, an unusually energetic supernova'
f['label'] = "The blast of SN 1998bw (the kinetic energy of its flying debris), an unusually energetic supernova linked to a gamma-ray burst; one model gives 3 × 10⁴⁵ J (a 'hypernova'), an aspherical model about 15 times less"
f['display'] = 'about 3 × 10⁴⁵ J of motion in its debris in one spherical model (2–5 × 10⁴⁵ J); an aspherical model gives 2 × 10⁴⁴ J'
f['notes'] += " Review round 2: the page phrase and label now say it is the blast's kinetic energy (Iwamoto: 'The kinetic energy is as large as ~2-5 x 10^52 ergs'), not the whole supernova's, whose total (nearly all neutrinos) is far larger."
save('final-energy.json', raw, d)
# copy-7: the Weight tab's check row of the same PREM integral
raw, d = load('final-density.json'); F2 = {f['key']: f for f in d['facts']}
f = F2['energy_earth_binding_prem_computed']
f['status'] = 'derived'
f['notes'] += ' Review round 2 (pull request C): an independent check of energy_earth_gravitational_binding (2.489e32 J, integrated from the original PREM Table I); the two agree to under 0.1%. Status estimate -> derived (computed from published data, as the README\'s status rule says).'
save('final-density.json', raw, d)
print('left over:', left)
